import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  </Provider>
);
