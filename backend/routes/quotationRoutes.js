import express from "express";
import {
  createQuotation,
  approveQuotation,
  fulfillQuotation,
  rejectQuotation,
  getAllQuotations,
  getQuotationById,
  deleteQuotation,
} from "../controllers/quotationControllers.js";

const router = express.Router();

router.post("/", createQuotation);
router.get("/", getAllQuotations);
router.get("/:id", getQuotationById);
router.put("/:id/approve", approveQuotation);
router.put("/:id/fulfill", fulfillQuotation);
router.put("/:id/reject", rejectQuotation);
router.delete("/:id", deleteQuotation);

export default router;
