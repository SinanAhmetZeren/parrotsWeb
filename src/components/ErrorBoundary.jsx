import React from "react";
import parrotsLogo from "../assets/images/ParrotsLogo.png";
import { parrotTextDarkBlue } from "../styles/colors";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("❌ ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={container}>
          <img src={parrotsLogo} alt="Parrots" style={image} />
          <h2 style={title}>Something went wrong</h2>
          <p style={sub}>Please refresh the page and try again.</p>
          <button style={btn} onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f9f9f9",
  textAlign: "center",
  padding: "2rem",
};
const image = { width: "12rem", height: "12rem", marginBottom: "1.5rem" };
const title = { fontSize: "1.5rem", color: parrotTextDarkBlue, margin: 0 };
const sub = { fontSize: "1rem", color: parrotTextDarkBlue, margin: "0.75rem 0 1.5rem" };
const btn = {
  padding: "0.6rem 1.8rem",
  fontSize: "1rem",
  backgroundColor: "#3c9dde",
  color: "white",
  border: "none",
  borderRadius: "2rem",
  cursor: "pointer",
};
