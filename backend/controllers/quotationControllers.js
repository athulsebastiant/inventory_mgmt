import Quotation from "../models/quotation.js";
import Client from "../models/client.js";
import ProductSupplier from "../models/productSupplier.js";
import Product from "../models/product.js";
import StockLog from "../models/stockLog.js";

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
    return res.status(201).json({ quotation, message, toPurchase });
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
      return res.status(400).json({
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
        toPurchase.push({ productId: product._id, stillNeeded: needed });
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
