import Product from "../models/product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const {
    name,
    sku,
    description,
    initialStock,
    currentStock,
    reorderLevel,
    costPrice,
    supplierId,
    category,
    imageUrl,
  } = req.body;

  try {
    const product = new Product({
      name,
      sku,
      description,
      initialStock: initialStock || 0,
      currentStock: currentStock || 0,
      reorderLevel: reorderLevel || 0,
      costPrice,
      supplierId,
      category,
      imageUrl,
      reservedStock: 0,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
