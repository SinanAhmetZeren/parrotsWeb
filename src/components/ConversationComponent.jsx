import "../assets/css/App.css";
import * as React from "react";
import { useEffect, useRef } from "react";
import { parrotBlue, parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotBlueSemiTransparent, parrotBlueTransparent, parrotDarkBlue } from "../styles/colors";
import parrotLogo from "../assets/images/parrotsiconpaddedtransparent.png";
import { use } from "react";
import { invokeHub, isHubReady } from "../signalr/signalRHub";

export function ConversationComponent({ currentUserId, messagesToDisplay, conversationUserId, isDarkMode = false
}) {
  const dark = isDarkMode;
  const messagesEndRef = useRef(null);

  // Notify server when entering/leaving conversation
  useEffect(() => {
    if (!conversationUserId || !currentUserId) return;

    // Enter conversation
    const enter = async () => {
      while (!isHubReady()) await new Promise(res => setTimeout(res, 50));
      invokeHub("EnterConversationPage", currentUserId, conversationUserId);
      console.log("--> entered conversation page:---", conversationUserId.slice(0, 5));
    };
    enter();

    // Cleanup function: leave conversation
    return () => {
      if (isHubReady()) {
        invokeHub("LeaveConversationPage", currentUserId);
        console.log("--> left conversation page:---", conversationUserId.slice(0, 5));
      }
    };
  }, [conversationUserId, currentUserId]);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messagesToDisplay]);

  return (
    <div style={messagesContainerStyle}>
      {messagesToDisplay?.length > 0 && messagesToDisplay?.map((message, index) => {
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
              <div style={dateSeparatorStyle}>
                <span style={dateSeparatorTextStyle(dark)}>{date}</span>
              </div>
            )}
            {isAskParrots ? (
              <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", marginBottom: 8, justifySelf: "start", textAlign: "left" }}>
                <img src={parrotLogo} alt="Ask Parrots" style={{ width: 36, height: 36, borderRadius: "50%", marginRight: 8, flexShrink: 0 }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 12, color: parrotBlue, fontWeight: 700, marginBottom: 2 }}>Ask Parrots</div>
                  <div style={{ backgroundColor: parrotBlue, color: "white", borderRadius: 8, padding: "8px 12px", maxWidth: 480, whiteSpace: "pre-wrap", fontSize: "1rem", textAlign: "left", fontWeight: "bold" }}>
                    {displayText}
                  </div>
                </div>
              </div>
            ) : isParrotsBid ? (
              <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", marginBottom: 8, justifySelf: "start", textAlign: "left" }}>
                <img src={parrotLogo} alt="Parrots" style={{ width: 36, height: 36, borderRadius: "50%", marginRight: 8, flexShrink: 0 }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 12, color: parrotBlue, fontWeight: 700, marginBottom: 2 }}>Parrots</div>
                  <div style={{ backgroundColor: parrotBlue, color: "white", borderRadius: "4rem", padding: "8px 12px", maxWidth: 480, whiteSpace: "pre-wrap", fontSize: "1rem", textAlign: "left", fontWeight: "bold" }}>
                    {displayText}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  ...containerStyle(dark),
                  justifySelf: isCurrentUser ? "end" : "start",
                }}
              >
                <div style={messageTextStyle}>
                  <div>{displayText}</div>
                </div>
                <div style={dateAndTimeContainerStyle}>
                  <span style={{ color: dark ? "rgba(255,255,255,0.6)" : parrotBlueDarkTransparent2 }}>
                    {time}
                  </span>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </div >
  );
}

const messageTextStyle = {
  textAlign: "justify",
  display: "flex",
  flexDirection: "column",
  wordBreak: "break-word",
  padding: ".5rem",
  borderRadius: "1rem",
  fontSize: "1rem",
  fontWeight: "bold",
};


const dateAndTimeContainerStyle = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  padding: "4px",
  borderRadius: "0.5rem",
  fontSize: "0.85rem",
  fontWeight: "bold",
};

const dateSeparatorStyle = {
  display: "flex",
  justifyContent: "center",
  margin: "0.8rem 0 0.4rem",
};

const dateSeparatorTextStyle = (dark) => ({
  backgroundColor: dark ? "rgba(0,119,234,0.08)" : "rgba(0,119,234,0.06)",
  color: "rgba(0,119,234,0.5)",
  borderRadius: "2rem",
  padding: "0.2rem 1rem",
  fontSize: "0.8rem",
  fontWeight: "bold",
});

const messagesContainerStyle = {
  display: "grid",
  gap: "4px",
  width: "100%",
  // backgroundColor: "red"
};

const containerStyle = (dark) => ({
  fontSize: "1rem",
  fontFamily: "Nunito, sans-serif",
  margin: "4px 10px",
  padding: "4px 10px",
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  gap: "0.6rem",
  borderRadius: "4rem",
  color: dark ? "rgba(255,255,255,0.85)" : "darkblue",
  maxWidth: "80%",
  wordBreak: "break-word",
  backgroundColor: dark ? "#0a2745" : "rgb(246, 246, 246)",
});



