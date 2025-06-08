import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AddNewSupplier = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name,
        email,
        phone,
        address,
      };

      const response = await axios.post(
        "http://localhost:5000/api/suppliers/",
        body
      );

      if (response.status === 201) {
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        const { supplier } = response.data;
        navigate(`/suppliers/${supplier._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h2>Add New Supplier</h2>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="name">Enter name of supplier</label>
        <input
          type="text"
          placeholder="Name of supplier"
          name="name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Enter email of supplier</label>
        <input
          type="text"
          placeholder="Email of supplier"
          name="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="phone">Enter phone of supplier</label>
        <input
          type="text"
          placeholder="Phone no. of supplier"
          name="phone"
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
        />

        <label htmlFor="address">Enter address of supplier</label>
        <input
          type="text"
          placeholder="Address of supplier"
          name="address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="submit">ADD</button>
      </form>
    </>
  );
};

export default AddNewSupplier;
