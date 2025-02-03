
import "../assets/css/App.css";
import * as React from "react";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import { CgProfile } from "react-icons/cg";
import { TiMessages } from "react-icons/ti";

const apiUrl = process.env.REACT_APP_API_URL;
const userBaseUrl = `${apiUrl}/Uploads/UserImages/`;


export function SearchUserResultsComponent({ query, setQuery, userId,
  setConversationUserId,
  setConversationUserUsername,
  handleGoToUser
}) {
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUser,
    isSuccess: isSuccessUsers,
    refetch: refetchUsers,
  } = useGetUsersByUsernameQuery(query, { skip: query.length < 3 });


  return (
    <div style={searchMainContainer}>
      {isLoadingUsers ? (
        <div style={{ marginTop: "20%" }}>
          <div className="spinner"></div>
        </div>
      ) : isSuccessUsers && query.length > 2 ? (
        <div style={searchResultsContainer}>
          <RenderSearchResults
            users={usersData}
            userId={userId}
            setConversationUserId={setConversationUserId}
            setConversationUserUsername={setConversationUserUsername}
            handleGoToUser={handleGoToUser}
          />
        </div>
      ) : isErrorUsers ? (
        <div>Error: {errorUser.message}</div>
      ) : null}
    </div>
  );
}


function RenderSearchResults({ users, userId, setConversationUserId, setConversationUserUsername, handleGoToUser }) {
  const [hoveredUserImgID, setHoveredUserImgID] = React.useState("")
  const [hoveredUserImgID2, setHoveredUserImgID2] = React.useState("")
  const [hoveredUserImgID3, setHoveredUserImgID3] = React.useState("")

  const StartConversationWithUser = (user) => {
    setConversationUserId(user.id);
    setConversationUserUsername(user.userName)
  }

  if (!users) {
    console.log("no users");
    return null;
  }
  return <div style={searchResults}>
    {users.map((user) => (
      <div style={singleSearchResult} key={user.id}>
        <img
          title={`See ${user.userName}'s profile`}
          style={{ ...userProfileImg, ...((hoveredUserImgID3 === user.id) ? userprofileimgHover : {}) }}
          onMouseEnter={() => {
            setHoveredUserImgID3(user.id)
          }}
          onMouseLeave={() => setHoveredUserImgID3("")}
          onClick={() => handleGoToUser(user.id, user.userName)}
          src={userBaseUrl + user.profileImageUrl} alt="profile" />

        <div style={userNameText}>{user.userName}</div>
        <div title={`Send Message to ${user.userName}`}
          style={{ ...sendMessageStyle, ...((hoveredUserImgID === user.id) ? seeProfileStyleHover : {}) }}
          onMouseEnter={() => {
            setHoveredUserImgID(user.id)
          }}
          onMouseLeave={() => setHoveredUserImgID("")}
          onClick={() => StartConversationWithUser(user)}><TiMessages />
        </div>
        <div title={`See ${user.userName}'s profile`}
          style={{ ...seeProfileStyle, ...((hoveredUserImgID2 === user.id) ? seeProfileStyleHover : {}) }}
          onMouseEnter={() => {
            setHoveredUserImgID2(user.id)
          }}
          onMouseLeave={() => setHoveredUserImgID2("")}
          onClick={() => handleGoToUser(user.id, user.userName)}>
          <CgProfile />
        </div>
      </div>
    ))}
  </div>
}



const seeProfileStyleHover = {
  transform: "scale(1.2)", // Enlarge on hover
};

const seeProfileStyle = {
  backgroundColor: "white",
  alignSelf: "center",
  color: "#3c9dde",
  borderRadius: "2rem",
  padding: ".5rem",
  border: "2px solid #3c9dee42"
}

const sendMessageStyle = {
  backgroundColor: "white",
  alignSelf: "center",
  color: "#3c9dde",
  borderRadius: "2rem",
  padding: ".5rem",
  border: "2px solid #3c9dee42"
}



const searchResults = {
  margin: "1rem",
}

const searchMainContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "93vh"
}

const searchResultsContainer = {
  height: "calc(100% - 5rem)",
  backgroundColor: "white",
}

const singleSearchResult = {
  width: "100%",
  backgroundColor: "#f6f6f6",
  marginBottom: "1rem",
  display: "grid",
  gridTemplateColumns: "4rem 6fr 1fr 1fr",
  alignItems: "center",
  borderRadius: "4rem",
  padding: ".5rem",
  cursor: "pointer",
};

const userProfileImg = {
  height: "4rem",
  width: "4rem",
  borderRadius: "50%",
  marginRight: "1rem",
  transition: "transform 0.3s ease-in-out", // Smooth transition

}

const userprofileimgHover = {
  transform: "scale(1.2)", // Enlarge on hover
};

const userNameText = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  textAlign: "center",
  alignItems: "center",
  alignSelf: "center",
  color: "#3c9dde",
}

