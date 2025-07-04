import express from "express";
import {
  getTopSellingProducts,
  getStockOverviewByCategory,
} from "../controllers/analyticsControllers.js";

const router = express.Router();

router.get("/top-selling-products", getTopSellingProducts);

router.post("/stock-overview", getStockOverviewByCategory);

export default router;
