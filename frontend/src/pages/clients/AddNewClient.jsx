import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "../../styles/AddNewClient.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const AddNewClient = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredContact, setPreferredContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [message, setMessage] = useState("");
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Client name is required";
    if (!contactPerson.trim())
      newErrors.contactPerson = "Contact person name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email format is invalid";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!companyType) newErrors.companyType = "Company type is required";
    if (!preferredContact)
      newErrors.preferredContact = "Preferred contact method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isDemoMode) {
      setMessage(
        "Adding clients is restricted for demo purposes. You can view existing data."
      );
      return; // Stop execution if in demo mode
    }
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const body = {
        name,
        contactPerson,
        phone,
        email,
        address,
        gstNumber,
        companyType,
        notes,
        preferredContactMethod: preferredContact,
      };

      const response = await axios.post(`${backendUrl}/api/clients/`, body);
      if (response.status === 201) {
        console.log("Client added successfully:", response.data);
        setName("");
        setContactPerson("");
        setAddress("");
        setPhone("");
        setEmail("");
        setGstNumber("");
        setCompanyType("");
        setPreferredContact("");
        setNotes("");

        const { client } = response.data;
        console.log("New client", client);
        navigate(`/clients/${client._id}`);
      }
    } catch (error) {
      console.log(error);
      setErrors({ submit: "Failed to add client. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-client-container">
      <div className="form-header">
        <div className="breadcrumb">
          <Link to="/clients" className="breadcrumb-link">
            Clients
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Add New Client</span>
        </div>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Clients
        </button>
      </div>
      <div className="form-wrapper">
        <div className="form-title-section">
          <h1 className="form-title">Add New Client</h1>
          <p className="form-subtitle">
            Enter client information to create a new client record
          </p>
        </div>
        {errors.submit && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {errors.submit}
          </div>
        )}

        <form onSubmit={onSubmitHandler} className="client-form">
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Client Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter client name"
                  name="name"
                  value={name}
                  required
                  className={`form-input ${errors.name ? "error" : ""}`}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contactPerson" className="form-label">
                  Contact Person <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  placeholder="Name of contact person"
                  name="contactPerson"
                  value={contactPerson}
                  required
                  className={`form-input ${
                    errors.contactPerson ? "error" : ""
                  }`}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
                {errors.contactPerson && (
                  <span className="error-message">{errors.contactPerson}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter phone number"
                  name="phone"
                  value={phone}
                  required
                  className={`form-input ${errors.phone ? "error" : ""}`}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  name="email"
                  value={email}
                  required
                  className={`form-input ${errors.email ? "error" : ""}`}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="address" className="form-label">
                  Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  placeholder="Enter complete address"
                  name="address"
                  value={address}
                  required
                  rows="3"
                  className={`form-textarea ${errors.address ? "error" : ""}`}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="preferredContact" className="form-label">
                  Preferred Contact Method <span className="required">*</span>
                </label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={preferredContact}
                  required
                  className={`form-select ${
                    errors.preferredContact ? "error" : ""
                  }`}
                  onChange={(e) => setPreferredContact(e.target.value)}
                >
                  <option value="">
                    -- Choose preferred contact method --
                  </option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
                {errors.preferredContact && (
                  <span className="error-message">
                    {errors.preferredContact}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Business Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyType" className="form-label">
                  Company Type <span className="required">*</span>
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={companyType}
                  required
                  className={`form-select ${errors.companyType ? "error" : ""}`}
                  onChange={(e) => setCompanyType(e.target.value)}
                >
                  <option value="">-- Choose company type --</option>
                  <option value="corporate">Corporate</option>
                  <option value="individual">Individual</option>
                </select>
                {errors.companyType && (
                  <span className="error-message">{errors.companyType}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="gstNumber" className="form-label">
                  GST Number
                  <span className="optional">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  placeholder="Enter GST number"
                  name="gstNumber"
                  value={gstNumber}
                  className="form-input"
                  onChange={(e) => setGstNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Additional Information</h3>
            <div className="form-group full-width">
              <label htmlFor="notes" className="form-label">
                Notes <span className="optional">(Optional)</span>
              </label>
              <textarea
                id="notes"
                placeholder="Add any additional notes about the client"
                name="notes"
                value={notes}
                rows="4"
                className="form-textarea"
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Adding Client...
                </>
              ) : (
                <>
                  <span className="submit-icon">+</span>
                  Add Client
                </>
              )}
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
        </form>
      </div>
    </div>
  );
};

export default AddNewClient;
