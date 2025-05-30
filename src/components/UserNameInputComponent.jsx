import React from "react";
import { parrotTextDarkBlue } from "../styles/colors";

export const UserNameInputComponent = ({ userName, setUserName }) => {
  return (
    <input
      className="font-bold text-base custom-input"
      type="text"
      placeholder="Username"
      style={inputStyleUserName}
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />
  );
};
const inputStyleUserName = {
  width: "50%",
  padding: ".3rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  cursor: "pointer",
  height: "3rem",
  fontSize: "2rem",
  color: parrotTextDarkBlue,
  backgroundColor: "#007bff21",
};
