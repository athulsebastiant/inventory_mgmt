import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../../styles/PurchaseDetails.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const PurchaseDetails = () => {
  const { id } = useParams();
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/purchase-orders/${id}`
        );
        setPurchaseOrder(response.data);
        setStatus(response.data.status);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch purchase order.");
        setLoading(false);
      }
    };

    fetchPurchaseOrder();
  }, [id]);

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (error) return <div className="pd-error">{error}</div>;
  if (!purchaseOrder) return null;

  return (
    <div className="pd-container">
      <nav className="breadcrumb">
        <Link to="/purchasing">Purchases</Link> &gt;{" "}
        <span>Purchase Details</span>
      </nav>
      <div className="pd-header">
        <h2>Purchase Order</h2>
        <p className="pd-id">ID: {purchaseOrder._id}</p>
        <p className="pd-supplier">Supplier: {purchaseOrder.supplierId.name}</p>

        <div className="pd-status-section">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={status === "delivered"}
            className="pd-select"
          >
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={async () => {
              try {
                await axios.put(`${backendUrl}/api/purchase-orders/${id}`, {
                  status,
                });
                alert("Status updated!");
                const res = await axios.get(
                  `${backendUrl}/api/purchase-orders/${id}`
                );
                setPurchaseOrder(res.data);
                setStatus(res.data.status);
              } catch (err) {
                alert("Failed to update status");
              }
            }}
            disabled={purchaseOrder.status === "delivered"}
            className="pd-button"
          >
            Update Status
          </button>
        </div>
      </div>

      <h3 className="pd-items-title">Ordered Items</h3>
      <div className="pd-items-list">
        {purchaseOrder.items.map((item) => {
          const product = item.productSupplierId.productId;
          const imageUrl =
            product.imagesUrl?.[0] || "https://via.placeholder.com/150";

          return (
            <div key={item._id} className="pd-item-card">
              <img
                src={imageUrl}
                alt={product.name}
                className="pd-product-image"
              />
              <div className="pd-item-info">
                <h4>{product.name}</h4>
                <p>
                  <strong>Unit Price:</strong> ₹{item.unitPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantityOrdered}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PurchaseDetails;
