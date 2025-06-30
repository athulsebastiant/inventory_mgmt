import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/AddNewQuotation.css";
const token = localStorage.getItem("authToken");
const AddNewQuotation = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quotationProducts, setQuotationProducts] = useState([]);
  const [isCreatingQuotation, setIsCreatingQuotation] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    // Fetch clients
    fetch(`${backendUrl}/api/clients/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Error fetching clients:", err));

    // Fetch products
    fetch(`${backendUrl}/api/products/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setClientDropdownOpen(false);
  };

  const handleProductSelect = (product) => {
    // Check if product is already selected
    const isAlreadySelected = selectedProducts.some(
      (p) => p._id === product._id
    );
    if (!isAlreadySelected) {
      const productWithSuppliers = {
        ...product,
        suppliers: [],
        selectedSupplier: null,
        quantity: "",
        unitPrice: "",
        isSaved: false,
        supplierDropdownOpen: false,
        loadingSuppliers: true,
      };

      // Fetch suppliers for this product
      fetch(`${backendUrl}/api/productSuppliers/product/${product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((suppliers) => {
          setSelectedProducts((prev) =>
            prev.map((p) =>
              p._id === product._id
                ? { ...p, suppliers, loadingSuppliers: false }
                : p
            )
          );
        })
        .catch((err) => {
          console.error("Error fetching suppliers:", err);
          setSelectedProducts((prev) =>
            prev.map((p) =>
              p._id === product._id ? { ...p, loadingSuppliers: false } : p
            )
          );
        });

      setSelectedProducts((prev) => [...prev, productWithSuppliers]);
    }
    setProductDropdownOpen(false);
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
    // Also remove from quotation if it was saved
    const updatedQuotationProducts = quotationProducts.filter(
      (q) => q.productId !== productId
    );
    setQuotationProducts(updatedQuotationProducts);

    // Console log updated quotation
    const quotationData = {
      clientId: selectedClient._id,
      products: updatedQuotationProducts.map(({ productId, ...rest }) => rest),
    };
    console.log("Quotation Data (after removal):", quotationData);
  };

  const updateProductField = (productId, field, value) => {
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (p._id === productId) {
          const updated = { ...p, [field]: value };

          // If selecting a supplier, update the unit price
          if (field === "selectedSupplier" && value) {
            updated.unitPrice = value.unitPrice.toString();
          }

          return updated;
        }
        return p;
      })
    );
  };

  const createClientQuotation = async () => {
    if (isDemoMode) {
      setMessage(
        "Creating quotations is restricted for demo purposes. You can view existing data."
      );
      return; // Stop execution if in demo mode
    }
    if (quotationProducts.length === 0) {
      alert("Please save at least one product before creating quotation");
      return;
    }

    setIsCreatingQuotation(true);

    try {
      const quotationData = {
        clientId: selectedClient._id,
        products: quotationProducts.map(({ productId, ...rest }) => rest),
      };

      const response = await fetch(`${backendUrl}/api/client-quotations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quotationData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Prepare toPurchase with product names
        const toPurchaseWithNames =
          result.toPurchase?.map((item) => {
            const product = products.find((p) => p._id === item.productId);
            return {
              ...item,
              productName: product ? product.name : "Unknown Product",
            };
          }) || [];

        // Navigate to client quotation page with state
        navigate(`/client-quotations/${result.quotation._id}`, {
          state: {
            message: result.message,
            toPurchase: toPurchaseWithNames,
          },
        });
      } else {
        alert(`Error creating quotation: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating quotation:", error);
      alert("Error creating quotation. Please try again.");
    } finally {
      setIsCreatingQuotation(false);
    }
  };

  const toggleSupplierDropdown = (productId) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p._id === productId
          ? { ...p, supplierDropdownOpen: !p.supplierDropdownOpen }
          : { ...p, supplierDropdownOpen: false }
      )
    );
  };

  const saveProduct = (product) => {
    if (!product.selectedSupplier || !product.quantity) {
      alert("Please select a supplier and enter quantity");
      return;
    }

    const quotationProduct = {
      productId: product._id,
      productSupplierId: product.selectedSupplier._id,
      quantity: parseInt(product.quantity),
      unitPrice:
        parseFloat(product.unitPrice) || product.selectedSupplier.unitPrice,
    };

    // Update quotation products array
    setQuotationProducts((prev) => {
      const filtered = prev.filter((q) => q.productId !== product._id);
      const updatedQuotationProducts = [...filtered, quotationProduct];

      // Console log the quotation without productId
      const quotationData = {
        clientId: selectedClient._id,
        products: updatedQuotationProducts.map(
          ({ productId, ...rest }) => rest
        ),
      };
      console.log("Quotation Data (after save):", quotationData);

      return updatedQuotationProducts;
    });

    // Mark product as saved
    setSelectedProducts((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, isSaved: true } : p))
    );
  };

  return (
    <>
      <nav className="breadcrumb">
        <Link to="/client-quotations">Quotations</Link> &gt;{" "}
        <span>Add New Quotation</span>
      </nav>
      <h2 className="main-header">Add New Quotation</h2>
      <div className="main-container">
        {/* Left side - Client and Product Selection */}
        <div className="client-product-container">
          {/* Client Dropdown */}
          <div className="client-dropdown-container">
            <div
              className="dropdown-header"
              onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
            >
              {selectedClient ? selectedClient.name : "Select a client"}
            </div>

            {clientDropdownOpen && (
              <div className="dropdown-options">
                {clients.map((client) => (
                  <div
                    key={client._id}
                    className="dropdown-option"
                    onClick={() => handleClientSelect(client)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#FFF7ED")
                    }
                  >
                    {client.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Info */}
          {selectedClient && (
            <div className="client-info">
              <h3>Selected Client</h3>
              <p>
                <strong>Name:</strong> {selectedClient.name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedClient.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedClient.email}
              </p>
            </div>
          )}

          {/* Product Dropdown */}
          {selectedClient && (
            <div className="product-dropdown-container">
              <div
                className="dropdown-header"
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
              >
                Select a product
              </div>

              {productDropdownOpen && (
                <div className="dropdown-options">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="dropdown-option"
                      onClick={() => handleProductSelect(product)}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#e8d5b7")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#FFF7ED")
                      }
                    >
                      {product.imagesUrl && product.imagesUrl[0] && (
                        <img
                          src={product.imagesUrl[0]}
                          alt={product.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                      <span>{product.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side - Selected Products */}
        {selectedProducts.length > 0 && (
          <div
            style={{
              flex: "1",
              minWidth: "400px",
              maxHeight: "70vh",
              overflowY: "auto",
              paddingRight: "10px",
            }}
          >
            <h3 style={{ marginTop: "0" }}>Selected Products</h3>
            {selectedProducts.map((product) => (
              <div
                key={product._id}
                className="product-card"
                style={{
                  border: product.isSaved
                    ? "2px solid #8b7355"
                    : "1px solid #f5dfc4",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "15px",
                  backgroundColor: product.isSaved ? "#f9f0e7" : "#FFF7ED",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                {product.isSaved && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#4CAF50",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    SAVED
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "flex", gap: "15px", flex: "1" }}>
                    {product.imagesUrl && product.imagesUrl[0] && (
                      <img
                        src={product.imagesUrl[0]}
                        alt={product.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    )}
                    <div style={{ flex: "1" }}>
                      <h4 style={{ margin: "0 0 10px 0", color: "#252525" }}>
                        {product.name}
                      </h4>
                      <p style={{ margin: "5px 0", color: "#3d3d3d" }}>
                        <strong>Current Stock:</strong> {product.currentStock}
                      </p>
                      <p style={{ margin: "5px 0", color: "#3d3d3d" }}>
                        <strong>Cost Price:</strong> ₹{product.costPrice}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeProduct(product._id)}
                    style={{
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#cc0000")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#ff4444")
                    }
                  >
                    Remove
                  </button>
                </div>

                {/* Supplier Selection and Form */}
                <div
                  style={{
                    marginTop: "15px",
                    borderTop: "1px solid #f5dfc4",
                    paddingTop: "15px",
                  }}
                >
                  {/* Supplier Dropdown */}
                  <div style={{ marginBottom: "10px", position: "relative" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Supplier *
                    </label>
                    {product.loadingSuppliers ? (
                      <div style={{ padding: "10px", color: "#3d3d3d" }}>
                        Loading suppliers...
                      </div>
                    ) : (
                      <>
                        <div
                          onClick={() => toggleSupplierDropdown(product._id)}
                          style={{
                            border: "1px solid #f5dfc4",
                            padding: "8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            backgroundColor: "#f9f0e7",
                          }}
                        >
                          {product.selectedSupplier
                            ? `${product.selectedSupplier.supplierId.name} - ₹${product.selectedSupplier.unitPrice}`
                            : "Select a supplier"}
                        </div>
                        {product.supplierDropdownOpen && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "0",
                              right: "0",
                              backgroundColor: "#FFF7ED",
                              border: "1px solid #f5dfc4",
                              borderRadius: "4px",
                              maxHeight: "150px",
                              overflowY: "auto",
                              zIndex: 5,
                            }}
                          >
                            {product.suppliers.map((supplier) => (
                              <div
                                key={supplier._id}
                                onClick={() => {
                                  updateProductField(
                                    product._id,
                                    "selectedSupplier",
                                    supplier
                                  );
                                  toggleSupplierDropdown(product._id);
                                }}
                                style={{
                                  padding: "8px",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #f5dfc4",
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.backgroundColor = "##e8d5b7")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.backgroundColor = "#FFF7ED")
                                }
                              >
                                {supplier.supplierId.name} - ₹
                                {supplier.unitPrice}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Quantity and Price Inputs */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <div style={{ flex: "1" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          updateProductField(
                            product._id,
                            "quantity",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #f5dfc4",
                          borderRadius: "4px",
                        }}
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div style={{ flex: "1" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        Unit Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={product.unitPrice}
                        onChange={(e) =>
                          updateProductField(
                            product._id,
                            "unitPrice",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #f5dfc4",
                          borderRadius: "4px",
                        }}
                        placeholder="Unit price"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => saveProduct(product)}
                    disabled={!product.selectedSupplier || !product.quantity}
                    style={{
                      background:
                        !product.selectedSupplier || !product.quantity
                          ? "#f5dfc4"
                          : "#8b7355",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "10px 20px",
                      cursor:
                        !product.selectedSupplier || !product.quantity
                          ? "not-allowed"
                          : "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {product.isSaved ? "Update" : "Save Product"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Create Quotation Button */}
        <div style={{ textAlign: "right" }}>
          <button
            onClick={createClientQuotation}
            disabled={quotationProducts.length === 0 || isCreatingQuotation}
            style={{
              background:
                quotationProducts.length === 0 || isCreatingQuotation
                  ? "#f5dfc4"
                  : "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              cursor:
                quotationProducts.length === 0 || isCreatingQuotation
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {isCreatingQuotation ? "Creating..." : "Create Client Quotation"}
          </button>
        </div>
        {message && (
          <div
            className={`message-box ${
              isDemoMode ? "demo-message" : "success-message"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </>
  );
};

export default AddNewQuotation;
