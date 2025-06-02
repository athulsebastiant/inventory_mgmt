import express from "express";
import {
  createProductSupplier,
  getAllProductSuppliers,
  getProductSuppliersByProduct,
  getProductSuppliersBySupplier,
  updateProductSupplier,
  deleteProductSupplier,
} from "../controllers/productSupplierControllers.js";

const router = express.Router();

router.post("/", createProductSupplier);
router.get("/", getAllProductSuppliers);
router.get("/product/:productId", getProductSuppliersByProduct);
router.get("/supplier/:supplierId", getProductSuppliersBySupplier);
router.put("/:id", updateProductSupplier);
router.delete("/:id", deleteProductSupplier);

export default router;
