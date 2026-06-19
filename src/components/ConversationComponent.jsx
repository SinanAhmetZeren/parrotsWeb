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
        return (
          <React.Fragment key={index}>
            {showDateSeparator && (
              <div style={dateSeparatorStyle}>
                <span style={dateSeparatorTextStyle(dark)}>{date}</span>
              </div>
            )}
            <div
              style={{
                ...containerStyle(dark),
                justifySelf: isCurrentUser ? "end" : "start",
              }}
            >
              <div style={messageTextStyle}>
                <div>{message.text}</div>
              </div>
              <div style={dateAndTimeContainerStyle}>
                <span style={{ color: dark ? "rgba(255,255,255,0.6)" : parrotBlueDarkTransparent2 }}>
                  {time}
                </span>
              </div>
            </div>
          </React.Fragment>
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
  fontSize: "1.15rem",
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



