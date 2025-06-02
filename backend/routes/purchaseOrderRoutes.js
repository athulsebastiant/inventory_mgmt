import express from "express";
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from "../controllers/purchaseOrderControllers.js";

const router = express.Router();

router.post("/", createPurchaseOrder);
router.get("/", getAllPurchaseOrders);
router.get("/:id", getPurchaseOrderById);
router.put("/:id", updatePurchaseOrder);
router.delete("/:id", deletePurchaseOrder);

export default router;
