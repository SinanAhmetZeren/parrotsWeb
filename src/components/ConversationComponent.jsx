import "../assets/css/App.css";
import * as React from "react";
import { useEffect, useRef } from "react";
import { parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotBlueSemiTransparent, parrotBlueTransparent, parrotDarkBlue } from "../styles/colors";
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
    if (isHubReady()) {
      invokeHub("EnterConversationPage", currentUserId, conversationUserId);
      console.log("--> entered conversation page:---", conversationUserId.slice(0, 5));
    }

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
        const isCurrentUser = message.senderId === currentUserId;
        return (
          <div
            key={index}
            style={{
              ...containerStyle(dark),
              justifySelf: isCurrentUser ? "end" : "start",
            }}
          >
            <div style={messageTextStyle}>
              <div>{message.text}
              </div>
            </div>
            <div style={dateAndTimeContainerStyle}>
              <div>
                <span style={{ color: dark ? "rgba(255,255,255,0.6)" : parrotBlueDarkTransparent2 }}>
                  {time}
                </span>
              </div>
              <div>
                <span style={{ color: dark ? "rgba(255,255,255,0.4)" : parrotBlueDarkTransparent }}>
                  {date}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div >
  );
}

const messageTextStyle = {
  textAlign: "justify",
  display: "flex",         //   Enables flex behavior
  flexDirection: "column", //   Keeps content in a column
  wordBreak: "break-word", //   Prevents overflow issues
  padding: ".5rem",
  borderRadius: "1rem",
  fontSize: "1.3rem",
};


const dateAndTimeContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: "4px",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  color: "rgb(60, 157, 222)",
  fontWeight: "bold"
};

const messagesContainerStyle = {
  display: "grid",
  gap: "10px",
  width: "100%",
  // backgroundColor: "red"
};

const containerStyle = (dark) => ({
  fontSize: "1rem",
  fontFamily: "Nunito, sans-serif",
  margin: "10px",
  padding: "10px",
  display: "grid",
  gridTemplateColumns: "3fr 10rem",
  borderRadius: "4rem",
  color: dark ? "rgba(255,255,255,0.85)" : "darkblue",
  width: "auto",
  maxWidth: "80%",
  wordBreak: "break-word",
  backgroundColor: dark ? "#0a2240" : "rgb(246, 246, 246)",
});



