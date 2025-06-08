import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const ClientDetails = () => {
  const params = useParams();
  const [clientInfo, setClientInfo] = useState(null);

  async function getClient() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/clients/${params.id}`
      );
      setClientInfo(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getClient();
  }, [params.id]);
  return (
    <div>
      {clientInfo ? (
        <div>
          <h2>{clientInfo.name}</h2>
          <h3>contact person: {clientInfo.contactPerson}</h3>
          <p>phone: {clientInfo.phone}</p>
          <p>email: {clientInfo.email}</p>
          <p>address: {clientInfo.address}</p>
          <p>gst number: {clientInfo.gstNumber}</p>
          <p>company type: {clientInfo.companyType}</p>
          <h3>notes: {clientInfo.notes}</h3>
          <h4>{clientInfo.status}</h4>
          <p>preferred contact method: {clientInfo.preferredContactMethod}</p>
        </div>
      ) : (
        <h2></h2>
      )}
    </div>
  );
};

export default ClientDetails;
