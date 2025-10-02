import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Grid,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    MoreVert as MoreVertIcon,
    Download as DownloadIcon,
    Publish as PublishIcon,
    Unpublished as UnpublishedIcon
} from '@mui/icons-material';
import { useInvoice } from '../../../contexts/InvoiceContext';
import { Invoice } from '../../../types/invoice';
import StatusBadge from '../../../components/StatusBadge';

const RecentInvoicesTable: React.FC = () => {
    const navigate = useNavigate();
    const {
        invoices,
        isLoading,
        error,
        fetchInvoices,
        deleteInvoice,
        updateInvoiceStatus,
        clearError
    } = useInvoice();

    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (invoice: Invoice) => {
        setInvoiceToDelete(invoice);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (invoiceToDelete) {
            try {
                await deleteInvoice(invoiceToDelete._id);
                setDeleteDialogOpen(false);
                setInvoiceToDelete(null);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, invoice: Invoice) => {
        setAnchorEl(event.currentTarget);
        setSelectedInvoice(invoice);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedInvoice(null);
    };

    const handleView = () => {
        if (selectedInvoice) {
            navigate(`/applications/invoices/${selectedInvoice._id}`);
        }
        handleMenuClose();
    };

    const handleEdit = () => {
        if (selectedInvoice) {
            navigate(`/applications/invoices/edit/${selectedInvoice._id}`);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedInvoice) {
            handleDeleteClick(selectedInvoice);
        }
        handleMenuClose();
    };

    const handlePost = async () => {
        if (selectedInvoice) {
            try {
                await updateInvoiceStatus(selectedInvoice._id, true);
            } catch (err) {
                console.error(err);
            }
        }
        handleMenuClose();
    };

    const handleUnpost = async () => {
        if (selectedInvoice) {
            try {
                await updateInvoiceStatus(selectedInvoice._id, false);
            } catch (err) {
                console.error(err);
            }
        }
        handleMenuClose();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (isLoading && invoices.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h6" fontWeight="600" color="text.primary">
                            All Invoices ({filteredInvoices.length})
                        </Typography>
                        <Box display="flex" gap={1}>
                            <Chip
                                label={`Total: ${invoices.length}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search by customer name or invoice number..."
                                value={searchTerm}
                                onChange={handleSearch}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Invoice No</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Customer</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Items</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Total</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, color: 'text.primary' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredInvoices.map((invoice) => (
                                    <TableRow
                                        key={invoice._id}
                                        hover
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            },
                                            '&:last-child td': {
                                                borderBottom: 0
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="600" color="primary">
                                                {invoice.invoiceNo}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="500">
                                                {invoice.customerName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(invoice.date)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge isPosted={invoice.isPosted} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`${invoice.items.length} items`}
                                                size="small"
                                                color="info"
                                                variant="outlined"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="600" color="text.primary">
                                                {formatCurrency(invoice.grandTotal)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuClick(e, invoice)}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'action.hover'
                                                    }
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {filteredInvoices.length === 0 && !isLoading && (
                        <Box textAlign="center" py={4}>
                            <Typography variant="h6" color="text.secondary">
                                No invoices found
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Invoice</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete invoice "{invoiceToDelete?.invoiceNo}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleView}>
                    <ViewIcon sx={{ mr: 1 }} />
                    View
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                {selectedInvoice && (
                    selectedInvoice.isPosted ? (
                        <MenuItem onClick={handleUnpost} sx={{ color: 'warning.main' }}>
                            <UnpublishedIcon sx={{ mr: 1 }} />
                            Unpost
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handlePost} sx={{ color: 'success.main' }}>
                            <PublishIcon sx={{ mr: 1 }} />
                            Post
                        </MenuItem>
                    )
                )}
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default RecentInvoicesTable;
