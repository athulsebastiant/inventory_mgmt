import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Clients.css";
import SearchBar from "../../components/SearchBar.jsx";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("authToken");
const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchClients = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/clients/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.contactPerson}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const clientElements = filteredClients.map((client) => (
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
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <Link to={"add-new-client"} className="add-client-btn">
          <span className="btn-icon">+</span>Add new Client
        </Link>
      </div>

      {filteredClients.length > 0 ? (
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
