import "../assets/css/App.css";
import * as React from "react";
import parrotEmojiIcon from "../assets/images/emojipickerparrot.jpg";
import parrotEmojiIconBlue from "../assets/images/emojipickerblueparrot.jpg";
import { EMOJI_CATEGORIES, EMOJIS_BY_CATEGORY, EMOJI_NAMES } from "../constants/emojiData";

const blue = "#0A77EA";
const navy = "#0A2540";
const mid = "#5C6B7A";
const line = "#E3E9F0";
const tint = "#F4F7FB";

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

  const canSend = !sendButtonDisabled && message.trim() !== "" && !hideSendLabel;

  return (
    <div style={compStyle}>

      {/* Emoji / mark button */}
      <div style={{ position: "relative", flexShrink: 0 }} ref={emojiRef}>
        <button
          onClick={() => setEmojiOpen(o => !o)}
          style={{ ...markStyle, border: (emojiOpen || focused) ? `1.5px solid ${blue}` : "1.5px solid transparent", opacity: hideSendLabel ? 0.35 : 1, pointerEvents: hideSendLabel ? "none" : "auto" }}
          title=""
          disabled={hideSendLabel}
        >
          <img src={emojiOpen || focused ? parrotEmojiIconBlue : parrotEmojiIcon} alt="emoji" style={{ width: 22, height: 22, objectFit: "cover", opacity: emojiOpen || focused ? 1 : 0.5, borderRadius: "50%" }} />
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
                  <button key={cat.key} onClick={() => setEmojiCategory(cat.key)} style={categoryBtnStyle(emojiCategory === cat.key, dark)}>{cat.icon}</button>
                ))}
              </div>
            )}
            <div style={emojiGridStyle}>
              {(emojiSearch
                ? Object.values(EMOJIS_BY_CATEGORY).flat().filter(e => EMOJI_NAMES[e]?.includes(emojiSearch.toLowerCase()))
                : (EMOJIS_BY_CATEGORY[emojiCategory] || [])
              ).map((emoji, i) => (
                <button key={i} style={emojiItemStyle} onClick={() => setMessage(prev => prev + emoji)}>{emoji}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Text field */}
      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        {showLabel && (
          <div style={fldLabel} onClick={() => setFocused(true)}>
            Write a message to <b style={{ color: "#0A5FBF", fontWeight: 800 }}>{conversationUserUsername}</b>
          </div>
        )}
        <textarea
          value={message}
          placeholder=""
          style={{
            ...fldStyle,
            border: (emojiOpen || focused) ? `1.5px solid ${blue}` : "1.5px solid transparent",
            background: (emojiOpen || focused) ? "#fff" : tint,
            boxShadow: (emojiOpen || focused) ? "0 0 0 3px rgba(10,119,234,.1)" : "none",
            opacity: hideSendLabel ? 0.35 : 1,
          }}
          maxLength={500}
          disabled={!conversationUserId}
          onFocus={() => { setFocused(true); setEmojiOpen(false); }}
          onBlur={() => setFocused(false)}
          onInput={handleInputChange}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
        />
      </div>

      {/* Send button */}
      <button
        disabled={!canSend}
        onClick={handleSendMessage}
        style={{
          ...sendStyle,
          background: canSend ? blue : "#fff",
          borderColor: canSend ? blue : line,
          color: canSend ? "#fff" : mid,
          cursor: canSend ? "pointer" : "not-allowed",
          opacity: hideSendLabel ? 0.35 : 1,
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21 4L3 10l7 3 3 7z"/></svg>
        Send
      </button>
    </div>
  );
}

const compStyle = {
  display: "flex", alignItems: "center", gap: 11,
  padding: "13px 18px",
  background: "#FAFCFE",
  borderTop: `1px solid ${line}`,
  flexShrink: 0,
};

const markStyle = {
  width: 38, height: 38, borderRadius: "50%",
  background: tint,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0, cursor: "pointer",
};

const fldLabel = {
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  left: 14, right: 14,
  fontSize: 14, fontWeight: 600, color: mid,
  pointerEvents: "none", userSelect: "none",
  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
};

const fldStyle = {
  width: "100%",
  fontFamily: "Nunito, sans-serif",
  fontSize: 14, fontWeight: 600, color: navy,
  borderRadius: 10, padding: "11px 14px",
  minHeight: "1rem", maxHeight: "10rem",
  overflowY: "hidden", resize: "none",
  outline: "none",
  transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
};

const sendStyle = {
  fontFamily: "Nunito, sans-serif",
  display: "inline-flex", alignItems: "center", gap: 7,
  border: `1.5px solid ${line}`, background: "#fff",
  fontSize: 13.5, fontWeight: 800,
  padding: "11px 20px", borderRadius: 99,
  flexShrink: 0,
  transition: "background 0.15s, border-color 0.15s, color 0.15s",
};


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

