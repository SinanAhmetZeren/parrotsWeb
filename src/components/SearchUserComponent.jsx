import "../assets/css/App.css";
import * as React from "react";
import { IoSearch } from "react-icons/io5";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { parrotRed } from "../styles/colors";

export function SearchUserComponent({ inputValue, setInputValue, onSearch, isLoading, isDarkMode = false, showSaved = false, onToggleSaved }) {
  const dark = isDarkMode;
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
          style={inputStyle(dark)}
          placeholder="Search for users..."
        />
        <div
          style={{ ...magnifierContainerStyle, cursor: isEnabled && !isLoading ? "pointer" : "default" }}
          onClick={isEnabled && !isLoading ? onSearch : undefined}
        >
          {isLoading ? (
            <div style={magnifierStyle(dark)}>
              <div style={spinnerStyle} />
            </div>
          ) : (
            <div style={magnifierStyle(dark)}>
              <IoSearch size="1.3rem" color={isEnabled ? "#3c9dde" : (dark ? "rgba(255,255,255,0.3)" : "#c0c0c0")} />
            </div>
          )}
        </div>
        <div
          style={{ ...magnifierContainerStyle, cursor: "pointer" }}
          onClick={onToggleSaved}
        >
          <div style={bookmarkButtonStyle(showSaved, dark)}>
            {showSaved
              ? <BsBookmarkFill size="1.1rem" />
              : <BsBookmark size="1.1rem" />
            }
          </div>
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

const magnifierStyle = (dark) => ({
  backgroundColor: dark ? "#0d2b4e" : "white",
  borderRadius: "50%",
  padding: ".2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "3rem",
  width: "3rem",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
});

const searchUserContainer = {
  display: "flex",
  flexDirection: "row",
  height: "5rem",
  width: "100%",
  color: "black",
};

const inputStyle = (dark) => ({
  width: "23rem",
  height: "3rem",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  marginLeft: "1rem",
  borderRadius: "2rem",
  fontSize: "1.3rem",
  color: dark ? "rgba(255,255,255,0.9)" : "black",
  backgroundColor: dark ? "#0d2b4e" : "white",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070",
});

const spinnerStyle = {
  width: "1.4rem",
  height: "1.4rem",
  border: "3px solid #c0c0c070",
  borderTop: "3px solid #3c9dde",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const bookmarkButtonStyle = (active, dark) => ({
  borderRadius: "50%",
  backgroundColor: dark ? "#0d2b4e" : "white",
  color: active ? parrotRed : (dark ? "rgba(255,255,255,0.3)" : "#c0c0c0"),
  width: "3rem",
  height: "3rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
  transition: "background-color 0.2s ease",
  flexShrink: 0,
});

const searchMainContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "93vh",
};
