import { Router } from "express";
import { InvoiceController } from "../controllers/invoiceController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const invoiceController = new InvoiceController();

router.use(authMiddleware);

// POST /invoices - Create new invoice
router.post("/", async (req, res) => {
  await invoiceController.createInvoice(req, res);
});

// GET /invoices - Get all invoices
router.get("/", async (req, res) => {
  await invoiceController.getAllInvoices(req, res);
});

// GET /invoices/search - Search invoices by customer name or date range
router.get("/search", async (req, res) => {
  await invoiceController.searchInvoices(req, res);
});

// GET /invoices/generate-number - Generate new invoice number
router.get("/generate-number", async (req, res) => {
  await invoiceController.generateInvoiceNumber(req, res);
});

// GET /invoices/:id - Get specific invoice
router.get("/:id", async (req, res) => {
  await invoiceController.getInvoice(req, res);
});

// PUT /invoices/:id - Update invoice
router.put("/:id", async (req, res) => {
  await invoiceController.updateInvoice(req, res);
});

// DELETE /invoices/:id - Delete invoice
router.delete("/:id", async (req, res) => {
  await invoiceController.deleteInvoice(req, res);
});

// PUT /invoices/:id/status - Update invoice posted status
router.put("/:id/status", async (req, res) => {
  await invoiceController.updateInvoicePostedStatus(req, res);
});

// GET /invoices/status/:isPosted - Get invoices by posted status
router.get("/status/:isPosted", async (req, res) => {
  await invoiceController.getInvoicesByPostedStatus(req, res);
});

export default router;
