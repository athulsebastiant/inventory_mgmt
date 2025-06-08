import Product from "../models/product.js";
import Supplier from "../models/supplier.js";

export const createSupplier = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const supplier = new Supplier({
      name,
      email,
      phone,
      address: address || "N/A",
    });
    const savedSupplier = await supplier.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Supplier created",
        supplier: savedSupplier,
      });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
};

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Not found" });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a supplier
export const deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
