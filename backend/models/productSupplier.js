import mongoose from "mongoose";

const productSupplierSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    leadTimeDays: {
      type: Number,
    },
    preferred: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ProductSupplier", productSupplierSchema);
