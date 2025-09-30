import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";

const domain = "dev-tepjs6ey4y31zm8w.us.auth0.com";         // from Auth0 application settings
const clientId = "YoPRljb2IhK8dRhMek39ndQ2h8afrVxv";       // from Auth0 SPA application
const audience = "https://moyo-product-api";              // must match Auth0 API identifier

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience
    }}
    cacheLocation="localstorage"
    useRefreshTokens
  >
    <App />
  </Auth0Provider>
);
