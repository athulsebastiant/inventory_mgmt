import express from "express";
import {
  createQuotation,
  approveQuotation,
  fulfillQuotation,
  rejectQuotation,
  getAllQuotations,
  getQuotationById,
  deleteQuotation,
  getQuotationCount,
  getTotalQuotValue,
  generateQuotationInvoice,
} from "../controllers/quotationControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.post("/", createQuotation);
router.get("/", getAllQuotations);
router.get("/:id", getQuotationById);
router.put("/:id/approve", approveQuotation);
router.put("/:id/fulfill", fulfillQuotation);
router.put("/:id/reject", rejectQuotation);
router.delete("/:id", deleteQuotation);
router.get("/quotations/count", getQuotationCount);
router.get("/quotations/total-quot-value", getTotalQuotValue);
router.get("/:id/invoice", generateQuotationInvoice);
export default router;
