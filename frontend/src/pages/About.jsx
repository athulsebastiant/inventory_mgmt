import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About Our Inventory Management System</h1>
      <p className="about-intro">
        Welcome to our Inventory Manager 2025 — a robust, user-friendly platform
        designed to streamline your inventory operations from purchase to
        fulfillment.
      </p>

      <section className="about-section">
        <h2>What You Can Do</h2>
        <ul className="about-features">
          <li>
            <strong>Manage Clients:</strong> Add, edit, and view client details
            for streamlined order processing.
          </li>
          <li>
            <strong>Handle Suppliers:</strong> Maintain supplier records and
            track relationships effortlessly.
          </li>
          <li>
            <strong>Track Products:</strong> Add new products, set stock levels,
            and categorize for better control.
          </li>
          <li>
            <strong>Create Purchases:</strong> Generate purchase orders and
            track delivery status.
          </li>
          <li>
            <strong>Client Quotations:</strong> Create, approve, and fulfill
            client quotations with ease and accuracy.
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Why Use This System?</h2>
        <p>
          Built with simplicity and scalability in mind, this system helps you:
        </p>
        <ul className="about-benefits">
          <li>Reduce manual tracking and errors</li>
          <li>Improve visibility across your supply chain</li>
          <li>Increase operational efficiency</li>
          <li>Enable fast and accurate decision making</li>
        </ul>
      </section>

      <section className="about-contact">
        <h2>Developer Contact</h2>
        <p>
          Created and maintained by: <strong>Athul Sebastian</strong>
        </p>
        <p>
          Email:{" "}
          <a href="mailto:athulsebastiant@gmail.com">
            athulsebastiant@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default About;
