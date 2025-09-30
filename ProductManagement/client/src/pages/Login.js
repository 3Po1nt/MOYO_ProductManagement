import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <div>
      <h2>Login</h2>

      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>
          Login with Auth0
        </button>
      )}

      {isAuthenticated && (
        <div>
          <p>Logged in as: {user?.email}</p>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
