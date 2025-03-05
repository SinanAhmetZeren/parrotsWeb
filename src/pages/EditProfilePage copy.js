/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css"
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { useSelector } from "react-redux";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { EditProfileSocialsComponent } from "../components/EditProfileSocialsComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserNameInputComponent } from "../components/UserNameInputComponent";
import { UserTitleInputComponent } from "../components/UserTitleInputComponent";


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
                      <div className="flex profilePage_BioTitleUserName">
                        <div className="flex profilePage_UserName">
                          <span className="profilePage_UserName">
                            <UserNameInputComponent userName={userName} setUserName={setUserName} />
                          </span>
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
                              toolbar: false,
                            }}
                            style={{
                              color: "rgba(0, 119, 234, 0.9)",
                              fontWeight: "600",
                              fontSize: "1.1rem",
                              borderRadius: "1.5rem",
                              padding: "0.5rem",
                              backgroundColor: "#007bff21",
                            }}
                          />
                          <style>
                            {`
                            .ql-container {
                              border: none !important; /* Removes border around editor */
                            }
                            .ql-editor {
                              border: none !important; /* Removes inner border */
                            }
                          `}
                          </style>
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



