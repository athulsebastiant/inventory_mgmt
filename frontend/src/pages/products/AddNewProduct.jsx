import React, { useState } from "react";
import imgUpload from "../../images/imgUpload.jpg";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/AddNewProduct.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const AddNewProduct = () => {
  const navigate = useNavigate();
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [message, setMessage] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isDemoMode) {
      setMessage(
        "Adding products is restricted for demo purposes. You can view existing data."
      );
      return; // Stop execution if in demo mode
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("sku", sku);
      formData.append("description", description);
      formData.append("initialStock", initialStock);
      formData.append("currentStock", currentStock);
      formData.append("reorderLevel", reorderLevel);
      formData.append("costPrice", costPrice);
      formData.append("category", category);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/products/`,
        formData
      );
      if (response.status === 201) {
        console.log("Product added successfully:", response.data);
        setName("");
        setDescription("");

        setCostPrice("");
        setCurrentStock("");
        setInitialStock("");
        setSku("");
        setReorderLevel("");
        setCategory("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        const { product } = response.data;
        console.log("New product:", product);

        navigate(`/products/${product._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="breadcrumb">
        <Link to="/products">Products</Link> &gt; <span>Add New Product</span>
      </nav>
      <h2>Add New Product</h2>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="name">Enter Name of Product</label>
        <input
          type="text"
          placeholder="Name of product"
          id="name"
          name="name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="sku">Enter sku of Product</label>
        <input
          type="text"
          placeholder="sku of product"
          id="sku"
          name="sku"
          value={sku}
          required
          onChange={(e) => setSku(e.target.value)}
        />

        <label htmlFor="Description">Enter Description of Product</label>
        <input
          type="text"
          placeholder="Description of product"
          id="Description"
          name="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="initialstock">Enter initial stock of Product</label>
        <input
          type="text"
          placeholder="initial stock of product"
          id="initialstock"
          name="initialstock"
          value={initialStock}
          onChange={(e) => setInitialStock(e.target.value)}
        />

        <label htmlFor="currentstock">Enter current stock of Product</label>
        <input
          type="text"
          placeholder="current stock of product"
          id="currentstock"
          name="currentstock"
          value={currentStock}
          onChange={(e) => setCurrentStock(e.target.value)}
        />

        <label htmlFor="reorderlevel">Enter reorder level of Product</label>
        <input
          type="text"
          placeholder="reorder level  of product"
          id="reorderlevel"
          name="reorderlevel"
          value={reorderLevel}
          onChange={(e) => setReorderLevel(e.target.value)}
        />

        <label htmlFor="costprice">Enter cost price of Product</label>
        <input
          type="text"
          placeholder="cost price of product"
          id="costprice"
          name="costprice"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
        />

        <label htmlFor="category">Enter category of Product</label>
        <input
          type="text"
          placeholder="category of product"
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <div className="imgContainer">
          <p>Upload Image</p>
          <div>
            <label htmlFor="image1">
              <img
                src={!image1 ? imgUpload : URL.createObjectURL(image1)}
                alt=""
              />
              <input
                type="file"
                id="image1"
                onChange={(e) => setImage1(e.target.files[0])}
              />
            </label>

            <label htmlFor="image2">
              <img
                src={!image2 ? imgUpload : URL.createObjectURL(image2)}
                alt=""
              />
              <input
                type="file"
                id="image2"
                onChange={(e) => setImage2(e.target.files[0])}
              />
            </label>

            <label htmlFor="image3">
              <img
                src={!image3 ? imgUpload : URL.createObjectURL(image3)}
                alt=""
              />
              <input
                type="file"
                id="image3"
                onChange={(e) => setImage3(e.target.files[0])}
              />
            </label>

            <label htmlFor="image4">
              <img
                src={!image4 ? imgUpload : URL.createObjectURL(image4)}
                alt=""
              />
              <input
                type="file"
                id="image4"
                onChange={(e) => setImage4(e.target.files[0])}
              />
            </label>
          </div>
        </div>
        <button type="submit">ADD</button>
        {message && (
          <div
            className={`message-box ${
              isDemoMode ? "demo-message" : "success-message"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </>
  );
};

export default AddNewProduct;
