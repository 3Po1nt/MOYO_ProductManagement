import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth0 } from "@auth0/auth0-react";   // <-- import Auth0 hook

export default function Approvals() {
  const [products, setProducts] = useState([]);
  const { getAccessTokenSilently } = useAuth0(); // <-- get token function

  // Fetch all products and show only those pending approval
  useEffect(() => {
    const fetchProducts = async () => {
      const token = await getAccessTokenSilently({
        audience: "https://moyo-product-api",
      });

      const res = await api.get("/product", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(res.data.filter((p) => p.status === "PendingApproval"));
    };

    fetchProducts();
  }, [getAccessTokenSilently]);

  // Approve product
  const approve = async (id) => {
    const token = await getAccessTokenSilently({
      audience: "https://moyo-product-api",
    });

    await api.post(`/product/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Approved!");
  };

  // Reject product
  const reject = async (id) => {
    const token = await getAccessTokenSilently({
      audience: "https://moyo-product-api",
    });

    await api.post(`/product/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Rejected!");
  };

  return (
    <div>
      <h2>Pending Approvals</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} – R{p.price}
            <button onClick={() => approve(p.id)}>Approve</button>
            <button onClick={() => reject(p.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}