import { apiService } from './api';
import {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  ApiResponse
} from '../types/invoice';

export class InvoiceService {
  async getInvoices(): Promise<ApiResponse<Invoice[]>> {
    try {
      return (await apiService.getInvoices()) as ApiResponse<Invoice[]>;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch invoices'
      );
    }
  }

  async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    try {
      return (await apiService.getInvoice(id)) as ApiResponse<Invoice>;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch invoice'
      );
    }
  }

  async createInvoice(
    invoiceData: CreateInvoiceRequest
  ): Promise<ApiResponse<Invoice>> {
    try {
      return (await apiService.createInvoice(
        invoiceData
      )) as ApiResponse<Invoice>;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create invoice'
      );
    }
  }

  async updateInvoice(
    id: string,
    invoiceData: Partial<CreateInvoiceRequest>
  ): Promise<ApiResponse<Invoice>> {
    try {
      return (await apiService.updateInvoice(
        id,
        invoiceData
      )) as ApiResponse<Invoice>;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update invoice'
      );
    }
  }

  async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    try {
      return (await apiService.deleteInvoice(id)) as ApiResponse<void>;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to delete invoice'
      );
    }
  }

  async searchInvoices(params: {
    customerName?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Invoice[]>> {
    try {
      return (await apiService.searchInvoices(params)) as ApiResponse<
        Invoice[]
      >;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to search invoices'
      );
    }
  }

  async generateInvoiceNumber(): Promise<ApiResponse<{ invoiceNo: string }>> {
    try {
      return (await apiService.generateInvoiceNumber()) as ApiResponse<{
        invoiceNo: string;
      }>;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to generate invoice number'
      );
    }
  }

  calculateItemTotal(quantity: number, price: number): number {
    return quantity * price;
  }

  calculateGrandTotal(
    items: Array<{ quantity: number; price: number }>
  ): number {
    return items.reduce(
      (total, item) =>
        total + this.calculateItemTotal(item.quantity, item.price),
      0
    );
  }

  async updateInvoiceStatus(
    id: string,
    isPosted: boolean
  ): Promise<ApiResponse<Invoice>> {
    try {
      return (await apiService.updateInvoiceStatus(
        id,
        isPosted
      )) as ApiResponse<Invoice>;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to update invoice status'
      );
    }
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;
