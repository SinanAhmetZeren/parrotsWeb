import "../assets/css/App.css";
import * as React from "react";
import { useEffect, useRef } from "react";

export function ConversationComponent({ currentUserId, messagesToDisplay
}) {
  const messagesEndRef = useRef(null);

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
              ...containerStyle,
              justifySelf: isCurrentUser ? "end" : "start", // Align messages dynamically
            }}
          >
            <div style={messageTextStyle}>
              <div>{message.text}
              </div>
            </div>
            <div style={dateAndTimeContainerStyle}>
              <div>
                <span>
                  {time}
                </span>
              </div>
              <div>
                <span>
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
};

const containerStyle = {
  fontSize: "1rem",
  margin: "10px",
  padding: "10px",
  display: "grid",
  gridTemplateColumns: "3fr 10rem",
  borderRadius: "4rem",
  color: "darkblue",
  width: "auto",
  maxWidth: "80%",
  wordBreak: "break-word",
  backgroundColor: "rgb(246, 246, 246)",
};



