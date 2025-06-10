import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
          `http://localhost:5000/api/purchase-orders/${id}`
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!purchaseOrder) return null;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Purchase Order ID: {purchaseOrder._id}</h2>
      <h3>Supplier: {purchaseOrder.supplierId.name}</h3>
      <label>
        Status:&nbsp;
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={status === "delivered"}
        >
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>
      <button
        onClick={async () => {
          try {
            await axios.put(`http://localhost:5000/api/purchase-orders/${id}`, {
              status,
            });
            alert("Status updated!");
            const res = await axios.get(
              `http://localhost:5000/api/purchase-orders/${id}`
            );
            setPurchaseOrder(res.data);
            setStatus(res.data.status);
          } catch (err) {
            alert("Failed to update status");
          }
        }}
        disabled={purchaseOrder.status === "delivered"}
        style={{ marginLeft: "10px" }}
      >
        Update Status
      </button>

      <h4>Items:</h4>
      {purchaseOrder.items.map((item, index) => {
        const product = item.productSupplierId.productId;
        const imageUrl =
          product.imagesUrl?.[0] || "https://via.placeholder.com/150";

        return (
          <div
            key={item._id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <h5>{product.name}</h5>
            <img
              src={imageUrl}
              alt={product.name}
              style={{
                width: "150px",
                height: "auto",
                display: "block",
                marginBottom: "10px",
              }}
            />
            <p>
              <strong>Unit Price:</strong> ${item.unitPrice.toFixed(2)}
            </p>
            <p>
              <strong>Quantity:</strong> {item.quantityOrdered}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PurchaseDetails;
