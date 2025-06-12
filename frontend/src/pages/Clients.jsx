import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients/");
      setClients(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const clientElements = clients.map((client) => (
    <div key={client._id} className="client-card">
      <Link to={`${client._id}`} className="client-link">
        <div className="client-header">
          <h3 className="client-name">{client.name} </h3>
          <span className="client-contact">{client.contactPerson}</span>
        </div>
        <div className="client-details">
          <div className="detail-item">
            <span className="detail-icon">📞</span>
            <span className="detail-text">{client.phone}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">✉️</span>
            <span className="detail-text">{client.email}</span>
          </div>
        </div>
      </Link>
    </div>
  ));

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1 className="page-title">All Clients</h1>

        <Link to={"add-new-client"} className="add-client-btn">
          <span className="btn-icon">+</span>Add new Client
        </Link>
      </div>
      {clients.length > 0 ? (
        <div className="clients-grid">{clientElements}</div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No clients found</h3>
          <p>Start by adding your first client</p>
        </div>
      )}
    </div>
  );
};

export default Clients;
