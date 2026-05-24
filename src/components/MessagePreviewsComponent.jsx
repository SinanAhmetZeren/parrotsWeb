
import "../assets/css/App.css";
import * as React from "react";
import { useParams } from "react-router-dom";
import { parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotBlue, parrotDarkBlue, parrotYellow } from "../styles/colors";


const userBaseUrl = `  `;

export function MessagePreviewsComponent({
  messagesData,
  userId,
  setConversationUserId,
  setConversationUserUsername,
  setActiveGroupId,
  handleGoToUser,
  isDarkMode = false,
}) {
  const dark = isDarkMode;
  const { conversationUserId: selectedUserId } = useParams();

  const [hoveredUserImgID, setHoveredUserImgID] = React.useState("");
  const [selectedConversationUserId, setSelectedConversationUserId] = React.useState(selectedUserId);
  const [selectedGroupId, setSelectedGroupId] = React.useState(null);

  if (!messagesData || messagesData.length === 0) {
    return <p style={{ color: "#3c9dde66", fontSize: "1.5rem", fontWeight: "500" }}
      className="text-gray-500 text-center p-4">No messages yet</p>;
  }

  const sortedMessages = [...messagesData].sort(
    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  );

  return sortedMessages.map((message, index) => {
    const isGroup = !!message.groupConversationId;

    if (isGroup) {
      const dateObj = message.dateTime ? new Date(message.dateTime) : null;
      const time = dateObj ? dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
      const date = dateObj ? dateObj.toLocaleDateString("en-GB") : "";
      const isSelected = selectedGroupId === message.groupConversationId;

      return (
        <div key={`group-${message.groupConversationId}`}
          style={{ ...containerStyle(dark), ...(isSelected && selectedContainerStyle(dark)) }}
          onClick={() => {
            setSelectedGroupId(message.groupConversationId);
            setSelectedConversationUserId("");
            setConversationUserId("");
            if (setActiveGroupId) setActiveGroupId(message.groupConversationId);
          }}>
          <div style={groupIconContainer(dark, message.groupConversationId)}>
            <span style={groupIconText}>
              {(message.groupName || "")
                .split(" ")
                .filter(w => w)
                .slice(0, 2)
                .map(w => w[0].toUpperCase())
                .join("")}
            </span>
          </div>
          <div style={UsernameAndTextContainer}>
            <span style={messageUsernameStyle(dark, message.unreadCount > 0)}>{message.groupName}</span>
            <span style={messageTextStyle(dark, message.unreadCount > 0)}>{message.text ? `${message.senderUsername}: ${message.text}` : "No messages yet"}</span>
          </div>
          <div style={timestampContainer}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ ...messageTimeStyle, color: dark ? "rgba(255,255,255,0.6)" : parrotBlueDarkTransparent2 }}>{time}</span>
              {message.unreadCount > 0 && <div style={unreadDot}>{message.unreadCount}</div>}
            </div>
            <span style={{ ...messageTimeStyle, color: dark ? "rgba(255,255,255,0.4)" : parrotBlueDarkTransparent }}>{date}</span>
          </div>
        </div>
      );
    }

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
      setSelectedGroupId(null);
      if (setActiveGroupId) setActiveGroupId(null);
    };

    return (
      <div key={index}
        style={{ ...containerStyle(dark), ...((otherUserUserId === selectedConversationUserId) && selectedContainerStyle(dark)) }}
        title={message.text} onClick={() => setUserDetails()}>
        <div style={userprofileimgContainer} title={"Go to profile"} onClick={(e) => {
          e.stopPropagation();
          handleGoToUser(otherUserUserId, otherUserUsername, otherUserPublicId);
        }}>
          <img
            src={userBaseUrl + otherUserProfile}
            style={{ ...userprofileimg, ...((hoveredUserImgID === otherUserUserId) ? userprofileimgHover : {}) }}
            alt=""
            onMouseEnter={() => setHoveredUserImgID(otherUserUserId)}
            onMouseLeave={() => setHoveredUserImgID("")}
          />
        </div>
        <div style={UsernameAndTextContainer}>
          <div><span style={messageUsernameStyle(dark, message.unreadCount > 0)}>{otherUserUsername}</span></div>
          <div><span style={messageTextStyle(dark, message.unreadCount > 0)}>{message.text}</span></div>
        </div>
        <div style={timestampContainer}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ ...messageTimeStyle, color: dark ? "rgba(255,255,255,0.6)" : parrotBlueDarkTransparent2 }}>{time}</span>
            {message.unreadCount > 0 && <div style={unreadDot}>{message.unreadCount}</div>}
          </div>
          <div><span style={{ ...messageTimeStyle, color: dark ? "rgba(255,255,255,0.4)" : parrotBlueDarkTransparent }}>{date}</span></div>
        </div>
      </div>
    );
  });
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
  margin: "4px 10px",
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
  minWidth: 0,
  overflow: "hidden",
}

const timestampContainer = {
}

const unreadDot = {
  minWidth: "18px",
  height: "18px",
  borderRadius: "9px",
  backgroundColor: "#3c9dde",
  backgroundColor: parrotYellow,
  marginLeft: "5px",
  marginBottom: "5px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.75rem",
  fontWeight: "900",
  color: parrotDarkBlue,
  padding: "0 4px",
}



const messageTextStyle = (dark, hasUnread = false) => ({
  fontSize: "1.3rem",
  textAlign: "left",
  color: dark ? "rgba(255,255,255,0.7)" : "darkblue",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  display: "block",
  fontWeight: hasUnread ? "700" : "400",
})



const messageUsernameStyle = (dark, hasUnread = false) => ({
  fontSize: "1.3rem",
  textAlign: "left",
  color: hasUnread ? (dark ? "white" : "#1a6ab5") : (dark ? "rgba(255,255,255,0.9)" : "#3c9dde"),
  fontWeight: hasUnread ? "900" : "bold",
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

const groupColors = ["#a020a0", "#6a0dad", "#1e88e5", "#29b6f6", "#00bfa5", "#ffa726", "#e53935"];

const groupColorMap = new Map();
let colorPool = [];
let lastUsedColor = null;
const groupColor = (id) => {
  if (!groupColorMap.has(id)) {
    if (colorPool.length === 0) {
      do { colorPool = [...groupColors].sort(() => Math.random() - 0.5); } while (colorPool[colorPool.length - 1] === lastUsedColor);
    }
    lastUsedColor = colorPool.pop();
    groupColorMap.set(id, lastUsedColor);
  }
  return groupColorMap.get(id);
};

const groupIconContainer = (dark, id) => ({
  width: "4rem",
  height: "4rem",
  borderRadius: "50%",
  backgroundColor: groupColor(id),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "1rem",
  flexShrink: 0,
});

const groupIconText = {
  color: "white",
  fontSize: "1.6rem",
  fontWeight: "700",
};