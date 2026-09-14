import * as React from "react";

const blue = "#0A77EA";

export function SearchUserComponent({ inputValue, setInputValue, onSearch, isLoading, isDarkMode = false }) {
  const isEnabled = inputValue.length >= 3;

  return (
    <div style={srch}>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && isEnabled) onSearch(); }}
        style={srchInput}
        placeholder="Search people…"
      />
      <button
        style={{ ...srchBtn, opacity: isEnabled ? 1 : 0.55, cursor: isEnabled ? "pointer" : "default" }}
        disabled={!isEnabled || isLoading}
        onClick={() => isEnabled && !isLoading && onSearch()}
      >
        {isLoading ? <span style={spinner} /> : "Search"}
      </button>
    </div>
  );
}

const srch = { display: "flex", alignItems: "center", gap: 8, width: "100%" };

const srchInput = {
  flex: 1, minWidth: 0,
  fontFamily: "Nunito, sans-serif",
  fontSize: 13.5, fontWeight: 700, color: "#0A2540",
  background: "#F4F7FB", border: "1.5px solid transparent",
  borderRadius: 8, padding: "9px 11px", outline: "none",
};

const srchBtn = {
  fontFamily: "Nunito, sans-serif",
  border: "none", background: blue, color: "#fff",
  fontSize: 13.5, fontWeight: 800,
  padding: "10px 18px", borderRadius: 99,
  flexShrink: 0,
};

const spinner = {
  display: "inline-block",
  width: 14, height: 14,
  border: "2px solid rgba(255,255,255,0.4)",
  borderTop: "2px solid #fff",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};
