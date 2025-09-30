import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);   // NEW loading state
  const { getAccessTokenSilently } = useAuth0();

  // Combined effect for role detection and product fetching
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently({
          audience: "https://moyo-product-api",
        });

        // Decode token to determine role
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        if (decoded.permissions?.includes("capturer:basic")) {
          setRole("Capturer");
        } else if (decoded.permissions?.includes("manager:basic")) {
          setRole("Manager");
        } else {
          setRole("");
        }

        // Fetch products
        const res = await api.get("/product", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [getAccessTokenSilently]);

  // Delete product (Manager only)
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = await getAccessTokenSilently({
        audience: "https://moyo-product-api",
      });

      await api.delete(`/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Product deleted!");
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  // --- STYLING ---
  const containerStyle = {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
  };

  const titleStyle = {
    color: "#333",
    marginBottom: "25px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "10px",
  };

  const listStyle = {
    listStyleType: "none",
    padding: 0,
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
  };

  const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  };

  const productInfoStyle = {
    flexGrow: 1,
    display: "flex",
    gap: "20px",
    alignItems: "center",
  };

  const nameStyle = {
    fontWeight: "bold",
    minWidth: "150px",
    color: "#007bff",
  };

  const priceStyle = {
    color: "#28a745",
    fontWeight: "600",
    minWidth: "80px",
  };

  const getStatusStyle = (status) => {
    let color, bgColor;
    switch (status) {
      case "Approved":
        color = "#155724";
        bgColor = "#d4edda";
        break;
      case "Rejected":
        color = "#721c24";
        bgColor = "#f8d7da";
        break;
      case "PendingApproval":
      default:
        color = "#856404";
        bgColor = "#fff3cd";
        break;
    }
    return {
      color,
      backgroundColor: bgColor,
      padding: "5px 10px",
      borderRadius: "15px",
      fontSize: "0.85em",
      fontWeight: "600",
      minWidth: "140px",
      textAlign: "center",
    };
  };

  const editButtonStyle = {
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#ffc107",
    color: "#343a40",
    marginLeft: "10px",
    textDecoration: "none",
  };

  const deleteButtonStyle = {
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#dc3545",
    color: "white",
    marginLeft: "10px",
  };

  const roleInfoStyle = {
    textAlign: "center",
    marginBottom: "20px",
    color: "#6c757d",
    fontSize: "1.1em",
    padding: "10px",
    border: "1px dashed #ced4da",
    borderRadius: "5px",
  };
  // -----------------------

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={titleStyle}>Loading Products...</h2>
        <p>Please wait while we fetch your products.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Product Catalog 🛒</h2>

      {role && (
        <p style={roleInfoStyle}>
          Current Role: <strong>{role}</strong>
        </p>
      )}

      <ul style={listStyle}>
        {products.map((p) => (
          <li key={p.id} style={listItemStyle}>
            <div style={productInfoStyle}>
              <span style={nameStyle}>{p.name}</span>
              <span style={priceStyle}>R{p.price.toFixed(2)}</span>
              <span style={getStatusStyle(p.status)}>
                {p.status.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {role === "Capturer" && (
                <Link to={`/edit/${p.id}`} style={{ textDecoration: "none" }}>
                  <button style={editButtonStyle}>✏️ Edit</button>
                </Link>
              )}
              {role === "Manager" && (
                <button
                  style={deleteButtonStyle}
                  onClick={() => deleteProduct(p.id)}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}