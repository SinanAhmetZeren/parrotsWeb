import "../assets/css/App.css";
import * as React from "react";
import { useState } from "react";

export function MessageSenderComponent({ conversationUserId, currentUserId }) {
  const [message, setMessage] = useState("");
  React.useEffect(() => {
    console.log("message: ", message);
  }, [message]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSendMessage = () => {
    console.log("sending message: ", message);
    console.log("from user: ", currentUserId);
    console.log("to user: ", conversationUserId);
    setMessage("");
  }

  return (
    <div style={inputContainerStyle}>
      <textarea
        value={message}
        placeholder="Write a message..."
        style={messageInputStyle}
        onInput={handleInputChange}
      />
      <button onClick={() => handleSendMessage()} style={sendButtonStyle}> Send </button>
    </div>
  );
}

const inputContainerStyle = {
  display: "grid",
  gridTemplateColumns: "85% 10%",
  gap: "1rem",
  alignItems: "center",
  width: "100%",
  padding: "1rem",
  backgroundColor: "#f0f0f0",
};

const messageInputStyle = {
  height: "4rem",
  width: "100%",
  padding: "1rem",
  fontSize: "1.3rem",
  border: "1px solid #ccc",
  color: "black",
  overflowY: "hidden", // Hide scrollbar initially
  minHeight: "1rem", // Set minimum height
  maxHeight: "10rem", // Optional: Limit maximum height (can be adjusted)
  resize: "none", // Disables the resize handle

  paddingLeft: "2rem",
  paddingRight: "2rem",
  marginRop: "1rem",
  borderRadius: "2rem",
  backgroundColor: "rgb(249, 245, 241)",

};

const sendButtonStyle = {
  width: "7rem",
  height: "4rem",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "2rem",
  cursor: "pointer",
};




