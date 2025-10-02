import Invoice, { IInvoice, IInvoiceItem } from "../models/Invoice";

export class InvoiceRepository {
  async findById(id: string): Promise<IInvoice | null> {
    try {
      const data = await Invoice.findById(id);
      console.log(data, "data find by id");
      return data;
    } catch (error) {
      throw new Error(`Error finding invoice by ID: ${error}`);
    }
  }

  async findByInvoiceNo(invoiceNo: string): Promise<IInvoice | null> {
    try {
      return await Invoice.findOne({ invoiceNo });
    } catch (error) {
      throw new Error(`Error finding invoice by invoice number: ${error}`);
    }
  }

  async findByInvoiceNumber(invoiceNo: string): Promise<IInvoice | null> {
    try {
      return await Invoice.findOne({ invoiceNo });
    } catch (error) {
      throw new Error(`Error finding invoice by invoice number: ${error}`);
    }
  }

  async create(invoiceData: {
    invoiceNo: string;
    customerName: string;
    date: Date;
    dueDate?: Date;
    items: IInvoiceItem[];
    grandTotal: number;
    isPosted: boolean;
  }): Promise<IInvoice> {
    try {
      const invoice = new Invoice(invoiceData);
      return await invoice.save();
    } catch (error) {
      throw new Error(`Error creating invoice: ${error}`);
    }
  }

  async update(
    id: string,
    updateData: Partial<IInvoice>
  ): Promise<IInvoice | null> {
    try {
      return await Invoice.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Error updating invoice: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await Invoice.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Error deleting invoice: ${error}`);
    }
  }

  async findAll(): Promise<IInvoice[]> {
    try {
      return await Invoice.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error finding all invoices: ${error}`);
    }
  }

  async findByCustomerName(customerName: string): Promise<IInvoice[]> {
    try {
      return await Invoice.find({
        customerName: { $regex: customerName, $options: "i" },
      }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error finding invoices by customer name: ${error}`);
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IInvoice[]> {
    try {
      return await Invoice.find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ date: -1 });
    } catch (error) {
      throw new Error(`Error finding invoices by date range: ${error}`);
    }
  }

  async findByPostedStatus(isPosted: boolean): Promise<IInvoice[]> {
    try {
      return await Invoice.find({ isPosted }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error finding invoices by posted status: ${error}`);
    }
  }
}
