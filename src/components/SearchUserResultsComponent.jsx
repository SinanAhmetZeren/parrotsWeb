
import "../assets/css/App.css";
import * as React from "react";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";

const blueDk = "#0A5FBF";
const mid = "#5C6B7A";
const tint = "#F4F7FB";

export function SearchUserResultsComponent({
  query, setQuery, userId,
  setConversationUserId,
  setConversationUserUsername,
  handleGoToUser,
  setInputValue,
  onLoadingChange,
  isDarkMode = false,
  staticUsers = null,
}) {
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    isError: isErrorUsers,
    error: errorUser,
    isSuccess: isSuccessUsers,
  } = useGetUsersByUsernameQuery(query, { skip: staticUsers !== null || query.length < 3 });

  React.useEffect(() => {
    if (onLoadingChange) onLoadingChange(isLoadingUsers || isFetchingUsers);
  }, [isLoadingUsers, isFetchingUsers, onLoadingChange]);

  if (staticUsers !== null) {
    return staticUsers?.length > 0
      ? <Results users={staticUsers} userId={userId} setConversationUserId={setConversationUserId} setConversationUserUsername={setConversationUserUsername} handleGoToUser={handleGoToUser} setInputValue={setInputValue} setQuery={setQuery} />
      : <p style={emptyText}>No saved users yet</p>;
  }

  if (isLoadingUsers || isFetchingUsers) return <div style={{ marginTop: "20%", display: "flex", justifyContent: "center" }}><div className="spinner" /></div>;
  if (isErrorUsers) return <div style={emptyText}>Error: {errorUser?.message}</div>;
  if (isSuccessUsers && query.length > 2) return <Results users={usersData} userId={userId} setConversationUserId={setConversationUserId} setConversationUserUsername={setConversationUserUsername} handleGoToUser={handleGoToUser} setInputValue={setInputValue} setQuery={setQuery} />;
  return null;
}

function Tip({ text, children }) {
  const [show, setShow] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <span style={tip}>{text}</span>}
    </span>
  );
}

function Results({ users, userId, setConversationUserId, setConversationUserUsername, handleGoToUser, setInputValue, setQuery }) {
  const [hoveredAvId, setHoveredAvId] = React.useState(null);
  if (!users?.length) return <p style={emptyText}>No users found</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {users.map(user => (
        <div key={user.id} style={thStyle}>
          <span
            style={{ ...avStyle, cursor: "pointer", transform: hoveredAvId === user.id ? "scale(1.18)" : "scale(1)", transition: "transform 0.2s" }}
            title={`See ${user.userName}'s profile`}
            onClick={() => handleGoToUser(user.userId, user.userName, user.publicId)}
            onMouseEnter={() => setHoveredAvId(user.id)}
            onMouseLeave={() => setHoveredAvId(null)}
          >
            <img src={user.profileImageThumbnailUrl || user.profileImageUrl} style={avImg} alt="" />
          </span>
          <span style={nameStyle}>{user.userName}</span>
          <Tip text="Send message">
            <span style={actBtn} onClick={() => { setConversationUserId(user.id); setConversationUserUsername(user.userName); setQuery(""); setInputValue(""); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:19,height:19}}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>
            </span>
          </Tip>
          <Tip text="View profile">
            <span style={actBtn} onClick={() => handleGoToUser(user.userId, user.userName, user.publicId)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:19,height:19}}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19a6 6 0 0 1 11 0"/></svg>
            </span>
          </Tip>
        </div>
      ))}
    </div>
  );
}

const thStyle = {
  fontFamily: "Nunito, sans-serif",
  display: "flex", alignItems: "center", gap: 10,
  width: "100%",
  border: "1.5px solid transparent",
  background: tint, borderRadius: 11,
  padding: "9px 10px 9px 9px",
  cursor: "default",
};


const avStyle = {
  width: 42, height: 42, borderRadius: "50%",
  overflow: "hidden", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
};

const avImg = { width: "100%", height: "100%", objectFit: "cover" };

const nameStyle = {
  flex: 1, minWidth: 0,
  fontSize: 14.5, fontWeight: 800, color: blueDk,
  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  paddingLeft: 4, textAlign: "left",
};

const actBtn = {
  width: 38, height: 38, borderRadius: 9,
  background: "#E6EFFB", color: "#0A5FBF",
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0, cursor: "pointer",
};

const tip = {
  position: "absolute", top: "calc(100% + 6px)", left: "50%",
  transform: "translateX(-50%)",
  background: "#0A2540", color: "#fff",
  fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
  padding: "4px 9px", borderRadius: 6,
  pointerEvents: "none", zIndex: 99,
};

const emptyText = {
  color: mid, fontSize: "0.85rem", fontWeight: 700,
  textAlign: "center", padding: "2rem 1rem",
};
