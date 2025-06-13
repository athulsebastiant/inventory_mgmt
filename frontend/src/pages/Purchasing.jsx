import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import "../styles/Purchasing.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Purchasing = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/purchase-orders/`);
      console.log(response.data);
      setPurchases(response.data);
      setError("");
    } catch (error) {
      setError("Failed to load purchase orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // const purchaseElements = purchases.map((purchase) => (
  //   <div key={purchase._id}>
  //     <Link to={`${purchase._id}`}>
  //       <h3>Purchase id:{purchase._id}</h3>
  //       <p>Supplier:{purchase.supplierId.name}</p>

  //       <p>
  //         Price:
  //         {purchase.items.reduce((sum, item) => {
  //           return sum + item.quantityOrdered * item.unitPrice;
  //         }, 0)}
  //       </p>
  //       <p>{purchase.status}</p>
  //       <p>{purchase.createdAt}</p>
  //     </Link>
  //   </div>
  // ));

  return (
    <div className="purchasing-container">
      <div className="header">
        <h1>Purchase Orders</h1>
        <Link to="new-purchase" className="add-button">
          + Add New Purchase Order
        </Link>
      </div>
      {loading && <div className="loading">Loading purchase orders...</div>}
      {error && <div className="error">{error}</div>}
      <div className="purchase-list">
        {purchases.map((purchase) => (
          <Link
            to={`${purchase._id}`}
            key={purchase._id}
            className="purchase-card"
          >
            <h3 className="purchase-id">ID: {purchase._id}</h3>
            <p className="supplier-name">
              Supplier: {purchase.supplierId.name}
            </p>
            <p className="purchase-price">
              Total Price: ₹
              {purchase.items
                .reduce(
                  (sum, item) => sum + item.quantityOrdered * item.unitPrice,
                  0
                )
                .toFixed(2)}
            </p>
            <p className={`status ${purchase.status.toLowerCase()}`}>
              Status: {purchase.status}
            </p>
            <p className="date">
              Date: {new Date(purchase.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Purchasing;
