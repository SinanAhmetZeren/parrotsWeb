/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { BlueHashtagText } from "../components/BlueHashtagText";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { useGetUserByIdQuery, useGetUserByPublicIdQuery } from "../slices/UserSlice";
import { ProfilePageVoyagesComponent } from "../components/ProfilePageVoyagesComponent";
import { ProfilePageVehiclesComponent } from "../components/ProfilePageVehiclesComponent";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { parrotTextDarkBlue } from "../styles/colors";
import { LoadingProfilePage } from "../components/LoadingProfilePage";

function ProfilePagePublic() {
  const { userId } = useParams();
  const { userName } = useParams();
  const local_userId = localStorage.getItem("storedUserId");

  const navigate = useNavigate();

  console.log("-> userId of public profile", userId);
  console.log("-> local_userId of logged in user", local_userId);

  const handleSendMessageRequest = () => {
    navigate(`/connect/${userId}/${userName}`);
  };

  const handleGoToProfilePage = () => {
    navigate(`/profile`);
  };

  const apiUrl = process.env.REACT_APP_API_URL;
  const userBaseUrl = ``;

  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error,
    isSuccess: isSuccessUser,
    refetch: refetchUserData,
    // } = useGetUserByIdQuery(userId);
  } = useGetUserByPublicIdQuery(userId);

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (isErrorUser) {
    return <SomethingWentWrong />;
  }

  return isLoadingUser ? (
    <LoadingProfilePage />
  ) : isSuccessUser ? (
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
                {/* <div
                  className="profilePage_SendMessage"
                  onClick={() => handleSendMessageRequest()}
                >
                  <span>Send Message</span>
                </div>

                {
                  local_userId === userId ?

                    <div
                      className="profilePage_gotoPublicProfileButton"
                      onClick={() => handleGoToProfilePage()}
                    >
                      <span>Profile</span>
                    </div>

                    : null
                } */}


                <div style={buttonsContainer}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <div onClick={() => handleSendMessageRequest()} style={navigationButton}>
                      <span>Send Message</span>
                    </div>


                    {local_userId === userId &&
                      <div onClick={() => handleGoToProfilePage()} style={navigationButton}>
                        <span>Profile</span>
                      </div>
                    }
                  </div>
                </div>


                <div className="flex profilePage_CoverImage">
                  <img
                    src={userBaseUrl + userData?.backgroundImageUrl}
                    className=" profilePage_CoverImage_Img"
                    alt="a"
                  />
                </div>

                <div className="flex profilePage_ProfileImage">
                  <div>
                    <div className="profilePage_ProfileImage_Img_Container">
                      <div className="profilePage_ProfileImage_Img">
                        <img
                          src={userBaseUrl + userData?.profileImageUrl}
                          alt="Uploaded preview"
                          style={profileImg}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex profilePage_BioAndContactDetails">
                <div className="flex profilePage_BioTitleUserName">
                  <div className="flex profilePage_UserName">
                    <span
                      className="profilePage_UserName"
                      style={{ color: parrotTextDarkBlue }}
                    >
                      {userData.userName}
                    </span>
                  </div>
                  <div className="flex profilePage_Title">
                    <span
                      className="profilePage_Title"
                      style={{ color: parrotTextDarkBlue }}
                    >
                      {userData.title}
                    </span>
                  </div>
                  <div className="flex profilePage_Bio">
                    <BlueHashtagText originalText={userData.bio} />
                  </div>
                </div>
                <div className="flex profilePage_ContactDetails">
                  {isSuccessUser ? (
                    <SocialRenderComponent userData={userData} />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col profilePage_BottomRight">
              <div className="flex profilePage_Vehicles ">
                {isSuccessUser ? (
                  userData?.usersVehicles.length > 0 ? (
                    <>
                      <span style={VehiclesVoyagesTitle}>Vehicles</span>
                      <ProfilePageVehiclesComponent userData={userData} />
                    </>
                  ) : null
                ) : null}
              </div>
              <div className="flex profilePage_Voyages ">
                {isSuccessUser ? (
                  userData?.usersVoyages.length > 0 ? (
                    <>
                      <span style={{ ...VehiclesVoyagesTitle }}>Voyages</span>
                      <ProfilePageVoyagesComponent userData={userData} />
                    </>
                  ) : null
                ) : null}

                {isSuccessUser &&
                  userData?.usersVoyages.length === 0 &&
                  userData?.usersVehicles.length === 0 && (
                    <div
                      className="flex flex-col"
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
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "1.5rem",
                          height: "100%",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      ></div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  ) : null;
}

export default ProfilePagePublic;

const profileImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  border: "2px solid transparent",
  overFlow: "hidden",
  borderRadius: "1rem",
}

const VehiclesVoyagesTitle = {
  width: "100%", // Added quotes around "100%"
  fontSize: "2rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white",
};

const buttonsContainer = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end", // single child aligned right
  alignItems: "center",
  padding: "0.5rem",
  // backgroundColor: "rgba(255, 255, 255, 0.54321) ",
  boxSizing: "border-box",
  borderTopLeftRadius: "1rem",
  borderTopRightRadius: "1rem",
}

const navigationButton = {
  borderRadius: "1.5rem",
  backgroundColor: "white",
  color: "#007bff",
  padding: "0.2rem 0.8rem",
  textAlign: "center",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1.1rem",
  border: "none",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};