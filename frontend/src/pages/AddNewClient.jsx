import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AddNewClient = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredContact, setPreferredContact] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name,
        contactPerson,
        phone,
        email,
        address,
        gstNumber,
        companyType,
        notes,
        preferredContactMethod: preferredContact,
      };

      const response = await axios.post(
        "http://localhost:5000/api/clients/",
        body
      );
      if (response.status === 201) {
        console.log("Client added successfully:", response.data);
        setName("");
        setContactPerson("");
        setAddress("");
        setPhone("");
        setEmail("");
        setGstNumber("");
        setCompanyType("");
        setPreferredContact("");
        setNotes("");

        const { client } = response.data;
        console.log("New client", client);
        navigate(`/clients/${client._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2>Add New Client</h2>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="name">Enter name of client</label>
        <input
          type="text"
          placeholder="Name of client"
          name="name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="contactPerson">Enter name of client</label>
        <input
          type="text"
          placeholder="Name of contact person"
          name="contactPerson"
          value={contactPerson}
          required
          onChange={(e) => setContactPerson(e.target.value)}
        />

        <label htmlFor="phone">Enter phonbe no. of client</label>
        <input
          type="text"
          placeholder="Phone no. of client"
          name="phone"
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
        />

        <label htmlFor="email">Enter email of client</label>
        <input
          type="text"
          placeholder="Email of client"
          name="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="address">Enter address of client</label>
        <input
          type="text"
          placeholder="Address of client"
          name="address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
        />

        <label htmlFor="gstnumber">Enter gst number of client</label>
        <input
          type="text"
          placeholder="gst number of client"
          name="gstnumber"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
        />

        <label htmlFor="companyType">Select company type of client</label>
        <select
          name="companyType"
          onChange={(e) => setCompanyType(e.target.value)}
        >
          <option selected disabled>
            -- choose company type --
          </option>
          <option value="corporate">corporate</option>
          <option value="individual">individual</option>
        </select>

        <label htmlFor="notes">Enter notes on client</label>
        <textarea
          type="text"
          placeholder="Notes on client"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <label htmlFor="preferredContact">
          Select preferred contact mode of client
        </label>
        <select
          name="preferredContact"
          onChange={(e) => setPreferredContact(e.target.value)}
        >
          <option selected disabled>
            -- choose preferred contact mode of client --
          </option>
          <option value="email">email</option>
          <option value="phone">phone</option>
        </select>
        <button type="submit">ADD</button>
      </form>
    </>
  );
};

export default AddNewClient;
