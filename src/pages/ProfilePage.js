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


function ProfilePage() {
  const local_userId = localStorage.getItem("storedUserId")
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;


  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const userBaseUrl = `${apiUrl}/Uploads/UserImages/`;
  const handleGoToPublicPage = () => {
    navigate(`/profile-public/${userData.id}/${userData.userName}`);
  }
  const gotoNewVehicle = () => {
    navigate(`/newVehicle`);
  }


  const gotoNewVoyage = () => {
    navigate(`/newVoyage`);
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
    if (isSuccessUser)
      console.log("userData: ", userData);
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
                          <span className="profilePage_UserName">{userData.userName}</span>
                        </div>
                        <div className="flex profilePage_Title">
                          <span className="profilePage_Title">{userData.title}</span>
                        </div>
                        <div className="flex profilePage_Bio">
                          <BlueHashtagText originalText={userData.bio} />
                        </div>
                      </div>
                      <div className="flex profilePage_ContactDetails">
                        {isSuccessUser ?
                          <SocialRenderComponent userData={userData} />
                          : null
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col profilePage_BottomRight">
                    <div className="flex profilePage_Vehicles ">

                      {isSuccessUser ? (
                        userData?.usersVehicles.length > 0 ?
                          (<>
                            <div style={{
                              display: "flex", flexDirection: "row", width: "70%", margin: "auto", marginBottom: ".5rem",
                              marginTop: ".5rem"
                            }}>

                              <span style={VehiclesVoyagesTitle}>Vehicles</span>
                              <span
                                onClick={() => { gotoNewVehicle() }}
                                style={NewVehicle}>New Vehicle</span>
                            </div>

                            <ProfilePageVehiclesComponent userData={userData}
                            // userFavoriteVehicles={state_favVehicles} 
                            />
                          </>) : null)
                        : null
                      }
                    </div>
                    <div className="flex profilePage_Voyages ">
                      {isSuccessUser ? (
                        userData?.usersVoyages.length > 0 ?
                          (<>


                            <div style={{
                              display: "flex", flexDirection: "row", width: "70%", margin: "auto", marginBottom: ".5rem",
                              marginTop: ".5rem"
                            }}>

                              <span style={VehiclesVoyagesTitle}>Voyages</span>
                              <span
                                onClick={() => { gotoNewVoyage() }}
                                style={NewVehicle}>New Voyage</span>
                            </div>


                            <ProfilePageVoyagesComponent userData={userData}
                            // userFavoriteVoyages={state_favVoyages} 
                            />
                          </>) : null)
                        : null
                      }

                    </div>
                  </div>
                </div>
              </div>
            </header >
          </div >
        ) : null
  );



}

export default ProfilePage;



const spinnerContainer = {
  marginTop: "20%",
};

const VehiclesVoyagesTitle = {
  width: "100%", // Added quotes around "100%"
  fontSize: "2rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white"
};


const NewVehicle = {
  width: "70%", // Added quotes around "100%"
  height: "80%",
  fontSize: "1.6rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white",
  borderRadius: "1.5rem",
  paddingRight: ".1rem",
  paddingLeft: ".1rem",
  marginTop: "0.3rem",
  backgroundColor: "#007bff",
  cursor: "pointer",
  border: "none",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
};




