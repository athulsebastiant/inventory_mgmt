import mongoose from "mongoose";
import productSupplier from "./productSupplier";

const quotationSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    products: [
      {
        productSupplierId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductSupplier",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "awaiting stock", "fulfilled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quotation", quotationSchema);
