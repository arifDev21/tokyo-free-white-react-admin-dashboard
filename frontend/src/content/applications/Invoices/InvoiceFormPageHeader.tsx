import { Typography, Button, Grid, IconButton, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

function InvoiceFormPageHeader() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const handleBack = () => {
        navigate('/applications/invoices');
    };

    return (
        <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
                <Box display="flex" alignItems="center">
                    <IconButton
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h3" component="h3" gutterBottom>
                            {isEdit ? 'Edit Invoice' : 'Create Invoice'}
                        </Typography>
                        <Typography variant="subtitle2">
                            {isEdit ? 'Update invoice details and items' : 'Fill in the invoice information below'}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default InvoiceFormPageHeader;
