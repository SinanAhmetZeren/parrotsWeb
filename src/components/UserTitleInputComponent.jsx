import React from "react";
import { parrotTextDarkBlue } from "../styles/colors";

export const UserTitleInputComponent = ({ userTitle, setUserTitle, isDarkMode = false }) => {
  const dark = isDarkMode;
  return (
    <input
      className="font-bold text-base custom-input"
      type="text"
      placeholder="Enter title (max 50 chars)"
      style={{
        ...inputStyleTitle,
        color: dark ? "rgba(255,255,255,0.9)" : parrotTextDarkBlue,
        backgroundColor: dark ? "#0a2240" : "#007bff21",
        border: dark ? "1px solid rgba(255,255,255,0.15)" : "none",
      }}
      value={userTitle}
      maxLength={50}
      onChange={(e) => setUserTitle(e.target.value)}
    />
  );
};
const inputStyleTitle = {
  width: "45rem",
  padding: ".3rem",
  borderRadius: "1.5rem",
  paddingLeft: "1rem",
  textAlign: "left",
  cursor: "pointer",
  height: "3rem",
  fontSize: "1.3rem",
  marginTop: "0.2rem",
  marginBottom: "0.2rem",
};
