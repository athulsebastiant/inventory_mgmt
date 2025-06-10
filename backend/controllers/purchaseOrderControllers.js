import PurchaseOrder from "../models/purchaseOrder.js";
import ProductSupplier from "../models/productSupplier.js";
import Supplier from "../models/supplier.js";
import Product from "../models/product.js";
import StockLog from "../models/stockLog.js";
export const createPurchaseOrder = async (req, res) => {
  try {
    const { supplierId, items, expectedDeliveryDate } = req.body;

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(400).json({ message: "Invalid supplierId" });
    }

    const validatedItems = await Promise.all(
      items.map(async (item) => {
        const {
          productSupplierId,
          quantityOrdered,
          unitPrice: overridePrice,
        } = item;
        const ps = await ProductSupplier.findById(productSupplierId);
        if (!ps) {
          throw new Error(`ProductSupplier ${productSupplierId} not found`);
        }
        if (ps.supplierId.toString() !== supplierId) {
          throw new Error(
            `ProductSupplier ${productSupplierId} does not belong to supplier ${supplierId}`
          );
        }

        const finalPrice = overridePrice != null ? overridePrice : ps.unitPrice;
        if (finalPrice < 0) {
          throw new Error(
            `Invalid unitPrice for ProductSupplier ${productSupplierId}`
          );
        }

        if (typeof quantityOrdered !== "number" || quantityOrdered < 1) {
          throw new Error(
            `Invalid quantityOrdered for ProductSupplier ${productSupplierId}`
          );
        }

        return {
          productSupplierId,
          quantityOrdered,
          unitPrice: finalPrice,
        };
      })
    ).catch((err) => {
      throw err;
    });
    const po = new PurchaseOrder({
      supplierId,
      items: validatedItems,
      expectedDeliveryDate,
    });
    await po.save();

    return res.status(201).json(po);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find().populate({
      path: "supplierId",
      select: "name",
    });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPurchaseOrderById = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate("supplierId", "name")
      .populate({
        path: "items.productSupplierId",
        populate: {
          path: "productId",
          select: "name imagesUrl", // get product name
        },
      });

    if (!po) return res.status(404).json({ message: "PO not found" });
    return res.json(po);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expectedDeliveryDate } = req.body;

    const po = await PurchaseOrder.findById(id);
    if (!po) return res.status(404).json({ message: "PO not found" });

    if (status === "delivered" && po.status !== "delivered") {
      for (let item of po.items) {
        const ps = await ProductSupplier.findById(item.productSupplierId);
        if (!ps)
          throw new Error(
            `ProductSupplier ${item.productSupplierId} not found`
          );

        const product = await Product.findById(ps.productId);
        if (!product) throw new Error(`Product ${ps.productId} not found`);

        product.currentStock += item.quantityOrdered;
        await product.save();

        const log = new StockLog({
          productId: ps.productId,
          changeType: "increase",
          source: "purchase-order",
          referenceId: po._id,
          quantityChanged: item.quantityOrdered,
          note: `PO ${po._id} delivered`,
          date: new Date(),
        });
        await log.save();
      }
    }

    if (status) po.status = status;
    if (expectedDeliveryDate) po.expectedDeliveryDate = expectedDeliveryDate;

    await po.save();
    return res.json(po);
  } catch (error) {
    console.error("Update PO Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deletePurchaseOrder = async (req, res) => {
  try {
    const po = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!po) return res.status(404).json({ message: "PO not found" });
    return res.json({ message: "PO deleted" });
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
};
