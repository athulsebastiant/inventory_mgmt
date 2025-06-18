import productSupplier from "../models/productSupplier.js";
import Product from "../models/product.js";
import Supplier from "../models/supplier.js";

export const createProductSupplier = async (req, res) => {
  try {
    const { productId, supplierId, unitPrice, leadTimeDays, preferred } =
      req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ message: "Invalid productId" });

    const supplier = await Supplier.findById(supplierId);
    if (!supplier)
      return res.status(400).json({ message: "Invalid supplierId" });

    if (preferred) {
      await productSupplier.updateMany({ productId }, { preferred: false });
    }

    const newLink = new productSupplier({
      productId,
      supplierId,
      unitPrice,
      leadTimeDays,
      preferred,
    });
    await newLink.save();
    res.status(201).json({
      success: true,
      message: "Product Supplier Link created",
      newLink,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllProductSuppliers = async (req, res) => {
  try {
    const links = await productSupplier.find();
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductSuppliersByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const links = await productSupplier.find({ productId }).populate({
      path: "supplierId",
      select: "name",
    });

    res.json(links);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductSuppliersBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const links = await productSupplier.find({ supplierId }).populate({
      path: "productId",
      select: "name imagesUrl",
    });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProductSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { unitPrice, leadTimeDays, preferred } = req.body;
    const link = await productSupplier.findById(id);
    if (!link) return res.status(404).json({ message: "Link not found" });

    if (preferred) {
      await productSupplier.updateMany(
        { productId: link.productId },
        { preferred: false }
      );
    }

    link.unitPrice = unitPrice ?? link.unitPrice;
    link.leadTimeDays = leadTimeDays ?? link.leadTimeDays;
    link.preferred = preferred ?? link.preferred;

    await link.save();
    res.json({ success: true, message: "Links updated successfully", link });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProductSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductSupplier.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Link not found" });
    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
