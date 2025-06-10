import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
const Purchasing = () => {
  const [purchases, setPurchases] = useState([]);
  const fetchPurchases = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/purchase-orders/"
      );
      console.log(response.data);
      setPurchases(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const purchaseElements = purchases.map((purchase) => (
    <div key={purchase._id}>
      <Link to={`${purchase._id}`}>
        <h3>Purchase id:{purchase._id}</h3>
        <p>Supplier:{purchase.supplierId.name}</p>

        <p>
          Price:
          {purchase.items.reduce((sum, item) => {
            return sum + item.quantityOrdered * item.unitPrice;
          }, 0)}
        </p>
        <p>{purchase.status}</p>
        <p>{purchase.createdAt}</p>
      </Link>
    </div>
  ));

  return (
    <div>
      <div>
        <Link to="new-purchase">Add new Purchase Order</Link>
      </div>
      <div>{purchaseElements}</div>
    </div>
  );
};

export default Purchasing;
