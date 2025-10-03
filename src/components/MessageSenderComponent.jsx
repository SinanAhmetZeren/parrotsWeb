import "../assets/css/App.css";
import * as React from "react";

export function MessageSenderComponent({
  conversationUserId,
  currentUserId,
  message,
  setMessage,
  handleSendMessage,
  sendButtonDisabled,
  conversationUserUsername,
}) {
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div style={inputContainerStyle}>
      <textarea
        value={message}
        placeholder={`Write a message to ${conversationUserUsername}`}
        style={messageInputStyle}
        onInput={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // prevent new line
            handleSendMessage();
          }
        }}
      />
      <button
        disabled={sendButtonDisabled}
        onClick={() => handleSendMessage()}
        style={{
          ...sendButtonStyle,
          backgroundColor: sendButtonDisabled ? "gray" : "#007bff",
        }}
      >
        {" "}
        Send{" "}
      </button>
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
  color: "black",
  overflowY: "hidden",
  minHeight: "1rem",
  maxHeight: "10rem",
  resize: "none",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  marginRop: "1rem",
  borderRadius: "2rem",
  border: "2px solid #c0c0c070",
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
