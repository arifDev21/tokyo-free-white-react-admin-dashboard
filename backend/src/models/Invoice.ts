import mongoose, { Document, Schema } from "mongoose";

export interface IInvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
  isTaxable: boolean;
  taxAmount: number;
}

export interface IInvoice extends Document {
  _id: string;
  invoiceNo: string;
  customerName: string;
  date: Date;
  dueDate?: Date;
  items: IInvoiceItem[];
  grandTotal: number;
  isPosted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema: Schema = new Schema({
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
  isTaxable: {
    type: Boolean,
    required: true,
    default: true,
  },
  taxAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
});

const InvoiceSchema: Schema = new Schema(
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
      default: Date.now,
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

export default mongoose.model<IInvoice>("Invoice", InvoiceSchema);
