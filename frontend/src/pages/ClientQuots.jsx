import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const ClientQuots = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/client-quotations/")
      .then((res) => {
        setQuotations(res.data);
      })
      .catch((err) => {
        console.error("Error fetching client quotations:", err);
      });
  }, []);

  return (
    <div>
      <div>
        <Link to="new-quotation">Add new Client Quotation</Link>
      </div>

      <div>
        <h2>Client Quotations</h2>
        {quotations.length === 0 ? (
          <p>No quotations found.</p>
        ) : (
          <ul>
            {quotations.map((quot) => (
              <li key={quot._id}>
                <Link to={`/client-quotations/${quot._id}`}>
                  <strong>Quote ID:</strong> {quot._id} |{" "}
                  <strong>Status:</strong> {quot.status} |{" "}
                  <strong>Client:</strong> {quot.clientId.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClientQuots;
