import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Approvals from "./pages/Approvals";
import EditProduct from "./pages/EditProduct";

function App() {
  const { user, isAuthenticated } = useAuth0();

  // You can read roles from the token later if needed
  // const roles = user && user["https://moyo-product-api/roles"];

  return (
    <BrowserRouter>
      <Navbar user={user} isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/edit/:id" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;