import { InvoiceRepository } from "../repositories/invoiceRepository";
import { IInvoice, IInvoiceItem } from "../models/Invoice";

export class InvoiceService {
  private invoiceRepository: InvoiceRepository;

  constructor() {
    this.invoiceRepository = new InvoiceRepository();
  }

  async createInvoice(invoiceData: {
    invoiceNo: string;
    customerName: string;
    date: Date;
    dueDate?: Date;
    items: IInvoiceItem[];
    isPosted?: boolean;
  }): Promise<IInvoice> {
    try {
      const grandTotal = this.calculateGrandTotal(invoiceData.items);

      const invoice = await this.invoiceRepository.create({
        invoiceNo: invoiceData.invoiceNo,
        customerName: invoiceData.customerName,
        date: invoiceData.date,
        dueDate: invoiceData.dueDate,
        items: invoiceData.items,
        grandTotal,
        isPosted: invoiceData.isPosted ?? false, // Use nullish coalescing instead of ||
      });

      return invoice;
    } catch (error) {
      throw new Error(`Error creating invoice: ${error}`);
    }
  }

  async updateInvoice(
    id: string,
    updateData: {
      invoiceNo?: string;
      customerName?: string;
      date?: Date;
      dueDate?: Date;
      items?: IInvoiceItem[];
      isPosted?: boolean;
    }
  ): Promise<IInvoice | null> {
    try {
      let processedData: any = { ...updateData };

      if (updateData.items) {
        const grandTotal = this.calculateGrandTotal(updateData.items);

        processedData.items = updateData.items;
        processedData.grandTotal = grandTotal;
      }

      return await this.invoiceRepository.update(id, processedData);
    } catch (error) {
      throw new Error(`Error updating invoice: ${error}`);
    }
  }

  async getInvoice(id: string): Promise<IInvoice | null> {
    try {
      return await this.invoiceRepository.findById(id);
    } catch (error) {
      throw new Error(`Error getting invoice: ${error}`);
    }
  }

  async getAllInvoices(): Promise<IInvoice[]> {
    try {
      return await this.invoiceRepository.findAll();
    } catch (error) {
      throw new Error(`Error getting all invoices: ${error}`);
    }
  }

  async deleteInvoice(id: string): Promise<boolean> {
    try {
      return await this.invoiceRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting invoice: ${error}`);
    }
  }

  async searchInvoicesByCustomer(customerName: string): Promise<IInvoice[]> {
    try {
      return await this.invoiceRepository.findByCustomerName(customerName);
    } catch (error) {
      throw new Error(`Error searching invoices by customer: ${error}`);
    }
  }

  async getInvoicesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<IInvoice[]> {
    try {
      return await this.invoiceRepository.findByDateRange(startDate, endDate);
    } catch (error) {
      throw new Error(`Error getting invoices by date range: ${error}`);
    }
  }

  private calculateGrandTotal(items: IInvoiceItem[]): number {
    return items.reduce((total, item) => total + item.total, 0);
  }

  async generateInvoiceNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();

    try {
      const yearPrefix = `INV-`;
      const yearSuffix = `-${currentYear}`;

      const invoices = await this.invoiceRepository.findAll();
      const yearInvoices = invoices.filter(
        (invoice) =>
          invoice.invoiceNo.startsWith(yearPrefix) &&
          invoice.invoiceNo.endsWith(yearSuffix)
      );

      let nextNumber = 1;

      if (yearInvoices.length > 0) {
        const numbers = yearInvoices
          .map((invoice) => {
            const invoiceNo = invoice.invoiceNo;
            if (
              invoiceNo.startsWith(yearPrefix) &&
              invoiceNo.endsWith(yearSuffix)
            ) {
              const numberPart = invoiceNo.slice(
                yearPrefix.length,
                -yearSuffix.length
              );
              const num = parseInt(numberPart, 10);
              return !isNaN(num) ? num : 0;
            }
            return 0;
          })
          .filter((num) => num > 0);

        if (numbers.length > 0) {
          nextNumber = Math.max(...numbers) + 1;
        }
      }

      const formattedNumber = nextNumber.toString().padStart(5, "0");
      const invoiceNumber = `${yearPrefix}${formattedNumber}${yearSuffix}`;

      return invoiceNumber;
    } catch (error) {
      const timestamp = Date.now();
      return `INV-${timestamp}-${currentYear}`;
    }
  }

  validateInvoiceData(invoiceData: {
    invoiceNo: string;
    customerName: string;
    date: Date;
    items: Omit<IInvoiceItem, "total">[];
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!invoiceData.invoiceNo || invoiceData.invoiceNo.trim() === "") {
      errors.push("Invoice number is required");
    }

    if (!invoiceData.customerName || invoiceData.customerName.trim() === "") {
      errors.push("Customer name is required");
    }

    if (!invoiceData.date) {
      errors.push("Date is required");
    }

    if (!invoiceData.items || invoiceData.items.length === 0) {
      errors.push("At least one item is required");
    } else {
      invoiceData.items.forEach((item, index) => {
        if (!item.description || item.description.trim() === "") {
          errors.push(`Item ${index + 1}: Description is required`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
        }
        if (!item.price || item.price < 0) {
          errors.push(`Item ${index + 1}: Price must be 0 or greater`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async updateInvoicePostedStatus(
    id: string,
    isPosted: boolean
  ): Promise<IInvoice | null> {
    try {
      return await this.invoiceRepository.update(id, { isPosted });
    } catch (error) {
      throw new Error(`Error updating invoice posted status: ${error}`);
    }
  }

  async getInvoicesByPostedStatus(isPosted: boolean): Promise<IInvoice[]> {
    try {
      return await this.invoiceRepository.findByPostedStatus(isPosted);
    } catch (error) {
      throw new Error(`Error getting invoices by posted status: ${error}`);
    }
  }
}
