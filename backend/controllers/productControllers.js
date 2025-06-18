import Product from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      initialStock,
      currentStock,
      reorderLevel,
      costPrice,

      category,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );
    console.log(">>> req.body:", req.body);
    console.log(">>> req.files:", req.files);
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const product = new Product({
      name,
      sku,
      description,
      initialStock: initialStock || 0,
      currentStock: currentStock || 0,
      reorderLevel: reorderLevel || 0,
      costPrice,

      category,
      imagesUrl,
      reservedStock: 0,
    });

    const savedProduct = await product.save();
    res.status(201).json({
      success: true, // Explicitly indicate success
      message: "Product created successfully!", // Optional: Add a success message
      product: savedProduct, // Include the actual product data
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Product Not Found" });
    res.json({ message: "Product deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments(); // or .estimatedDocumentCount() if approximation is fine
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTotalInventoryCost = async (req, res) => {
  try {
    const totalValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          value: { $sum: { $multiply: ["$currentStock", "$costPrice"] } },
        },
      },
    ]);
    res.json({ totalValue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
