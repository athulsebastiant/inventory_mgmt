import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";
import IVM from "../images/IVM.jpeg";
const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="image-container">
          {/* Replace this with your image */}
          <img src={IVM} alt="Page not found" className="not-found-image" />
        </div>

        <div className="text-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-description">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>

          <Link className="link-button" to={"/"}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
