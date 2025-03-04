/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css"
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { BlueHashtagText } from "../components/BlueHashtagText";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { ProfilePageVoyagesComponent } from "../components/ProfilePageVoyagesComponent";
import { ProfilePageVehiclesComponent } from "../components/ProfilePageVehiclesComponent";
import { useSelector } from "react-redux";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { EditProfileSocialsComponent } from "../components/EditProfileSocialsComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


export function EditProfilePage() {
  const local_userId = localStorage.getItem("storedUserId")
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const [userName, setUserName] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userBio, setUserBio] = useState("");

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const userBaseUrl = `${apiUrl}/Uploads/UserImages/`;
  const handleGoToPublicPage = () => {
    navigate(`/profile-public/${userData.id}/${userData.userName}`);
  }


  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error,
    isSuccess: isSuccessUser,
    refetch: refetchUserData,
  } = useGetUserByIdQuery(userId);


  useEffect(() => {
    if (isSuccessUser) {
      console.log("userData: ", userData);
      setUserName(userData.userName);
      setUserTitle(userData.title);
      setUserBio(userData.bio);
    }

  }, [userData, isSuccessUser])


  return (
    isLoadingUser ? (
      <LoadingProfilePage />
    ) :
      isSuccessUser
        ? (
          <div className="App">
            <header className="App-header">
              <div className="flex mainpage_Container">
                <div className="flex mainpage_TopRow">
                  <TopLeftComponent />
                  <div className="flex mainpage_TopRight">
                    <TopBarMenu />
                  </div>
                </div>

                <div className="flex profilePage_Bottom">
                  <div className="flex profilePage_BottomLeft">
                    <div className="flex profilePage_CoverAndProfile">

                      <div className="profilePage_SendMessage" onClick={() => handleGoToPublicPage()}>
                        <span>Public Profile</span>
                      </div>
                      <div className="flex profilePage_CoverImage">
                        <img src={userBaseUrl + userData?.backgroundImageUrl} className=" profilePage_CoverImage_Img" alt="a" />

                      </div>
                      <div className="flex profilePage_ProfileImage">
                        <div>
                          <div className="profilePage_ProfileImage_Img_Container" >
                            <img src={userBaseUrl + userData?.profileImageUrl} className=" profilePage_ProfileImage_Img" alt="b" />
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="flex profilePage_BioAndContactDetails">
                      <div className="flex profilePage_BioTitleUserName" style={{ backgroundColor: " " }}>
                        <div className="flex profilePage_UserName">
                          <span className="profilePage_UserName"

                          ><UserNameInputComponent userName={userName} setUserName={setUserName} /></span>
                        </div>
                        <div className="flex profilePage_Title">
                          <span className="profilePage_Title">
                            <UserTitleInputComponent userTitle={userTitle} setUserTitle={setUserTitle} />
                          </span>
                        </div>
                        <div className="flex profilePage_Bio">

                          <ReactQuill
                            value={userBio}
                            onChange={(value) => setUserBio(value)}
                            placeholder="Tell us about your vehicle"
                            modules={{
                              // toolbar: [
                              // [{ header: [1, 2, false] }],
                              // ["bold", "italic", "underline"],
                              // [{ list: "ordered" }, { list: "bullet" }],
                              // ["emoji"],

                              // ],
                              toolbar: false,  // Disable the toolbar completely

                            }}
                            theme="snow"  // Ensure the theme is set to snow

                            style={{
                              color: "rgba(0, 119, 234, 0.9)",
                              fontWeight: "600",
                              fontSize: "1.1rem",
                              backgroundColor: "white",
                              borderRadius: "0.5rem",
                              padding: "0.5rem",
                              backgroundColor: "#007bff21",

                            }}
                          />
                        </div>
                      </div>
                      <div className="flex editProfilePage_ContactDetails" style={{ backgroundColor: " " }}>
                        {isSuccessUser ?
                          <EditProfileSocialsComponent userData={userData} />
                          : null
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col profilePage_BottomRight">
                    <div className="flex flex-col"
                      style={{
                        paddingLeft: ".5rem",
                        borderRadius: "1.5rem",
                        height: "calc(100vh - 3.5rem)",
                        width: "calc(100% - 0%)",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "1.5rem",
                          height: "100%",
                          flexDirection: "column",
                          width: "100%"
                        }}
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header >
          </div >
        ) : null
  );



}

const UserNameInputComponent = ({ userName, setUserName }) => {
  return (
    <input
      className="font-bold text-base custom-input"
      type="text"
      placeholder="Username"
      style={inputStyleUserName}
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />
  );
}

const UserTitleInputComponent = ({ userTitle, setUserTitle }) => {
  return (
    <input
      className="font-bold text-base custom-input"
      type="text"
      placeholder="Title"
      style={inputStyleTitle}
      value={userTitle}
      onChange={(e) => setUserTitle(e.target.value)}
    />
  );
}

const inputStyle = {
  width: "50%",
  padding: ".3rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  cursor: "pointer",
  height: "3rem",
  fontSize: "2rem",
  color: "#007bff",
  backgroundColor: "#007bff21",
}


const inputStyleUserName = {
  width: "50%",
  padding: ".3rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  cursor: "pointer",
  height: "3rem",
  fontSize: "2rem",
  color: "#007bff",
  backgroundColor: "#007bff21",
}


const inputStyleTitle = {
  width: "85%",
  padding: ".3rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  cursor: "pointer",
  height: "3rem",
  fontSize: "1.5rem",
  color: "#007bff",
  backgroundColor: "#007bff21",
}
