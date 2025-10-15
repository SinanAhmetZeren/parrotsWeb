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
import { useSelector } from "react-redux";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { parrotButtonDarkBlue, parrotDarkBlue, parrotTextDarkBlue } from "../styles/colors";
import TermsOfUseComponent from "../components/TermsOfUseComponent";

function ProfilePage() {
  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const userBaseUrl = ``;
  const [isOpen, setIsOpen] = useState(false);

  const handleGoToPublicPage = () => {
    navigate(`/profile-public/${userData.id}/${userData.userName}`);
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
      triggerGetUserById(userId);
    }

    return () => {
      console.log("Cleanup: Unsubscribing or resetting data if necessary");
      // Optionally clear userData-related local state or reset component state here
    };
  }, [userId, triggerGetUserById]);

  // useEffect(() => {
  //   if (isSuccessUser) console.log("userData--------> ", userData);
  // }, [userData, isSuccessUser]);

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
                  <TermsOfUseComponent />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5rem",
                    }}
                  >
                    <div onClick={() => handleGoToPublicPage()} style={navigationButton}>
                      <span>Public Profile</span>
                    </div>
                    <div onClick={() => handleGoToEditProfilePage()} style={navigationButton}>
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
              </div>
              <div className="flex profilePage_BioAndContactDetails">
                <div className="flex profilePage_BioTitleUserName">
                  <div
                    className="flex profilePage_UserName"
                    style={{ justifyContent: "left" }}
                  >
                    <span
                      className="profilePage_UserName"
                      style={{ color: parrotTextDarkBlue }}
                    >
                      {userData.userName}
                    </span>
                  </div>
                  <div
                    className="flex profilePage_Title"
                    style={{ color: parrotTextDarkBlue }}
                  >
                    <span className="profilePage_Title">{userData.title}</span>
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
                        <NoVoyagesVehiclesPlaceHolder type={"Vehicle"} />
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
                        <NoVoyagesVehiclesPlaceHolder type={"Voyage"} />
                      </div>
                    </>
                  )
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  ) : null;
}

export default ProfilePage;


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
