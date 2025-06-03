import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    changeType: {
      type: String,
      enum: ["increase", "decrease"],
      required: true,
    },
    source: {
      type: String,
      enum: ["manual", "quotation", "purchase-order"],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    quantityChanged: {
      type: Number,
      required: true,
      min: 1,
    },
    note: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("StockLog", stockLogSchema);
