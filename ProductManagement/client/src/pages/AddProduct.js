import React, { useState } from "react";
import api from "../api";                 // your axios instance
import { useAuth0 } from "@auth0/auth0-react"; // <-- import the hook

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const { getAccessTokenSilently } = useAuth0(); // <-- access Auth0

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
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={addProduct}>Submit</button>
    </div>
  );
}
