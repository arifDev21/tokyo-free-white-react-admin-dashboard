const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  async register(username: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // Invoice endpoints
  async getInvoices() {
    return this.request('/invoices');
  }

  async getInvoice(id: string) {
    return this.request(`/invoices/${id}`);
  }

  async createInvoice(invoiceData: any) {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData)
    });
  }

  async updateInvoice(id: string, invoiceData: any) {
    return this.request(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData)
    });
  }

  async deleteInvoice(id: string) {
    return this.request(`/invoices/${id}`, {
      method: 'DELETE'
    });
  }

  async searchInvoices(params: {
    customerName?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params.customerName)
      queryParams.append('customerName', params.customerName);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return this.request(`/invoices/search?${queryParams.toString()}`);
  }

  async generateInvoiceNumber() {
    return this.request('/invoices/generate-number');
  }

  async updateInvoiceStatus(id: string, isPosted: boolean) {
    return this.request(`/invoices/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isPosted })
    });
  }
}

export const apiService = new ApiService();
export default apiService;
