import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Invoice, InvoiceState } from '../types/invoice';
import { invoiceService } from '../services/invoiceService';

interface InvoiceContextType extends InvoiceState {
    fetchInvoices: () => Promise<void>;
    fetchInvoice: (id: string) => Promise<void>;
    createInvoice: (invoiceData: any) => Promise<void>;
    updateInvoice: (id: string, invoiceData: any) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
    updateInvoiceStatus: (id: string, isPosted: boolean) => Promise<void>;
    searchInvoices: (params: { customerName?: string; startDate?: string; endDate?: string }) => Promise<void>;
    clearError: () => void;
    setCurrentInvoice: (invoice: Invoice | null) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoice = () => {
    const context = useContext(InvoiceContext);
    if (context === undefined) {
        throw new Error('useInvoice must be used within an InvoiceProvider');
    }
    return context;
};

interface InvoiceProviderProps {
    children: ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await invoiceService.getInvoices();

            if (response.success && response.data) {
                setInvoices(response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch invoices');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoices';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchInvoice = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await invoiceService.getInvoice(id);

            if (response.success && response.data) {
                setCurrentInvoice(response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch invoice');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoice';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createInvoice = useCallback(async (invoiceData: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await invoiceService.createInvoice(invoiceData);

            if (response.success && response.data) {
                setInvoices(prev => [response.data!, ...prev]);
            } else {
                throw new Error(response.message || 'Failed to create invoice');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateInvoice = useCallback(async (id: string, invoiceData: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await invoiceService.updateInvoice(id, invoiceData);

            if (response.success && response.data) {
                setInvoices(prev =>
                    prev.map(invoice =>
                        invoice._id === id ? response.data! : invoice
                    )
                );
                if (currentInvoice?._id === id) {
                    setCurrentInvoice(response.data!);
                }
            } else {
                throw new Error(response.message || 'Failed to update invoice');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentInvoice]);

    const deleteInvoice = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await invoiceService.deleteInvoice(id);

            if (response.success) {
                setInvoices(prev => prev.filter(invoice => invoice._id !== id));
                if (currentInvoice?._id === id) {
                    setCurrentInvoice(null);
                }
            } else {
                throw new Error(response.message || 'Failed to delete invoice');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentInvoice]);

    const updateInvoiceStatus = useCallback(async (id: string, isPosted: boolean) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await invoiceService.updateInvoiceStatus(id, isPosted);

            if (response.success && response.data) {
                setInvoices(prev =>
                    prev.map(invoice =>
                        invoice._id === id ? response.data! : invoice
                    )
                );
                if (currentInvoice?._id === id) {
                    setCurrentInvoice(response.data!);
                }
            } else {
                throw new Error(response.message || 'Failed to update invoice status');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice status';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [currentInvoice]);

    const searchInvoices = useCallback(async (params: {
        customerName?: string;
        startDate?: string;
        endDate?: string
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await invoiceService.searchInvoices(params);

            if (response.success && response.data) {
                setInvoices(response.data);
            } else {
                throw new Error(response.message || 'Failed to search invoices');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to search invoices';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: InvoiceContextType = {
        invoices,
        currentInvoice,
        isLoading,
        error,
        fetchInvoices,
        fetchInvoice,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        searchInvoices,
        clearError,
        setCurrentInvoice,
    };

    return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
};

