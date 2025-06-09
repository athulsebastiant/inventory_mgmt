import axios from "axios";
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
const LinkSupplierProduct = () => {
  const supplier = useOutletContext();
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
        const response = await axios.get("http://localhost:5000/api/products/");
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
        "http://localhost:5000/api/productSuppliers/",
        body
      );
      if (response.status === 201) {
        setUnitPrice("");
        setLeadTimeDays("");

        navigate(`/suppliers/${supplier._id}/all-link`);
      }
    } catch (error) {}
  };

  return (
    <div>
      <p>{supplier.name}</p>
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
      <style>{`
        .select-container {
          max-width: 400px;
          margin: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            sans-serif;
        }

        .select-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .custom-select-container {
          position: relative;
        }

        .custom-select {
          border: 2px solid #ddd;
          border-radius: 8px;
          padding: 12px;
          background: white;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 50px;
          transition: border-color 0.2s ease;
          user-select: none;
        }

        .custom-select:hover {
          border-color: #999;
        }

        .custom-select.open {
          border-color: #007bff;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .selected-option {
          flex: 1;
        }

        .dropdown-arrow {
          color: #666;
          transition: transform 0.2s ease;
          font-size: 12px;
        }

        .custom-select.open .dropdown-arrow {
          transform: rotate(180deg);
        }

        .options-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #007bff;
          border-top: none;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .custom-option {
          padding: 12px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
          transition: background-color 0.2s ease;
        }

        .custom-option:hover {
          background-color: #f8f9fa;
        }

        .custom-option:last-child {
          border-bottom: none;
        }

        .option-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .option-image {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #eee;
          flex-shrink: 0;
        }

        .loading {
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 16px;
        }

        .error {
          padding: 12px;
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c33;
        }

        /* Responsive design */
        @media (max-width: 480px) {
          .select-container {
            max-width: 100%;
          }

          .option-image {
            width: 32px;
            height: 32px;
          }

          .custom-select {
            padding: 10px;
          }

          .custom-option {
            padding: 10px;
          }
        }
      `}</style>
      {selectedProductData ? (
        <>
          <div>Current Price : ${selectedProductData.costPrice}</div>
          <form onSubmit={onSubmitHandler}>
            <label htmlFor="unitPrice">Enter Unit Price</label>

            <input
              type="text"
              name="unitPrice"
              placeholder="Unit Price"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              required
            />
            <label htmlFor="leadTimeDays">Enter lead time days </label>

            <input
              type="text"
              name="leadTimeDays"
              placeholder="Lead Time Days"
              value={leadTimeDays}
              onChange={(e) => setLeadTimeDays(e.target.value)}
            />

            <button type="submit">Create Link</button>
          </form>
        </>
      ) : null}
    </div>
  );
};

export default LinkSupplierProduct;
