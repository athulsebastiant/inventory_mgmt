import PurchaseOrder from "../models/purchaseOrder.js";
import ProductSupplier from "../models/productSupplier.js";
import Supplier from "../models/supplier.js";
import Product from "../models/product.js";
import StockLog from "../models/stockLog.js";
import puppeteer from "puppeteer";
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

export const getPurchaseOrderCount = async (req, res) => {
  try {
    const count = await PurchaseOrder.countDocuments(); // or .estimatedDocumentCount() if approximation is fine
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generatePurchaseInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseOrder = await PurchaseOrder.findById(id)
      .populate("supplierId")
      .populate({
        path: "items.productSupplierId",
        populate: {
          path: "productId",
        },
      });

    if (!purchaseOrder) {
      res.status(404).json({ message: "Quotation not found" });
    }

    const supplier = purchaseOrder.supplierId;
    const products = purchaseOrder.items;

    let itemsHtml = "";
    let grandTotal = 0;

    products.forEach((item, index) => {
      const product = item.productSupplierId.productId;
      const quantity = item.quantityOrdered;
      const unitPrice = item.unitPrice;
      const total = quantity * unitPrice;
      grandTotal += total;

      itemsHtml += `
      <tr>
      <td>${index + 1}</td>
      <td>
      <img src="${
        product.imagesUrl[0]
      }" width="50" height="50" style="object-fit:cover;"/>
      <div>${product.name}</div>
      </td>
      <td>${quantity}</td>
      <td>$${unitPrice.toFixed(2)}</td>
      <td>$${total.toFixed(2)}</td>
      </tr>     
      `;
    });

    const html = `
    <html>
      <head><style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { text-align: center; }
            .client-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
            th { background: #f0f0f0; }
            .total { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Purchase Invoice</h1>

          <div class="client-details">
            <strong>Supplier:</strong> ${supplier.name}<br/>
            <strong>Phone:</strong> ${supplier.phone}<br/>
            <strong>Email:</strong> ${supplier.email}<br/>
            <strong>Address:</strong> ${supplier.address}<br/>
            <strong>Status:</strong> ${purchaseOrder.status}<br/>
            <strong>Date:</strong> ${new Date(
              purchaseOrder.createdAt
            ).toLocaleDateString()}
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="4" class="total">Grand Total</td>
                <td>$${grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    
    `;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename = "purchase-order-${purchaseOrder._id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};
