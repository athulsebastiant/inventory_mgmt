import React from "react";
import { useEffect, useState } from "react";
import { NavLink, useParams, Outlet } from "react-router-dom";
import axios from "axios";
const SupplierDetails = () => {
  const params = useParams();
  const [supplierInfo, setSupplierInfo] = useState(null);

  async function getSupplier() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/suppliers/${params.id}`
      );
      setSupplierInfo(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getSupplier();
  }, [params.id]);
  return (
    <section>
      <div>
        {supplierInfo ? (
          <div>
            <h2>{supplierInfo.name}</h2>
            <p>{supplierInfo.email}</p>
            <p>{supplierInfo.phone}</p>
            <p>{supplierInfo.address}</p>
          </div>
        ) : (
          <h2></h2>
        )}
      </div>
      <nav>
        <NavLink
          to={"."}
          style={({ isActive }) =>
            isActive
              ? {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  color: "#161616",
                }
              : null
          }
          end
        ></NavLink>

        <NavLink
          to={"link-supplier-product"}
          style={({ isActive }) =>
            isActive
              ? {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  color: "#161616",
                }
              : null
          }
        >
          Link Supplier To Products
        </NavLink>
        <NavLink
          to={"all-link"}
          style={({ isActive }) =>
            isActive
              ? {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  color: "#161616",
                }
              : null
          }
        >
          View All Products of Supplier
        </NavLink>
      </nav>
      <Outlet context={supplierInfo} />
    </section>
  );
};

export default SupplierDetails;
