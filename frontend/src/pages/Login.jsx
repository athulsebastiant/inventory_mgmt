import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${backendUrl}/api/users/login`, formData);
      const { token } = res.data;

      localStorage.setItem("authToken", token);

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Login</h2>
        <label>Email (use test123@tmail.com)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Password (use test1234)</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit">Log In</button>
        <Link to={"/signup"}>Don't have an account? Sign up here</Link>
      </form>
    </div>
  );
};

export default Login;
