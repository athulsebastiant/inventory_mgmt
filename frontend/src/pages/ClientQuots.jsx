import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
const ClientQuots = () => {
  return (
    <div>
      <div>
        <Link to={"new-quotation"}>Add new Client Quotation</Link>
      </div>
    </div>
  );
};

export default ClientQuots;
