
import "../assets/css/App.css";
import * as React from "react";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import { CgProfile } from "react-icons/cg";
import { TiMessages } from "react-icons/ti";

const apiUrl = process.env.REACT_APP_API_URL;
const userBaseUrl = ``;


export function SearchUserResultsComponent({ query, setQuery, userId,
  setConversationUserId,
  setConversationUserUsername,
  handleGoToUser,
  setInputValue,
  onLoadingChange,
  isDarkMode = false,
  staticUsers = null,
}) {
  const dark = isDarkMode;
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    isError: isErrorUsers,
    error: errorUser,
    isSuccess: isSuccessUsers,
    refetch: refetchUsers,
  } = useGetUsersByUsernameQuery(query, { skip: staticUsers !== null || query.length < 3 });

  React.useEffect(() => {
    if (onLoadingChange) onLoadingChange(isLoadingUsers || isFetchingUsers);
  }, [isLoadingUsers, isFetchingUsers, onLoadingChange]);

  if (staticUsers !== null) {
    return (
      <div style={searchMainContainer}>
        <div style={searchResultsContainer(dark)}>
          {staticUsers?.length > 0
            ? <RenderSearchResults
                users={staticUsers}
                userId={userId}
                setConversationUserId={setConversationUserId}
                setConversationUserUsername={setConversationUserUsername}
                handleGoToUser={handleGoToUser}
                setInputValue={setInputValue}
                setQuery={setQuery}
                dark={dark}
              />
            : <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: "3rem", fontSize: "1rem" }}>
                No saved users yet
              </div>
          }
        </div>
      </div>
    );
  }

  return (
    <div style={searchMainContainer}>
      {isLoadingUsers || isFetchingUsers ? (
        <div style={{ marginTop: "20%" }}>
          <div className="spinner"></div>
        </div>
      ) : isSuccessUsers && query.length > 2 ? (
        <div style={searchResultsContainer(dark)}>
          <RenderSearchResults
            users={usersData}
            userId={userId}
            setConversationUserId={setConversationUserId}
            setConversationUserUsername={setConversationUserUsername}
            handleGoToUser={handleGoToUser}
            setInputValue={setInputValue}
            setQuery={setQuery}
            dark={dark}
          />
        </div>
      ) : isErrorUsers ? (
        <div>Error: {errorUser.message}</div>
      ) : null}
    </div>
  );
}


function RenderSearchResults({ users, userId, setConversationUserId, setConversationUserUsername, handleGoToUser, setInputValue, setQuery, dark }) {
  const [hoveredUserImgID, setHoveredUserImgID] = React.useState("")
  const [hoveredUserImgID2, setHoveredUserImgID2] = React.useState("")
  const [hoveredUserImgID3, setHoveredUserImgID3] = React.useState("")

  const StartConversationWithUser = (user) => {
    setConversationUserId(user.id);
    setConversationUserUsername(user.userName);
    setQuery("");
    setInputValue("");
  }

  if (!users) {
    console.log("no users");
    return null;
  }
  return <div style={searchResults}>
    {users.map((user) => (
      <div style={singleSearchResult(dark)} key={user.id}>
        <img
          title={`See ${user.userName}'s profile`}
          style={{ ...userProfileImg, ...((hoveredUserImgID3 === user.id) ? userprofileimgHover : {}) }}
          onMouseEnter={() => { setHoveredUserImgID3(user.id) }}
          onMouseLeave={() => setHoveredUserImgID3("")}
          onClick={() => { handleGoToUser(user.userId, user.userName, user.publicId); }}
          src={userBaseUrl + (user.profileImageThumbnailUrl || user.profileImageUrl)} alt="profile" />

        <div style={userNameText(dark)}>{user.userName}</div>
        <div title={`Send Message to ${user.userName}`}
          style={{ ...actionButtonStyle(dark), ...((hoveredUserImgID === user.id) ? actionButtonHover : {}) }}
          onMouseEnter={() => { setHoveredUserImgID(user.id) }}
          onMouseLeave={() => setHoveredUserImgID("")}
          onClick={() => StartConversationWithUser(user)}><TiMessages />
        </div>
        <div title={`See ${user.userName}'s profile`}
          style={{ ...actionButtonStyle(dark), ...((hoveredUserImgID2 === user.id) ? actionButtonHover : {}) }}
          onMouseEnter={() => { setHoveredUserImgID2(user.id) }}
          onMouseLeave={() => setHoveredUserImgID2("")}
          onClick={() => handleGoToUser(user.userId, user.userName, user.publicId)}>
          <CgProfile />
        </div>
      </div>
    ))}
  </div>
}



const actionButtonHover = {
  transform: "scale(1.2)",
};

const actionButtonStyle = (dark) => ({
  backgroundColor: dark ? "#0d2b4e" : "white",
  alignSelf: "center",
  color: "#3c9dde",
  borderRadius: "2rem",
  padding: ".5rem",
  border: dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #3c9dee42",
})

const searchResults = {
  margin: "1rem",
}

const searchMainContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "93vh",
}

const searchResultsContainer = (_dark) => ({
  height: "calc(100% - 5rem)",
  backgroundColor: "transparent",
})

const singleSearchResult = (dark) => ({
  width: "100%",
  backgroundColor: dark ? "#0a2240" : "#f6f6f6",
  marginBottom: "1rem",
  display: "grid",
  gridTemplateColumns: "4rem 6fr 1fr 1fr",
  alignItems: "center",
  borderRadius: "4rem",
  padding: ".5rem",
  cursor: "pointer",
});

const userProfileImg = {
  height: "4rem",
  width: "4rem",
  borderRadius: "50%",
  marginRight: "1rem",
  transition: "transform 0.3s ease-in-out",
}

const userprofileimgHover = {
  transform: "scale(1.2)",
};

const userNameText = (dark) => ({
  fontSize: "1.3rem",
  fontWeight: "bold",
  textAlign: "center",
  alignItems: "center",
  alignSelf: "center",
  color: dark ? "rgba(255,255,255,0.9)" : "#3c9dde",
})
