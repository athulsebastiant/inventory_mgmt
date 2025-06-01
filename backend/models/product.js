import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    description: String,
    initialStock: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    costPrice: { type: Number, required: true, min: 0 },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    category: String,
    imageUrl: String,
    reservedStock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
