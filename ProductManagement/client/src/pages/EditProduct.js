import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // <-- import Auth0 hook
import api from "../api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0(); // <-- get token

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // --- LOGIC (Kept exactly the same) ---

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://moyo-product-api",
        });

        const res = await api.get(`/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(res.data.name);
        setPrice(res.data.price);
      } catch (error) {
        console.error("Failed to fetch product for editing:", error);
        // Handle error, maybe redirect to home or show an error message
      }
    };

    fetchProduct();
  }, [id, getAccessTokenSilently]);

  // Save updates
  const saveChanges = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://moyo-product-api",
      });

      await api.put(
        `/product/${id}`,
        { id: parseInt(id), name, price: parseFloat(price) },
        { headers: { Authorization: `Bearer ${token}` } } // <-- attach token
      );

      alert("Product updated! Waiting for approval again.");
      navigate("/"); // back to list
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes.");
    }
  };

  // --- STYLING OBJECTS (Consistent with AddProduct) ---
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
    boxSizing: "border-box",
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%",
    backgroundColor: "#ffc107", // A striking yellow/orange for "Edit/Save" action
    color: "#343a40",
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
      <h2 style={titleStyle}>Edit Product Details 📝</h2>
      <input
        style={inputStyle}
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button style={buttonStyle} onClick={saveChanges}>
        Save Changes
      </button>
    </div>
  );
}