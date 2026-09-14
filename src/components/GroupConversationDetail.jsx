import "../assets/css/App.css";
import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useGetGroupMessagesQuery, useGetGroupByIdQuery } from "../slices/GroupSlice";
import { useAddGroupMemberMutation, useRemoveGroupMemberMutation, useExitGroupMutation } from "../slices/GroupSlice";
import { useGetUsersByUsernameQuery, useAcknowledgeGroupHistoryMutation, setAcknowledgedGroupHistory } from "../slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { invokeHub, isHubReady, register_ReceiveGroupMessageRefetch, unregister_ReceiveGroupMessageRefetch, register_ReceiveGroupMessage, unregister_ReceiveGroupMessage } from "../signalr/signalRHub";
import { useNavigate } from "react-router-dom";
import parrotLogo from "../assets/images/parrotsiconpaddedtransparent.webp";
import { DirectMessageSenderComponent } from "./DirectMessageSenderComponent";

// ── Tokens ──────────────────────────────────────────────────────────────────
const blue    = "#0A77EA";
const blueDk  = "#0A5FBF";
const navy    = "#0A2540";
const mid     = "#5C6B7A";
const line    = "#E3E9F0";
const tint    = "#F4F7FB";
const red     = "#C22F3D";

const GROUP_COLORS = ["#8E44D0","#1E9BE0","#2AA3D8","#E23B3B","#1BBF7A","#EF8A1B","#2AC898","#0A77EA"];
function groupColor(name = "") {
  return GROUP_COLORS[(name.charCodeAt(0) || 0) % GROUP_COLORS.length];
}

export function GroupConversationDetail({ groupId, currentUserId, isDarkMode = false, groupData, refetchPreviews }) {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const sendTimestampsRef = useRef([]);

  const dispatch = useDispatch();
  const hasAcknowledgedGroupHistory = useSelector((state) => state.users.hasAcknowledgedGroupHistory);
  const [acknowledgeGroupHistory] = useAcknowledgeGroupHistoryMutation();
  const [showGroupHistoryModal, setShowGroupHistoryModal] = useState(false);
  const [showMembers, setShowMembers] = useState(true);

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

const { data: groupMessagesData, refetch: refetchMessages, isUninitialized: msgsUninitialized } = useGetGroupMessagesQuery(
    { groupId, userId: currentUserId },
    { skip: !groupId || !currentUserId, refetchOnMountOrArgChange: true }
  );
  const safeRefetchMessages = () => { if (!msgsUninitialized) refetchMessages(); };

  const { data: searchResults } = useGetUsersByUsernameQuery(memberQuery, {
    skip: memberQuery.length < 3,
  });

  const [addMember] = useAddGroupMemberMutation();
  const [removeMember] = useRemoveGroupMemberMutation();
  const [exitGroup] = useExitGroupMutation();

  useEffect(() => {
    if (!hasAcknowledgedGroupHistory) setShowGroupHistoryModal(true);
  }, [hasAcknowledgedGroupHistory]);

  useEffect(() => {
    const msgs = Array.isArray(groupMessagesData) ? groupMessagesData : groupMessagesData?.items;
    if (Array.isArray(msgs)) {
      const sorted = [...msgs].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
setMessagesToDisplay(sorted);
    }
  }, [groupMessagesData]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  }, [messagesToDisplay]);

  useEffect(() => {
    if (resolvedGroupData?.members) setMembers(resolvedGroupData.members);
  }, [resolvedGroupData]);

  useEffect(() => {
    if (!groupId || !currentUserId) return;
    const enter = async () => {
      while (!isHubReady()) await new Promise(res => setTimeout(res, 50));
      await invokeHub("EnterGroupConversationPage", currentUserId, groupId.toString());
      if (refetchPreviews) refetchPreviews();
    };
    enter();
    return () => { if (isHubReady()) invokeHub("LeaveGroupConversationPage", currentUserId); };
  }, [groupId, currentUserId]);

  useEffect(() => {
    if (!groupId) return;
    const handler = (incomingGroupId) => {
      if (incomingGroupId === groupId) safeRefetchMessages();
    };
    register_ReceiveGroupMessageRefetch(handler);
    return () => unregister_ReceiveGroupMessageRefetch(handler);
  }, [groupId, refetchMessages]);

  useEffect(() => {
    if (!groupId) return;
    const handler = (payload) => {
      if (!payload || payload.groupConversationId !== groupId) return;
      safeRefetchMessages();
    };
    register_ReceiveGroupMessage(handler);
    return () => unregister_ReceiveGroupMessage(handler);
  }, [groupId, refetchMessages]);

  const handleAcknowledgeGroupHistory = async () => {
    setShowGroupHistoryModal(false);
    dispatch(setAcknowledgedGroupHistory());
    try { await acknowledgeGroupHistory().unwrap(); } catch { }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    const now = Date.now();
    sendTimestampsRef.current = sendTimestampsRef.current.filter(t => now - t < 5000);
    if (sendTimestampsRef.current.length >= 5) return;
    sendTimestampsRef.current.push(now);
    const optimistic = { senderId: currentUserId, senderUsername: "You", senderProfileThumbnailUrl: "", text: message, dateTime: new Date().toISOString() };
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

  const handleAddMember = async (userId) => {
    setAddingUserId(userId);
    try {
      const result = await addMember({ groupId, userId, requesterId: currentUserId });
      if (result.data) setMembers(result.data.members ?? []);
    } finally { setAddingUserId(null); }
  };

  const handleRemoveMember = async (userId) => {
    setRemovingUserId(userId);
    try {
      const result = await removeMember({ groupId, userId, requesterId: currentUserId });
      if (result.data) setMembers(result.data.members ?? []);
    } finally { setRemovingUserId(null); }
  };

  const handleExitGroup = async () => {
    await exitGroup({ groupId, userId: currentUserId });
    if (refetchPreviews) refetchPreviews();
  };

  const memberUserIds = members.map(m => m.userId);
  const myMember = members.find(m => m.userId === currentUserId);
  const myAvatar = myMember?.profileImageThumbnailUrl || myMember?.profileImageUrl || "";
  const stackedAvatars = members.slice(0, 3);
  const groupName = resolvedGroupData?.name || "";
  const gc = groupColor(groupName);

  return (
    <div style={outerWrap}>

      {/* Group history modal */}
      {showGroupHistoryModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={modalTitle}>Group Message History</div>
            <p style={modalText}>You have access to the full message history of this group. All future members who join will also be able to see all previous messages.</p>
            <button style={modalBtn} onClick={handleAcknowledgeGroupHistory}>Got it</button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={chead}>
        {/* Group avatar */}
        <div style={{ ...av(36), backgroundColor: gc, color: "#fff", fontSize: 15, fontWeight: 900 }}>
          {groupName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={whoStyle}>{groupName}</div>
          <div style={subStyle}>Group · {members.length} member{members.length !== 1 ? "s" : ""}</div>
        </div>
        <span style={{ flex: 1 }} />
        {/* Stacked member avatars */}
        <div style={stack}>
          {stackedAvatars.map((m, i) => (
            m.profileImageThumbnailUrl || m.profileImageUrl
              ? <img key={m.userId} src={m.profileImageThumbnailUrl || m.profileImageUrl} alt="" style={{ ...stackImg, zIndex: stackedAvatars.length - i }} />
              : <div key={m.userId} style={{ ...stackIni, backgroundColor: groupColor(m.username || ""), zIndex: stackedAvatars.length - i }}>{(m.username || "?").charAt(0).toUpperCase()}</div>
          ))}
        </div>
        {/* Members toggle */}
        <button style={{ ...mtoggle, ...(showMembers ? mtoggleOn : {}) }} onClick={() => setShowMembers(v => !v)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, color: mid }}><circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M17 11a3 3 0 0 0 0-6"/><path d="M19 19a5 5 0 0 0-2-4"/></svg>
          Members
        </button>
      </div>

      {/* ── Split: members + messages ── */}
      <div style={split(showMembers)}>

        {/* Members column */}
        {showMembers && (
          <div style={mcol}>
            <div style={mtop}>
              <span style={secLabel}>Members</span>
              <span style={ctBadge}>{members.length}</span>
              {!isCreator && (
                confirmLeave
                  ? <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                      <button style={noStayBtn} onClick={() => setConfirmLeave(false)}>Stay</button>
                      <button style={leaveConfirmBtn} onClick={handleExitGroup}>Leave</button>
                    </div>
                  : <button style={leaveBtn} onClick={() => setConfirmLeave(true)}>Leave</button>
              )}
            </div>

            {/* Search */}
            {isCreator && (
              <div style={sw}>
                <div style={srchRow}>
                  <input
                    style={srchInput}
                    placeholder="Find people…"
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && memberSearch.length >= 3) setMemberQuery(memberSearch); }}
                  />
                  <button
                    style={{ ...srchBtn, opacity: memberSearch.length < 3 ? 0.5 : 1, cursor: memberSearch.length < 3 ? "default" : "pointer" }}
                    onClick={() => memberSearch.length >= 3 && setMemberQuery(memberSearch)}
                  >Search</button>
                </div>
              </div>
            )}

            <div style={mlist}>
              {/* Search results */}
              {isCreator && searchResults?.length > 0 && (
                <>
                  <span style={secLabel}>Search result</span>
                  <div style={mrows}>
                    {searchResults.filter(u => !memberUserIds.includes(u.id)).map(u => (
                      <div key={u.id} style={prRow}>
                        <div style={av(36)}>
                          {u.profileImageThumbnailUrl || u.profileImageUrl
                            ? <img src={u.profileImageThumbnailUrl || u.profileImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: groupColor(u.userName || ""), color: "#fff", fontSize: 13, fontWeight: 900 }}>{(u.userName || "?").charAt(0).toUpperCase()}</div>}
                        </div>
                        <div style={nb}><span style={nm}>{u.userName}</span><span style={rl}>Not in group</span></div>
                        <button style={actBtn("#E6EFFB", blueDk)} onClick={() => !addingUserId && handleAddMember(u.id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" style={{ width: 15, height: 15 }}><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* In this group */}
              <div style={divr}>
                <span style={secLabel}>In this group · {members.length}</span>
                <span style={{ flex: 1, height: 1, backgroundColor: line }} />
              </div>
              <div style={mrows}>
                {members.map(m => (
                  <div key={m.userId} style={prRow}>
                    <div style={av(36)}>
                      {m.profileImageThumbnailUrl || m.profileImageUrl
                        ? <img src={m.profileImageThumbnailUrl || m.profileImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: groupColor(m.username || ""), color: "#fff", fontSize: 13, fontWeight: 900 }}>{(m.username || "?").charAt(0).toUpperCase()}</div>}
                    </div>
                    <div style={nb}>
                      <span style={{ ...nm, cursor: "pointer" }} onClick={() => navigate(`/profile-public/${m.publicId}/${m.username}`)}>{m.username}</span>
                      <span style={rl}>{m.userId === resolvedGroupData?.creatorId ? "Owner" : "Member"}</span>
                    </div>
                    {m.userId === currentUserId
                      ? <span style={youBadge}>You</span>
                      : isCreator
                        ? <button style={actBtn("#FBE9EB", red)} disabled={!!removingUserId} onClick={() => handleRemoveMember(m.userId)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" style={{ width: 15, height: 15 }}><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>
                          </button>
                        : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages column */}
        <div style={tcol}>
          <div style={msgs} className="cream-scrollbar">
            {messagesToDisplay?.map((msg, index) => {
              const isMe = msg.senderId === currentUserId;
              const dateObj = new Date(msg.dateTime);
              const timeStr = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
              const dateStr = dateObj.toLocaleDateString("en-GB");
              const prevDate = index > 0 ? new Date(messagesToDisplay[index - 1].dateTime).toLocaleDateString("en-GB") : null;
              const showDay = dateStr !== prevDate;
              const avatarSrc = isMe ? myAvatar : (msg.senderProfileThumbnailUrl || msg.senderProfileUrl || "");
              const senderName = isMe ? "" : (msg.senderUsername || "");
              const senderColor = groupColor(senderName);
              const prevMsg = index > 0 ? messagesToDisplay[index - 1] : null;
              const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId || showDay;

              const avatarEl = (
                <div style={{ ...av(32), backgroundColor: isMe ? blue : senderColor, visibility: isFirstInGroup ? "visible" : "hidden" }}>
                  {avatarSrc
                    ? <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                    : <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>{isMe ? (myMember?.username || "M").charAt(0).toUpperCase() : (senderName || "?").charAt(0).toUpperCase()}</span>}
                </div>
              );

              return (
                <React.Fragment key={index}>
                  {showDay && <div style={dayPill}>{dateStr}</div>}
                  <div style={msgRow(isMe)}>
                    {!isMe && avatarEl}
                    <div style={mw}>
                      {!isMe && senderName && isFirstInGroup && <span style={mnStyle}>{senderName}</span>}
                      <div style={bub(isMe)}>
                        <span style={txStyle}>{msg.text}</span>
                        <span style={tmStyle(isMe)}>{timeStr}</span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Compose */}
          <DirectMessageSenderComponent
            conversationUserId={groupId}
            currentUserId={currentUserId}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSend}
            sendButtonDisabled={false}
            conversationUserUsername={groupName}
            isDarkMode={isDarkMode}
            placeholder={`Write a message to ${groupName}…`}
          />
        </div>

      </div>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const outerWrap = {
  display: "flex", flexDirection: "column",
  width: "100%", height: "100%",
  backgroundColor: "#fff",
  borderRadius: 14,
  overflow: "hidden",
  position: "relative",
};

const chead = {
  display: "flex", alignItems: "center", gap: 11,
  padding: "12px 18px",
  borderBottom: `1px solid ${line}`,
  backgroundColor: "#FAFCFE",
  flexShrink: 0,
};

const av = (size) => ({
  width: size, height: size, borderRadius: "50%",
  overflow: "hidden", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  backgroundColor: tint,
});

const whoStyle = { fontSize: 15.5, fontWeight: 800, color: navy, fontFamily: "Nunito, sans-serif" };
const subStyle = { fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: mid, marginTop: 1, fontFamily: "Nunito, sans-serif" };

const stack = { display: "flex", flexDirection: "row-reverse", alignItems: "center", flexShrink: 0, marginRight: 3 };
const stackImg = { width: 28, height: 28, borderRadius: "50%", border: "2px solid #FAFCFE", objectFit: "cover", marginRight: -9 };
const stackIni = { width: 28, height: 28, borderRadius: "50%", border: "2px solid #FAFCFE", marginRight: -9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 900, flexShrink: 0 };

const mtoggle = {
  fontFamily: "Nunito, sans-serif",
  display: "inline-flex", alignItems: "center", gap: 7,
  border: `1.5px solid ${line}`, background: "#fff", color: navy,
  fontSize: 12.5, fontWeight: 800,
  padding: "8px 13px", borderRadius: 99, cursor: "pointer", flexShrink: 0,
};
const mtoggleOn = { backgroundColor: tint, borderColor: "#C9DAF0" };

const split = (showMembers) => ({
  flex: 1, minHeight: 0,
  display: "grid",
  gridTemplateColumns: showMembers ? "288px minmax(0,1fr)" : "minmax(0,1fr)",
});

const mcol = {
  borderRight: `1px solid ${line}`,
  display: "flex", flexDirection: "column",
  minHeight: 0,
  backgroundColor: "#FCFDFE",
  overflow: "hidden",
};

const mtop = {
  display: "flex", alignItems: "center", gap: 9,
  padding: "13px 14px 10px",
  flexShrink: 0,
};

const secLabel = {
  fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
  textTransform: "uppercase", color: mid,
  fontFamily: "Nunito, sans-serif",
};

const ctBadge = {
  fontSize: 12, fontWeight: 800, color: mid,
  backgroundColor: tint, padding: "3px 9px", borderRadius: 99,
  fontFamily: "Nunito, sans-serif",
};

const sw = {
  padding: "0 14px 12px",
  borderBottom: `1px solid ${line}`,
  flexShrink: 0,
};

const srchRow = { display: "flex", alignItems: "center", gap: 8 };

const srchInput = {
  flex: 1, minWidth: 0,
  fontFamily: "Nunito, sans-serif",
  fontSize: 13.5, fontWeight: 700, color: navy,
  backgroundColor: tint, border: "1.5px solid transparent",
  borderRadius: 8, padding: "9px 11px", outline: "none",
};

const srchBtn = {
  fontFamily: "Nunito, sans-serif",
  border: "none", backgroundColor: blue, color: "#fff",
  fontSize: 13, fontWeight: 800,
  padding: "10px 15px", borderRadius: 99, flexShrink: 0,
};

const mlist = {
  flex: 1, minHeight: 0, overflowY: "auto",
  padding: "12px 12px 14px",
  display: "flex", flexDirection: "column", gap: 9,
};

const mrows = { display: "flex", flexDirection: "column", gap: 7 };

const prRow = {
  display: "flex", alignItems: "center", gap: 10,
  backgroundColor: tint, border: "1.5px solid transparent",
  borderRadius: 11, padding: "8px 9px",
};

const nb = { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 };
const nm = { fontSize: 14, fontWeight: 800, color: blueDk, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "Nunito, sans-serif" };
const rl = { fontSize: 10, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase", color: mid, fontFamily: "Nunito, sans-serif" };

const actBtn = (bg, color) => ({
  width: 30, height: 30, borderRadius: 9,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0, border: "none", cursor: "pointer",
  backgroundColor: bg, color,
  padding: 0,
});

const youBadge = {
  fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
  textTransform: "uppercase", color: mid,
  backgroundColor: "#fff", border: `1.5px solid ${line}`,
  padding: "4px 9px", borderRadius: 99, flexShrink: 0,
  fontFamily: "Nunito, sans-serif",
};

const divr = { display: "flex", alignItems: "center", gap: 9 };

const leaveBtn = {
  fontFamily: "Nunito, sans-serif",
  marginLeft: "auto",
  backgroundColor: "#FBE9EB", color: red,
  border: "none", borderRadius: 99,
  padding: "5px 13px", fontSize: 12, fontWeight: 800, cursor: "pointer",
};
const leaveConfirmBtn = { ...leaveBtn, backgroundColor: red, color: "#fff" };
const noStayBtn = {
  fontFamily: "Nunito, sans-serif",
  backgroundColor: tint, color: mid,
  border: `1.5px solid ${line}`, borderRadius: 99,
  padding: "5px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer",
};

const tcol = { display: "flex", flexDirection: "column", minHeight: 0 };

const msgs = {
  flex: 1, minHeight: 0, overflowY: "auto",
  padding: "16px 20px 20px",
  display: "flex", flexDirection: "column", gap: 10,
};

const dayPill = {
  alignSelf: "center",
  backgroundColor: tint, color: mid,
  fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
  padding: "5px 13px", borderRadius: 99,
  fontFamily: "Nunito, sans-serif",
};

const msgRow = (isMe) => ({
  display: "flex", alignItems: "flex-end", gap: 9,
  maxWidth: "72%",
  alignSelf: isMe ? "flex-end" : "flex-start",
  flexDirection: isMe ? "row-reverse" : "row",
});

const mw = { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 };

const mnStyle = {
  fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
  color: mid, paddingLeft: 2, fontFamily: "Nunito, sans-serif", alignSelf: "flex-start",
};

const bub = (isMe) => ({
  backgroundColor: isMe ? "#E6EFFB" : tint,
  borderRadius: 14, padding: "10px 14px",
  display: "flex", alignItems: "baseline", gap: 11, minWidth: 0,
});

const txStyle = { fontSize: 14, fontWeight: 600, lineHeight: 1.45, wordBreak: "break-word", fontFamily: "Nunito, sans-serif", color: navy };
const tmStyle = (isMe) => ({ fontSize: 11, fontWeight: 700, color: isMe ? "#4A6C93" : mid, flexShrink: 0, fontFamily: "Nunito, sans-serif" });

const comp = {
  display: "flex", alignItems: "center", gap: 11,
  padding: "13px 18px",
  backgroundColor: "#FAFCFE", borderTop: `1px solid ${line}`,
  flexShrink: 0,
};

const compMark = {
  width: 38, height: 38, borderRadius: "50%",
  backgroundColor: tint,
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
};

const compInput = {
  flex: 1, minWidth: 0,
  fontFamily: "Nunito, sans-serif",
  backgroundColor: tint, border: "1.5px solid transparent",
  borderRadius: 10, padding: "11px 14px",
  fontSize: 14, fontWeight: 600, color: navy, outline: "none",
};

const sendBtn = {
  fontFamily: "Nunito, sans-serif",
  display: "inline-flex", alignItems: "center", gap: 7,
  border: `1.5px solid ${line}`, backgroundColor: "#fff", color: mid,
  fontSize: 13.5, fontWeight: 800,
  padding: "11px 20px", borderRadius: 99,
  cursor: "not-allowed", flexShrink: 0,
};

const sendBtnOn = { backgroundColor: blue, borderColor: blue, color: "#fff", cursor: "pointer" };

// ── History modal ────────────────────────────────────────────────────────────
const modalOverlay = { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 };
const modalBox = { backgroundColor: "#fff", borderRadius: 12, padding: "2rem", maxWidth: 480, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", textAlign: "center" };
const modalTitle = { fontSize: "1.1rem", fontWeight: 700, color: "#1e3a5f", marginBottom: "1rem", fontFamily: "Nunito, sans-serif" };
const modalText = { fontSize: "0.95rem", color: "#374151", lineHeight: 1.6, marginBottom: "1.5rem", fontFamily: "Nunito, sans-serif" };
const modalBtn = { backgroundColor: blue, color: "white", border: "none", borderRadius: 8, padding: "0.65rem 2rem", fontSize: "1rem", fontWeight: 600, cursor: "pointer", fontFamily: "Nunito, sans-serif" };
