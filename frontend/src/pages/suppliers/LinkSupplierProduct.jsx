import axios from "axios";
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import "../../styles/LinkSupplierProduct.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const LinkSupplierProduct = () => {
  const supplier = useOutletContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [unitPrice, setUnitPrice] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/products/`);
        const data = response.data;
        setProducts(data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsOpen(false);
  };

  const selectedProductData = products.find((p) => p._id === selectedProduct);
  console.log("yahoo", selectedProductData);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const body = {
        productId: selectedProductData._id,
        supplierId: supplier._id,
        unitPrice,
        leadTimeDays,
      };
      const response = await axios.post(
        `${backendUrl}/api/productSuppliers/`,
        body
      );
      if (response.status === 201) {
        setUnitPrice("");
        setLeadTimeDays("");

        navigate(`/suppliers/${supplier._id}/all-link`);
      }
    } catch (error) {
      console.error("Failed to create product-supplier link", error);
    }
  };

  return (
    <div className="link-supplier-container">
      <h2 className="supplier-name">Link Product to {supplier.name}</h2>
      <div className="select-container">
        <label htmlFor="product-select" className="select-label">
          Select a Product
        </label>
        <div className="custom-select-container">
          <div
            className={`custom-select ${isOpen ? "open" : "}"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="selected-option">
              {selectedProductData ? (
                <div className="option-content">
                  <img
                    src={selectedProductData.imagesUrl?.[0]}
                    className="option-image"
                  />
                  <span>{selectedProductData.name}</span>
                </div>
              ) : (
                "Choose a product.."
              )}
            </div>
            <div className="dropdown-arrow">▼</div>
          </div>
          {isOpen && (
            <div className="options-list">
              <div
                className="custom-option"
                onClick={() => handleSelectProduct("")}
              >
                Choose a product ..
              </div>
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="custom-option"
                  onClick={() => handleSelectProduct(product._id)}
                >
                  <div className="option-content">
                    <img
                      src={product.imagesUrl?.[0]}
                      alt=""
                      className="option-image"
                    />
                    <span>{product.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProductData ? (
        <>
          <div className="product-info">
            <strong>Current Price:</strong> ${selectedProductData.costPrice}
          </div>
          <form onSubmit={onSubmitHandler} className="link-form">
            <div className="form-group">
              <label htmlFor="unitPrice">Enter Unit Price</label>

              <input
                type="text"
                name="unitPrice"
                placeholder="Unit Price"
                className="form-input"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="leadTimeDays">Enter lead time days </label>

              <input
                type="text"
                name="leadTimeDays"
                placeholder="Lead Time Days"
                className="form-input"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(e.target.value)}
              />
            </div>
            <button type="submit" className="submit-button">
              Create Link
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
};

export default LinkSupplierProduct;
