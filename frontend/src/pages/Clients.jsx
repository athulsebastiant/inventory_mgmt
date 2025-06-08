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
    <div key={client._id}>
      <Link to={`${client._id}`}>
        <h3>{client.name}</h3>
        <h4>{client.contactPerson}</h4>
        <p>{client.phone}</p>
        <p>{client.email}</p>
      </Link>
    </div>
  ));

  return (
    <div>
      <h1>All Clients</h1>
      <div>
        <Link to={"add-new-client"}>Add new Client</Link>
      </div>
      <div>{clientElements}</div>
    </div>
  );
};

export default Clients;
