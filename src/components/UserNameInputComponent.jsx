import React from "react";
import { parrotTextDarkBlue } from "../styles/colors";

export const UserNameInputComponent = ({ userName, setUserName, isDarkMode = false }) => {
  const dark = isDarkMode;
  return (
    <input
      className="font-bold text-base custom-input"
      type="text"
      placeholder="Enter username (3-25 chars)"
      maxLength={25}
      style={{
        ...inputStyleUserName,
        color: dark ? "rgba(255,255,255,0.9)" : parrotTextDarkBlue,
        backgroundColor: dark ? "#0a2240" : "#007bff21",
        border: dark ? "1px solid rgba(255,255,255,0.15)" : "none",
      }}
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />
  );
};
const inputStyleUserName = {
  width: "30rem",
  padding: ".3rem",
  borderRadius: "1.5rem",
  paddingLeft: "1rem",
  textAlign: "left",
  cursor: "pointer",
  height: "3rem",
  fontSize: "1.5rem",
};
