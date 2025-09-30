import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  // Determine role from token itself
  useEffect(() => {
    const initRole = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://moyo-product-api",
        });
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // Inspect permissions array for roles
        if (decoded.permissions?.includes("capturer:basic")) {
          setRole("Capturer");
        } else if (decoded.permissions?.includes("manager:basic")) {
          setRole("Manager");
        } else {
          setRole("");
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    };

    initRole();
  }, [getAccessTokenSilently]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://moyo-product-api",
        });

        const res = await api.get("/product", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
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

  return (
    <div>
      <h2>All Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} – R{p.price} – Status: {p.status}
            {/* Capturer can edit */}
            {role === "Capturer" && (
              <Link to={`/edit/${p.id}`}>
                <button>Edit</button>
              </Link>
            )}
            {/* Manager can delete */}
            {role === "Manager" && (
              <button onClick={() => deleteProduct(p.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}