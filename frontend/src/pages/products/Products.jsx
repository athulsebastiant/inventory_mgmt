import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/Products.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Products = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/products/`);

      console.log("Products data", response.data);
      setProducts(response.data);
      console.log("Products successfully set to state");
    } catch (error) {
      console.log("Error fetching products", error);
      console.log("Error details:", error.response?.data || error.message);
    } finally {
      setLoading(false); // ⬅️ Stop loading
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("Products state updated", products);
    console.log("Number of products:", products.length);
  }, [products]);

  const productElements = products.map((product) => (
    <div key={product._id} className="product-tile">
      <Link to={`${product._id}`}>
        <img src={product.imagesUrl[0]} alt="" />
        <div className="product-info">
          <h3>{product.name}</h3>
          <p>Current Stock: {product.currentStock}</p>
          <p>Cost Price: ${product.costPrice}</p>
        </div>
      </Link>
    </div>
  ));

  return (
    <div className="product-list-container">
      <h1>All Products</h1>
      <div>
        <Link to={"add-new-product"} className="new_product_link">
          Add New Product
        </Link>
      </div>
      {loading ? (
        <div className="loading-products">
          <div className="loader"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="product-list">{productElements}</div>
      )}
    </div>
  );
};

export default Products;
