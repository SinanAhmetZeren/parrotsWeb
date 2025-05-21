import React from "react";

export const UserTitleInputComponent = ({ userTitle, setUserTitle }) => {
    return (
        <input
            className="font-bold text-base custom-input"
            type="text"
            placeholder="Title"
            style={inputStyleTitle}
            value={userTitle}
            onChange={(e) => setUserTitle(e.target.value)} />
    );
};
const inputStyleTitle = {
    width: "85%",
    padding: ".3rem",
    borderRadius: "1.5rem",
    textAlign: "center",
    cursor: "pointer",
    height: "3rem",
    fontSize: "1.5rem",
    color: "#007bff",
    backgroundColor: "#007bff21",
    marginTop: "0.2rem"
};
