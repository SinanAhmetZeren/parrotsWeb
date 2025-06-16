import "../assets/css/App.css";
import * as React from "react";
import { IoSearch } from "react-icons/io5";

export function SearchUserComponent({ query, setQuery }) {
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div style={searchMainContainer}>
      <div style={searchUserContainer}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange} // Use the correct handler
          style={inputStyle} // Added styles for input
          placeholder="Search for users..."
        />
        <div style={magnifierContainerStyle}>
          <IoSearch style={magnifierStyle} />
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
  color: "#3c9dde",
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

const searchMainContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "93vh",
};
