import { color } from "d3";
import "../assets/css/App.css";
import * as React from "react";
import { FaFontAwesome } from "react-icons/fa";
const apiUrl = process.env.REACT_APP_API_URL;
const userBaseUrl = `${apiUrl}/Uploads/UserImages/`;

export function ConversationComponent({ conversationData, currentUserId,
  currentUserUsername,
  currentUserProfileImg,
  conversationUserId,
  conversationUserProfileImg,
  conversationUserUsername }) {

  return (
    <div style={messagesContainerStyle}>
      {conversationData?.data.map((message, index) => {
        console.log("conversation message 0: ", message);

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
  gridTemplateColumns: "3fr 1fr",
  borderRadius: "4rem",
  color: "darkblue",
  width: "auto",
  maxWidth: "80%",
  wordBreak: "break-word",
  backgroundColor: "rgb(246, 246, 246)",
};



