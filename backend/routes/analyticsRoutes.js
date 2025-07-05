import express from "express";
import {
  getTopSellingProducts,
  getStockOverviewByCategory,
  getClientEngagement,
} from "../controllers/analyticsControllers.js";

const router = express.Router();

router.get("/top-selling-products", getTopSellingProducts);

router.post("/stock-overview", getStockOverviewByCategory);

router.get("/client-engagement", getClientEngagement);
export default router;
