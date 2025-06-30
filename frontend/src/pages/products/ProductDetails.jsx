import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/ProductDetails.css";
const token = localStorage.getItem("authToken");
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ProductDetails = () => {
  const params = useParams();
  console.log(params);
  const [productinfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editmode, setEditMode] = useState(false);
  const [editableInfo, setEditableInfo] = useState(null);
  async function getProduct() {
    try {
      const response = await axios.get(
        `${backendUrl}/api/products/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setProductInfo(response.data);
      setEditableInfo(response.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, [params.id]);

  const handleChange = (field, value) => {
    setEditableInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSave = async () => {
    if (editmode) {
      try {
        const response = await axios.put(
          `${backendUrl}/api/products/${params.id}`,
          editableInfo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setProductInfo(response.data.updatedProduct);
          setEditableInfo(response.data.updatedProduct);
          alert(response.data.message);
        } else {
          alert("Failed to update product details.");
        }
      } catch (error) {
        sole.error("Update failed:", error);
        alert("An error occurred while updating client details.");
      }
    }
    setEditMode(!editmode);
  };

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
      <button onClick={handleEditSave} className="editProduct-btn">
        {editmode ? "💾 Save" : "✏️ Edit"}
      </button>
      <div className="product-images-grid">
        {productinfo.imagesUrl.map((url, index) =>
          url ? (
            <img key={index} src={url} alt={`Product ${index + 1}`} />
          ) : null
        )}
      </div>
      <div className="product-info">
        {editmode ? (
          <input
            className="product-input"
            value={editableInfo.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        ) : (
          <h2>{productinfo.name}</h2>
        )}
        {editmode ? (
          <input
            className="product-input-small"
            value={editableInfo.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
          />
        ) : (
          <p>
            <strong>SKU:</strong> {productinfo.sku}
          </p>
        )}
        {editmode ? (
          <input
            className="product-input-small"
            value={editableInfo.category}
            onChange={(e) => handleChange("category", e.target.value)}
          />
        ) : (
          <p>
            <strong>Category:</strong> {productinfo.category}
          </p>
        )}
        {editmode ? (
          <input
            className="product-input-small"
            value={editableInfo.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        ) : (
          <p id="desc">
            <strong>Description:</strong> {productinfo.description}
          </p>
        )}
        <p>
          <strong>Current Stock:</strong> {productinfo.currentStock}
        </p>
        <p>
          <strong>Initial Stock:</strong> {productinfo.initialStock}
        </p>
        {editmode ? (
          <input
            className="product-input-small"
            value={editableInfo.reorderLevel}
            onChange={(e) => handleChange("reorderLevel", e.target.value)}
          />
        ) : (
          <p>
            <strong>Reorder Level:</strong> {productinfo.reorderLevel}
          </p>
        )}
        {editmode ? (
          <input
            className="product-input-small"
            value={editableInfo.costPrice}
            onChange={(e) => handleChange("costPrice", e.target.value)}
          />
        ) : (
          <p>
            <strong>Cost Price:</strong> ${productinfo.costPrice}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
