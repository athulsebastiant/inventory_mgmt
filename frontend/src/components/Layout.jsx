import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <div className="wrapper">
        <Header />
        <main className="content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
