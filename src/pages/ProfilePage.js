/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { BlueHashtagText } from "../components/BlueHashtagText";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import {
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} from "../slices/UserSlice";
import { ProfilePageVoyagesComponent } from "../components/ProfilePageVoyagesComponent";
import { ProfilePageVehiclesComponent } from "../components/ProfilePageVehiclesComponent";
import { useSelector, useDispatch } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";
import { stopHubConnection } from "../signalr/signalRHub";
import { apiSlice } from "../api/apiSlice";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { parrotButtonDarkBlue, parrotDarkBlue, parrotTextDarkBlue } from "../styles/colors";
import TermsOfUseComponent from "../components/TermsOfUseComponent";
import parrotCoin from "../assets/images/parrotcoin.png"

function ProfilePage() {
  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const isDarkMode = useSelector((state) => state.users.isDarkMode);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    stopHubConnection();
    dispatch(updateAsLoggedOut());
    dispatch(apiSlice.util.resetApiState());
    navigate("/login");
  };
  const apiUrl = process.env.REACT_APP_API_URL;
  const userBaseUrl = ``;
  const [isOpen, setIsOpen] = useState(false);
  const [isParrotCoinHovered, setIsParrotCoinHovered] = useState(false);

  const handleGoToPublicPage = () => {
    navigate(`/profile-public/${userData.publicId}/${userData.userName}`);
  };

  const handleGoToEditProfilePage = () => {
    navigate(`/edit-profile`);
  };

  const gotoNewVehicle = () => {
    navigate(`/newVehicle`);
  };

  const gotoNewVoyage = () => {
    navigate(`/newVoyage`);
  };

  const handleGoToParrotCoinPage = () => {
    navigate(`/parrotCoinPage`);
  };

  const [
    triggerGetUserById,
    {
      data: userData,
      isLoading: isLoadingUser,
      isError: isErrorUser,
      error,
      isSuccess: isSuccessUser,
    },
  ] = useLazyGetUserByIdQuery();

  useEffect(() => {
    const token = localStorage.getItem("storedToken");
    if (userId && token) {
      console.log("getting data for user id: ", userId);

      const res = triggerGetUserById(userId);
      console.log(res);
    }

    return () => {
      // console.log("Cleanup: Unsubscribing or resetting data if necessary");
      // Optionally clear userData-related local state or reset component state here
    };
  }, [userId, triggerGetUserById]);

  useEffect(() => {
    if (isSuccessUser) console.log("userData--------> ", userData);
  }, [userData, isSuccessUser]);

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  return isLoadingUser ? (
    <LoadingProfilePage />
  ) : isErrorUser ? (
    <SomethingWentWrong />
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
              <div style={buttonsAndImagesContainer}>
                <div style={buttonsContainer}>
                  <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", alignItems: "center" }}>
                    <TermsOfUseComponent isDarkMode={isDarkMode} />
                    <div onClick={() => setShowLogoutModal(true)} style={logoutPill}>
                      <span>Logout</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <div onClick={() => handleGoToPublicPage()} style={navButton(isDarkMode)}>
                      <span>Public Profile</span>
                    </div>
                    <div onClick={() => handleGoToEditProfilePage()} style={navButton(isDarkMode)}>
                      <span>Edit Profile</span>
                    </div>
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

                <div style={parrotCoinContainer}
                  onClick={() => handleGoToParrotCoinPage()}
                >
                  <img
                    src={parrotCoin}
                    alt="Uploaded preview"
                    style={{
                      ...parrotCoinImg,
                      transform: isParrotCoinHovered ? "scale(1.3)" : "scale(1)",
                      transition: "transform 0.3s ease-in-out",
                      display: "block",
                    }}
                    onMouseEnter={() => setIsParrotCoinHovered(true)}
                    onMouseLeave={() => setIsParrotCoinHovered(false)}

                  />
                </div>

              </div>
              <div className="flex profilePage_BioAndContactDetails">
                <div
                  className="flex profilePage_BioTitleUserName"
                  style={isDarkMode ? { backgroundColor: "#0d2b4e" } : {}}
                >
                  <div
                    className="flex profilePage_UserName"
                    style={{ justifyContent: "left" }}
                  >
                    <span
                      className="profilePage_UserName"
                      style={{ color: isDarkMode ? "rgba(255,255,255,0.9)" : parrotTextDarkBlue }}
                    >
                      {userData.userName}
                    </span>
                  </div>
                  <div
                    className="flex profilePage_Title"
                    style={{ color: isDarkMode ? "rgba(255,255,255,0.75)" : parrotTextDarkBlue }}
                  >
                    <span className="profilePage_Title">{userData.title}</span>
                  </div>
                  <div className="flex profilePage_Bio">
                    <BlueHashtagText originalText={userData.bio} isDarkMode={isDarkMode} />
                  </div>
                </div>
                <div className="flex profilePage_ContactDetails">
                  {isSuccessUser ? (
                    <SocialRenderComponent userData={userData} isDarkMode={isDarkMode} />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col profilePage_BottomRight">
              <div className="flex profilePage_Vehicles ">
                {isSuccessUser ? (
                  userData?.usersVehicles.length > 0 ? (
                    <>
                      <div style={titlesContainer}>
                        <span style={VehiclesVoyagesTitle}>Vehicles</span>
                        <span
                          onClick={() => {
                            gotoNewVehicle();
                          }}
                          style={NewVehicle}
                        >
                          New Vehicle
                        </span>
                      </div>

                      <ProfilePageVehiclesComponent
                        userData={userData}
                        isDarkMode={isDarkMode}
                      // userFavoriteVehicles={state_favVehicles}
                      />
                    </>
                  ) : (
                    <>
                      <div style={titlesContainer}>
                        <span style={VehiclesVoyagesTitle}>Vehicles</span>
                        <span
                          onClick={() => {
                            gotoNewVehicle();
                          }}
                          style={NewVehicle}
                        >
                          New Vehicle
                        </span>
                      </div>
                      <div style={noVoyagesYetContainer}>
                        <NoVoyagesVehiclesPlaceHolder type={"Vehicle"} isDarkMode={isDarkMode} />
                      </div>
                    </>
                  )
                ) : null}
              </div>
              <div className="flex profilePage_Voyages ">
                {isSuccessUser ? (
                  userData?.usersVoyages.length > 0 ? (
                    <>
                      <div style={titlesContainer}>
                        <span style={VehiclesVoyagesTitle}>Voyages</span>
                        <span
                          onClick={() => {
                            gotoNewVoyage();
                          }}
                          style={NewVehicle}
                        >
                          New Voyage
                        </span>
                      </div>
                      <ProfilePageVoyagesComponent
                        userData={userData}
                        isDarkMode={isDarkMode}
                      // userFavoriteVoyages={state_favVoyages}
                      />
                    </>
                  ) : (
                    <>
                      <div style={titlesContainer}>
                        <span style={VehiclesVoyagesTitle}>Voyages</span>
                        <span
                          onClick={() => {
                            gotoNewVoyage();
                          }}
                          style={NewVehicle}
                        >
                          New Voyage
                        </span>
                      </div>
                      <div style={noVoyagesYetContainer}>
                        <NoVoyagesVehiclesPlaceHolder type={"Voyage"} isDarkMode={isDarkMode} />
                      </div>
                    </>
                  )
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>
      {showLogoutModal && (
        <div style={modalOverlay} onClick={() => setShowLogoutModal(false)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "rgba(10,119,234,.7)", fontWeight: "bold" }}>
              Are you sure you want to log out?
            </h3>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button onClick={handleLogout} style={{ ...modalBtn, backgroundColor: "#2ac898" }}>Yes, Logout</button>
              <button onClick={() => setShowLogoutModal(false)} style={{ ...modalBtn, backgroundColor: "rgba(10,119,234,1)" }}>Stay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
}

export default ProfilePage;


const parrotCoinImg = {
  position: "absolute",
  top: "0.1rem"
}

const parrotCoinContainer = {
  position: "absolute",
  height: "5rem",
  width: "5rem",
  borderRadius: "5rem",
  right: 0,
  marginRight: "1rem",
  marginBottom: "1rem",
  backgroundColor: "#cad8ecaa",
  cursor: "pointer"
}

const buttonsContainer = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  display: "flex",
  justifyContent: "space-between", // pushes left vs right sections apart
  alignItems: "center",
  padding: "0.5rem",
  // backgroundColor: "rgba(255, 255, 255, 0.54321) ",
  boxSizing: "border-box",
  borderTopLeftRadius: "1rem",
  borderTopRightRadius: "1rem",
}

const buttonsAndImagesContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  height: "60%",
  width: "100%",
  position: "relative",
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




const profileImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  border: "2px solid transparent",
  overFlow: "hidden",
  borderRadius: "1rem",
}

const titlesContainer = {
  display: "flex",
  flexDirection: "row",
  width: "70%",
  margin: "auto",
  marginBottom: ".5rem",
  marginTop: ".5rem",
  alignItems: "center",
}

const modalOverlay = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
  alignItems: "center", zIndex: 2000,
};

const modalContent = {
  background: "white", padding: "2rem", borderRadius: "8px",
  textAlign: "center", boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
};

const modalBtn = {
  padding: "0.6rem 1.5rem", borderRadius: "1.5rem", color: "white",
  fontWeight: "bold", cursor: "pointer", fontSize: "1.2rem", border: "none",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
};

const logoutPill = {
  borderRadius: "1.5rem",
  backgroundColor: "white",
  color: "#e05555",
  padding: "0.2rem 0.8rem",
  textAlign: "center",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1.1rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
};

const VehiclesVoyagesTitle = {
  width: "100%", // Added quotes around "100%"
  fontSize: "2rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white",
};

const NewVehicle = {
  width: "60%", // Added quotes around "100%"
  height: "65%",
  fontSize: "1.2rem", // Changed to camelCase
  fontWeight: "bold", // Correct format for font-weight
  color: "white",
  borderRadius: "1.5rem",
  backgroundColor: "#007bff",
  backgroundColor: parrotDarkBlue,
  cursor: "pointer",
  border: "none",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
};

const noVoyagesYetContainer = {
  width: "100%",
  height: "22rem",
  marginBottom: "1rem",
};

const NoVoyagesVehiclesPlaceHolder = ({ type }) => {
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        height: "100%",
        width: "92%",
        padding: "1vh",
        borderRadius: "1.5rem",
        position: "relative",
        margin: "auto",
        display: "flex", // Use flexbox
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        textAlign: "center", // Ensure text alignment
      }}
    >
      <span
        style={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "1.1rem",
          fontWeight: 800,
          textShadow: `
          2px 2px 4px rgba(0, 0, 0, 0.6),  
          -2px -2px 4px rgba(255, 255, 255, 0.2)
        `,
          filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))",
        }}
      >
        Add a new {type}
      </span>
    </div>
  );
};
