
import { color } from "d3";
import "../assets/css/App.css";
import * as React from "react";
const apiUrl = process.env.REACT_APP_API_URL;
const userBaseUrl = `${apiUrl}/Uploads/UserImages/`;

export function MessagePreviewsComponent({ messagesData, userId }) {
  console.log("current userId: ", userId);
  console.log("messagesData ...: ", messagesData[0]);

  return (
    messagesData.map((message, index) => {
      const otherUserId = message.receiverId === userId ? message.senderId : message.receiverId;
      const otherUserUsername = message.receiverId === userId ? message.senderUsername : message.receiverUsername;
      const otherUserProfile = message.receiverId === userId ? message.senderProfileUrl : message.receiverProfileUrl;

      const dateObj = new Date(message.dateTime);
      const time = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      const date = dateObj.toLocaleDateString("en-GB");

      if (index === 0) {
        console.log("other user: ", otherUserId);
        console.log("other user: ", otherUserUsername);
        console.log("other user: ", otherUserProfile);
        console.log("message: ", message);
        console.log("------");
      }

      return (
        <div style={containerStyle}>
          <div style={userprofileimgContainer}>
            <img src={userBaseUrl + otherUserProfile} style={userprofileimg} alt="user" />
          </div>
          <div style={UsernameAndTextContainer}>
            <div>
              <span style={messageTextStyle}>{otherUserUsername}</span>
            </div>
            <div>
              <span style={messageTextStyle}>{message.text}</span>
            </div>
          </div>
          <div style={timestampContainer}>
            <div>
              <span style={messageTextStyle}>{time}</span>
            </div>
            <div>
              <span style={messageTextStyle}>{date}</span>
            </div>
          </div>

        </div>)
    })
  );
}

const userprofileimgContainer = {
  backgroundColor: "rgb(3, 246, 246)",
}

const UsernameAndTextContainer = {
  backgroundColor: "rgb(3, 324, 144)",
}

const timestampContainer = {
  backgroundColor: "rgb(113, 146, 246)",
}

const containerStyle = {
  fontSize: "1rem",
  backgroundColor: "rgb(246, 246, 246)",
  margin: "10px",
  padding: "10px",
  display: "flex",
  flexDirection: "row",
  borderRadius: "4rem",
}


const userprofileimg = {
  height: "4rem",
  width: "4rem",
  borderRadius: "50%",
  marginRight: "1rem",
}


const messageTextStyle = {
  fontSize: "1.3rem",
  textAlign: "left",
  color: "#3c9dde",
  color: "white"
}