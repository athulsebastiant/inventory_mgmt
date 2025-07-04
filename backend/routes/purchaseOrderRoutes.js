import express from "express";
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderCount,
  generatePurchaseInvoice,
} from "../controllers/purchaseOrderControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.post("/", createPurchaseOrder);
router.get("/", getAllPurchaseOrders);
router.get("/:id", getPurchaseOrderById);
router.put("/:id", updatePurchaseOrder);
router.delete("/:id", deletePurchaseOrder);
router.get("/purchase-orders/count", getPurchaseOrderCount);
router.get("/:id/invoice", generatePurchaseInvoice);
export default router;
