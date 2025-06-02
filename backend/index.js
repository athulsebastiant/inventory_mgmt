import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import productSupplierRoutes from "./routes/productSupplierRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes.js";
dotenv.config();

const app = express();

connectDB();
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/productSuppliers", productSupplierRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
