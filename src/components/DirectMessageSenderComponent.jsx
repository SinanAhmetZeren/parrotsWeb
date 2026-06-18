import "../assets/css/App.css";
import * as React from "react";
import parrotEmojiIcon from "../assets/images/emojipickerparrot.jpg";
import parrotEmojiIconBlue from "../assets/images/emojipickerblueparrot.jpg";
import { parrotBlue, parrotCream } from "../styles/colors";
import { EMOJI_CATEGORIES, EMOJIS_BY_CATEGORY, EMOJI_NAMES } from "../constants/emojiData";

export function DirectMessageSenderComponent({
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
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const [emojiCategory, setEmojiCategory] = React.useState("smileys");
  const [emojiSearch, setEmojiSearch] = React.useState("");
  const emojiRef = React.useRef(null);
  const showLabel = !hideSendLabel && conversationUserUsername && !focused && !message;

  React.useEffect(() => {
    if (!emojiOpen) return;
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) { setEmojiOpen(false); setEmojiSearch(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [emojiOpen]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div style={inputContainerStyle(dark)}>

      {/* Emoji button + panel */}
      <div style={{ position: "relative", flexShrink: 0 }} ref={emojiRef}>
        <button
          onClick={() => setEmojiOpen(o => !o)}
          style={{ ...emojiBtnStyle(dark, emojiOpen || focused), opacity: hideSendLabel ? 0.2 : 1, pointerEvents: hideSendLabel ? "none" : "auto" }}
          title=""
          disabled={hideSendLabel}
        >
          <img src={emojiOpen || focused ? parrotEmojiIconBlue : parrotEmojiIcon} alt="emoji" style={{ width: 50, height: 50, objectFit: "cover", opacity: emojiOpen || focused ? (dark ? 0.35 : 1) : 0.2 }} />
        </button>
        {emojiOpen && (
          <div style={emojiPanelStyle(dark)}>
            <div style={emojiSearchWrapStyle}>
              <input
                style={emojiSearchInputStyle(dark)}
                placeholder="Search emoji..."
                value={emojiSearch}
                onChange={e => setEmojiSearch(e.target.value)}
                autoFocus
              />
            </div>
            {!emojiSearch && (
              <div style={categoryRowStyle}>
                {EMOJI_CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setEmojiCategory(cat.key)}
                    style={categoryBtnStyle(emojiCategory === cat.key, dark)}
                  >{cat.icon}</button>
                ))}
              </div>
            )}
            <div style={emojiGridStyle}>
              {(emojiSearch
                ? Object.values(EMOJIS_BY_CATEGORY).flat().filter(e => EMOJI_NAMES[e]?.includes(emojiSearch.toLowerCase()))
                : (EMOJIS_BY_CATEGORY[emojiCategory] || [])
              ).map((emoji, i) => (
                <button
                  key={i}
                  style={emojiItemStyle}
                  onClick={() => setMessage(prev => prev + emoji)}
                >{emoji}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Text input */}
      <div style={{ ...textareaWrapperStyle, position: "relative", flex: 1 }}>
        {showLabel && (
          <div style={labelStyle(dark)} onClick={() => setFocused(true)}>
            Write a message to <span style={{ color: parrotBlue, fontWeight: "bold" }}>{conversationUserUsername}</span>
          </div>
        )}
        <textarea
          value={message}
          placeholder=""
          style={{ ...messageInputStyle(dark), opacity: hideSendLabel ? 0.2 : 1, border: (emojiOpen || focused) ? "2px solid rgba(0,119,234,0.4)" : dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070" }}
          maxLength={500}
          disabled={!conversationUserId}
          onFocus={() => { setFocused(true); setEmojiOpen(false); }}
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

      {/* Send button */}
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
  display: "flex",
  flexDirection: "row",
  gap: "0.6rem",
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
  transform: "translateY(-30%)",
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
  flexShrink: 0,
};

const emojiBtnStyle = (dark, active) => ({
  background: "none",
  border: active ? "2px solid rgba(0,119,234,0.4)" : dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070",
  cursor: "pointer",
  padding: 0,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  overflow: "hidden",
  flexShrink: 0,
});

const emojiPanelStyle = (dark) => ({
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: 0,
  width: "40rem",
  height: "30rem",
  display: "flex",
  flexDirection: "column",
  backgroundColor: dark ? "#0a2745" : "white",
  border: dark ? "1px solid #1a4a7a" : "1px solid #dde8f5",
  borderRadius: "1rem",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  zIndex: 999,
  overflow: "hidden",
});

const emojiSearchWrapStyle = {
  padding: "0.5rem 0.6rem 0.3rem",
};

const emojiSearchInputStyle = (dark) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "0.4rem 0.9rem",
  borderRadius: "2rem",
  border: dark ? "1px solid #1a4a7a" : "1px solid #cce0f5",
  backgroundColor: dark ? "#011a32" : "#f5f8ff",
  color: dark ? "white" : "black",
  fontSize: "1.1rem",
  outline: "none",
});

const categoryRowStyle = {
  display: "flex",
  overflowX: "auto",
  padding: "0.4rem 0.4rem 0",
  gap: "0.1rem",
  scrollbarWidth: "none",
};

const categoryBtnStyle = (active, dark) => ({
  background: active ? (dark ? "#1a4a7a" : "#e8f0fe") : "none",
  border: "none",
  borderRadius: "0.5rem",
  fontSize: "1.625rem",
  cursor: "pointer",
  padding: "0.25rem 0.4rem",
  flexShrink: 0,
});

const emojiGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  padding: "0.4rem",
  flex: 1,
  overflowY: "auto",
  alignContent: "flex-start",
  gap: "0.1rem",
};

const emojiItemStyle = {
  background: "none",
  border: "none",
  fontSize: "2.5rem",
  cursor: "pointer",
  padding: "0.15rem",
  borderRadius: "0.4rem",
  lineHeight: 1,
};

