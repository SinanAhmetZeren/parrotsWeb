import "../assets/css/App.css";
import * as React from "react";
import { useEffect, useRef } from "react";
import parrotLogo from "../assets/images/parrotsiconpaddedtransparent.png";
import { invokeHub, isHubReady } from "../signalr/signalRHub";

const mid = "#5C6B7A";
const tint = "#F4F7FB";
const line = "#E3E9F0";

export function ConversationComponent({ currentUserId, messagesToDisplay, conversationUserId, isDarkMode = false }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversationUserId || !currentUserId) return;
    const enter = async () => {
      while (!isHubReady()) await new Promise(res => setTimeout(res, 50));
      invokeHub("EnterConversationPage", currentUserId, conversationUserId);
      console.log("--> entered conversation page:---", conversationUserId.slice(0, 5));
    };
    enter();
    return () => {
      if (isHubReady()) {
        invokeHub("LeaveConversationPage", currentUserId);
        console.log("--> left conversation page:---", conversationUserId.slice(0, 5));
      }
    };
  }, [conversationUserId, currentUserId]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  }, [messagesToDisplay]);

  return (
    <div style={msgsContainer}>
      {messagesToDisplay?.length > 0 && messagesToDisplay.map((message, index) => {
        const dateObj = new Date(message.dateTime);
        const time = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        const date = dateObj.toLocaleDateString("en-GB");
        const prevDate = index > 0 ? new Date(messagesToDisplay[index - 1].dateTime).toLocaleDateString("en-GB") : null;
        const showDateSeparator = date !== prevDate;
        const isCurrentUser = message.senderId === currentUserId;
        const isAskParrots = isCurrentUser && message.text?.startsWith("**🦜**");
        const isParrotsBid = message.text?.startsWith("[parrots-bid]");
        const displayText = isAskParrots
          ? message.text.replace(/^\*\*🦜\*\*\s*/, "")
          : isParrotsBid
            ? message.text.replace(/^\[parrots-bid\]\s*/, "")
            : message.text;

        return (
          <React.Fragment key={index}>
            {showDateSeparator && (
              <span style={daySep}>{date}</span>
            )}
            {isAskParrots || isParrotsBid ? (
              <div style={mSys}>
                <span style={mAvSys}>
                  <img src={parrotLogo} alt="Parrots" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </span>
                <span style={sysw}>
                  <span style={sysn}>{isAskParrots ? "Ask Parrots" : "Parrots"}</span>
                  <span style={bubSys}>
                    <span style={bubTx}>{displayText}</span>
                  </span>
                </span>
              </div>
            ) : (
              <div style={{ ...mWrap, alignSelf: isCurrentUser ? "flex-end" : "flex-start", flexDirection: isCurrentUser ? "row-reverse" : "row" }}>
                <span style={{ ...bub, background: isCurrentUser ? "#E6EFFB" : tint }}>
                  <span style={{ ...bubTx, color: isCurrentUser ? "#0A2540" : "#0A2540" }}>{displayText}</span>
                  <span style={{ ...bubTm, color: isCurrentUser ? "#4A6C93" : mid }}>{time}</span>
                </span>
              </div>
            )}
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

const msgsContainer = {
  display: "flex", flexDirection: "column", gap: 10,
  width: "100%", padding: "16px 20px 20px",
};

const daySep = {
  alignSelf: "center",
  background: tint, color: mid,
  fontSize: 10, fontWeight: 800,
  letterSpacing: "0.1em", textTransform: "uppercase",
  padding: "5px 13px", borderRadius: 99,
};

const mWrap = {
  display: "flex", alignItems: "flex-end", gap: 9, maxWidth: "72%",
};

const bub = {
  borderRadius: 14, padding: "10px 14px",
  display: "flex", alignItems: "baseline", gap: 11, minWidth: 0,
};

const bubTx = {
  fontSize: 14, fontWeight: 600, lineHeight: 1.45, wordBreak: "break-word",
};

const bubTm = {
  fontSize: 11, fontWeight: 700, flexShrink: 0,
};

const mSys = {
  display: "flex", alignItems: "flex-start", gap: 9, maxWidth: "78%",
};

const mAvSys = {
  width: 32, height: 32, borderRadius: "50%",
  overflow: "hidden", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
};

const sysw = {
  display: "flex", flexDirection: "column", gap: 4, minWidth: 0,
};

const sysn = {
  fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
  textTransform: "uppercase", color: mid,
};

const bubSys = {
  background: "#FAFCFE", border: `1.5px solid ${line}`,
  borderRadius: 14, padding: "10px 14px",
  display: "flex", alignItems: "baseline", gap: 11, minWidth: 0,
};
