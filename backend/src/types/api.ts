export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface UserResponse {
  _id: string;
  id: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export interface InvoiceResponse {
  _id: string;
  invoiceNo: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
}
