/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { BlueHashtagText } from "../components/BlueHashtagText";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { useGetUserByPublicIdQuery } from "../slices/UserSlice";
import { ProfilePageVoyagesComponent } from "../components/ProfilePageVoyagesComponent";
import { ProfilePageVehiclesComponent } from "../components/ProfilePageVehiclesComponent";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { parrotTextDarkBlue } from "../styles/colors";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { useSelector } from "react-redux";

function ProfilePagePublic() {
  const { userId } = useParams();
  const { userName } = useParams();
  const local_userId = localStorage.getItem("storedUserId");
  const isDarkMode = useSelector((state) => state.users.isDarkMode);

  const navigate = useNavigate();

  const handleSendMessageRequest = () => {
    navigate(`/connect/${userId}/${userName}`);
  };

  const handleGoToProfilePage = () => {
    navigate(`/profile`);
  };

  const userBaseUrl = ``;

  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    isSuccess: isSuccessUser,
  } = useGetUserByPublicIdQuery(userId);

  const { data: healthCheckData, isError: isHealthCheckError } = useHealthCheckQuery();

  if (isHealthCheckError) return <SomethingWentWrong />;
  if (isErrorUser) return <SomethingWentWrong />;

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
                <div style={buttonsContainer}>
                  <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
                    <div onClick={() => handleSendMessageRequest()} style={navButton(isDarkMode)}>
                      <span>Send Message</span>
                    </div>
                    {local_userId === userId &&
                      <div onClick={() => handleGoToProfilePage()} style={navButton(isDarkMode)}>
                        <span>Profile</span>
                      </div>
                    }
                  </div>
                </div>

                <div className="flex profilePage_CoverImage">
                  <img src={userBaseUrl + userData?.backgroundImageUrl} className="profilePage_CoverImage_Img" alt="a" />
                </div>

                <div className="flex profilePage_ProfileImage">
                  <div>
                    <div className="profilePage_ProfileImage_Img_Container">
                      <div className="profilePage_ProfileImage_Img">
                        <img src={userBaseUrl + userData?.profileImageUrl} alt="Uploaded preview" style={profileImg} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex profilePage_BioAndContactDetails">
                <div
                  className="flex profilePage_BioTitleUserName"
                  style={isDarkMode ? { backgroundColor: "#0d2b4e" } : {}}
                >
                  <div className="flex profilePage_UserName">
                    <span className="profilePage_UserName" style={{ color: isDarkMode ? "rgba(255,255,255,0.9)" : parrotTextDarkBlue }}>
                      {userData.userName}
                    </span>
                  </div>
                  <div className="flex profilePage_Title">
                    <span className="profilePage_Title" style={{ color: isDarkMode ? "rgba(255,255,255,0.75)" : parrotTextDarkBlue }}>
                      {userData.title}
                    </span>
                  </div>
                  <div className="flex profilePage_Bio">
                    <BlueHashtagText originalText={userData.bio} isDarkMode={isDarkMode} />
                  </div>
                </div>
                <div className="flex profilePage_ContactDetails">
                  {isSuccessUser ? <SocialRenderComponent userData={userData} isDarkMode={isDarkMode} /> : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col profilePage_BottomRight">
              <div className="flex profilePage_Vehicles">
                {isSuccessUser ? (
                  userData?.usersVehicles.length > 0 ? (
                    <>
                      <span style={VehiclesVoyagesTitle}>Vehicles</span>
                      <ProfilePageVehiclesComponent userData={userData} isDarkMode={isDarkMode} />
                    </>
                  ) : null
                ) : null}
              </div>
              <div className="flex profilePage_Voyages">
                {isSuccessUser ? (
                  userData?.usersVoyages.length > 0 ? (
                    <>
                      <span style={VehiclesVoyagesTitle}>Voyages</span>
                      <ProfilePageVoyagesComponent userData={userData} isDarkMode={isDarkMode} />
                    </>
                  ) : null
                ) : null}

                {isSuccessUser &&
                  userData?.usersVoyages.length === 0 &&
                  userData?.usersVehicles.length === 0 && (
                    <div className="flex flex-col" style={{ paddingLeft: ".5rem", borderRadius: "1.5rem", height: "calc(100vh - 3.5rem)", width: "calc(100% - 0%)", flexDirection: "column" }}>
                      <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "1.5rem", height: "100%", flexDirection: "column", width: "100%" }} />
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
  width: "100%", height: "100%", objectFit: "cover",
  border: "2px solid transparent", overFlow: "hidden", borderRadius: "1rem",
};

const VehiclesVoyagesTitle = {
  width: "100%", fontSize: "2rem", fontWeight: 800, color: "white",
};

const buttonsContainer = {
  position: "absolute", top: "0", left: "0", width: "100%",
  display: "flex", justifyContent: "flex-end", alignItems: "center",
  padding: "0.5rem", boxSizing: "border-box",
  borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem",
};

const navButton = (_dark) => ({
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
});
