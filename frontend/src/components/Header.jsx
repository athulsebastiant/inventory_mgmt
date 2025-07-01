import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  return (
    <header>
      <Link className="site-logo" to="/">
        Inventory Manager 2025
      </Link>
      <nav>
        <NavLink
          to="/clients"
          className={({ isActive }) => (isActive ? "activeLink" : "")}
        >
          Clients
        </NavLink>
        <NavLink
          to="/suppliers"
          className={({ isActive }) => (isActive ? "activeLink" : "")}
        >
          Suppliers
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? "activeLink" : "")}
        >
          Products
        </NavLink>
        <NavLink
          to="/client-quotations"
          className={({ isActive }) => (isActive ? "activeLink" : "")}
        >
          Client Quotations
        </NavLink>
        <NavLink
          to="/purchasing"
          className={({ isActive }) => (isActive ? "activeLink" : "")}
        >
          Purchasing
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "activeLink" : "")}
        >
          About
        </NavLink>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
