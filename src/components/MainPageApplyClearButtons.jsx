import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { useState, useRef, useEffect } from "react";
import { enUS } from "react-date-range/dist/locale"; // Import locale
import "../assets/css/date-range-custom.css";

export const MainPageApplyClearButtons = () => {
  const buttonStyle = {
    width: "50%", // Match the input width
    padding: "0.1rem",
    borderRadius: "1.5rem",
    textAlign: "center",
    color: "white",

    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    border: "none",
    boxShadow: `
        0 4px 6px rgba(0, 0, 0, 0.3),
        inset 0 -4px 6px rgba(0, 0, 0, 0.3)
      `,
    transition: "box-shadow 0.2s ease",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  return (
    <div
      style={{
        display: "flex", // Flexbox to place inputs side by side
        gap: ".5rem", // Gap between the two inputs
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        cursor: "pointer",
        width: "100%",
        paddingTop: "0.2rem",
      }}
    >
      <button
        onClick={() => {
          console.log("clear");
        }}
        style={{ ...buttonStyle, backgroundColor: "green" }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          console.log("apply");
        }}
        style={{ ...buttonStyle, backgroundColor: "#007bff" }}
      >
        Apply
      </button>
    </div>
  );
};
