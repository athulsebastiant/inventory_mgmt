import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/Supplier.css";
import SearchBar from "../../components/SearchBar.jsx";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("authToken");
const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/suppliers/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuppliers(response.data);
      setError("");
    } catch (error) {
      console.log(error);
      console.log(error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.name} ${supplier.address}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // const supplierElements = filteredSuppliers.map((supplier) => (
  //   <div key={supplier._id}>
  //     <Link to={`${supplier._id}`}>
  //       <p>{supplier.name}</p>
  //       <p>{supplier.email}</p>
  //       <p>{supplier.phone}</p>
  //       <p>{supplier.address}</p>
  //     </Link>
  //   </div>
  // ));

  return (
    <div className="container">
      <h1 className="page-title">All Suppliers</h1>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <div className="button-container">
        <Link to="add-new-supplier" className="primary-button">
          + Add New Supplier
        </Link>
      </div>

      {loading ? (
        <p className="info-text">Loading suppliers...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : filteredSuppliers.length === 0 ? (
        <p className="info-text">No suppliers found.</p>
      ) : (
        <div className="supplier-list">
          {filteredSuppliers.map((supplier) => (
            <Link
              to={supplier._id}
              key={supplier._id}
              className="supplier-card"
            >
              <p className="supplier-name">{supplier.name}</p>
              <p className="supplier-detail">{supplier.email}</p>
              <p className="supplier-detail">{supplier.phone}</p>
              <p className="supplier-detail">{supplier.address}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suppliers;
