
import "../assets/css/App.css";
import * as React from "react";
import { useEffect } from "react";
import { useGetUsersByUsernameQuery } from "../slices/UserSlice";
import { IoSearch } from "react-icons/io5";

const apiUrl = process.env.REACT_APP_API_URL;
const userBaseUrl = `${apiUrl}/Uploads/UserImages/`;


export function SearchUserComponent({ query, setQuery }) {

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUser,
    isSuccess: isSuccessUsers,
    refetch: refetchUsers,
  } = useGetUsersByUsernameQuery(query, { skip: query.length < 3 });

  const handleInputChange = (event) => {
    setQuery(event.target.value); // Properly set the query value
  };

  useEffect(() => {
    // console.log("useEffect: ", usersData);
  }, [usersData]);

  return (
    <div style={searchMainContainer}>
      <div style={searchUserContainer}>

        <input
          type="text"
          value={query}
          onChange={handleInputChange} // Use the correct handler
          style={inputStyle} // Added styles for input
        />
        <div style={magnifierContainerStyle}>
          <IoSearch style={magnifierStyle} />
        </div>

      </div>
      {query.length > 2 ?
        <div style={searchResultsContainer}>

          <RenderSearchResults users={usersData} />
        </div> : null}
    </div>

  );
}

const gotoProfile = (profileId) => {
  console.log("gotoProfile: ", profileId);
}

function RenderSearchResults({ users }) {
  if (!users) {
    console.log("no users");
    return null;
  }

  return <div style={searchResults}>
    {users.map((user) => (
      <div onClick={() => gotoProfile(user.id)} style={singleSearchResult} key={user.id}>
        <img style={userProfileImg} src={userBaseUrl + user.profileImageUrl} alt="profile" />
        <div style={userNameText}>{user.userName}</div>
      </div>
    ))}
  </div>
}

const magnifierContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: ".5rem",
};

const magnifierStyle = {
  backgroundColor: "#f9f5f1",
  borderRadius: "50%",
  padding: ".2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#3c9dde",
  height: "3rem",
  width: "3rem",
};

const searchUserContainer = {
  display: "flex",
  flexDirection: "row",
  height: "5rem",
  width: "100%",
  color: "black",
}

const inputStyle = {
  width: "26rem",
  height: "3rem",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  borderRadius: "2rem",
  backgroundColor: "#f9f5f1",
  fontSize: "1.5rem",
}

const searchResults = {
  margin: "1rem",
}

const searchMainContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
}

const searchResultsContainer = {
  height: "calc(100% - 5rem",
  backgroundColor: "white",
}

const singleSearchResult = {
  width: "100%",
  backgroundColor: "#f6f6f6",
  marginBottom: "1rem",
  display: "flex",
  flexDirection: "row",
  borderRadius: "4rem",
  padding: ".5rem",
  cursor: "pointer",
}

const userProfileImg = {
  height: "4rem",
  width: "4rem",
  borderRadius: "50%",
  marginRight: "1rem",
}

const userNameText = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  textAlign: "center",
  alignItems: "center",
  alignSelf: "center",
  color: "#3c9dde",
}