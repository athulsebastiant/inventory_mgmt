import React from "react";
import { useLocation } from "react-router-dom";
const QuotationDetails = () => {
  const { state } = useLocation();
  const { message, toPurchase } = state || {};
  console.log(message);
  console.log(toPurchase);
  return (
    <div>
      <div>{message}</div>
      <p>{toPurchase}</p>
    </div>
  );
};

export default QuotationDetails;
