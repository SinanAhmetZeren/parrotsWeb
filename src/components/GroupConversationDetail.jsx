import "../assets/css/App.css";
import * as React from "react";
import { RiCloseLine, RiAddLine } from "react-icons/ri";
import { useState, useEffect, useRef, useCallback } from "react";
import { useGetGroupMessagesQuery, useGetGroupByIdQuery } from "../slices/GroupSlice";
import { useAddGroupMemberMutation, useRemoveGroupMemberMutation, useExitGroupMutation } from "../slices/GroupSlice";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import { invokeHub, isHubReady, register_ReceiveGroupMessageRefetch, unregister_ReceiveGroupMessageRefetch, register_ReceiveGroupMessage, unregister_ReceiveGroupMessage } from "../signalr/signalRHub";
import { parrotBlue, parrotBlueDarkTransparent2, parrotBlueDarkTransparent, parrotLightBlue, parrotRed } from "../styles/colors";
import { useNavigate } from "react-router-dom";

const userBaseUrl = "";

export function GroupConversationDetail({ groupId, currentUserId, isDarkMode = false, groupData, refetchPreviews }) {
  const dark = isDarkMode;
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const sendTimestampsRef = useRef([]);

  const [message, setMessage] = useState("");
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [addingUserId, setAddingUserId] = useState(null);
  const [removingUserId, setRemovingUserId] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const { data: fetchedGroupData } = useGetGroupByIdQuery(
    { groupId, userId: currentUserId },
    { skip: !groupId || !currentUserId, refetchOnMountOrArgChange: true }
  );

  const resolvedGroupData = groupData ?? fetchedGroupData;
  const [members, setMembers] = useState(resolvedGroupData?.members ?? []);
  const isCreator = resolvedGroupData?.creatorId === currentUserId;

  const { data: groupMessagesData, refetch: refetchMessages } = useGetGroupMessagesQuery(
    { groupId, userId: currentUserId },
    { skip: !groupId || !currentUserId }
  );

  const { data: searchResults } = useGetUsersByUsernameQuery(memberQuery, {
    skip: memberQuery.length < 3,
  });

  const [addMember] = useAddGroupMemberMutation();
  const [removeMember] = useRemoveGroupMemberMutation();
  const [exitGroup] = useExitGroupMutation();

  useEffect(() => {
    if (groupMessagesData) setMessagesToDisplay(groupMessagesData);
  }, [groupMessagesData]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messagesToDisplay]);

  useEffect(() => {
    if (resolvedGroupData?.members) setMembers(resolvedGroupData.members);
  }, [resolvedGroupData]);

  useEffect(() => {
    if (!groupId || !currentUserId) return;
    const enter = async () => {
      while (!isHubReady()) await new Promise(res => setTimeout(res, 50));
      invokeHub("EnterGroupConversationPage", currentUserId, groupId.toString());
    };
    enter();
    return () => {
      if (isHubReady()) invokeHub("LeaveGroupConversationPage", currentUserId);
    };
  }, [groupId, currentUserId]);

  // ReceiveGroupMessageRefetch — refetch messages when a new group message arrives
  useEffect(() => {
    if (!groupId) return;
    const handler = (incomingGroupId) => {
      if (incomingGroupId === groupId) refetchMessages();
    };
    register_ReceiveGroupMessageRefetch(handler);
    return () => unregister_ReceiveGroupMessageRefetch(handler);
  }, [groupId, refetchMessages]);

  // ReceiveGroupMessage — real-time update from mobile or other clients
  useEffect(() => {
    if (!groupId) return;
    const handler = (payload) => {
      if (!payload || payload.groupConversationId !== groupId) return;
      refetchMessages();
    };
    register_ReceiveGroupMessage(handler);
    return () => unregister_ReceiveGroupMessage(handler);
  }, [groupId, refetchMessages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const now = Date.now();
    sendTimestampsRef.current = sendTimestampsRef.current.filter(t => now - t < 5000);
    if (sendTimestampsRef.current.length >= 5) return;
    sendTimestampsRef.current.push(now);

    const optimistic = {
      senderId: currentUserId,
      senderUsername: "You",
      senderProfileThumbnailUrl: "",
      text: message,
      dateTime: new Date().toISOString(),
    };
    setMessagesToDisplay(prev => [...(prev ?? []), optimistic]);
    const saved = message;
    setMessage("");

    try {
      if (!isHubReady()) { setMessage(saved); return; }
      await invokeHub("SendGroupMessage", currentUserId, groupId, saved);
      if (refetchPreviews) refetchPreviews();
    } catch {
      setMessagesToDisplay(prev => prev.filter(m => m !== optimistic));
      setMessage(saved);
    }
  };

  const handleAddMember = async (userId, username) => {
    setAddingUserId(userId);
    try {
      const result = await addMember({ groupId, userId, requesterId: currentUserId });
      if (result.data) setMembers(result.data.members ?? []);
    } finally {
      setAddingUserId(null);
    }
  };

  const handleRemoveMember = async (userId) => {
    setRemovingUserId(userId);
    try {
      const result = await removeMember({ groupId, userId, requesterId: currentUserId });
      if (result.data) setMembers(result.data.members ?? []);
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleExitGroup = async () => {
    await exitGroup({ groupId, userId: currentUserId });
    if (refetchPreviews) refetchPreviews();
  };

  const memberUserIds = members.map(m => m.userId);
  const myMember = members.find(m => m.userId === currentUserId);
  const myAvatar = myMember?.profileImageThumbnailUrl || myMember?.profileImageUrl || "";

  return (
    <div style={outerContainer(dark)}>

      {/* Members panel */}
      <div style={membersPanel(dark)}>
        <div style={membersPanelHeader(dark)}>
          {!confirmLeave && <span style={membersPanelTitle(dark)}>Members</span>}
          {!isCreator && (
            confirmLeave ? (
              <div style={confirmLeaveRow}>
                <span style={confirmLeaveText}>Are you sure?</span>
                <button style={noStayBtn} onClick={() => setConfirmLeave(false)}>No, Stay</button>
                <button style={exitBtn} onClick={handleExitGroup}>Yes, Leave</button>
              </div>
            ) : (
              <button style={leaveBtn} onClick={() => setConfirmLeave(true)}>Leave</button>
            )
          )}
        </div>

        {/* Add member search — creator only */}
        {isCreator && (
          <>
            <div style={addMemberSection}>
              <input
                style={searchInput(dark)}
                placeholder="Add by username..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") setMemberQuery(memberSearch); }}
              />
              <button
                style={{ ...searchBtn, opacity: memberSearch.length < 3 ? 0.4 : 1, cursor: memberSearch.length < 3 ? "default" : "pointer" }}
                onClick={() => memberSearch.length >= 3 && setMemberQuery(memberSearch)}
              >Search</button>
            </div>
            {searchResults?.length > 0 && (
              <div style={searchResultsList(dark)}>
                {searchResults.filter(u => !memberUserIds.includes(u.id)).map(u => (
                  <div key={u.id} style={searchResultRow(dark)}>
                    <img src={u.profileImageThumbnailUrl || u.profileImageUrl} alt="" style={memberAvatar} />
                    <span style={memberName(dark)}>{u.userName}</span>
                    <button
                      style={{ ...addBtn, opacity: addingUserId === u.id ? 0.6 : 1, cursor: addingUserId === u.id ? "default" : "pointer" }}
                      onClick={() => !addingUserId && handleAddMember(u.id, u.userName)}
                    >
                      {addingUserId === u.id
                        ? <div className="spinner" style={{ width: "0.9rem", height: "0.9rem", border: "2px solid rgba(0,119,234,0.3)", borderTop: `2px solid ${parrotBlue}` }} />
                        : <RiAddLine size={16} color={parrotBlue} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Member list — scrollable */}
        <div style={memberList}>
          {members.map(m => (
            <div key={m.userId} style={memberRow(dark)}>
              <img src={m.profileImageThumbnailUrl || m.profileImageUrl} alt="" style={memberAvatar} />
              <span
                style={memberName(dark)}
                onClick={() => navigate(`/profile-public/${m.publicId}/${m.username}`)}
                title="Go to profile"
              >
                {m.username}
              </span>
              {isCreator && m.userId !== currentUserId && (
                <span style={{ ...removeBtn, opacity: removingUserId === m.userId ? 0.6 : 1, cursor: removingUserId === m.userId ? "default" : "pointer" }} onClick={() => !removingUserId && handleRemoveMember(m.userId)}>
                  {removingUserId === m.userId
                    ? <div className="spinner" style={{ width: "0.9rem", height: "0.9rem", border: "2px solid rgba(220,50,50,0.3)", borderTop: "2px solid rgb(220,50,50)" }} />
                    : <RiCloseLine size={16} color={parrotRed} />}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Messages panel */}
      <div style={messagesPanel}>

        {/* Message list */}
        <div style={messageList(dark)} className={dark ? "dark-scrollbar" : "cream-scrollbar"}>
          {messagesToDisplay?.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            const dateObj = new Date(msg.dateTime);
            const time = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            const date = dateObj.toLocaleDateString("en-GB");
            const avatarSrc = isMe ? myAvatar : (msg.senderProfileThumbnailUrl || msg.senderProfileImageUrl || "");
            const displayName = isMe ? "You" : (msg.senderUsername || "");

            const avatarEl = (
              <img
                src={avatarSrc}
                alt=""
                style={msgAvatar}
                onError={e => { e.target.style.visibility = "hidden"; }}
              />
            );

            const textGrid = (
              <div style={msgTextGrid(dark, isMe)}>
                <span style={msgUsername(dark)}>{displayName}</span>
                <span style={msgTime(dark)}>{time}</span>
                <span style={msgText(dark)}>{msg.text}</span>
                <span style={msgDate(dark)}>{date}</span>
              </div>
            );

            return (
              <div key={index} style={msgBubble(dark, isMe)}>
                {isMe ? (<>{textGrid}{avatarEl}</>) : (<>{avatarEl}{textGrid}</>)}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Send box */}
        <div style={sendBox(dark)}>
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
            <input
              style={{ ...sendInput(dark), width: "100%", boxSizing: "border-box" }}
              placeholder=""
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            />
            {!message && (
              <span style={{ position: "absolute", left: "1.2rem", pointerEvents: "none", fontSize: "1.2rem", color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "calc(100% - 2.4rem)" }}>
                Write a message to{" "}
                <span style={{ color: parrotBlue, fontWeight: 600 }}>{resolvedGroupData?.name ?? ""}</span>
              </span>
            )}
          </div>
          <button style={sendButton} onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}


const msgBubble = (dark, isMe) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.6rem",
  margin: "4px 10px",
  justifySelf: isMe ? "end" : "start",
  maxWidth: "80%",
});

const msgAvatar = {
  width: "2.6rem",
  height: "2.6rem",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
  alignSelf: "center",
};

const msgTextGrid = (dark, isMe) => ({
  display: "grid",
  gridTemplateColumns: "1fr 7rem",
  gridTemplateRows: "auto auto",
  gap: "0 0.4rem",
  padding: "0.5rem 0.9rem",
  borderRadius: "1.5rem",
  backgroundColor: dark ? "#0a2745" : "rgb(246,246,246)",
  color: dark ? "rgba(255,255,255,0.85)" : "darkblue",
  wordBreak: "break-word",
  textAlign: isMe ? "right" : "left",
});

const msgUsername = (dark) => ({
  gridColumn: "1",
  gridRow: "1",
  fontSize: "0.85rem",
  fontWeight: "700",
  color: dark ? parrotLightBlue : parrotBlue,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const msgTime = (dark) => ({
  gridColumn: "2",
  gridRow: "1",
  fontSize: "0.85rem",
  fontWeight: "700",
  color: dark ? "rgba(255,255,255,0.6)" : parrotBlueDarkTransparent2,
  textAlign: "right",
  whiteSpace: "nowrap",
});

const msgText = (dark) => ({
  gridColumn: "1",
  gridRow: "2",
  fontSize: "1.15rem",
});

const msgDate = (dark) => ({
  gridColumn: "2",
  gridRow: "2",
  fontSize: "0.8rem",
  color: dark ? "rgba(255,255,255,0.4)" : parrotBlueDarkTransparent,
  textAlign: "right",
  whiteSpace: "nowrap",
});






const outerContainer = (dark) => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  height: "100%",
  backgroundColor: dark ? "#011a32" : "white",
});

const membersPanel = (dark) => ({
  width: "22rem",
  minWidth: "22rem",
  display: "flex",
  flexDirection: "column",
  borderRight: dark ? "1px solid #1a4a7a" : "1px solid #e0eaf5",
  backgroundColor: dark ? "#0a2745" : "#f9f5f1",
  padding: "1rem",
  overflowY: "auto",
});

const membersPanelHeader = (dark) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
});

const membersPanelTitle = (dark) => ({
  fontSize: "1.3rem",
  fontWeight: "700",
  color: dark ? "white" : parrotBlue,
});

const memberList = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  marginTop: "0.5rem",
  overflowY: "auto",
  flex: 1,
};

const memberRow = (dark) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.4rem 0.6rem",
  borderRadius: "2rem",
  backgroundColor: dark ? "#0f3460" : "white",
});

const memberAvatar = {
  width: "2.4rem",
  height: "2.4rem",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
};

const memberName = (dark) => ({
  flex: 1,
  fontSize: "1.1rem",
  color: dark ? "rgba(255,255,255,0.9)" : parrotBlue,
  cursor: "pointer",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const removeBtn = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.6rem",
  height: "1.6rem",
  borderRadius: "50%",
  backgroundColor: "rgba(220,50,50,0.12)",
  flexShrink: 0,
};

const leaveBtn = {
  backgroundColor: "#F5A623",
  color: "white",
  border: "none",
  borderRadius: "1rem",
  padding: "0.3rem 0.8rem",
  cursor: "pointer",
  fontSize: "1rem",
};

const exitBtn = {
  backgroundColor: parrotRed,
  color: "white",
  border: "none",
  borderRadius: "1rem",
  padding: "0.3rem 0.8rem",
  cursor: "pointer",
  fontSize: "1rem",
};

const noStayBtn = {
  backgroundColor: "#3c9dde",
  color: "white",
  border: "none",
  borderRadius: "1rem",
  padding: "0.3rem 0.8rem",
  cursor: "pointer",
  fontSize: "1rem",
};

const confirmLeaveRow = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginLeft: "auto",
};

const confirmLeaveText = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#3c9dde",
};

const addMemberSection = {
  display: "flex",
  gap: "0.5rem",
  marginTop: "0.5rem",
};

const searchInput = (dark) => ({
  flex: 1,
  padding: "0.4rem 0.8rem",
  borderRadius: "1rem",
  border: dark ? "1px solid #1a4a7a" : "1px solid #cce0f5",
  backgroundColor: dark ? "#011a32" : "white",
  color: dark ? "white" : "black",
  fontSize: "1rem",
  outline: "none",
});

const searchBtn = {
  backgroundColor: parrotBlue,
  color: "white",
  border: "none",
  borderRadius: "1rem",
  padding: "0.4rem 0.8rem",
  cursor: "pointer",
  fontSize: "1rem",
};

const searchResultsList = (dark) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  marginTop: "0.5rem",
});

const searchResultRow = (dark) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.4rem 0.6rem",
  borderRadius: "2rem",
  backgroundColor: dark ? "#0f3460" : "white",
});

const addBtn = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.6rem",
  height: "1.6rem",
  borderRadius: "50%",
  backgroundColor: "rgba(0,119,234,0.12)",
  border: "none",
  flexShrink: 0,
};

const messagesPanel = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  height: "100%",
};

const messageList = (dark) => ({
  flex: 1,
  overflowY: "scroll",
  display: "grid",
  padding: "1rem",
  gap: "4px",
  height: `calc(100vh - 14rem)`,
  alignContent: "start",
});



const sendBox = (dark) => ({
  display: "flex",
  gap: "0.8rem",
  padding: "0.8rem 1rem",
  borderTop: dark ? "1px solid #1a4a7a" : "1px solid #e0eaf5",
  backgroundColor: dark ? "#0a2745" : "#f9f5f1",
});

const sendInput = (dark) => ({
  flex: 1,
  padding: "0.6rem 1.2rem",
  borderRadius: "2rem",
  border: dark ? "1px solid #1a4a7a" : "1px solid #cce0f5",
  backgroundColor: dark ? "#011a32" : "white",
  color: dark ? "white" : "black",
  fontSize: "1.2rem",
  outline: "none",
});

const sendButton = {
  backgroundColor: parrotBlue,
  color: "white",
  border: "none",
  borderRadius: "2rem",
  padding: "0.6rem 1.6rem",
  cursor: "pointer",
  fontSize: "1.2rem",
  fontWeight: "600",
};
