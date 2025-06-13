import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/ClientDetails.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ClientDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  async function getClient() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/clients/${params.id}`
      );
      setClientInfo(response.data);
    } catch (error) {
      console.log(error.message);
      setError("Failed to load client details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getClient();
  }, [params.id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  if (loading) {
    return (
      <div className="client-details-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-details-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Client</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="client-details-container">
      {clientInfo ? (
        <>
          <div className="client-header">
            <div className="header-content">
              <div className="breadcrumb">
                <Link to="/clients" className="breadcrumb-link">
                  Clients
                </Link>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-current">{clientInfo.name}</span>
              </div>
              <div className="header-actions">
                <button onClick={() => navigate(-1)} className="back-btn">
                  ← Back
                </button>
              </div>
            </div>
          </div>
          <div className="client-content">
            <div className="client-main-info">
              <div className="client-title-section">
                <h1 className="client-name">{clientInfo.name}</h1>
                <span
                  className={`status-badge ${getStatusColor(
                    clientInfo.status
                  )}`}
                >
                  {clientInfo.status || "Active"}
                </span>
              </div>

              <div className="contact-person-section">
                <h2 className="section-title">Contact Person</h2>
                <p className="contact-person">{clientInfo.contactPerson}</p>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <h3 className="card-title">Contact Information</h3>
                <div className="detail-list">
                  <div className="detail-row">
                    <span className="detail-label">📞 Phone:</span>
                    <span className="detail-value">{clientInfo.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">✉️ Email:</span>
                    <span className="detail-value">{clientInfo.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🏠 Address:</span>
                    <span className="detail-value">{clientInfo.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📋 Preferred Contact:</span>
                    <span className="detail-value">
                      {clientInfo.preferredContactMethod}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-card">
                <h3 className="card-title">Business Information</h3>
                <div className="detail-list">
                  <div className="detail-row">
                    <span className="detail-label">🏢 Company Type:</span>
                    <span className="detail-value">
                      {clientInfo.companyType}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🧾 GST Number:</span>
                    <span className="detail-value">{clientInfo.gstNumber}</span>
                  </div>
                </div>
              </div>

              {clientInfo.notes && (
                <div className="detail-card notes-card">
                  <h3 className="card-title">Notes</h3>
                  <div className="notes-content">
                    <p>{clientInfo.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>Client not found</h3>
          <p>The requested client could not be found.</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
