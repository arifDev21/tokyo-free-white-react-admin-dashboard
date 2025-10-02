import { Seeder } from "./index";
import mongoose, { Schema } from "mongoose";

const InvoiceItemSchema = new Schema(
  {
    description: String,
    quantity: Number,
    price: Number,
    total: Number,
  },
  { _id: false }
);

const InvoiceSchema = new Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    items: [InvoiceItemSchema],
    grandTotal: {
      type: Number,
      required: true,
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

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export const seedInvoices: Seeder = {
  name: "002-seed-invoices",

  async run(): Promise<void> {
    // Check if invoices already exist
    const existingInvoices = await Invoice.countDocuments();
    if (existingInvoices > 0) {
      console.log("Invoices already exist, skipping seeder");
      return;
    }

    // Create sample invoices
    const invoices = [
      {
        invoiceNo: "INV-001",
        customerName: "PT. ABC Company",
        date: new Date("2024-01-15"),
        dueDate: new Date("2024-02-15"),
        items: [
          {
            description: "Web Development Service",
            quantity: 1,
            price: 5000000,
            total: 5000000,
            isTaxable: true,
            taxAmount: 550000,
          },
          {
            description: "Domain Registration",
            quantity: 1,
            price: 150000,
            total: 150000,
            isTaxable: false,
            taxAmount: 0,
          },
        ],
        grandTotal: 5700000,
        isPosted: true,
      },
      {
        invoiceNo: "INV-002",
        customerName: "CV. XYZ Trading",
        date: new Date("2024-01-20"),
        dueDate: new Date("2024-02-20"),
        items: [
          {
            description: "Mobile App Development",
            quantity: 1,
            price: 8000000,
            total: 8000000,
            isTaxable: true,
            taxAmount: 880000,
          },
          {
            description: "UI/UX Design",
            quantity: 1,
            price: 2000000,
            total: 2000000,
            isTaxable: true,
            taxAmount: 220000,
          },
        ],
        grandTotal: 11100000,
        isPosted: false,
      },
      {
        invoiceNo: "INV-003",
        customerName: "Toko Online Maju",
        date: new Date("2024-02-01"),
        dueDate: new Date("2024-03-01"),
        items: [
          {
            description: "E-commerce Website",
            quantity: 1,
            price: 12000000,
            total: 12000000,
            isTaxable: true,
            taxAmount: 1320000,
          },
          {
            description: "Payment Gateway Integration",
            quantity: 1,
            price: 3000000,
            total: 3000000,
            isTaxable: true,
            taxAmount: 330000,
          },
          {
            description: "SSL Certificate",
            quantity: 1,
            price: 500000,
            total: 500000,
            isTaxable: false,
            taxAmount: 0,
          },
        ],
        grandTotal: 17205000,
        isPosted: true,
      },
      {
        invoiceNo: "INV-004",
        customerName: "Restoran Sederhana",
        date: new Date("2024-02-10"),
        dueDate: new Date("2024-03-10"),
        items: [
          {
            description: "POS System Development",
            quantity: 1,
            price: 6000000,
            total: 6000000,
            isTaxable: true,
            taxAmount: 660000,
          },
          {
            description: "Training & Support",
            quantity: 1,
            price: 1000000,
            total: 1000000,
            isTaxable: true,
            taxAmount: 110000,
          },
        ],
        grandTotal: 7770000,
        isPosted: false,
      },
      {
        invoiceNo: "INV-005",
        customerName: "Klinik Sehat",
        date: new Date("2024-02-15"),
        dueDate: new Date("2024-03-15"),
        items: [
          {
            description: "Medical Management System",
            quantity: 1,
            price: 15000000,
            total: 15000000,
            isTaxable: true,
            taxAmount: 1650000,
          },
          {
            description: "Database Setup",
            quantity: 1,
            price: 2000000,
            total: 2000000,
            isTaxable: true,
            taxAmount: 220000,
          },
          {
            description: "Data Migration",
            quantity: 1,
            price: 1500000,
            total: 1500000,
            isTaxable: true,
            taxAmount: 165000,
          },
        ],
        grandTotal: 20535000,
        isPosted: false,
      },
    ];

    await Invoice.insertMany(invoices);
    console.log(`Created ${invoices.length} invoices`);
  },

  async clear(): Promise<void> {
    await Invoice.deleteMany({});
    console.log("All invoices cleared");
  },
};
