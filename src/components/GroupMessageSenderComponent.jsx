import * as React from "react";
import { useState, useRef, useEffect } from "react";
import parrotEmojiIcon from "../assets/images/emojipickerparrot.jpg";
import parrotEmojiIconBlue from "../assets/images/emojipickerblueparrot.jpg";
import { parrotBlue } from "../styles/colors";
import { EMOJI_CATEGORIES, EMOJIS_BY_CATEGORY, EMOJI_NAMES } from "../constants/emojiData";

export function GroupMessageSenderComponent({ message, setMessage, handleSend, groupName, isDarkMode = false }) {
  const dark = isDarkMode;
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("smileys");
  const [emojiSearch, setEmojiSearch] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const emojiRef = useRef(null);

  useEffect(() => {
    if (!emojiOpen) return;
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) { setEmojiOpen(false); setEmojiSearch(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [emojiOpen]);

  return (
    <div style={containerStyle(dark)}>

      {/* Emoji button + panel */}
      <div style={{ position: "relative", flexShrink: 0 }} ref={emojiRef}>
        <button onClick={() => setEmojiOpen(o => !o)} style={emojiBtnStyle(dark, emojiOpen || inputFocused)}>
          <img src={emojiOpen || inputFocused ? parrotEmojiIconBlue : parrotEmojiIcon} alt="emoji" style={{ width: 50, height: 50, objectFit: "cover", opacity: emojiOpen || inputFocused ? (dark ? 0.35 : 1) : 0.2 }} />
        </button>
        {emojiOpen && (
          <div style={emojiPanelStyle(dark)}>
            <div style={searchWrapStyle}>
              <input
                style={searchInputStyle(dark)}
                placeholder="Search emoji..."
                value={emojiSearch}
                onChange={e => setEmojiSearch(e.target.value)}
                autoFocus
              />
            </div>
            {!emojiSearch && (
              <div style={categoryRowStyle}>
                {EMOJI_CATEGORIES.map(cat => (
                  <button key={cat.key} onClick={() => setEmojiCategory(cat.key)} style={categoryBtnStyle(emojiCategory === cat.key, dark)}>
                    {cat.icon}
                  </button>
                ))}
              </div>
            )}
            <div style={emojiGridStyle}>
              {(emojiSearch
                ? Object.values(EMOJIS_BY_CATEGORY).flat().filter(e => EMOJI_NAMES[e]?.includes(emojiSearch.toLowerCase()))
                : (EMOJIS_BY_CATEGORY[emojiCategory] || [])
              ).map((emoji, i) => (
                <button key={i} style={emojiItemStyle}
                  onClick={() => setMessage(prev => prev + emoji)}
                >{emoji}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
        <input
          style={{ ...inputStyle(dark), width: "100%", boxSizing: "border-box", border: (emojiOpen || inputFocused) ? "2px solid rgba(0,119,234,0.4)" : dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070" }}
          placeholder=""
          value={message}
          onChange={e => setMessage(e.target.value)}
          onFocus={() => { setEmojiOpen(false); setInputFocused(true); }}
          onBlur={() => setInputFocused(false)}
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
        />
        {!message && (
          <span style={{ position: "absolute", left: "1.2rem", pointerEvents: "none", fontSize: "1.2rem", color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "calc(100% - 2.4rem)" }}>
            Write a message to{" "}
            <span style={{ color: parrotBlue, fontWeight: 600 }}>{groupName ?? ""}</span>
          </span>
        )}
      </div>

      <button style={sendBtnStyle} onClick={handleSend}>Send</button>
    </div>
  );
}

const containerStyle = (dark) => ({
  display: "flex",
  gap: "0.8rem",
  padding: "0.8rem 1rem",
  borderTop: dark ? "1px solid #1a4a7a" : "1px solid #e0eaf5",
  backgroundColor: dark ? "#0a2745" : "#f9f5f1",
  alignItems: "center",
});

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

const searchWrapStyle = {
  padding: "0.5rem 0.6rem 0.3rem",
};

const searchInputStyle = (dark) => ({
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


const inputStyle = (dark) => ({
  flex: 1,
  padding: "0.6rem 1.2rem",
  borderRadius: "2rem",
  border: dark ? "1px solid #1a4a7a" : "1px solid #cce0f5",
  backgroundColor: dark ? "#011a32" : "white",
  color: dark ? "white" : "black",
  fontSize: "1.2rem",
  outline: "none",
});

const sendBtnStyle = {
  backgroundColor: parrotBlue,
  color: "white",
  border: "none",
  borderRadius: "2rem",
  padding: "0.6rem 1.6rem",
  cursor: "pointer",
  fontSize: "1.2rem",
  fontWeight: "600",
  flexShrink: 0,
};
