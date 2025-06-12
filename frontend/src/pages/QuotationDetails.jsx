import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/QuotationDetails.css";
const QuotationDetails = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [message, setMessage] = useState("");
  const [toPurchase, setToPurchase] = useState([]);
  const [isFrozen, setIsFrozen] = useState(false);
  const fetchQuotation = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/client-quotations/${id}`
      );
      setQuotation(res.data);
      if (res.data.status === "fulfilled") {
        setIsFrozen(true);
      }
    } catch (err) {
      console.error("Failed to fetch quotation", err);
    }
  };
  useEffect(() => {
    fetchQuotation();
  }, [id]);

  const handleApprove = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/client-quotations/${id}/approve`
      );

      setMessage(res.data.message);
      setToPurchase(res.data.toPurchase || []);
      await fetchQuotation();
    } catch (err) {
      console.error("Approval failed", err);
      setMessage("Approval failed. Please try again.");
    }
  };

  const handleFulfill = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/client-quotations/${id}/fulfill`
      );

      setMessage(res.data.message);
      setIsFrozen(true);
      await fetchQuotation();
    } catch (err) {
      console.error("Fulfillment failed", err);
      setMessage("Fulfillment failed. Please try again.");
    }
  };

  if (!quotation) return <p>Loading...</p>;

  console.log(toPurchase);
  const totalPrice = quotation.products.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);

  return (
    <div className="quotation-container">
      <nav className="breadcrumb">
        <Link to="/client-quotations">Quotations</Link> &gt;{" "}
        <span>Quotation Details</span>
      </nav>
      <div className="button-group">
        <button
          className="btn approve"
          onClick={handleApprove}
          disabled={isFrozen}
        >
          Approve
        </button>
        <button
          className="btn approve"
          onClick={handleFulfill}
          disabled={isFrozen}
        >
          Fulfill
        </button>
      </div>

      <h1 className="main-heading">Quotation Details</h1>
      <div className="details-box">
        <p>
          <strong>Quotation ID:</strong> {quotation._id}
        </p>
        <p>
          <strong>Client Name:</strong> {quotation.clientId?.name}
        </p>
        <p>
          <strong>Status:</strong> {quotation.status}
        </p>
        <p>
          <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}
        </p>
      </div>

      {message && <div className="status-message">{message}</div>}

      {toPurchase.length > 0 && (
        <div className="purchase-section">
          <h3>Items to Purchase:</h3>
          <ul>
            {toPurchase.map((item, index) => (
              <li key={index}>
                <strong>Product:</strong> {[item.productName] || item.productId}
                <br />
                <strong>Still Needed:</strong> {item.stillNeeded}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="subheading">Products</h2>
      <div className="product-grid">
        {quotation.products?.map((productItem, index) => {
          const product = productItem.productSupplierId?.productId;
          const imageUrl = product?.imagesUrl?.[0];

          return (
            <div className="product-card" key={index}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={product?.name}
                  className="product-img"
                />
              )}
              <h3>{product?.name}</h3>
              <p>
                <strong>Quantity:</strong> {productItem.quantity}
              </p>
              <p>
                <strong>Unit Price:</strong> ₹{productItem.unitPrice}
              </p>
              <p>
                <strong>Total:</strong> $
                {(productItem.quantity * productItem.unitPrice).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuotationDetails;
