import React from "react";
import { parrotTextDarkBlue } from "../styles/colors";

export const UserTitleInputComponent = ({ userTitle, setUserTitle }) => {
  return (
    <input
      className="font-bold text-base custom-input"
      type="text"
      placeholder="Enter title"
      style={inputStyleTitle}
      value={userTitle}
      onChange={(e) => setUserTitle(e.target.value)}
    />
  );
};
const inputStyleTitle = {
  width: "30rem",
  padding: ".3rem",
  borderRadius: "1.5rem",
  paddingLeft: "1rem",
  textAlign: "left",
  cursor: "pointer",
  height: "3rem",
  fontSize: "1.3rem",
  color: parrotTextDarkBlue,
  backgroundColor: "#007bff21",
  marginTop: "0.2rem",
  marginBottom: "0.2rem",
};
