import Quotation from "../models/quotation.js";
import Client from "../models/client.js";
import ProductSupplier from "../models/productSupplier.js";
import Product from "../models/product.js";
import StockLog from "../models/stockLog.js";
// updateQuotation  deleteQuotation
export const createQuotation = async (req, res) => {
  try {
    const { clientId, products } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    let status = "approved";
    const toPurchase = [];

    for (const item of products) {
      const { productSupplierId, quantity, unitprice: overridePrice } = item;

      const ps = await ProductSupplier.findById(productSupplierId);
      if (!ps) {
        return res
          .status(400)
          .json({ message: `ProductSupplier ${productSupplierId} not found` });
      }

      const product = await Product.findById(ps.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${ps.productId} not found` });
      }

      const finalPrice = overridePrice != null ? overridePrice : ps.unitPrice;
      if (finalPrice < 0) {
        return res
          .status(400)
          .json({ message: `Invalid unitPrice for ${productSupplierId}` });
      }
      item.unitPrice = finalPrice;

      const availableStock = product.currentStock - product.reservedStock;

      if (availableStock >= quantity) {
        product.reservedStock += quantity;
        await product.save();

        await StockLog.create({
          productId: product._id,
          changeType: "decrease",
          source: "quotation",
          referenceId: null,
          quantityChanged: quantity,
          note: `Reserved ${quantity} units for new quotation`,
          date: new Date(),
        });
      } else {
        if (availableStock > 0) {
          product.reservedStock += availableStock;
          await product.save();

          await StockLog.create({
            productId: product._id,
            changeType: "decrease",
            source: "quotation",
            referenceId: null,
            quantityChanged: availableStock,
            note: `Partially reserved ${availableStock} units for new quotation`,
            date: new Date(),
          });
        }
        status = "awaiting stock";
        const shortfall = quantity - availableStock;
        toPurchase.push({ productId: product._id, needed: shortfall });
      }
    }

    const quotation = new Quotation({
      clientId,
      products,
      status,
    });
    await quotation.save();

    if (status !== "pending") {
      await StockLog.updateMany(
        { source: "quotation", referenceId: null },
        { referenceId: quotation._id }
      );
    }
    const message =
      status === "awaiting stock"
        ? "Quotation created; some items await stock. See toPurchase list."
        : "Quotation created and fully reserved.";
    return res
      .status(201)
      .json({ success: true, quotation, message, toPurchase });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const approveQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (!["pending", "awaiting stock"].includes(quotation.status)) {
      return res.status(201).json({
        message: `Cannot approve a quotation with status '${quotation.status}'.`,
      });
    }

    const toPurchase = [];
    let allFulfilled = true;

    for (const item of quotation.products) {
      const { productSupplierId, quantity } = item;

      const ps = await ProductSupplier.findById(productSupplierId);
      if (!ps) {
        return res
          .status(400)
          .json({ message: `ProductSupplier ${productSupplierId} not found` });
      }

      const product = await Product.findById(ps.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${ps.productId} not found` });
      }

      const reservedAgg = await StockLog.aggregate([
        {
          $match: {
            source: "quotation",
            referenceId: quotation._id,
            productId: product._id,
            changeType: "decrease",
          },
        },
        { $group: { _id: null, totalReserved: { $sum: "$quantityChanged" } } },
      ]);

      const reservedSoFar =
        reservedAgg.length > 0 ? reservedAgg[0].totalReserved : 0;

      const needed = quantity - reservedSoFar;

      if (needed <= 0) {
        continue;
      }

      const availableStock = product.currentStock - product.reservedStock;

      if (availableStock >= needed) {
        product.reservedStock += needed;
        await product.save();

        await StockLog.create({
          productId: product._id,
          changeType: "decrease",
          source: "quotation",
          referenceId: quotation._id,
          quantityChanged: needed,
          note: `Reserved additional ${needed} units on approval of quotation ${quotation._id}`,
          date: new Date(),
        });
      } else if (availableStock > 0) {
        product.reservedStock += availableStock;

        await product.save();

        await StockLog.create({
          productId: product._id,
          changeType: "decrease",
          source: "quotation",
          referenceId: quotation._id,
          quantityChanged: availableStock,
          note: `Partially reserved ${availableStock} units on approval of quotation ${quotation._id}`,
          date: new Date(),
        });

        const shortfall = needed - availableStock;
        allFulfilled = false;
        toPurchase.push({ productId: product._id, stillNeeded: shortfall });
      } else {
        allFulfilled = false;
        toPurchase.push({
          productId: product._id,
          productName: product.name,
          stillNeeded: needed,
        });
      }
    }

    quotation.status = allFulfilled ? "approved" : "awaiting stock";
    await quotation.save();

    const message = allFulfilled
      ? "Quotation approved and fully reserved."
      : "Quotation set to awaiting stock. See toPurchase list for shortfall.";

    return res.json({ quotation, message, toPurchase });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const fulfillQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (quotation.status !== "approved") {
      return res.status(400).json({
        message: `Cannot fulfill a quotation with status '${quotation.status}'.`,
      });
    }

    for (const item of quotation.products) {
      const { productSupplierId, quantity } = item;

      const ps = await ProductSupplier.findById(productSupplierId);
      if (!ps) {
        return res
          .status(400)
          .json({ message: `ProductSupplier ${productSupplierId} not found` });
      }

      const product = await Product.findById(ps.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${ps.productId} not found` });
      }

      product.reservedStock = Math.max(0, product.reservedStock - quantity);
      product.currentStock -= quantity;
      await product.save();

      await StockLog.create({
        productId: product._id,
        changeType: "decrease",
        source: "quotation",
        referenceId: quotation._id,
        quantityChanged: quantity,
        note: `Fulfilled quotation ${quotation._id} (removed ${quantity} units)`,
        date: new Date(),
      });
    }

    quotation.status = "fulfilled";
    await quotation.save();
    return res.json({
      message: "Quotation fulfilled successfully.",
      quotation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const rejectQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findById(id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (
      quotation.status !== "approved" &&
      quotation.status !== "awaiting stock"
    ) {
      return res.status(400).json({
        message: "Only approved or awaiting quoatatios can be rejected",
      });
    }

    for (const item of quotation.products) {
      const ps = await ProductSupplier.findById(item.productSupplierId);
      if (!ps) {
        return res.status(404).json({
          message: `ProductSupplier ${item.productSupplierId} not found`,
        });
      }

      const product = await Product.findById(ps.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${ps.productId} not found` });
      }

      product.reservedStock -= item.quantity;
      if (product.reservedStock < 0) product.reservedStock = 0;
      await product.save();

      await StockLog.create({
        productId: product._id,
        changeType: "increase",
        source: "quotation",
        referenceId: quotation._id,
        quantityChanged: item.quantity,
        note: `Released ${item.quantity} units due to quotation rejection`,
        date: new Date(),
      });
    }

    quotation.status = "rejected";
    await quotation.save();

    return res.json({
      message: "Quotation rejected and stock released",
      quotation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().populate({
      path: "clientId",
      select: "name",
    });
    return res.json(quotations);
  } catch (error) {}
};

export const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id)
      .populate({
        path: "clientId",
        select: "name",
      })
      .populate({
        path: "products.productSupplierId", // Path to the productSupplierId within the products array
        populate: {
          // Nested populate for the product within productSupplier
          path: "productId", // Path to the productId within the productSupplier schema
          select: "name imagesUrl", // Select only the 'name' field from the product
        },
      });
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    return res.json(quotation);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (["approved", "awaiting stock"].includes(quotation.status)) {
      for (const item of quotation.products) {
        const ps = await ProductSupplier.findById(ps.productSupplierId);
        if (!ps) continue;

        const product = await Product.findById(ps.productId);
        if (!product) continue;

        const reservedAgg = await StockLog.aggregate([
          {
            $match: {
              source: "quotation",
              referenceId: quotation._id,
              productId: product._id,
              changeType: "decrease",
            },
          },
          {
            $group: { _id: null, totalReserved: { $sum: "$quantityChanged" } },
          },
        ]);

        const reservedSoFar =
          reservedAgg.length > 0 ? reservedAgg[0].totalReserved : 0;
        if (reservedSoFar > 0) {
          product.reservedStock -= reservedSoFar;
          if (product.reservedStock < 0) product.reservedStock = 0;
          await product.save();

          await StockLog.create({
            productId: product._id,
            changeType: "increase",
            source: "quotation",
            referenceId: quotation._id,
            quantityChanged: reservedSoFar,
            note: `Released ${reservedSoFar} units due to deletion of quotation ${quotation._id}`,
            date: new Date(),
          });
        }
      }
    }

    await quotation.remove();
    return res.json({
      message: "Quotation deleted and reserved stock  (if any) released",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getQuotationCount = async (req, res) => {
  try {
    const count = await Quotation.countDocuments(); // or .estimatedDocumentCount() if approximation is fine
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTotalQuotValue = async (req, res) => {
  try {
    const totalQuotationValue = await Quotation.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ["$products.quantity", "$products.unitPrice"] },
          },
        },
      },
    ]);
    res.json({ totalQuotationValue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
