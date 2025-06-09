import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
const ViewSuppliersLinks = () => {
  const supplier = useOutletContext();
  const [psLinks, setPsLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchLink = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/productSuppliers/supplier/${supplier._id}`
      );
      setPsLinks(response.data);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Failed to load supplier links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLink();
  }, [supplier]);
  console.log(psLinks);

  if (loading) {
    return <div className="loading">Loading supplier links...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (psLinks.length === 0) {
    return (
      <div className="no-links">
        <h3>No Product Links Found</h3>
        <p>This supplier has no linked products yet.</p>
      </div>
    );
  }

  return (
    <div className="supplier-links-container">
      <h2>Linked Products ({psLinks.length})</h2>

      <div className="products-grid">
        {psLinks.map((link) => (
          <div key={link._id} className="product-card">
            <div className="product-image-container">
              <img
                src={link.productId.imagesUrl[0]}
                alt={link.productId.name}
                className="product-image"
              />
            </div>

            <div className="product-info">
              <h3 className="product-name">{link.productId.name}</h3>

              <div className="product-details">
                <div className="detail-item">
                  <span className="detail-label">Unit Price:</span>
                  <span className="detail-value">${link.unitPrice}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Lead Time:</span>
                  <span className="detail-value">{link.leadTimeDays} days</span>
                </div>

                {link.preferred && (
                  <div className="preferred-badge">Preferred</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .supplier-links-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .supplier-links-container h2 {
          color: #333;
          margin-bottom: 24px;
          font-size: 28px;
          font-weight: 600;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-info {
          padding: 20px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .detail-label {
          font-weight: 500;
          color: #666;
        }

        .detail-value {
          font-weight: 600;
          color: #333;
        }

        .preferred-badge {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          margin-top: 8px;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #666;
        }

        .error {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          margin: 20px;
        }

        .no-links {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .no-links h3 {
          color: #333;
          margin-bottom: 12px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .supplier-links-container {
            padding: 16px;
          }

          .product-image-container {
            height: 180px;
          }

          .product-info {
            padding: 16px;
          }

          .product-name {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .detail-value {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewSuppliersLinks;
