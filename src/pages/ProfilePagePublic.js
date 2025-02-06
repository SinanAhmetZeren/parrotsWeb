/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css"
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { BlueHashtagText } from "../components/BlueHashtagText";
import { SocialRenderComponent } from "../components/SocialRenderComponent";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import { ProfilePageVoyagesComponent } from "../components/ProfilePageVoyagesComponent";
import { ProfilePageVehiclesComponent } from "../components/ProfilePageVehiclesComponent";


function ProfilePagePublic() {
  const { userId } = useParams();
  const { userName } = useParams();
  const navigate = useNavigate();

  const handleSendMessageRequest = () => {
    navigate(`/connect/${userId}/${userName}`);
  }

  const apiUrl = process.env.REACT_APP_API_URL;
  const userBaseUrl = `${apiUrl}/Uploads/UserImages/`;


  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error,
    isSuccess: isSuccessUser,
    refetch: refetchUserData,
  } = useGetUserByIdQuery(userId);


  return (
    isLoadingUser ? (
      <div style={spinnerContainer}>
        <div className="spinner"></div>
      </div>
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

                  <div className="profilePage_SendMessage" onClick={() => handleSendMessageRequest()}>
                    <span>Send Message</span>
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
                        <span style={VehiclesVoyagesTitle}>Vehicles</span>
                        <ProfilePageVehiclesComponent userData={userData} />
                      </>) : null)
                    : null
                  }
                </div>
                <div className="flex profilePage_Voyages ">
                  {isSuccessUser ? (
                    userData?.usersVoyages.length > 0 ?
                      (<>
                        <span style={{ ...VehiclesVoyagesTitle, marginTop: "1rem" }}>Voyages</span>
                        <ProfilePageVoyagesComponent userData={userData} />
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

export default ProfilePagePublic;



const spinnerContainer = {
  marginTop: "20%",
};

const VehiclesVoyagesTitle = {
  width: "100%", // Added quotes around "100%"
  fontSize: "2rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white"
};
