import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/">Products</Link> |{" "}
      <Link to="/add">Add Product</Link> |{" "}
      <Link to="/approvals">Approvals</Link> |{" "}

      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
      {isAuthenticated && (
        <>
          <span>Logged in as: {user?.email}</span>{" "}
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}