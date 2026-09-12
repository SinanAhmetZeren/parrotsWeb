
import "../assets/css/App.css";
import * as React from "react";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import { TiMessages } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";

const blueDk = "#0A5FBF";
const mid = "#5C6B7A";
const line = "#E3E9F0";
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

function Results({ users, userId, setConversationUserId, setConversationUserUsername, handleGoToUser, setInputValue, setQuery }) {
  if (!users?.length) return <p style={emptyText}>No users found</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {users.map(user => (
        <div
          key={user.id}
          style={thStyle}
          onMouseEnter={e => Object.assign(e.currentTarget.style, thHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: "transparent", background: tint })}
        >
          <span
            style={avStyle}
            title={`See ${user.userName}'s profile`}
            onClick={() => handleGoToUser(user.userId, user.userName, user.publicId)}
          >
            <img src={user.profileImageThumbnailUrl || user.profileImageUrl} style={avImg} alt="" />
          </span>
          <span style={nameStyle}>{user.userName}</span>
          <button
            style={iconBtn}
            title={`Send message to ${user.userName}`}
            onClick={() => { setConversationUserId(user.id); setConversationUserUsername(user.userName); setQuery(""); setInputValue(""); }}
          ><TiMessages /></button>
          <button
            style={iconBtn}
            title={`See ${user.userName}'s profile`}
            onClick={() => handleGoToUser(user.userId, user.userName, user.publicId)}
          ><CgProfile /></button>
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
  cursor: "pointer",
  transition: "border-color 0.15s, background 0.15s",
};

const thHover = { borderColor: "#C9DAF0", background: "#fff" };

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
  paddingLeft: 4,
};

const iconBtn = {
  fontFamily: "Nunito, sans-serif",
  width: 30, height: 30, borderRadius: 8,
  border: `1px solid ${line}`, background: "#fff",
  color: mid, display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "1.1rem", cursor: "pointer", flexShrink: 0,
  transition: "border-color 0.15s, color 0.15s",
};

const emptyText = {
  color: mid, fontSize: "0.85rem", fontWeight: 700,
  textAlign: "center", padding: "2rem 1rem",
};
