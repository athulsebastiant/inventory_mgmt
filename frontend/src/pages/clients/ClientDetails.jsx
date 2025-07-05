import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/ClientDetails.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("authToken");
const ClientDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editableInfo, setEditableInfo] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [message, setMessage] = useState("");
  async function getClient() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/clients/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClientInfo(response.data);
      setEditableInfo(response.data);
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

  const handleChange = (field, value) => {
    setEditableInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSave = async () => {
    if (isDemoMode) {
      setMessage(
        "Editing clients is restricted for demo purposes. You can view existing data."
      );
      return; // Stop execution if in demo mode
    }

    if (editMode) {
      try {
        const response = await axios.put(
          `${backendUrl}/api/clients/${params.id}`,
          editableInfo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setClientInfo(response.data.client);
          setEditableInfo(response.data.client);
          alert(response.data.message);
        } else {
          alert("Failed to update client details.");
        }
      } catch (error) {
        console.error("Update failed:", error);
        alert("An error occurred while updating client details.");
      }
    }
    setEditMode(!editMode);
  };

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
          <button onClick={handleEditSave} className="edit-save-btn">
            {editMode ? "💾 Save" : "✏️ Edit"}
          </button>
          {message && (
            <div
              className={`message-box ${
                isDemoMode ? "demo-message" : "success-message"
              }`}
            >
              {message}
            </div>
          )}
          <div className="client-content">
            <div className="client-main-info">
              <div className="client-title-section">
                {editMode ? (
                  <input
                    className="client-input"
                    value={editableInfo.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                ) : (
                  <h1 className="client-name">{clientInfo.name}</h1>
                )}

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
                {editMode ? (
                  <input
                    className="client-input"
                    value={editableInfo.contactPerson}
                    onChange={(e) =>
                      handleChange("contactPerson", e.target.value)
                    }
                  />
                ) : (
                  <p className="contact-person">{clientInfo.contactPerson}</p>
                )}
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <h3 className="card-title">Contact Information</h3>
                <div className="detail-list">
                  <div className="detail-row">
                    <span className="detail-label">📞 Phone:</span>
                    {editMode ? (
                      <input
                        className="client-input-small"
                        value={editableInfo.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    ) : (
                      <span className="detail-value">{clientInfo.phone}</span>
                    )}
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">✉️ Email:</span>
                    {editMode ? (
                      <input
                        className="client-input-small"
                        value={editableInfo.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    ) : (
                      <span className="detail-value">{clientInfo.email}</span>
                    )}
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🏠 Address:</span>
                    {editMode ? (
                      <input
                        className="client-input-small"
                        value={editableInfo.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                      />
                    ) : (
                      <span className="detail-value">{clientInfo.address}</span>
                    )}
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📋 Preferred Contact:</span>
                    {editMode ? (
                      <select
                        className="client-input-small"
                        onChange={(e) =>
                          handleChange("preferredContactMethod", e.target.value)
                        }
                      >
                        <option
                          value={
                            editableInfo.preferredContactMethod == "phone"
                              ? "email"
                              : "phone"
                          }
                        >
                          {editableInfo.preferredContactMethod == "phone"
                            ? "email"
                            : "phone"}
                        </option>
                        <option value={editableInfo.preferredContactMethod}>
                          {editableInfo.preferredContactMethod}
                        </option>
                      </select>
                    ) : (
                      <span className="detail-value">
                        {clientInfo.preferredContactMethod}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="detail-card">
                <h3 className="card-title">Business Information</h3>
                <div className="detail-list">
                  <div className="detail-row">
                    <span className="detail-label">🏢 Company Type:</span>
                    {editMode ? (
                      <select
                        className="client-input-small"
                        onChange={(e) =>
                          handleChange("companyType", e.target.value)
                        }
                      >
                        <option
                          value={
                            editableInfo.companyType == "individual"
                              ? "corporate"
                              : "individual"
                          }
                        >
                          {editableInfo.companyType == "individual"
                            ? "corporate"
                            : "individual"}
                        </option>
                        <option value={editableInfo.companyType}>
                          {editableInfo.companyType}
                        </option>
                      </select>
                    ) : (
                      <span className="detail-value">
                        {clientInfo.companyType}
                      </span>
                    )}
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🧾 GST Number:</span>
                    {editMode ? (
                      <input
                        className="client-input-small"
                        value={editableInfo.gstNumber}
                        onChange={(e) =>
                          handleChange("gstNumber", e.target.value)
                        }
                      />
                    ) : (
                      <span className="detail-value">
                        {clientInfo.gstNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {clientInfo.notes && (
                <div className="detail-card notes-card">
                  <h3 className="card-title">Notes</h3>
                  <div className="notes-content">
                    {editMode ? (
                      <input
                        className="client-input"
                        value={editableInfo.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                      />
                    ) : (
                      <p>{clientInfo.notes}</p>
                    )}
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
