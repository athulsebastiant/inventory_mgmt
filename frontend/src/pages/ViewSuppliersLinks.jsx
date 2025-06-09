import React from "react";
import { useOutletContext } from "react-router-dom";

const ViewSuppliersLinks = () => {
  const supplier = useOutletContext();
  //localhost:5000/api/productSuppliers/supplier/${supplier._id}

  return <div>ViewSuppliersLinks</div>;
};

export default ViewSuppliersLinks;
