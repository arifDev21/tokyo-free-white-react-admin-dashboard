import { Migration } from "./index";
import mongoose, { Schema } from "mongoose";

const InvoiceItemSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const InvoiceSchema = new Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    items: [InvoiceItemSchema],
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    isPosted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
InvoiceSchema.index({ invoiceNo: 1 }, { unique: true });
InvoiceSchema.index({ customerName: 1 });
InvoiceSchema.index({ date: -1 });
InvoiceSchema.index({ isPosted: 1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ createdAt: -1 });

export const createInvoicesMigration: Migration = {
  name: "002-create-invoices",

  async up(): Promise<void> {
    // Check if model already exists
    if (mongoose.models.Invoice) {
      console.log("Invoice model already exists, skipping");
      return;
    }

    // Create invoices collection with schema
    const Invoice = mongoose.model("Invoice", InvoiceSchema);

    // Create indexes
    await Invoice.collection.createIndex({ invoiceNo: 1 }, { unique: true });
    await Invoice.collection.createIndex({ customerName: 1 });
    await Invoice.collection.createIndex({ date: -1 });
    await Invoice.collection.createIndex({ createdAt: -1 });

    console.log("Invoices collection created with indexes");
  },

  async down(): Promise<void> {
    // Drop invoices collection
    await mongoose.connection.db?.collection("invoices").drop();
    console.log("Invoices collection dropped");
  },
};
