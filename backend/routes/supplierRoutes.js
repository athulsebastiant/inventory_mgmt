import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  getSupplierCount,
  deleteSupplier,
} from "../controllers/supplierControllers.js";

const router = express.Router();

router.post("/", createSupplier);
router.get("/", getSuppliers);
router.get("/:id", getSupplierById);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);
router.get("/suppliers/count", getSupplierCount);

export default router;
