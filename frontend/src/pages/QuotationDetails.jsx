import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
    <div className="container">
      <div style={{ marginBottom: "1rem" }}>
        <button
          className="approve-btn"
          onClick={handleApprove}
          disabled={isFrozen}
        >
          Approve
        </button>
        <button
          className="fulfill-btn"
          onClick={handleFulfill}
          disabled={isFrozen}
        >
          Fulfill
        </button>
      </div>

      <h1 className="heading">Quotation Details</h1>
      <div className="info">
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

      {message && <div className="message-box">{message}</div>}

      {toPurchase.length > 0 && (
        <div className="purchase-box">
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
      <div className="product-list">
        {quotation.products?.map((productItem, index) => {
          const product = productItem.productSupplierId?.productId;
          const imageUrl = product?.imagesUrl?.[0];

          return (
            <div className="product-card" key={index}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={product?.name}
                  className="product-image"
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
                <strong>Total:</strong> ₹
                {(productItem.quantity * productItem.unitPrice).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
      <style>{`.container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
  font-family: Arial, sans-serif;
}

.approve-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.approve-btn:hover {
  background-color: #45a049;
}

.fulfill-btn{
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.fulfill-btn:hover{
  background-color: #45a049;
}
.heading {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

.subheading {
  font-size: 22px;
  margin-top: 30px;
  margin-bottom: 15px;
}

.info p {
  margin: 6px 0;
}

.message-box {
  background-color: #e0f7fa;
  padding: 12px;
  margin-top: 15px;
  border-left: 6px solid #00796b;
  border-radius: 5px;
}

.purchase-box {
  background-color: #fff3e0;
  padding: 12px;
  margin-top: 15px;
  border-left: 6px solid #ef6c00;
  border-radius: 5px;
}

.purchase-box ul {
  list-style-type: disc;
  padding-left: 20px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 16px;
  width: calc(50% - 20px);
  background-color: #f7f7f7;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.product-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  margin-bottom: 12px;
  border-radius: 6px;
}`}</style>
    </div>
  );
};

export default QuotationDetails;
