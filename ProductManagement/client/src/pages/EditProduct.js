import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";      // <-- import Auth0 hook
import api from "../api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();   // <-- get token

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const token = await getAccessTokenSilently({
        audience: "https://moyo-product-api",
      });

      const res = await api.get(`/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setName(res.data.name);
      setPrice(res.data.price);
    };

    fetchProduct();
  }, [id, getAccessTokenSilently]);

  // Save updates
  const saveChanges = async () => {
    const token = await getAccessTokenSilently({
      audience: "https://moyo-product-api",
    });

    await api.put(
      `/product/${id}`,
      { id: parseInt(id), name, price: parseFloat(price) },
      { headers: { Authorization: `Bearer ${token}` } }      // <-- attach token
    );

    alert("Product updated! Waiting for approval again.");
    navigate("/"); // back to list
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={saveChanges}>Save</button>
    </div>
  );
}