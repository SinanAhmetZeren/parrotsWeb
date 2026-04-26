/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css";
import React, { useState, useEffect, useRef } from "react";
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
import { parrotTextDarkBlue, parrotRed } from "../styles/colors";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { useSelector, useDispatch } from "react-redux";
import { useAddBookmarkMutation, useRemoveBookmarkMutation } from "../slices/UserSlice";
import { addBookmarkedUserId, removeBookmarkedUserId } from "../slices/UserSlice";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

function ProfilePagePublic() {
  const { userId } = useParams();
  const { userName } = useParams();
  const local_userId = localStorage.getItem("storedUserId");
  const isDarkMode = useSelector((state) => state.users.isDarkMode);
  const bookmarkedUserIds = useSelector((state) => state.users.bookmarkedUserIds);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addBookmark] = useAddBookmarkMutation();
  const [removeBookmark] = useRemoveBookmarkMutation();

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

  // userId from URL is publicId; use userData.id (internal) for bookmark operations
  const internalUserId = userData?.id ?? null;
  const isBookmarked = internalUserId ? bookmarkedUserIds.includes(internalUserId) : false;
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkHovered, setBookmarkHovered] = useState(false);

  const handleToggleBookmark = async () => {
    if (!internalUserId || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(internalUserId).unwrap();
        dispatch(removeBookmarkedUserId(internalUserId));
      } else {
        await addBookmark(internalUserId).unwrap();
        dispatch(addBookmarkedUserId(internalUserId));
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    } finally {
      setBookmarkLoading(false);
    }
  };

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
                  <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", alignItems: "center" }}>
                    <div onClick={() => handleSendMessageRequest()} style={navButton(isDarkMode)}>
                      <span>Send Message</span>
                    </div>
                    {local_userId === internalUserId
                      ? <div onClick={() => handleGoToProfilePage()} style={navButton(isDarkMode)}>
                          <span>Profile</span>
                        </div>
                      : <div style={{ position: "relative" }}
                            onMouseEnter={() => setBookmarkHovered(true)}
                            onMouseLeave={() => setBookmarkHovered(false)}
                          >
                          <div onClick={handleToggleBookmark} style={bookmarkButton(isBookmarked, bookmarkLoading)}>
                            {bookmarkLoading
                              ? <div style={bookmarkSpinner} />
                              : isBookmarked ? <BsBookmarkFill size="1.1rem" /> : <BsBookmark size="1.1rem" />}
                          </div>
                          {bookmarkHovered && !bookmarkLoading && (
                            <div style={bookmarkTooltip}>
                              {isBookmarked ? "Remove bookmark" : "Bookmark user"}
                            </div>
                          )}
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

const bookmarkButton = (active, loading) => ({
  borderRadius: "50%",
  backgroundColor: "white",
  color: loading ? "#c0c0c0" : active ? parrotRed : "#c0c0c0",
  width: "2.2rem",
  height: "2.2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: loading ? "default" : "pointer",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
  transition: "background-color 0.2s ease",
  flexShrink: 0,
});

const bookmarkTooltip = {
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "white",
  color: "#333",
  fontSize: "0.9rem",
  padding: "6px 14px",
  borderRadius: "8px",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  zIndex: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
};

const bookmarkSpinner = {
  width: "1rem",
  height: "1rem",
  border: "2px solid rgba(0,0,0,0.15)",
  borderTop: "2px solid #007bff",
  borderRadius: "50%",
  animation: "spin 0.7s linear infinite",
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
