import React, { useState } from "react";
import api from "../api"; // your axios instance
import { useAuth0 } from "@auth0/auth0-react"; // <-- import the hook

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const { getAccessTokenSilently } = useAuth0(); // <-- access Auth0

  // The logic remains exactly the same
  const addProduct = async () => {
    try {
      // get a valid JWT token
      const token = await getAccessTokenSilently({
        audience: "https://moyo-product-api",
      });

      // send token in Authorization header
      await api.post(
        "/product",
        { name, price: parseFloat(price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product submitted for approval");
      // Optional: Clear the form after success
      setName("");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  // --- STYLING OBJECTS ---
  const containerStyle = {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    margin: "10px 0",
    display: "inline-block",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box", // Important for padding/border not increasing width
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%",
    backgroundColor: "#007bff",
    color: "white",
    padding: "14px 20px",
    margin: "20px 0 10px 0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  };

  const titleStyle = {
    color: "#333",
    marginBottom: "20px",
  };
  // -----------------------

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Add New Product 🚀</h2>
      <input
        style={inputStyle}
        type="text"
        placeholder="Product Name" // Improved placeholder
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        style={inputStyle}
        type="number" // Use type="number" for better mobile keyboard support
        placeholder="Price (e.g., 9.99)" // Improved placeholder
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button style={buttonStyle} onClick={addProduct}>
        Submit for Approval
      </button>
    </div>
  );
}