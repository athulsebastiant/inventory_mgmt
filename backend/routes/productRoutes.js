import express from "express";
const router = express.Router();
import * as productControllers from "../controllers/productControllers.js";

router.get("/", productControllers.getProducts);
router.post("/", productControllers.createProduct);

export default router;
