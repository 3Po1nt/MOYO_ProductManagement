import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth0 } from "@auth0/auth0-react"; // <-- import Auth0 hook

export default function Approvals() {
  const [products, setProducts] = useState([]);
  const { getAccessTokenSilently } = useAuth0(); // <-- get token function

  // --- LOGIC (Kept exactly the same) ---

  // Fetch all products and show only those pending approval
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://moyo-product-api",
        });

        const res = await api.get("/product", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // NOTE: The products list needs to be re-fetched after an action (approve/reject)
        // to update the UI. For simplicity, we'll keep the current fetch logic,
        // but in a real app, you'd call fetchProducts() after a successful action.

        setProducts(res.data.filter((p) => p.status === "PendingApproval"));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [getAccessTokenSilently]);

  // Approve product
  const approve = async (id) => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://moyo-product-api",
      });

      await api.post(
        `/product/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optimistic UI Update: Remove the approved item immediately
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert(`Product ID ${id} Approved!`);
    } catch (err) {
      console.error(err);
      alert("Failed to approve product");
    }
  };

  // Reject product
  const reject = async (id) => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://moyo-product-api",
      });

      await api.post(
        `/product/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optimistic UI Update: Remove the rejected item immediately
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert(`Product ID ${id} Rejected!`);
    } catch (err) {
      console.error(err);
      alert("Failed to reject product");
    }
  };

  // --- STYLING OBJECTS ---
  const containerStyle = {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  };

  const titleStyle = {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "10px",
  };

  const listStyle = {
    listStyleType: "none",
    padding: 0,
  };

  const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    marginBottom: "10px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  };

  const productInfoStyle = {
    fontSize: "1.1em",
    fontWeight: "500",
    color: "#444",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "10px",
  };

  const approveButtonStyle = {
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#28a745", // Green for approval
    color: "white",
    transition: "background-color 0.3s ease",
  };

  const rejectButtonStyle = {
    padding: "8px 15px",
    borderRadius: "5px",
    border: "1px solid #dc3545", // Red border for rejection
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "transparent",
    color: "#dc3545",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const noProductsStyle = {
    textAlign: "center",
    color: "#6c757d",
    fontSize: "1.2em",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "8px",
  };
  // -----------------------

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Product Approval Queue</h2>

      {products.length === 0 ? (
        <p style={noProductsStyle}>
          🎉 No products currently pending approval. You're all caught up!
        </p>
      ) : (
        <ul style={listStyle}>
          {products.map((p) => (
            <li key={p.id} style={listItemStyle}>
              <span style={productInfoStyle}>
                **{p.name}** – R{p.price.toFixed(2)}
              </span>
              <div style={buttonContainerStyle}>
                <button style={approveButtonStyle} onClick={() => approve(p.id)}>
                  ✅ Approve
                </button>
                <button style={rejectButtonStyle} onClick={() => reject(p.id)}>
                  ❌ Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}