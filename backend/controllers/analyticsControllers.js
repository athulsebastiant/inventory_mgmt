import Quotation from "../models/quotation.js";
import Product from "../models/product.js";
import Client from "../models/client.js";
export const getTopSellingProducts = async (req, res) => {
  try {
    const result = await Quotation.aggregate([
      { $match: { status: "fulfilled" } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productSupplierId",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      {
        $lookup: {
          from: "productsuppliers",
          localField: "_id",
          foreignField: "_id",
          as: "productSupplier",
        },
      },
      { $unwind: "$productSupplier" },
      {
        $lookup: {
          from: "products",
          localField: "productSupplier.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          totalQuantity: 1,
        },
      },
      { $sort: { totalQuantity: -1 } },
    ]);
    res.json(result);
  } catch (error) {
    console.error("Error in getTopSellingProducts:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getStockOverviewByCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({ category }).select(
      "name currentStock reservedStock reorderLevel"
    );
    const formattedData = products.map((product) => ({
      productName: product.name,
      availableStock: product.currentStock - product.reservedStock,
      reorderLevel: product.reorderLevel,
    }));
    res.status(200).json(formattedData);
  } catch (error) {
    console.log("Error fetching stock overview", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClientEngagement = async (req, res) => {
  try {
    const result = await Quotation.aggregate([
      {
        $group: {
          _id: "$clientId",
          quotationCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "_id",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $project: {
          clientName: "$client.name",
          quotationCount: 1,
        },
      },
      { $sort: { quotationCount: -1 } },
    ]);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch client engagement data" });
  }
};
