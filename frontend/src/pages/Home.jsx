import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import prod from "../images/prods.jpg";
import client from "../images/clients2.jpg";
import supplier from "../images/supplier2.jpg";
import link from "../images/link2.jpg";
import purchase from "../images/purchase2.webp";
import quot from "../images/quot2.jpg";
const token = localStorage.getItem("authToken");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    productsCount: 0,
    clientsCount: 0,
    suppliersCount: 0,
    quotationsCount: 0,
    inventoryCost: 0,
    quotationValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          productsResponse,
          clientsResponse,
          inventoryCostResponse,
          suppliersResponse,
          quotationsResponse,
          quotationValueResponse,
        ] = await Promise.all([
          axios.get(`${backendUrl}/api/products/products/count`),
          axios.get(`${backendUrl}/api/clients/clients/count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${backendUrl}/api/products/products/total-inv-cost`),
          axios.get(`${backendUrl}/api/suppliers/suppliers/count`),
          axios.get(`${backendUrl}/api/client-quotations/quotations/count`),
          axios.get(
            `${backendUrl}/api/client-quotations/quotations/total-quot-value`
          ),
        ]);

        setDashboardData({
          productsCount: productsResponse.data.count || productsResponse.data,
          clientsCount: clientsResponse.data.count || clientsResponse.data,
          suppliersCount:
            suppliersResponse.data.count || suppliersResponse.data,
          quotationsCount:
            quotationsResponse.data.count || quotationsResponse.data,
          inventoryCost:
            inventoryCostResponse.data.totalValue[0].value ||
            inventoryCostResponse.data,
          quotationValue:
            quotationValueResponse.data.totalQuotationValue[0].totalValue ||
            quotationValueResponse.data,
        });
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const StatusCard = ({
    title,
    value,
    isLoading,
    isCurrency = false,
    icon,
    color,
  }) => (
    <div className="status-card">
      <div className="status-card-header">
        <div className={`status-card-icon ${color}`}>{icon}</div>
        <h3 className="status-card-title">{title}</h3>
      </div>
      <div className="status-card-value">
        {isLoading ? (
          <div className="loading-skeleton"></div>
        ) : (
          <span className="status-value">
            {isCurrency ? formatCurrency(value) : formatNumber(value)}
          </span>
        )}
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">
          Monitor your business metrics at a glance
        </p>
      </div>

      <div className="status-cards-grid">
        <StatusCard
          title="Total Products"
          value={dashboardData.productsCount}
          isLoading={loading}
          icon="📦"
          color="blue"
        />

        <StatusCard
          title="Total Clients"
          value={dashboardData.clientsCount}
          isLoading={loading}
          icon="👥"
          color="green"
        />

        <StatusCard
          title="Total Suppliers"
          value={dashboardData.suppliersCount}
          isLoading={loading}
          icon="🏭"
          color="purple"
        />

        <StatusCard
          title="Total Quotations"
          value={dashboardData.quotationsCount}
          isLoading={loading}
          icon="📄"
          color="orange"
        />

        <StatusCard
          title="Inventory Cost"
          value={dashboardData.inventoryCost}
          isLoading={loading}
          isCurrency={true}
          icon="💰"
          color="red"
        />

        <StatusCard
          title="Quotation Value"
          value={dashboardData.quotationValue}
          isLoading={loading}
          isCurrency={true}
          icon="💎"
          color="teal"
        />
      </div>
      {/* Workflow Section */}
      <div className="workflow-section">
        <div className="workflow-header">
          <h2 className="workflow-title">How Our System Works</h2>
          <p className="workflow-subtitle">
            Follow these simple steps to manage your business efficiently
          </p>
        </div>

        <div className="workflow-timeline">
          <div className="timeline-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <div className="step-image-container">
                <img
                  src={prod}
                  alt="Add Products"
                  className="step-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="image-placeholder">
                  <span className="placeholder-icon">📦</span>
                  <span className="placeholder-text">Products Image</span>
                </div>
              </div>
              <h3 className="step-title">Add Products</h3>
              <p className="step-description">
                Start by adding your products to the inventory system with
                details like name, description, and specifications.
              </p>
            </div>
          </div>

          <div className="timeline-connector"></div>

          <div className="timeline-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <div className="step-image-container">
                <img
                  src={client}
                  alt="Add Clients"
                  className="step-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="image-placeholder">
                  <span className="placeholder-icon">👥</span>
                  <span className="placeholder-text">Clients Image</span>
                </div>
              </div>
              <h3 className="step-title">Add Clients</h3>
              <p className="step-description">
                Register your clients with their contact information and
                business details for future quotations.
              </p>
            </div>
          </div>

          <div className="timeline-connector"></div>

          <div className="timeline-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <div className="step-image-container">
                <img
                  src={supplier}
                  alt="Add Suppliers"
                  className="step-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="image-placeholder">
                  <span className="placeholder-icon">🏭</span>
                  <span className="placeholder-text">Suppliers Image</span>
                </div>
              </div>
              <h3 className="step-title">Add Suppliers</h3>
              <p className="step-description">
                Add supplier information including contact details, terms, and
                product categories they provide.
              </p>
            </div>
          </div>

          <div className="timeline-connector"></div>

          <div className="timeline-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <div className="step-image-container">
                <img
                  src={link}
                  alt="Link Suppliers to Products"
                  className="step-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="image-placeholder">
                  <span className="placeholder-icon">🔗</span>
                  <span className="placeholder-text">Link Products Image</span>
                </div>
              </div>
              <h3 className="step-title">Link Suppliers to Products</h3>
              <p className="step-description">
                Connect your suppliers with specific products, including pricing
                and availability information.
              </p>
            </div>
          </div>

          <div className="timeline-connector"></div>

          <div className="timeline-step">
            <div className="step-number">5</div>
            <div className="step-content">
              <div className="step-image-container">
                <img
                  src={purchase}
                  alt="Purchase Products"
                  className="step-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="image-placeholder">
                  <span className="placeholder-icon">🛒</span>
                  <span className="placeholder-text">Purchasing Image</span>
                </div>
              </div>
              <h3 className="step-title">Purchase Products</h3>
              <p className="step-description">
                Create purchase orders and manage procurement from your linked
                suppliers efficiently.
              </p>
            </div>
          </div>

          <div className="timeline-connector"></div>

          <div className="timeline-step">
            <div className="step-number">6</div>
            <div className="step-content">
              <div className="step-image-container">
                <img
                  src={quot}
                  alt="Manage Quotations"
                  className="step-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="image-placeholder">
                  <span className="placeholder-icon">📄</span>
                  <span className="placeholder-text">Quotations Image</span>
                </div>
              </div>
              <h3 className="step-title">Manage Client Quotations</h3>
              <p className="step-description">
                Generate professional quotations for clients using your
                inventory and send them for approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
