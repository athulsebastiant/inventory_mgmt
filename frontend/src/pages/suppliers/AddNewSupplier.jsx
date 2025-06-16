import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/AddNewSupplier.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const AddNewSupplier = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [message, setMessage] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isDemoMode) {
      setMessage(
        "Creating suppliers is restricted for demo purposes. You can view existing data."
      );
      return; // Stop execution if in demo mode
    }
    setLoading(true);
    setError("");
    try {
      const body = {
        name,
        email,
        phone,
        address,
      };

      const response = await axios.post(`${backendUrl}/api/suppliers/`, body);

      if (response.status === 201) {
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        const { supplier } = response.data;
        navigate(`/suppliers/${supplier._id}`);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to add supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <nav className="breadcrumb">
        <Link to="/suppliers">Suppliers</Link> &gt;{" "}
        <span>Add New Supplier</span>
      </nav>
      <h2 className="page-title">Add New Supplier</h2>
      <form onSubmit={onSubmitHandler} className="supplier-form">
        <label htmlFor="name">Enter name of supplier</label>
        <input
          type="text"
          placeholder="Name of supplier"
          name="name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Enter email of supplier</label>
        <input
          type="text"
          placeholder="Email of supplier"
          name="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="phone">Enter phone of supplier</label>
        <input
          type="text"
          placeholder="Phone no. of supplier"
          name="phone"
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
        />

        <label htmlFor="address">Enter address of supplier</label>
        <input
          type="text"
          placeholder="Address of supplier"
          name="address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Adding..." : "ADD"}
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
      </form>
    </div>
  );
};

export default AddNewSupplier;
