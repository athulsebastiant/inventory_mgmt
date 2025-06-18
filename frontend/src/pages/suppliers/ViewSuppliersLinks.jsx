import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "../../styles/ViewSuppliersLinks.css";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ViewSuppliersLinks = () => {
  const supplier = useOutletContext();
  const [psLinks, setPsLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLinkMode, setEditLinkMode] = useState(false);
  const [editPsLinkInfo, setEditPsLinkInfo] = useState([]);
  const fetchLink = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/productSuppliers/supplier/${supplier._id}`
      );
      setPsLinks(response.data);
      setEditPsLinkInfo(response.data.map((link) => ({ ...link })));
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

  // const handleLinkInfoChange = (linkId, field, value) => {
  //   setEditPsLinkInfo((prev) => {
  //     prev.map((link) => {
  //       link._id === linkId ? { ...link, [field]: value } : link;
  //     });
  //   });
  // };

  const handleEditSaveLink = async () => {
    if (editLinkMode) {
      try {
        for (const link of editPsLinkInfo) {
          const response = await axios.put(
            `${backendUrl}/api/productSuppliers/${link._id}`,
            link
          );

          if (!response.data.success) {
            console.error("Failed to update link:", response.data.message);
            alert(`Failed to update link: ${response.data.message}`);
            return; // stop further updates if one fails
          }

          console.log(
            "Link updated:",
            response.data.message,
            response.data.link
          );
        }

        alert("All links updated successfully.");
        await fetchLink(); // 🔄 Refresh data from server after updates
      } catch (error) {
        console.error("Error updating links:", error);
        alert("An error occurred while updating links.");
      }
    }

    setEditLinkMode(!editLinkMode);
  };

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
      <button onClick={handleEditSaveLink} className="edit-save-btn">
        {editLinkMode ? "💾 Save" : "✏️ Edit"}
      </button>
      <div className="products-grid">
        {psLinks.map((link) => (
          <div key={link._id} className="product-card">
            <div className="product-image-container">
              <img
                src={link.productId.imagesUrl[0]}
                alt={link.productId.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  /* This makes sure the image fills the container while maintaining its aspect ratio */
                  position: "absolute",
                  background: "#fff",
                  top: "0",
                  left: "0",
                }}
              />
            </div>

            <div className="product-info">
              <h3 className="product-name">{link.productId.name}</h3>

              <div className="product-details">
                <div className="detail-item">
                  <span className="detail-label">Unit Price:</span>
                  {editLinkMode ? (
                    <input
                      type="number"
                      value={
                        editPsLinkInfo?.find((l) => l._id === link._id)
                          ?.unitPrice || ""
                      }
                      onChange={(e) => {
                        const updatedLinks = editPsLinkInfo.map((l) =>
                          l._id === link._id
                            ? { ...l, unitPrice: e.target.value }
                            : l
                        );
                        setEditPsLinkInfo(updatedLinks);
                      }}
                    />
                  ) : (
                    <span className="detail-value">${link.unitPrice}</span>
                  )}
                </div>

                <div className="detail-item">
                  <span className="detail-label">Lead Time:</span>

                  {editLinkMode ? (
                    <input
                      type="number"
                      value={
                        editPsLinkInfo?.find((l) => l._id === link._id)
                          ?.leadTimeDays || ""
                      }
                      onChange={(e) => {
                        const updatedLinks = editPsLinkInfo.map((l) =>
                          l._id === link._id
                            ? { ...l, leadTimeDays: e.target.value }
                            : l
                        );
                        setEditPsLinkInfo(updatedLinks);
                      }}
                    />
                  ) : (
                    <span className="detail-value">
                      {link.leadTimeDays} days
                    </span>
                  )}
                </div>

                {link.preferred && (
                  <div className="preferred-badge">Preferred</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSuppliersLinks;
