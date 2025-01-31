
import "../assets/css/App.css";
import * as React from "react";

const apiUrl = process.env.REACT_APP_API_URL;
const userBaseUrl = `${apiUrl}/Uploads/UserImages/`;

export function MessagePreviewsComponent({
  messagesData,
  userId,
  setConversationUserId,
  setConversationUserUsername,
  handleGoToUser
}) {

  const [hoveredUserImgID, setHoveredUserImgID] = React.useState("")
  const sortedMessages = [...messagesData].sort(
    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  );

  return (
    sortedMessages.map((message, index) => {
      const otherUserUserId = message.receiverId === userId ? message.senderId : message.receiverId;
      const otherUserUsername = message.receiverId === userId ? message.senderUsername : message.receiverUsername;
      const otherUserProfile = message.receiverId === userId ? message.senderProfileUrl : message.receiverProfileUrl;

      const dateObj = new Date(message.dateTime);
      const time = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      const date = dateObj.toLocaleDateString("en-GB");

      const setUserDetails = () => {
        setConversationUserId(otherUserUserId);
        setConversationUserUsername(otherUserUsername)
      }

      return (
        <div key={index} style={containerStyle} title={message.text} onClick={() => setUserDetails()}>
          <div style={userprofileimgContainer} title={"Go to profile"} onClick={() => {
            console.log("going to other user: ", otherUserUserId);
            handleGoToUser(otherUserUserId)
          }
          }>
            <img
              src={userBaseUrl + otherUserProfile}
              style={{ ...userprofileimg, ...((hoveredUserImgID === otherUserUserId) ? userprofileimgHover : {}) }}
              alt="user"
              onMouseEnter={() => {
                console.log("otheruser: ", otherUserUsername)
                setHoveredUserImgID(otherUserUserId)
              }}
              onMouseLeave={() => setHoveredUserImgID("")}
            />
          </div>
          <div style={UsernameAndTextContainer}>
            <div>
              <span style={messageUsernameStyle}>{otherUserUsername}</span>
            </div>
            <div>
              <span style={messageTextStyle}>{message.text}</span>
            </div>
          </div>
          <div style={timestampContainer}>
            <div>
              <span style={messageTimeStyle}>{time}</span>
            </div>
            <div>
              <span style={messageTimeStyle}>{date}</span>
            </div>
          </div>

        </div>)
    })
  );
}


const userprofileimg = {
  height: "4rem",
  width: "4rem",
  borderRadius: "50%",
  marginRight: "1rem",
  transition: "transform 0.3s ease-in-out", // Smooth transition
}

const userprofileimgHover = {
  transform: "scale(1.2)", // Enlarge on hover
};

const containerStyle = {
  fontSize: "1rem",
  backgroundColor: "rgb(246, 246, 246)",
  margin: "10px",
  padding: "10px",
  display: "grid",
  gridTemplateColumns: "1fr 3fr 1.5fr",
  alignItems: "center",
  borderRadius: "4rem",
  cursor: "pointer"
};

const userprofileimgContainer = {
  cursor: "pointer"

}

const UsernameAndTextContainer = {
}

const timestampContainer = {
}



const messageTextStyle = {
  fontSize: "1.3rem",
  textAlign: "left",
  color: "#3c9dde",
  color: "darkblue",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 1,
  textOverflow: "ellipsis",
}



const messageUsernameStyle = {
  fontSize: "1.3rem",
  textAlign: "left",
  color: "#3c9dde",
  fontWeight: "bold",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 1,
  textOverflow: "ellipsis",
}


const messageTimeStyle = {
  fontSize: "1.1rem",
  textAlign: "left",
  color: "#3c9dde",
  fontWeight: "600",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 1,
  textOverflow: "ellipsis",
}