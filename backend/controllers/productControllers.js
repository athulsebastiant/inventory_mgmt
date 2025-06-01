import Product from "../models/product.js";

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
  const {
    name,
    sku,
    description,
    initialStock,
    currentStock,
    reorderLevel,
    costPrice,

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

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
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
