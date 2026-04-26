import "../assets/css/App.css";
import * as React from "react";
import { parrotBlue, parrotCream } from "../styles/colors";

export function MessageSenderComponent({
  conversationUserId,
  currentUserId,
  message,
  setMessage,
  handleSendMessage,
  sendButtonDisabled,
  conversationUserUsername,
  isDarkMode = false,
  placeholder,
  hideSendLabel = false,
}) {
  const dark = isDarkMode;
  const [focused, setFocused] = React.useState(false);
  const showLabel = !hideSendLabel && conversationUserUsername && !focused && !message;

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div style={inputContainerStyle(dark)}>
      <div style={textareaWrapperStyle}>
        {showLabel && (
          <div style={labelStyle(dark)} onClick={() => setFocused(true)}>
            Write a message to <span style={{ color: parrotBlue, fontWeight: "bold" }}>{conversationUserUsername}</span>
          </div>
        )}
        <textarea
          value={message}
          placeholder=""
          style={{ ...messageInputStyle(dark), opacity: hideSendLabel ? 0.2 : 1 }}
          maxLength={500}
          disabled={!conversationUserId}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
      </div>
      <button
        disabled={sendButtonDisabled || message.trim() === ""}
        onClick={() => handleSendMessage()}
        style={{
          ...sendButtonStyle,
          backgroundColor: hideSendLabel
            ? (dark ? "#0d2b4e" : "white")
            : (sendButtonDisabled || message.trim() === "") ? "gray" : "#007bff",
          border: hideSendLabel
            ? (dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070")
            : "none",
          opacity: hideSendLabel ? 0.2 : 1,
        }}
      >
        {hideSendLabel ? "" : "Send"}
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
  backgroundColor: dark ? "rgba(10,34,64,0.8)" : parrotCream,
});

const textareaWrapperStyle = {
  position: "relative",
  width: "100%",
};

const labelStyle = (dark) => ({
  position: "absolute",
  top: "40%",
  transform: "translateY(-50%)",
  left: "2rem",
  fontSize: "1.3rem",
  color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
  pointerEvents: "none",
  userSelect: "none",
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
  alignSelf: "flex-end",
  marginBottom: "1rem",
};
