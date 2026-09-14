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
        color: dark ? "rgba(255,255,255,0.9)" : "#0A2540",
        backgroundColor: dark ? "#0a2240" : "#fff",
        border: dark ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid rgba(160,175,190,.3)",
      }}
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />
  );
};
const inputStyleUserName = {
  width: "100%",
  padding: "9px 14px",
  borderRadius: 10,
  textAlign: "left",
  cursor: "text",
  height: "2.6rem",
  fontSize: "0.95rem",
  fontFamily: "Nunito, sans-serif",
  fontWeight: 700,
  outline: "none",
  transition: "border-color 0.15s",
};
