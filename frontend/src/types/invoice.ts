export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
  isTaxable: boolean;
  taxAmount: number;
}

export interface Invoice {
  _id: string;
  invoiceNo: string;
  customerName: string;
  date: string;
  dueDate?: string;
  items: InvoiceItem[];
  grandTotal: number;
  isPosted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceRequest {
  invoiceNo: string;
  customerName: string;
  date: string;
  dueDate?: string;
  items: Omit<InvoiceItem, 'total' | 'taxAmount'>[];
  isPosted?: boolean;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  id: string;
}

export interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
}

export interface InvoiceStatistics {
  total: number;
  draft: number;
  posted: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
