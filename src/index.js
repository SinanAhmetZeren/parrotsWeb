import React from "react";
import 'leaflet/dist/leaflet.css';
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

const API_URL = window.location.hostname === "localhost" ? "https://localhost:7151" : "https://api.parrotsvoyages.com";
function postClientError(payload) {
  try {
    navigator.sendBeacon(`${API_URL}/api/ClientError`, new Blob([JSON.stringify({ ...payload, platform: "web" })], { type: "application/json" }));
  } catch (_) {}
}
window.onerror = (message, source, lineno, colno, error) => {
  postClientError({ message: String(message), stack: error?.stack, source: `${source}:${lineno}:${colno}` });
};
window.onunhandledrejection = (event) => {
  postClientError({ message: String(event.reason?.message ?? event.reason), stack: event.reason?.stack, source: "unhandledrejection" });
};

const root = ReactDOM.createRoot(document.getElementById("root"));
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </GoogleOAuthProvider>
    </React.StrictMode>
  </Provider>
);
