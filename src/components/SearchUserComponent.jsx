import "../assets/css/App.css";
import * as React from "react";
import { IoSearch } from "react-icons/io5";

export function SearchUserComponent({ inputValue, setInputValue, onSearch, isLoading }) {
  const isEnabled = inputValue.length >= 3;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && isEnabled) onSearch();
  };

  return (
    <div style={searchMainContainer}>
      <div style={searchUserContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          placeholder="Search for users..."
        />
        <div
          style={{ ...magnifierContainerStyle, cursor: isEnabled && !isLoading ? "pointer" : "default" }}
          onClick={isEnabled && !isLoading ? onSearch : undefined}
        >
          {isLoading ? (
            <div style={{ ...magnifierStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={spinnerStyle} />
            </div>
          ) : (
            <IoSearch style={{ ...magnifierStyle, color: isEnabled ? "#3c9dde" : "#c0c0c0" }} />
          )}
        </div>
      </div>
    </div>
  );
}

const magnifierContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: ".5rem",
};

const magnifierStyle = {
  // backgroundColor: "#f9f5f1",
  backgroundColor: "white",
  borderRadius: "50%",
  padding: ".2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "3rem",
  width: "3rem",
  border: "2px solid #c0c0c070",
};

const searchUserContainer = {
  display: "flex",
  flexDirection: "row",
  height: "5rem",
  width: "100%",
  color: "black",
};

const inputStyle = {
  width: "26rem",
  height: "3rem",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  marginLeft: "1rem",
  borderRadius: "2rem",
  fontSize: "1.3rem",
  border: "2px solid #c0c0c070",
};

const spinnerStyle = {
  width: "1.4rem",
  height: "1.4rem",
  border: "3px solid #c0c0c070",
  borderTop: "3px solid #3c9dde",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const searchMainContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "93vh",
};
