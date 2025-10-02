import { Migration } from "./index";
import mongoose from "mongoose";

export const addItemPpnFieldsMigration: Migration = {
  name: "004-add-item-ppn-fields",

  async up(): Promise<void> {
    // Add PPN fields to existing invoice items
    await mongoose.connection.db?.collection("invoices").updateMany(
      {},
      {
        $set: {
          "items.$[].isTaxable": true,
          "items.$[].taxAmount": 0,
          "items.$[].totalWithTax": 0,
        },
      }
    );

    // Recalculate PPN for existing invoice items
    const invoices = await mongoose.connection.db
      ?.collection("invoices")
      .find({})
      .toArray();

    for (const invoice of invoices || []) {
      const updatedItems = invoice.items.map((item: any) => {
        const total = item.quantity * item.price;
        const taxAmount = item.isTaxable ? Math.round((total * 11) / 100) : 0;
        const totalWithTax = total + taxAmount;

        return {
          ...item,
          total,
          taxAmount,
          totalWithTax,
        };
      });

      // Recalculate invoice grand total
      const grandTotal = updatedItems.reduce(
        (sum: number, item: any) => sum + item.totalWithTax,
        0
      );

      await mongoose.connection.db?.collection("invoices").updateOne(
        { _id: invoice._id },
        {
          $set: {
            items: updatedItems,
            grandTotal,
          },
          $unset: {
            subtotal: "",
            taxRate: "",
            taxAmount: "",
          },
        }
      );
    }

    console.log("Item PPN fields added and calculated for existing invoices");
  },

  async down(): Promise<void> {
    // Remove PPN fields from invoice items
    await mongoose.connection.db?.collection("invoices").updateMany(
      {},
      {
        $unset: {
          "items.$[].isTaxable": "",
          "items.$[].taxAmount": "",
          "items.$[].totalWithTax": "",
        },
      }
    );

    console.log("Item PPN fields removed from invoices");
  },
};
