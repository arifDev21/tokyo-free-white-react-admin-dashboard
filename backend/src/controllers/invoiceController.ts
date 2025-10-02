import { Request, Response } from "express";
import { InvoiceService } from "../services/invoiceService";

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { invoiceNo, customerName, date, dueDate, items, isPosted } =
        req.body;

      // Validate input
      if (
        !invoiceNo ||
        !customerName ||
        !date ||
        !items ||
        !Array.isArray(items)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invoice number, customer name, date, and items are required",
        });
        return;
      }

      // Validate invoice data
      const validation = this.invoiceService.validateInvoiceData({
        invoiceNo,
        customerName,
        date: new Date(date),
        items,
      });

      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        });
        return;
      }

      const invoice = await this.invoiceService.createInvoice({
        invoiceNo,
        customerName,
        date: new Date(date),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        items,
        isPosted: isPosted || false, // Include isPosted parameter
      });

      res.status(201).json({
        success: true,
        message: "Invoice created successfully",
        data: invoice,
      });
    } catch (error) {
      console.error("Create invoice error:", error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create invoice",
      });
    }
  }

  async getInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Invoice ID is required",
        });
        return;
      }

      const invoice = await this.invoiceService.getInvoice(id);

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Invoice retrieved successfully",
        data: invoice,
      });
    } catch (error) {
      console.error("Get invoice error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get invoice",
      });
    }
  }

  async getAllInvoices(req: Request, res: Response): Promise<void> {
    try {
      const invoices = await this.invoiceService.getAllInvoices();

      res.status(200).json({
        success: true,
        message: "Invoices retrieved successfully",
        data: invoices,
      });
    } catch (error) {
      console.error("Get all invoices error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get invoices",
      });
    }
  }

  async updateInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Invoice ID is required",
        });
        return;
      }

      // If items are being updated, validate them
      if (updateData.items) {
        const validation = this.invoiceService.validateInvoiceData({
          invoiceNo: updateData.invoiceNo || "",
          customerName: updateData.customerName || "",
          date: updateData.date ? new Date(updateData.date) : new Date(),
          items: updateData.items,
        });

        if (!validation.isValid) {
          res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.errors,
          });
          return;
        }
      }

      const invoice = await this.invoiceService.updateInvoice(id, updateData);

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Invoice updated successfully",
        data: invoice,
      });
    } catch (error) {
      console.error("Update invoice error:", error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update invoice",
      });
    }
  }

  async deleteInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Invoice ID is required",
        });
        return;
      }

      const deleted = await this.invoiceService.deleteInvoice(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Invoice deleted successfully",
      });
    } catch (error) {
      console.error("Delete invoice error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete invoice",
      });
    }
  }

  async searchInvoices(req: Request, res: Response): Promise<void> {
    try {
      const { customerName, startDate, endDate } = req.query;

      let invoices;

      if (customerName) {
        invoices = await this.invoiceService.searchInvoicesByCustomer(
          customerName as string
        );
      } else if (startDate && endDate) {
        invoices = await this.invoiceService.getInvoicesByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        invoices = await this.invoiceService.getAllInvoices();
      }

      res.status(200).json({
        success: true,
        message: "Invoices retrieved successfully",
        data: invoices,
      });
    } catch (error) {
      console.error("Search invoices error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to search invoices",
      });
    }
  }

  async generateInvoiceNumber(req: Request, res: Response): Promise<void> {
    try {
      const invoiceNumber = await this.invoiceService.generateInvoiceNumber();

      res.status(200).json({
        success: true,
        message: "Invoice number generated successfully",
        data: {
          invoiceNo: invoiceNumber,
        },
      });
    } catch (error) {
      console.error("Generate invoice number error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate invoice number",
      });
    }
  }

  // Update invoice posted status
  async updateInvoicePostedStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isPosted } = req.body;

      if (typeof isPosted !== "boolean") {
        res.status(400).json({
          success: false,
          message: "isPosted must be a boolean value",
        });
        return;
      }

      const invoice = await this.invoiceService.updateInvoicePostedStatus(
        id,
        isPosted
      );

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Invoice posted status updated successfully",
        data: invoice,
      });
    } catch (error) {
      console.error("Update invoice posted status error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update invoice posted status",
      });
    }
  }

  // Get invoices by posted status
  async getInvoicesByPostedStatus(req: Request, res: Response): Promise<void> {
    try {
      const { isPosted } = req.params;

      if (isPosted !== "true" && isPosted !== "false") {
        res.status(400).json({
          success: false,
          message: "isPosted must be 'true' or 'false'",
        });
        return;
      }

      const invoices = await this.invoiceService.getInvoicesByPostedStatus(
        isPosted === "true"
      );

      res.status(200).json({
        success: true,
        message: "Invoices retrieved successfully",
        data: invoices,
      });
    } catch (error) {
      console.error("Get invoices by posted status error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get invoices by posted status",
      });
    }
  }
}
