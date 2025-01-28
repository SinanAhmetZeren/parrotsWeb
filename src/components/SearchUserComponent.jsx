
import { color } from "d3";
import "../assets/css/App.css";
import * as React from "react";

export function SearchUserComponent({ query, setQuery }) {

  console.log("query ...: ", query);
  const handleInputChange = (event) => {
    setQuery(event.target.value); // Properly set the query value
    console.log(event.target.value);
  };

  return (
    <>
      <div style={searchUserContainer}>
        <span>Search User</span>
        <input
          type="text"
          value={query}
          onChange={handleInputChange} // Use the correct handler
          style={inputStyle} // Added styles for input
        />
      </div>
      <div>
        <RenderSearchResults />
      </div>
    </>

  );
}

function RenderSearchResults() {
  console.log("RenderSearchResults ...");
}


const searchUserContainer = {
  height: "6rem",
  width: "100%",
  color: "blue",
  backgroundColor: "lightblue"

}

const inputStyle = {
  color: "blue",
  width: "28rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
}





