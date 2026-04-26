
import "../assets/css/App.css";
import * as React from "react";
import { useParams } from "react-router-dom";
import { parrotBlueDarkTransparent, parrotBlueDarkTransparent2 } from "../styles/colors";


const userBaseUrl = `  `;

export function MessagePreviewsComponent({
  messagesData,
  userId,
  // selectedUserId,
  setConversationUserId,
  setConversationUserUsername,
  handleGoToUser,
  isDarkMode = false,
}) {
  const dark = isDarkMode;
  const { conversationUserId: selectedUserId } = useParams();

  const [hoveredUserImgID, setHoveredUserImgID] = React.useState("")
  const [selectedConversationUserId, setSelectedConversationUserId] = React.useState(selectedUserId);
  if (!messagesData || messagesData.length === 0) {
    return <p
      style={{
        color: "#3c9dde66",
        fontSize: "1.5rem",
        fontWeight: "500"
      }}
      className="text-gray-500 text-center p-4">No messages yet</p>;
  }


  const sortedMessages = [...messagesData].sort(
    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  );

  return (
    sortedMessages.map((message, index) => {
      const otherUserUserId = message.receiverId === userId ? message.senderId : message.receiverId;
      const otherUserUsername = message.receiverId === userId ? message.senderUsername : message.receiverUsername;
      const otherUserProfileFull = message.receiverId === userId ? message.senderProfileUrl : message.receiverProfileUrl;
      const otherUserProfileThumb = message.receiverId === userId ? message.senderProfileThumbnailUrl : message.receiverProfileThumbnailUrl;
      const otherUserProfile = otherUserProfileThumb || otherUserProfileFull;
      const otherUserPublicId = message.receiverId === userId ? message.senderPublicId : message.receiverPublicId;


      const dateObj = new Date(message.dateTime);
      const time = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      const date = dateObj.toLocaleDateString("en-GB");

      const setUserDetails = () => {
        setConversationUserId(otherUserUserId);
        setConversationUserUsername(otherUserUsername);
        setSelectedConversationUserId(otherUserUserId);
      }

      return (
        <div key={index}
          style={{
            ...containerStyle(dark),
            ...((otherUserUserId === selectedConversationUserId) && selectedContainerStyle(dark))
          }}
          title={message.text} onClick={() => setUserDetails()}>
          <div style={userprofileimgContainer} title={"Go to profile"} onClick={() => {
            console.log("going to other user: ", otherUserUserId);
            handleGoToUser(otherUserUserId, otherUserUsername, otherUserPublicId)
          }
          }>
            <img
              src={userBaseUrl + otherUserProfile}
              style={{ ...userprofileimg, ...((hoveredUserImgID === otherUserUserId) ? userprofileimgHover : {}) }}
              alt="user"
              onMouseEnter={() => {
                setHoveredUserImgID(otherUserUserId)
              }}
              onMouseLeave={() => setHoveredUserImgID("")}
            />
          </div>
          <div style={UsernameAndTextContainer}>
            <div>
              <span style={messageUsernameStyle(dark)}>{otherUserUsername}</span>
            </div>
            <div>
              <span style={messageTextStyle(dark)}>{message.text}</span>
            </div>
          </div>
          <div style={timestampContainer}>
            <div>
              <span style={{ ...messageTimeStyle, color: dark ? "rgba(255,255,255,0.6)" : parrotBlueDarkTransparent2 }}>{time}</span>
            </div>
            <div>
              <span style={{ ...messageTimeStyle, color: dark ? "rgba(255,255,255,0.4)" : parrotBlueDarkTransparent }}>{date}</span>
            </div>
          </div>
        </div>)
    })
  );
}

const selectedContainerStyle = (dark) => ({
  boxShadow: "inset 0 0 3px rgba(60, 157, 222,0.5)",
  backgroundColor: dark ? "#0a3060" : "white",
})

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

const containerStyle = (dark) => ({
  fontSize: "1rem",
  backgroundColor: dark ? "#0a2745" : "rgb(246, 246, 246)",
  margin: "10px",
  padding: "10px",
  display: "grid",
  gridTemplateColumns: "1fr 3fr 1.5fr",
  alignItems: "center",
  borderRadius: "4rem",
  cursor: "pointer",
});

const userprofileimgContainer = {
  cursor: "pointer"

}

const UsernameAndTextContainer = {
}

const timestampContainer = {
}



const messageTextStyle = (dark) => ({
  fontSize: "1.3rem",
  textAlign: "left",
  color: dark ? "rgba(255,255,255,0.7)" : "darkblue",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 1,
  textOverflow: "ellipsis",
})



const messageUsernameStyle = (dark) => ({
  fontSize: "1.3rem",
  textAlign: "left",
  color: dark ? "rgba(255,255,255,0.9)" : "#3c9dde",
  fontWeight: "bold",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 1,
  textOverflow: "ellipsis",
})


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