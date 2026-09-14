import "../assets/css/App.css";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { parrotRed } from "../styles/colors";

export function SearchUserComponent({ inputValue, setInputValue, onSearch, isLoading, isDarkMode = false, showSaved = false, onToggleSaved, onCreateGroup, hideSearch = false }) {
  const dark = isDarkMode;
  const isEnabled = inputValue.length >= 3;
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const groupInputRef = useRef(null);

  useEffect(() => {
    if (showCreate && groupInputRef.current) groupInputRef.current.focus();
  }, [showCreate]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && isEnabled) onSearch();
  };

  const handleToggleCreate = () => {
    setShowCreate(s => !s);
    setGroupName("");
  };

  const handleCreate = () => {
    if (!groupName.trim()) return;
    onCreateGroup(groupName.trim());
    setGroupName("");
    setShowCreate(false);
  };

  return (
    <div style={searchMainContainer}>
      <div style={searchUserContainer}>
        {/* Always-visible search row */}
        {!hideSearch && <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ ...inputStyle(dark), opacity: showCreate ? 0 : 1 }}
          placeholder="Search for users..."
        />}
        {!hideSearch && <button
          style={searchBtnStyle(isEnabled)}
          disabled={!isEnabled || isLoading}
          onClick={isEnabled && !isLoading ? onSearch : undefined}
        >
          {isLoading ? <div style={spinnerStyle} /> : "Search"}
        </button>}
        {!hideSearch && onToggleSaved && <div className="nav-icon-wrapper"
          style={{ ...magnifierContainerStyle, cursor: "pointer", opacity: showCreate ? 0 : 1 }}
          onClick={onToggleSaved}
        >
          <div style={bookmarkButtonStyle(showSaved, dark)}>
            {showSaved
              ? <BsBookmarkFill size="1.1rem" />
              : <BsBookmark size="1.1rem" />
            }
          </div>
          <span className="nav-tooltip tooltip-up">{showSaved ? "Hide saved" : "Show saved"}</span>
        </div>}

        {/* +/× button — always in same position */}
        {onCreateGroup && (
          <div className="nav-icon-wrapper"
            style={{ ...magnifierContainerStyle, cursor: "pointer" }}
            onClick={handleToggleCreate}
          >
            <div style={createGroupButtonStyle(dark, showCreate)}>
              <span style={{ fontSize: "1.6rem", lineHeight: 1, fontWeight: "300" }}>{showCreate ? "×" : "+"}</span>
            </div>
            <span className="nav-tooltip tooltip-up">{showCreate ? "Cancel" : "Create group"}</span>
          </div>
        )}

        {/* Create overlay — sits on top of input + 2 icon buttons */}
        {showCreate && (
          <div style={createOverlay(dark)}>
            <input
              ref={groupInputRef}
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreate(); }}
              style={inputStyle(dark)}
              placeholder="Group name..."
              maxLength={30}
            />
            <button style={createSubmitBtn(dark)} onClick={handleCreate}>Create</button>
          </div>
        )}
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

const magnifierStyle = (dark) => ({
  backgroundColor: dark ? "#0d2b4e" : "white",
  borderRadius: "50%",
  padding: ".2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "3rem",
  width: "3rem",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid rgba(0, 119, 234, 0.25)",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
});

const searchUserContainer = {
  display: "flex",
  flexDirection: "row",
  height: "5rem",
  width: "100%",
  color: "black",
  position: "relative",
};

const inputStyle = (dark) => ({
  flex: 1,
  height: "3rem",
  paddingLeft: "1.2rem",
  paddingRight: "1.2rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  marginLeft: "1rem",
  borderRadius: "2rem",
  fontSize: "1.2rem",
  color: dark ? "rgba(255,255,255,0.9)" : "black",
  backgroundColor: dark ? "#0d2b4e" : "white",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid rgba(0, 119, 234, 0.25)",
  outline: "none",
});

const spinnerStyle = {
  width: "1.4rem",
  height: "1.4rem",
  border: "3px solid #c0c0c070",
  borderTop: "3px solid #3c9dde",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const bookmarkButtonStyle = (active, dark) => ({
  borderRadius: "50%",
  backgroundColor: dark ? "#0d2b4e" : "white",
  color: active ? parrotRed : (dark ? "rgba(255,255,255,0.3)" : "#c0c0c0"),
  width: "3rem",
  height: "3rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid rgba(0, 119, 234, 0.25)",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
  transition: "background-color 0.2s ease",
  flexShrink: 0,
});

const createGroupButtonStyle = (dark, active) => ({
  borderRadius: "50%",
  backgroundColor: active ? "#3c9dde" : (dark ? "#0d2b4e" : "white"),
  color: active ? "white" : (dark ? "rgba(255,255,255,0.7)" : "#3c9dde"),
  width: "3rem",
  height: "3rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid rgba(0, 119, 234, 0.25)",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
  flexShrink: 0,
});

const groupNameInputStyle = (dark) => ({
  flex: 1,
  height: "3rem",
  paddingLeft: "1.2rem",
  paddingRight: "1.2rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  marginLeft: "1rem",
  borderRadius: "2rem",
  fontSize: "1.3rem",
  color: dark ? "rgba(255,255,255,0.9)" : "black",
  backgroundColor: dark ? "#0d2b4e" : "white",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid rgba(0, 119, 234, 0.25)",
  outline: "none",
});

const searchBtnStyle = (enabled) => ({
  height: "3rem",
  minWidth: "6rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  marginLeft: "0.5rem",
  marginRight: "1rem",
  paddingLeft: "1.2rem",
  paddingRight: "1.2rem",
  borderRadius: "2rem",
  fontSize: "1.2rem",
  fontWeight: "600",
  backgroundColor: enabled ? "#0077ea" : "rgba(0, 119, 234, 0.25)",
  color: "white",
  border: "none",
  cursor: enabled ? "pointer" : "default",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const createSubmitBtn = (dark) => ({
  height: "3rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  marginLeft: "0.5rem",
  paddingLeft: "1.2rem",
  paddingRight: "1.2rem",
  borderRadius: "2rem",
  fontSize: "1.2rem",
  fontWeight: "600",
  backgroundColor: "#3c9dde",
  color: "white",
  border: "none",
  cursor: "pointer",
  flexShrink: 0,
});

const createOverlay = (dark) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: "4rem",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  zIndex: 10,
});

const searchMainContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
};
