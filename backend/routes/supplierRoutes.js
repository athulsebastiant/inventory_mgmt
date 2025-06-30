import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  getSupplierCount,
  deleteSupplier,
} from "../controllers/supplierControllers.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protect);
router.post("/", createSupplier);
router.get("/", getSuppliers);
router.get("/:id", getSupplierById);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);
router.get("/suppliers/count", getSupplierCount);

export default router;
