import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/Client-Quots.css";
const token = localStorage.getItem("authToken");
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ClientQuots = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${backendUrl}/api/client-quotations/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuotations(res.data);
    } catch (err) {
      setError("Failed to fetch quotations. Please try again.");
      console.error("Error fetching client quotations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchQuotations();
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "awaiting stock":
        return "awaiting-stock";
      case "fulfilled":
        return "fulfilled";
      default:
        return "status-default";
    }
  };

  if (loading) {
    return (
      <div className="client-quots-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading quotations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-quots-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Oops! Something went wrong</h3>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="client-quots-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-content">
          <h1 className="page-title">Client Quotations</h1>
          <p className="page-subtitle">
            Manage and track all your client quotations
          </p>
        </div>
        <Link to="new-quotation" className="add-button">
          <span className="button-icon">+</span>
          Add New Quotation
        </Link>
      </div>

      {/* Search and Stats Section */}
      <div className="controls-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{quotations.length}</span>
            <span className="stat-label">Total Quotes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{quotations.length}</span>
            <span className="stat-label">Showing</span>
          </div>
        </div>
      </div>

      {/* Quotations List */}
      <div className="quotations-section">
        {quotations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3 className="empty-title">{"No quotations found"}</h3>
          </div>
        ) : (
          <div className="quotations-grid">
            {quotations.map((quot) => (
              <div key={quot._id} className="quotation-card">
                <Link
                  to={`/client-quotations/${quot._id}`}
                  className="card-link"
                >
                  <div className="card-header">
                    <div className="quote-id">
                      <span className="id-label">Quote ID</span>
                      <span className="id-value">{quot._id}</span>
                    </div>
                    <div
                      className={`status-badge ${getStatusClass(quot.status)}`}
                    >
                      {quot.status}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="client-info">
                      <span className="client-label">Client</span>
                      <span className="client-name">
                        {quot.clientId?.name || "Unknown Client"}
                      </span>
                    </div>

                    {quot.createdAt && (
                      <div className="date-info">
                        <span className="date-label">Created</span>
                        <span className="date-value">
                          {new Date(quot.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <span className="view-details">View Details →</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientQuots;
