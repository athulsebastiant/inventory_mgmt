import express from "express";
const router = express.Router();
import * as productControllers from "../controllers/productControllers.js";

router.get("/", productControllers.getProducts);
router.get("/:id", productControllers.getProductById);
router.post("/", productControllers.createProduct);
router.put("/:id", productControllers.updateProduct);
router.delete("/:id", productControllers.deleteProduct);

export default router;
