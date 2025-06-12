import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/ProductDetails.css";
const ProductDetails = () => {
  const params = useParams();
  console.log(params);
  const [productinfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  async function getProduct() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${params.id}`
      );
      console.log(response);
      setProductInfo(response.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, [params.id]);
  console.log(productinfo);
  if (loading) {
    return (
      <div className="product-details-container loading">
        <div className="loader"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!productinfo) {
    return <div className="product-details-container">Product not found.</div>;
  }
  return (
    <div className="product-details-container">
      <nav className="breadcrumb">
        <Link to="/products">Products</Link> &gt; <span>Product Details</span>
      </nav>
      <div className="product-images-grid">
        {productinfo.imagesUrl.map((url, index) =>
          url ? (
            <img key={index} src={url} alt={`Product ${index + 1}`} />
          ) : null
        )}
      </div>
      <div className="product-info">
        <h2>{productinfo.name}</h2>
        <p>
          <strong>SKU:</strong> {productinfo.sku}
        </p>
        <p>
          <strong>Category:</strong> {productinfo.category}
        </p>
        <p>
          <strong>Description:</strong> {productinfo.description}
        </p>
        <p>
          <strong>Current Stock:</strong> {productinfo.currentStock}
        </p>
        <p>
          <strong>Initial Stock:</strong> {productinfo.initialStock}
        </p>
        <p>
          <strong>Reorder Level:</strong> {productinfo.reorderLevel}
        </p>
        <p>
          <strong>Cost Price:</strong> ${productinfo.costPrice}
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
