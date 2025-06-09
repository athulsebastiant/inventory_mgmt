import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
const NewPurchase = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedSupplierData, setSelectedSupplierData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    setSelectedSupplier(supplierId);

    if (supplierId) {
      const supplier = suppliers.find((s) => s._id === supplierId);
      setSelectedSupplierData(supplier);
    } else {
      setSelectedSupplierData(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading suppliers..</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  return (
    <div className="supplier-select-container">
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
      <style jsx="true">{`
        .supplier-select-container {
          max-width: 500px;
          margin: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            sans-serif;
        }

        .select-section {
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

        .supplier-details {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          animation: slideIn 0.3s ease-out;
        }

        .supplier-details h3 {
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
          justify-content: between;
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

          .detail-value {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default NewPurchase;
