import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const apiUrl = process.env.REACT_APP_API_URL;

console.log(`Google Client ID: ${clientId}`); // Log the client ID for debugging
console.log(`API URL: ${apiUrl}`); // Log the API URL for debugging

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  </Provider>
);
