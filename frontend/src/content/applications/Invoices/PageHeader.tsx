import { Typography, Button, Grid } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useNavigate } from 'react-router-dom';

function PageHeader() {
    const navigate = useNavigate();
    const user = {
        name: 'Admin User',
        avatar: '/static/images/avatars/1.jpg'
    };

    const handleCreateInvoice = () => {
        navigate('/applications/invoices/create');
    };

    return (
        <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
                <Typography variant="h3" component="h3" gutterBottom>
                    Invoices
                </Typography>
                <Typography variant="subtitle2">
                    {user.name}, these are your recent invoices
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    sx={{ mt: { xs: 2, md: 0 } }}
                    variant="contained"
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                    onClick={handleCreateInvoice}
                >
                    Create Invoice
                </Button>
            </Grid>
        </Grid>
    );
}

export default PageHeader;