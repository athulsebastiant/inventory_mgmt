import React from "react";
import { NavLink, Link } from "react-router-dom";
const Header = () => {
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
      </nav>
    </header>
  );
};

export default Header;
