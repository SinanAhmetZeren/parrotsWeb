import React from "react";
import { parrotTextDarkBlue } from "../styles/colors";

export const UserNameInputComponent = ({ userName, setUserName }) => {
  return (
    <input
      className="font-bold text-base custom-input"
      type="text"
      placeholder="Enter username"
      style={inputStyleUserName}
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
  color: parrotTextDarkBlue,
  backgroundColor: "#007bff21",
};
