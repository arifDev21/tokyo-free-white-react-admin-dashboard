import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Grid,
    IconButton,
    Alert,
    CircularProgress,
    Divider,
    Paper,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { useInvoice } from '../../../contexts/InvoiceContext';
import { InvoiceItem } from '../../../types/invoice';
import { invoiceService } from '../../../services/invoiceService';

interface InvoiceFormData {
    invoiceNo: string;
    customerName: string;
    date: string;
    dueDate?: string;
    isPosted: boolean;
    items: InvoiceItem[];
}

const InvoiceFormContent: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const {
        currentInvoice,
        fetchInvoice,
        createInvoice,
        updateInvoice,
        isLoading,
        error,
        clearError
    } = useInvoice();

    const [formData, setFormData] = useState<InvoiceFormData>({
        invoiceNo: '',
        customerName: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: undefined,
        isPosted: false,
        items: [{ description: '', quantity: 1, price: 0, total: 0, isTaxable: true, taxAmount: 0 }]
    });

    const [localError, setLocalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            fetchInvoice(id);
        }
    }, [isEdit, id, fetchInvoice]);

    useEffect(() => {
        if (isEdit && currentInvoice) {
            // Recalculate tax for each item when loading from backend
            const recalculatedItems = currentInvoice.items.map(item => {
                const baseTotal = item.quantity * item.price;
                const taxAmount = item.isTaxable ? Math.round((baseTotal * 11) / 100) : 0;
                const total = baseTotal + taxAmount;

                return {
                    ...item,
                    total,
                    taxAmount
                };
            });

            setFormData({
                invoiceNo: currentInvoice.invoiceNo,
                customerName: currentInvoice.customerName,
                date: currentInvoice.date.split('T')[0],
                dueDate: currentInvoice.dueDate ? currentInvoice.dueDate.split('T')[0] : undefined,
                isPosted: currentInvoice.isPosted,
                items: recalculatedItems
            });
        }
    }, [isEdit, currentInvoice]);

    const handleInputChange = (field: keyof InvoiceFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (localError) setLocalError(null);
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };

        if (field === 'quantity' || field === 'price' || field === 'isTaxable') {
            const quantity = field === 'quantity' ? value : newItems[index].quantity;
            const price = field === 'price' ? value : newItems[index].price;
            const isTaxable = field === 'isTaxable' ? value : newItems[index].isTaxable;

            const baseTotal = quantity * price;
            const taxAmount = isTaxable ? Math.round((baseTotal * 11) / 100) : 0;
            const total = baseTotal + taxAmount;

            newItems[index] = {
                ...newItems[index],
                total,
                taxAmount
            };
        }

        setFormData(prev => ({
            ...prev,
            items: newItems
        }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, price: 0, total: 0, isTaxable: true, taxAmount: 0 }]
        }));
    };

    const removeItem = (index: number) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    // Calculate totals
    const calculateSubtotal = () => {
        return formData.items.reduce((total, item) => total + item.total, 0);
    };

    const calculateTaxAmount = () => {
        return formData.items.reduce((total, item) => total + item.taxAmount, 0);
    };

    const calculateGrandTotal = () => {
        return formData.items.reduce((total, item) => total + item.total, 0);
    };

    const generateInvoiceNumber = async () => {
        try {
            const response = await invoiceService.generateInvoiceNumber();
            if (response.success && response.data) {
                setFormData(prev => ({
                    ...prev,
                    invoiceNo: response.data!.invoiceNo
                }));
            }
        } catch (err) {
            setLocalError('Failed to generate invoice number');
        }
    };

    const validateForm = () => {
        if (!formData.invoiceNo.trim()) {
            setLocalError('Invoice number is required');
            return false;
        }
        if (!formData.customerName.trim()) {
            setLocalError('Customer name is required');
            return false;
        }
        if (!formData.date) {
            setLocalError('Date is required');
            return false;
        }
        if (formData.items.some(item => !item.description.trim())) {
            setLocalError('All items must have a description');
            return false;
        }
        if (formData.items.some(item => item.quantity <= 0)) {
            setLocalError('All items must have a quantity greater than 0');
            return false;
        }
        if (formData.items.some(item => item.price < 0)) {
            setLocalError('All items must have a price of 0 or greater');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (!validateForm()) return;

        if (isEdit) {
            // For edit, submit directly
            await submitInvoice();
        } else {
            // For create, show dialog
            setShowCreateDialog(true);
        }
    };

    const submitInvoice = async (isPosted: boolean = false) => {
        setIsSubmitting(true);

        try {
            const submitData = {
                invoiceNo: formData.invoiceNo,
                customerName: formData.customerName,
                date: formData.date,
                dueDate: formData.dueDate || undefined,
                isPosted: isPosted, // Use the parameter value, not formData.isPosted
                items: formData.items.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                    isTaxable: item.isTaxable,
                    taxAmount: item.taxAmount,
                    total: item.total
                }))
            };



            if (isEdit && id) {
                await updateInvoice(id, submitData);
            } else {
                await createInvoice(submitData);
            }

            navigate('/applications/invoices');
        } catch (err) {
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && isEdit) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {(error || localError) && (
                <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
                    {error || localError}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Invoice Details */}
                    <Grid item xs={12}>
                        <Card elevation={2} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Typography variant="h6" fontWeight="600" color="text.primary">
                                        Invoice Details
                                    </Typography>
                                    <Chip
                                        label="Required"
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ ml: 2 }}
                                    />
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Invoice Number"
                                            value={formData.invoiceNo}
                                            onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                                            required
                                            InputProps={{
                                                endAdornment: !isEdit && (
                                                    <InputAdornment position="end">
                                                        <Button size="small" onClick={generateInvoiceNumber}>
                                                            Generate
                                                        </Button>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Customer Name"
                                            value={formData.customerName}
                                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => handleInputChange('date', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Due Date"
                                            type="date"
                                            value={formData.dueDate || ''}
                                            onChange={(e) => handleInputChange('dueDate', e.target.value || undefined)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Items */}
                    <Grid item xs={12}>
                        <Card elevation={2} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="h6" fontWeight="600" color="text.primary">
                                            Invoice Items
                                        </Typography>
                                        <Chip
                                            label={`${formData.items.length} items`}
                                            size="small"
                                            color="info"
                                            variant="outlined"
                                            sx={{ ml: 2 }}
                                        />
                                    </Box>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={addItem}
                                        variant="contained"
                                        size="small"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Add Item
                                    </Button>
                                </Box>

                                {formData.items.map((item, index) => (
                                    <Paper
                                        key={index}
                                        elevation={1}
                                        sx={{
                                            p: 3,
                                            mb: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            backgroundColor: 'grey.50',
                                            '&:hover .delete-button': {
                                                opacity: 1,
                                                visibility: 'visible'
                                            }
                                        }}
                                    >
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} md={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Description"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    required
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '48px'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={2}>
                                                <TextField
                                                    fullWidth
                                                    label="Quantity"
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                                    required
                                                    inputProps={{ min: 1 }}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '48px'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={2}>
                                                <TextField
                                                    fullWidth
                                                    label="Price"
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                                                    required
                                                    inputProps={{ min: 0, step: 0.01 }}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '48px'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={2}>
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        height: '48px',
                                                        borderColor: 'divider',
                                                        borderRadius: 1,
                                                        backgroundColor: 'background.paper'
                                                    }}
                                                >
                                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                                                        Taxable
                                                    </Typography>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={item.isTaxable}
                                                                onChange={(e) => handleItemChange(index, 'isTaxable', e.target.checked)}
                                                                color="primary"
                                                                size="small"
                                                            />
                                                        }
                                                        label=""
                                                        sx={{ m: 0 }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} md={1}>
                                                <TextField
                                                    fullWidth
                                                    label="Total"
                                                    value={item.total.toFixed(2)}
                                                    InputProps={{
                                                        readOnly: true,
                                                        sx: {
                                                            fontWeight: 'bold'
                                                        }
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '48px'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={1}>
                                                {formData.items.length > 1 && (
                                                    <Box
                                                        display="flex"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        sx={{ height: '48px' }}
                                                    >
                                                        <IconButton
                                                            className="delete-button"
                                                            color="error"
                                                            onClick={() => removeItem(index)}
                                                            sx={{
                                                                opacity: 0,
                                                                visibility: 'hidden',
                                                                transition: 'all 0.2s ease-in-out',
                                                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(244, 67, 54, 0.2)'
                                                                }
                                                            }}
                                                            size="small"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Summary */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Invoice Summary
                                </Typography>
                                <Box display="flex" flexDirection="column" gap={1}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography>Subtotal:</Typography>
                                        <Typography>${calculateSubtotal().toFixed(2)}</Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography>Tax (11%):</Typography>
                                        <Typography>${calculateTaxAmount().toFixed(2)}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6">Grand Total:</Typography>
                                        <Typography variant="h6" color="primary">
                                            ${calculateGrandTotal().toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12}>
                        <Card elevation={2} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="h6" fontWeight="600" color="text.primary">
                                            Actions
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Save your changes or cancel to go back
                                        </Typography>
                                    </Box>
                                    <Box display="flex" gap={2}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/applications/invoices')}
                                            sx={{ borderRadius: 2, px: 3 }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            disabled={isSubmitting}
                                            sx={{ borderRadius: 2, px: 3 }}
                                        >
                                            {isSubmitting ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Create Invoice')}
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>

            {/* Create Invoice Dialog */}
            <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
                <DialogTitle>Create Invoice</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        How would you like to create this invoice?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        • <strong>Draft:</strong> Save as draft for later editing<br />
                        • <strong>Post:</strong> Create and post immediately
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCreateDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setShowCreateDialog(false);
                            submitInvoice(false); // Draft
                        }}
                        variant="outlined"
                        color="warning"
                    >
                        Save as Draft
                    </Button>
                    <Button
                        onClick={() => {
                            setShowCreateDialog(false);
                            submitInvoice(true); // Post
                        }}
                        variant="contained"
                        color="success"
                    >
                        Create & Post
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InvoiceFormContent;
