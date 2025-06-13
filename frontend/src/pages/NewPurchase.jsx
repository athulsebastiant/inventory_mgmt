import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const NewPurchase = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedSupplierData, setSelectedSupplierData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [productSupplierLinks, setProductSupplierLinks] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProductLink, setSelectedProductLink] = useState("");
  const [selectedProductData, setSelectedProductData] = useState(null);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccesss, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/suppliers/");
      const data = response.data;
      setSuppliers(data);
      setError(null);
    } catch (error) {
      console.log(error);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductSupplierLinks = async (supplierId) => {
    try {
      setLoadingProducts(true);
      const response = await axios.get(
        `http://localhost:5000/api/productSuppliers/supplier/${supplierId}`
      );
      const data = await response.data;
      setProductSupplierLinks(data);
    } catch (error) {
      console.log(error);
      setProductSupplierLinks([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    setSelectedSupplier(supplierId);

    if (supplierId) {
      const supplier = suppliers.find((s) => s._id === supplierId);
      setSelectedSupplierData(supplier);
      fetchProductSupplierLinks(supplierId);
    } else {
      setSelectedSupplierData(null);
      setProductSupplierLinks([]);
    }
    setSelectedProductLink("");
    setSelectedProductData(null);
    setQuantity("");
    setUnitPrice("");
    setOrderSuccess(false);
    setOrderError(null);
    setSelectedItems([]);
  };

  const handleProductSelect = (productLink) => {
    setSelectedProductLink(productLink._id);
    setSelectedProductData(productLink);
    setUnitPrice(productLink.unitPrice);
    setIsProductDropdownOpen(false);
  };

  const handleAddItem = () => {
    if (!selectedProductData || !quantity || !unitPrice) {
      alert("Please  select a product and enter quantity");
      return;
    }
    const newItem = {
      productSupplierId: selectedProductData._id,
      unitPrice: parseFloat(unitPrice),
      quantityOrdered: parseInt(quantity),
      productName: selectedProductData.productId.name,
      productImage: selectedProductData.productId.imagesUrl[0],
    };

    setSelectedItems([...selectedItems, newItem]);

    setSelectedProductLink("");
    setSelectedProductData(null);
    setQuantity("");
    setUnitPrice("");
  };

  const handlePostPurchaseOrder = async () => {
    if (!selectedSupplier || selectedItems.length === 0) {
      alert("Please select a supplier and add at least one item");
      return;
    }
    try {
      setSubmittingOrder(true);
      setOrderError(null);
      setOrderSuccess(false);

      const orderData = {
        supplierId: selectedSupplier,
        items: selectedItems.map((item) => ({
          productSupplierId: item.productSupplierId,
          quantityOrdered: item.quantityOrdered,
          unitPrice: item.unitPrice,
        })),
      };
      const response = await axios.post(
        "http://localhost:5000/api/purchase-orders/",
        orderData
      );
      console.log("Purchase order created successfully", response.data);
      setOrderSuccess(true);
      setSelectedItems([]);
      setSelectedSupplier("");
      setSelectedSupplierData(null);
      setProductSupplierLinks([]);
    } catch (error) {
      console.error("Error creating purchase order:", error);
      setOrderError(
        error.response?.data?.message ||
          "Failed to create purchase order. Please try again."
      );
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleRemoveItem = (indexToRemove) => {
    setSelectedItems(
      selectedItems.filter((_, index) => index !== indexToRemove)
    );
  };

  console.log(selectedItems);

  console.log(selectedItems);
  if (loading) {
    return <div className="loading">Loading suppliers..</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  return (
    <div className="supplier-select-container">
      <nav className="breadcrumb">
        <Link to="/purchasing">Purchases</Link> &gt;{" "}
        <span>Add New Purchase</span>
      </nav>
      {orderSuccesss && (
        <div className="success-message">
          ✅ Purchase order created successfully!
        </div>
      )}

      {/* Error Message */}
      {orderError && <div className="error-message">❌ {orderError}</div>}
      <div className="select-section">
        <label htmlFor="supplier-select" className="select-label">
          Select Supplier:
        </label>
        <select
          id="supplier-select"
          value={selectedSupplier}
          onChange={handleSupplierChange}
          className="supplier-select"
        >
          <option value="">Chooose a supplier...</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      {selectedSupplierData && (
        <div className="supplier-details">
          <h3>Supplier Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{selectedSupplierData.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">
                {selectedSupplierData.phone || "Not provided"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">
                {selectedSupplierData.email || "Not provided"}
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedSupplierData && (
        <div className="product-section">
          <h3>Select Products</h3>
          {loadingProducts ? (
            <div className="loading">Loading products ...</div>
          ) : (
            <>
              <div className="custom-select-container">
                <label className="select-label">Select Product:</label>
                <div
                  className={`custom-select ${
                    isProductDropdownOpen ? "open" : ""
                  }`}
                  onClick={() =>
                    setIsProductDropdownOpen(!isProductDropdownOpen)
                  }
                >
                  <div className="selected-option">
                    {selectedProductData ? (
                      <div className="option-content">
                        <img
                          src={selectedProductData.productId.imagesUrl[0]}
                          className="option-image"
                        />
                        <span>{selectedProductData.productId.name}</span>
                      </div>
                    ) : (
                      "Choose a product..."
                    )}
                  </div>
                  <div className="dropdown-arrow">▼</div>
                </div>
                {isProductDropdownOpen && (
                  <div className="options-list">
                    <div
                      className="custom-option"
                      onClick={() => {
                        setSelectedProductLink("");
                        setSelectedProductData(null);
                        setUnitPrice("");
                        setIsProductDropdownOpen(false);
                      }}
                    >
                      Choose a product...
                    </div>
                    {productSupplierLinks.map((link) => (
                      <div
                        key={link._id}
                        className="custom-option"
                        onClick={() => handleProductSelect(link)}
                      >
                        <div className="option-content">
                          <img
                            src={link.productId.imagesUrl[0]}
                            className="option-image"
                          />
                          <span>{link.productId.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedProductData && (
                <div className="selected-product-detaisl">
                  <h4>Product Details</h4>
                  <div className="product-info">
                    <img
                      src={selectedProductData.productId.imagesUrl[0]}
                      className="product-image"
                    />
                    <div className="product-details">
                      <h5>{selectedProductData.productId.name}</h5>
                      <p>
                        <strong>Unit Price:</strong>
                        {selectedProductData.unitPrice}
                      </p>
                      <p>
                        <strong>Lead Time:</strong>
                        {selectedProductData.leadTimeDays}
                      </p>
                    </div>
                  </div>
                  <div className="order-inputs">
                    <div className="input-group">
                      <label>Quantity:</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        min={1}
                      />
                    </div>
                    <div className="input-group">
                      <label>Unit Price:</label>
                      <input
                        type="number"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        placeholder="Enter price"
                        step={0.01}
                        min={0}
                      />
                    </div>
                  </div>
                  <button className="add-item-btn" onClick={handleAddItem}>
                    Add Item to Order
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {selectedItems.length > 0 && (
        <div className="selected-items">
          <h3>Selected Items ({selectedItems.length})</h3>
          <div className="items-list">
            {selectedItems.map((item, index) => (
              <div key={index} className="item-card">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="item-image"
                />
                <div className="item-details">
                  <h5>{item.productName}</h5>
                  <p>Quantity: {item.quantityOrdered}</p>
                  <p>Unit Price: ${item.unitPrice}</p>
                  <p>
                    <strong>
                      Total: $
                      {(item.quantityOrdered * item.unitPrice).toFixed(2)}
                    </strong>
                  </p>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(index)}
                  title="Remove item"
                >
                  {orderSuccesss && (
                    <div className="success-message">
                      ✅ Purchase order created successfully!
                    </div>
                  )}

                  {/* Error Message */}
                  {orderError && (
                    <div className="error-message">❌ {orderError}</div>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="total-amount">
              <strong>
                Total Order Amount: $
                {selectedItems
                  .reduce(
                    (total, item) =>
                      total + item.quantityOrdered * item.unitPrice,
                    0
                  )
                  .toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="order-actions">
            <button
              className="post-order-btn"
              onClick={handlePostPurchaseOrder}
              disabled={submittingOrder || selectedItems.length === 0}
            >
              {submittingOrder ? "Creating Order..." : "Post Purchase Order"}
            </button>
          </div>
        </div>
      )}
      <style jsx="true">{`
        .supplier-select-container {
          max-width: 600px;
          margin: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            sans-serif;
        }

        .select-section,
        .product-section {
          margin-bottom: 24px;
        }

        .select-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 16px;
        }

        .supplier-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .supplier-select:hover {
          border-color: #999;
        }

        .supplier-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .supplier-details,
        .product-section,
        .selected-items {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          animation: slideIn 0.3s ease-out;
        }

        .supplier-details h3,
        .product-section h3,
        .selected-items h3 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 20px;
          font-weight: 600;
        }

        .details-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .detail-label {
          font-weight: 600;
          color: #666;
          min-width: 80px;
          margin-right: 12px;
        }

        .detail-value {
          color: #333;
          font-weight: 500;
          flex: 1;
        }

        .custom-select-container {
          position: relative;
          margin-bottom: 20px;
        }

        .custom-select {
          border: 2px solid #ddd;
          border-radius: 8px;
          padding: 12px;
          background: white;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 50px;
          transition: border-color 0.2s ease;
          user-select: none;
        }

        .custom-select:hover {
          border-color: #999;
        }

        .custom-select.open {
          border-color: #007bff;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .selected-option {
          flex: 1;
        }

        .dropdown-arrow {
          color: #666;
          transition: transform 0.2s ease;
          font-size: 12px;
        }

        .custom-select.open .dropdown-arrow {
          transform: rotate(180deg);
        }

        .options-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #007bff;
          border-top: none;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .custom-option {
          padding: 12px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
          transition: background-color 0.2s ease;
        }

        .custom-option:hover {
          background-color: #f8f9fa;
        }

        .custom-option:last-child {
          border-bottom: none;
        }

        .option-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .option-image {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #eee;
          flex-shrink: 0;
        }

        .selected-product-details {
          margin-top: 20px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .selected-product-details h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .product-info {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          align-items: flex-start;
        }

        .product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #eee;
        }

        .product-details h5 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .product-details p {
          margin: 4px 0;
          color: #666;
        }

        .order-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          margin-bottom: 4px;
          font-weight: 600;
          color: #333;
        }

        .input-group input {
          padding: 10px 12px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #007bff;
        }

        .add-item-btn {
          background: #007bff;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .add-item-btn:hover {
          background: #0056b3;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-card {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          position: relative;
        }

        .item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #eee;
        }

        .item-details {
          flex: 1;
        }

        .item-details h5 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .item-details p {
          margin: 2px 0;
          color: #666;
          font-size: 14px;
        }

        .remove-item-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .remove-item-btn:hover {
          background: #c82333;
        }

        .order-summary {
          margin-top: 20px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .total-amount {
          font-size: 18px;
          text-align: right;
          color: #333;
        }

        .order-actions {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }

        .post-order-btn {
          background: #28a745;
          color: white;
          padding: 14px 32px;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          min-width: 200px;
        }

        .post-order-btn:hover:not(:disabled) {
          background: #218838;
        }

        .post-order-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .success-message {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 600;
        }

        .error-message {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 600;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          font-size: 16px;
          color: #666;
        }

        .error {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .supplier-select-container {
            max-width: 100%;
          }

          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .detail-label {
            min-width: auto;
            margin-right: 0;
          }

          .product-info {
            flex-direction: column;
          }

          .order-inputs {
            grid-template-columns: 1fr;
          }

          .item-card {
            flex-direction: column;
          }

          .post-order-btn {
            width: 100%;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default NewPurchase;
