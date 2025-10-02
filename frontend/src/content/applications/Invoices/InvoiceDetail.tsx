import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Container
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { useInvoice } from '../../../contexts/InvoiceContext';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import Footer from '../../../components/Footer';
import PDFService from '../../../services/pdfService';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentInvoice,
    fetchInvoice,
    isLoading,
    error,
    clearError
  } = useInvoice();

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id, fetchInvoice]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRecalculatedItems = () => {
    if (!currentInvoice) return [];

    return currentInvoice.items.map(item => {
      const baseTotal = item.quantity * item.price;
      const taxAmount = item.isTaxable ? Math.round((baseTotal * 11) / 100) : 0;
      const total = baseTotal + taxAmount;

      return {
        ...item,
        total,
        taxAmount
      };
    });
  };

  const recalculatedItems = getRecalculatedItems();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!currentInvoice) {
      alert('No invoice data available');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await PDFService.generateInvoicePDF(currentInvoice);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" onClose={clearError}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!currentInvoice) {
    return (
      <Box>
        <Typography variant="h6" color="text.secondary">
          Invoice not found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Invoice Details - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={() => navigate('/applications/invoices')}
              sx={{
                mr: 1,
                '@media print': {
                  display: 'none !important'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              sx={{
                '@media print': {
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem'
                }
              }}
            >
              Invoice Details
            </Typography>
          </Box>
          <Box
            sx={{
              '@media print': {
                display: 'none !important'
              }
            }}
          >
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/applications/invoices/edit/${currentInvoice._id}`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <Button
              variant="contained"
              startIcon={isGeneratingPDF ? <CircularProgress size={16} /> : <DownloadIcon />}
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </Box>
        </Box>
      </PageTitleWrapper>
      <Container
        maxWidth="lg"
        sx={{
          '@media print': {
            maxWidth: '100% !important',
            padding: '0 !important'
          }
        }}
      >
        <Card
          id="invoice-content"
          sx={{
            '@media print': {
              boxShadow: 'none !important',
              border: '1px solid #ccc !important',
              margin: '0 !important'
            }
          }}
        >
          <CardContent>
            {/* Invoice Header */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Invoice #{currentInvoice.invoiceNo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {formatDate(currentInvoice.date)}
                </Typography>
                {currentInvoice.dueDate && (
                  <Typography variant="body2" color="text.secondary">
                    Due Date: {formatDate(currentInvoice.dueDate)}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Bill To:
                </Typography>
                <Typography variant="body1">
                  {currentInvoice.customerName}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Items Table */}
            <TableContainer
              component={Paper}
              sx={{
                '@media print': {
                  boxShadow: 'none !important',
                  border: '1px solid #ccc !important'
                }
              }}
            >
              <Table
                sx={{
                  '@media print': {
                    '& .MuiTableCell-root': {
                      padding: '8px !important',
                      fontSize: '0.875rem !important'
                    }
                  }
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Taxable</TableCell>
                    <TableCell align="center">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recalculatedItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                      <TableCell align="center">
                        {item.isTaxable ? '✓' : '✗'}
                      </TableCell>
                      <TableCell align="center">{formatCurrency(item.total)}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Total Section */}
            <Box
              display="flex"
              justifyContent="flex-end"
              mt={3}
              sx={{
                '@media print': {
                  marginTop: '1rem !important'
                }
              }}
            >
              <Box
                minWidth={250}
                sx={{
                  '@media print': {
                    minWidth: '200px !important'
                  }
                }}
              >
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    '@media print': {
                      boxShadow: 'none !important',
                      border: '1px solid #ccc !important'
                    }
                  }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body1">
                            Subtotal:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1">
                            {formatCurrency(recalculatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0))}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body1">
                            Tax (11%):
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1">
                            {formatCurrency(recalculatedItems.reduce((sum, item) => sum + item.taxAmount, 0))}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h6">
                            Grand Total
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" color="primary">
                            {formatCurrency(recalculatedItems.reduce((sum, item) => sum + item.total, 0))}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            {/* Invoice Footer */}
            <Box mt={4} pt={3} borderTop="1px solid" borderColor="divider">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(currentInvoice.createdAt)}
                  </Typography>
                  {currentInvoice.updatedAt !== currentInvoice.createdAt && (
                    <Typography variant="body2" color="text.secondary">
                      Last Updated: {formatDate(currentInvoice.updatedAt)}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" align="right">
                    Thank you for your business!
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Box
        sx={{
          '@media print': {
            display: 'none !important'
          }
        }}
      >
        <Footer />
      </Box>
    </>
  );
};

export default InvoiceDetail;