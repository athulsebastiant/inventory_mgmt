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
import AddNewProduct from "./pages/AddNewProduct";
import AddNewClient from "./pages/AddNewClient";
import ClientDetails from "./pages/ClientDetails";
import SupplierDetails from "./pages/SupplierDetails";
import AddNewSupplier from "./pages/AddNewSupplier";
import LinkSupplierProduct from "./pages/LinkSupplierProduct";
import ViewSuppliersLinks from "./pages/ViewSuppliersLinks";
import NewPurchase from "./pages/NewPurchase";
import PurchaseDetails from "./pages/PurchaseDetails";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="products/add-new-product" element={<AddNewProduct />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="clients/add-new-client" element={<AddNewClient />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/:id" element={<SupplierDetails />}>
            <Route
              path="link-supplier-product"
              element={<LinkSupplierProduct />}
            />
            <Route path="all-link" element={<ViewSuppliersLinks />} />
          </Route>
          <Route
            path="suppliers/add-new-supplier"
            element={<AddNewSupplier />}
          />
          <Route path="client-quotations" element={<ClientQuots />} />
          <Route path="purchasing" element={<Purchasing />} />
          <Route path="purchasing/:id" element={<PurchaseDetails />} />
          <Route path="purchasing/new-purchase" element={<NewPurchase />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
