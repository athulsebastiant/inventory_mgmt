import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import About from "./pages/About";
import Products from "./pages/products/Products";
import Clients from "./pages/clients/Clients";
import Suppliers from "./pages/suppliers/Suppliers";
import ClientQuots from "./pages/quots/ClientQuots";
import Purchasing from "./pages/purchase/Purchasing";
import ProductDetails from "./pages/products/ProductDetails";
import AddNewProduct from "./pages/products/AddNewProduct";
import AddNewClient from "./pages/clients/AddNewClient";
import ClientDetails from "./pages/clients/ClientDetails";
import SupplierDetails from "./pages/suppliers/SupplierDetails";
import AddNewSupplier from "./pages/suppliers/AddNewSupplier";
import LinkSupplierProduct from "./pages/suppliers/LinkSupplierProduct";
import ViewSuppliersLinks from "./pages/suppliers/ViewSuppliersLinks";
import NewPurchase from "./pages/purchase/NewPurchase";
import PurchaseDetails from "./pages/purchase/PurchaseDetails";
import AddNewQuotation from "./pages/quots/AddNewQuotation";
import QuotationDetails from "./pages/quots/QuotationDetails";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import TopSellingProducts from "./pages/analytics/TopSellingProducts";
import StockOverview from "./pages/analytics/StockOverview";
import ClientEngagement from "./pages/analytics/ClientEngagement";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
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
          <Route path="client-quotations/:id" element={<QuotationDetails />} />
          <Route
            path="client-quotations/new-quotation"
            element={<AddNewQuotation />}
          />
          <Route path="purchasing" element={<Purchasing />} />
          <Route path="purchasing/:id" element={<PurchaseDetails />} />
          <Route path="purchasing/new-purchase" element={<NewPurchase />} />
          <Route
            path="analytics/top-selling-products"
            element={<TopSellingProducts />}
          />
          <Route path="analytics/stock-overview" element={<StockOverview />} />
          <Route
            path="analytics/client-engagement"
            element={<ClientEngagement />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
