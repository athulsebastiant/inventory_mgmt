import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import About from "./pages/About";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import Suppliers from "./pages/Suppliers";
import ClientQuots from "./pages/ClientQuots";
import Purchasing from "./pages/Purchasing";
import ProductDetails from "./pages/ProductDetails";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="clients" element={<Clients />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="client-quotations" element={<ClientQuots />} />
          <Route path="purchasing" element={<Purchasing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
