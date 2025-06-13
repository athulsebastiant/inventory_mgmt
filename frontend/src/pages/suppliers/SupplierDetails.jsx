import React from "react";
import { useEffect, useState } from "react";
import { NavLink, useParams, Outlet, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/SupplierDetails.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const SupplierDetails = () => {
  const params = useParams();
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function getSupplier() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${backendUrl}/api/suppliers/${params.id}`
      );
      setSupplierInfo(response.data);
    } catch (error) {
      setError("Failed to load supplier details.");
    } finally {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getSupplier();
  }, [params.id]);
  return (
    <section className="container">
      <nav className="breadcrumb">
        <Link to="/suppliers">Suppliers</Link> &gt;{" "}
        <span>Supplier Details</span>
      </nav>
      {loading ? (
        <p className="status-text">Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : supplierInfo ? (
        <div className="supplier-details-card">
          <h2>{supplierInfo.name}</h2>
          <p>Email: {supplierInfo.email}</p>
          <p>Phone: {supplierInfo.phone}</p>
          <p>Address: {supplierInfo.address}</p>
        </div>
      ) : (
        <p className="status-text">No supplier data found.</p>
      )}
      <nav className="tab-nav">
        <NavLink
          to={"."}
          style={({ isActive }) =>
            isActive
              ? {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  color: "#161616",
                }
              : null
          }
          end
        ></NavLink>

        <NavLink
          to="link-supplier-product"
          className={({ isActive }) =>
            isActive ? "tab-link active" : "tab-link"
          }
        >
          Link Supplier to Products
        </NavLink>
        <NavLink
          to="all-link"
          className={({ isActive }) =>
            isActive ? "tab-link active" : "tab-link"
          }
        >
          View All Products of Supplier
        </NavLink>
      </nav>
      <Outlet context={supplierInfo} />
    </section>
  );
};

export default SupplierDetails;
