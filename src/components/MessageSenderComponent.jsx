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
  isDarkMode = false,
}) {
  const dark = isDarkMode;
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // console.log("--> message: ", message);
  // console.log("--> sendbuttondisabled: ", sendButtonDisabled);

  return (
    <div style={inputContainerStyle(dark)}>
      <textarea
        value={message}
        placeholder={`Write a message to ${conversationUserUsername}`}
        style={messageInputStyle(dark)}
        maxLength={500}
        onInput={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // prevent new line
            handleSendMessage();
          }
        }}
      />
      <button
        disabled={sendButtonDisabled || message.trim() === ""}
        onClick={() => handleSendMessage()}
        style={{
          ...sendButtonStyle,
          backgroundColor: sendButtonDisabled || message.trim() === "" ? "gray" : "#007bff",
        }}
      >
        {" "}
        Send{" "}
      </button>
    </div>
  );
}

const inputContainerStyle = (dark) => ({
  display: "grid",
  gridTemplateColumns: "85% 10%",
  gap: "1rem",
  alignItems: "center",
  width: "100%",
  padding: "1rem",
  backgroundColor: dark ? "#0a2240" : "#f0f0f0",
});

const messageInputStyle = (dark) => ({
  height: "4rem",
  width: "100%",
  padding: "1rem",
  fontSize: "1.3rem",
  color: dark ? "rgba(255,255,255,0.9)" : "black",
  backgroundColor: dark ? "#0d2b4e" : "white",
  overflowY: "hidden",
  minHeight: "1rem",
  maxHeight: "10rem",
  resize: "none",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  marginRop: "1rem",
  borderRadius: "2rem",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070",
});

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
