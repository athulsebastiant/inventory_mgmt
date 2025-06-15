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
} from "../controllers/quotationControllers.js";

const router = express.Router();

router.post("/", createQuotation);
router.get("/", getAllQuotations);
router.get("/:id", getQuotationById);
router.put("/:id/approve", approveQuotation);
router.put("/:id/fulfill", fulfillQuotation);
router.put("/:id/reject", rejectQuotation);
router.delete("/:id", deleteQuotation);
router.get("/quotations/count", getQuotationCount);
router.get("/quotations/total-quot-value", getTotalQuotValue);
export default router;
