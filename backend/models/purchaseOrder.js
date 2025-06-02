import mongoose, { mongo } from "mongoose";
const purchaseOrderSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    items: [
      {
        productSupplierId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductSupplier",
          required: true,
        },
        quantityOrdered: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,

          min: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
    },
    expectedDeliveryDate: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;
