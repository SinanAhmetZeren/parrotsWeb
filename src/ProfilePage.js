/* eslint-disable no-undef */
import "./assets/css/ProfilePage.css"
import React, { useState, useEffect, useRef } from "react";

import { TopBarMenu } from "./components/TopBarMenu";
import { TopLeftComponent } from "./components/TopLeftComponent";
import profileImg from "./assets/parrot-looks2.jpg";
import coverImg from "./assets/seafromsky.jpg";

import { BlueHashtagText } from "./components/BlueHashtagText";
import { SocialRenderComponent } from "./components/SocialRenderComponent";
import { useGetUserByIdQuery } from "./slices/UserSlice";
import { ProfilePageVoyagesComponent } from "./components/ProfilePageVoyagesComponent";




function ProfilePage() {
  const userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  let voyageId = 88;
  const [userBid, setUserBid] = useState("")
  const profileData = ""
  const dummyBio = "Passionate wanderer, exploring the world one step at a time. Lost in the beauty of unfamiliar places and the stories they hold. 🌍✨ #Wanderlust. Embracing the journey with an open heart and a curiosity for the unknown......🌟👣"

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

  /*
  useEffect(() => {
    console.log("userData", userData)
    console.log("backgroundImageUrl", userData?.backgroundImageUrl);
    console.log("profileImageUrl", userData?.profileImageUrl);
    console.log("userBaseUrl", userBaseUrl + userData?.profileImageUrl);

  }, [userData]);
*/

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
              <TopLeftComponent userName={"Peter Parker"} />
              <div className="flex mainpage_TopRight">
                <TopBarMenu />
              </div>
            </div>

            <div className="flex profilePage_Bottom">
              <div className="flex profilePage_BottomLeft">
                <div className="flex profilePage_CoverAndProfile">
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
                      <span className="profilePage_UserName">Peter Parker</span>
                    </div>
                    <div className="flex profilePage_Title">
                      <span className="profilePage_Title">Serendipitous Vagabond Sojourner</span>
                    </div>
                    <div className="flex profilePage_Bio">
                      <BlueHashtagText originalText={dummyBio} />
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
                <div className="flex profilePage_Voyages ">
                  {isSuccessUser ?
                    <ProfilePageVoyagesComponent userData={userData} />
                    : null
                  }
                </div>
                <div className="flex profilePage_Vehicles "></div>
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
