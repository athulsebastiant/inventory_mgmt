import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/NewPurchase.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [message, setMessage] = useState("");
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/suppliers/`);
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
        `${backendUrl}/api/productSuppliers/supplier/${supplierId}`
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
    if (isDemoMode) {
      setMessage(
        "Purchasing products is restricted for demo purposes. You can view existing data."
      );
      return; // Stop execution if in demo mode
    }
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
        `${backendUrl}/api/purchase-orders/`,
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
          {message && (
            <div
              className={`message-box ${
                isDemoMode ? "demo-message" : "success-message"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewPurchase;
