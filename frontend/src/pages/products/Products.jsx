import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import "../../styles/Products.css";
import SearchBar from "../../components/SearchBar";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("authToken");
const Products = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const categoryFilter = searchParams.get("category");
  const lowStockFilter = searchParams.get("lowStock");
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/products/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const isLowStock = (product) => {
    return product.currentStock < product.reorderLevel;
  };

  const displayedProducts = products.filter((product) => {
    const matchesCategory = categoryFilter
      ? product.category.toLowerCase().replace(/\s+/g, "") === categoryFilter
      : true;

    const matchesSearch = `${product.name} ${product.sku}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesLowStock =
      lowStockFilter === "true" ? isLowStock(product) : true;

    return matchesCategory && matchesSearch && matchesLowStock;
  });

  const productElements = displayedProducts.map((product) => (
    <div
      key={product._id}
      className={`product-tile ${isLowStock(product) ? "low-stock" : ""}`}
    >
      <Link to={`${product._id}`}>
        <img src={product.imagesUrl[0]} alt="" />
        <div className="product-info">
          <h3>{product.name}</h3>
          <p>Current Stock: {product.currentStock}</p>
          <p>Cost Price: ${product.costPrice}</p>
          {isLowStock(product) && (
            <div className="low-stock-warning">
              ⚠️ LOW STOCK - Reorder Level: {product.reorderLevel}
            </div>
          )}
        </div>
      </Link>
    </div>
  ));

  function handleFilterChange(key, value) {
    setSearchParams((prevParams) => {
      if (value === null) {
        prevParams.delete(key);
      } else {
        prevParams.set(key, value);
      }
      return prevParams;
    });
  }

  const lowStockCount = products.filter(isLowStock).length;

  return (
    <div className="product-list-container">
      <h1>All Products</h1>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <div>
        <Link to={"add-new-product"} className="new_product_link">
          Add New Product
        </Link>
        <button
          onClick={() => handleFilterChange("category", "powertools")}
          className={`filter-btn btn-powertools ${
            categoryFilter === "powertools" ? "active" : ""
          }`}
        >
          Power Tools
        </button>
        <button
          onClick={() => handleFilterChange("category", "nailers&staplers")}
          className={`filter-btn btn-nailers ${
            categoryFilter === "nailers&staplers" ? "active" : ""
          }`}
        >
          Nailers and Staplers
        </button>
        <button
          onClick={() => handleFilterChange("category", "measuringtools")}
          className={`filter-btn btn-measuringtools ${
            categoryFilter === "measuringtools" ? "active" : ""
          }`}
        >
          Measuring Tools
        </button>
        <button
          onClick={() => handleFilterChange("category", "clamps&vises")}
          className={`filter-btn btn-clampsvises ${
            categoryFilter === "clamps&vises" ? "active" : ""
          }`}
        >
          Clamps and Vises
        </button>
        <button
          onClick={() =>
            handleFilterChange(
              "lowStock",
              lowStockFilter === "true" ? null : "true"
            )
          }
          className={`filter-btn btn-low-stock ${
            lowStockFilter === "true" ? "active" : ""
          }`}
        >
          Low Stock ({lowStockCount})
        </button>
        {categoryFilter || lowStockFilter ? (
          <button
            onClick={() => {
              handleFilterChange("category", null);
              handleFilterChange("lowStock", null);
            }}
            className="filter-btn btn-clear"
          >
            Clear Filters
          </button>
        ) : null}
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
