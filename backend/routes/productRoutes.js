import express from "express";
const router = express.Router();
import * as productControllers from "../controllers/productControllers.js";
import upload from "../middleware/multer.js";
import protect from "../middleware/authMiddleware.js";
router.use(protect);
router.get("/", productControllers.getProducts);
router.get("/:id", productControllers.getProductById);
router.post(
  "/",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  productControllers.createProduct
);
router.put("/:id", productControllers.updateProduct);
router.delete("/:id", productControllers.deleteProduct);
router.get("/products/count", productControllers.getProductCount);
router.get(
  "/products/total-inv-cost",
  productControllers.getTotalInventoryCost
);
export default router;
