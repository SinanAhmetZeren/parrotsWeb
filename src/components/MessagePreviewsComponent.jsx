
import "../assets/css/App.css";
import * as React from "react";
import { useParams } from "react-router-dom";

const blue = "#0A77EA";
const blueDk = "#0A5FBF";
const mid = "#5C6B7A";
const tint = "#F4F7FB";

export function MessagePreviewsComponent({
  messagesData,
  userId,
  setConversationUserId,
  setConversationUserUsername,
  setActiveGroupId,
  handleGoToUser,
  isDarkMode = false,
}) {
  const { conversationUserPublicId: selectedUserId } = useParams();
  const [selectedConversationUserId, setSelectedConversationUserId] = React.useState(selectedUserId);
  const [selectedGroupId, setSelectedGroupId] = React.useState(null);

  if (!messagesData || messagesData.length === 0) {
    return <p style={{ color: mid, fontSize: "0.85rem", fontWeight: 700, textAlign: "center", padding: "2rem 1rem" }}>No messages yet</p>;
  }

  const sortedMessages = [...messagesData].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  return sortedMessages.map((message, index) => {
    const isGroup = !!message.groupConversationId;

    if (isGroup) {
      const dateObj = message.dateTime ? new Date(message.dateTime) : null;
      const time = dateObj ? dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
      const date = dateObj ? dateObj.toLocaleDateString("en-GB") : "";
      const isSelected = selectedGroupId === message.groupConversationId;
      const previewText = message.text
        ? `${message.senderUsername}: ${message.text?.startsWith("**🦜**") ? "Ask Parrots: " + message.text.replace(/^\*\*🦜\*\*\s*/, "") : message.text?.startsWith("[parrots-bid]") ? "Parrots: " + message.text.replace(/^\[parrots-bid\]\s*/, "") : message.text}`
        : "No messages yet";

      return (
        <button
          key={`group-${message.groupConversationId}`}
          style={{ ...th, ...(isSelected ? thOn : {}) }}
          onMouseEnter={e => { if (!isSelected) Object.assign(e.currentTarget.style, thHover); }}
          onMouseLeave={e => { if (!isSelected) Object.assign(e.currentTarget.style, { borderColor: "transparent", background: tint }); }}
          onClick={() => {
            setSelectedGroupId(message.groupConversationId);
            setSelectedConversationUserId("");
            setConversationUserId("");
            if (setActiveGroupId) setActiveGroupId(message.groupConversationId);
          }}>
          <span style={{ ...av, ...avIni, backgroundColor: groupColor(message.groupConversationId) }}>
            {(message.groupName || "").split(" ").filter(w => w).slice(0, 2).map(w => w[0].toUpperCase()).join("")}
          </span>
          <span style={thb}>
            <span style={thr}>
              <span style={thn}>{message.groupName}</span>
              <span style={tht}>{time}</span>
            </span>
            <span style={thr}>
              <span style={thp}>{previewText}</span>
              <span style={thd}>{date}</span>
              {message.unreadCount > 0 && <span style={unread}>{message.unreadCount}</span>}
            </span>
          </span>
        </button>
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
    const isSelected = otherUserUserId === selectedConversationUserId;
    const previewText = message.text?.startsWith("**🦜**")
      ? "Ask Parrots: " + message.text.replace(/^\*\*🦜\*\*\s*/, "")
      : message.text?.startsWith("[parrots-bid]")
        ? "Parrots: " + message.text.replace(/^\[parrots-bid\]\s*/, "")
        : message.text;

    return (
      <button
        key={index}
        style={{ ...th, ...(isSelected ? thOn : {}) }}
        onMouseEnter={e => { if (!isSelected) Object.assign(e.currentTarget.style, thHover); }}
        onMouseLeave={e => { if (!isSelected) Object.assign(e.currentTarget.style, { borderColor: "transparent", background: tint }); }}
        title={message.text}
        onClick={() => {
          setConversationUserId(otherUserUserId);
          setConversationUserUsername(otherUserUsername);
          setSelectedConversationUserId(otherUserUserId);
          setSelectedGroupId(null);
          if (setActiveGroupId) setActiveGroupId(null);
        }}>
        <span
          style={av}
          title="Go to profile"
          onClick={e => { e.stopPropagation(); handleGoToUser(otherUserUserId, otherUserUsername, otherUserPublicId); }}>
          <img src={otherUserProfile} style={avImg} alt="" />
        </span>
        <span style={thb}>
          <span style={thr}>
            <span style={{ ...thn, fontWeight: message.unreadCount > 0 ? 900 : 800 }}>{otherUserUsername}</span>
            <span style={tht}>{time}</span>
          </span>
          <span style={thr}>
            <span style={{ ...thp, fontWeight: message.unreadCount > 0 ? 700 : 600 }}>{previewText}</span>
            <span style={thd}>{date}</span>
            {message.unreadCount > 0 && <span style={unread}>{message.unreadCount}</span>}
          </span>
        </span>
      </button>
    );
  });
}

const th = {
  fontFamily: "Nunito, sans-serif",
  display: "flex", alignItems: "center", gap: 11,
  textAlign: "left", width: "100%",
  border: "1.5px solid transparent",
  background: tint,
  borderRadius: 11,
  padding: "9px 12px 9px 9px",
  cursor: "pointer",
  transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
};

const thOn = {
  background: "#fff",
  borderColor: blue,
  boxShadow: "0 4px 14px rgba(10,119,234,.13)",
};

const thHover = {
  borderColor: "#C9DAF0",
  background: "#fff",
};

const av = {
  width: 42, height: 42, borderRadius: "50%",
  overflow: "hidden", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
};

const avIni = {
  color: "#fff", fontSize: 16, fontWeight: 900,
};

const avImg = {
  width: "100%", height: "100%", objectFit: "cover",
};

const thb = {
  flex: 1, minWidth: 0,
  display: "flex", flexDirection: "column", gap: 2,
};

const thr = {
  display: "flex", alignItems: "baseline", gap: 10, minWidth: 0,
};

const thn = {
  fontSize: 14.5, fontWeight: 800, color: blueDk,
  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  flex: 1, minWidth: 0,
};

const tht = {
  fontSize: 11.5, fontWeight: 800, color: mid, flexShrink: 0,
};

const thp = {
  fontSize: 12.5, fontWeight: 600, color: mid,
  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  flex: 1, minWidth: 0,
};

const thd = {
  fontSize: 11, fontWeight: 700, color: mid, flexShrink: 0,
};

const unread = {
  minWidth: 18, height: 18, borderRadius: 9,
  backgroundColor: "#2AC898",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 10, fontWeight: 900, color: "#fff",
  padding: "0 4px", flexShrink: 0,
};

const groupColors = ["#a020a0", "#6a0dad", "#1e88e5", "#29b6f6", "#00bfa5", "#ffa726", "#e53935", "#7A3FD4", "#E23B3B", "#12B886", "#38A6E8"];
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
