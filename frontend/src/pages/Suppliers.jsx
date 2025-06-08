import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/suppliers/");
      setSuppliers(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const supplierElements = suppliers.map((supplier) => (
    <div key={supplier._id}>
      <Link to={`${supplier._id}`}>
        <p>{supplier.name}</p>
        <p>{supplier.email}</p>
        <p>{supplier.phone}</p>
        <p>{supplier.address}</p>
      </Link>
    </div>
  ));

  return (
    <div>
      <h1>All Suppliers</h1>
      <div>
        <Link to={"add-new-supplier"}>Add new Supplier</Link>
      </div>
      <div>{supplierElements}</div>
    </div>
  );
};

export default Suppliers;
