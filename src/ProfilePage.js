/* eslint-disable no-undef */
import "./assets/css/ProfilePage.css"
import React, { useState, useEffect, useRef } from "react";

import { TopBarMenu } from "./components/TopBarMenu";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { TopLeftComponent } from "./components/TopLeftComponent";
import { VoyageDetailPageImageSwiper } from "./components/VoyageDetailPageImageSwiper";
import { VoyageDetailPageDetails } from "./components/VoyageDetailPageDetails";
import { VoyageDetailPageDescription } from "./components/VoyageDetailPageDescription";
import { VoyageDetailBids } from "./components/VoyageDetailPageBids";
import { VoyageDetailWaypointSwiper } from "./components/VoyageDetailWaypointSwiper";
import { VoyageDetailMapPanComponent } from "./components/VoyageDetailMapPanComponent";
import { VoyageDetailMarkerWithInfoWindow } from "./components/VoyageDetailMarkerWithInfoWindow";
import { VoyageDetailMapPolyLineComponent } from "./components/VoyageDetailMapPolyLineComponent";


function ProfilePage() {
  const userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  let voyageId = 88;
  const [userBid, setUserBid] = useState("")


  return (
    false ? (
      <div style={spinnerContainer}>
        <div className="spinner"></div>
      </div>
    ) : true ? (
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
                  <div className="flex profilePage_CoverImage"> </div>
                  <div className="flex profilePage_ProfileImage"> </div>
                </div>
                <div className="flex profilePage_BioAndContactDetails">
                  <div className="flex profilePage_BioTitleUserName">
                    <div className="flex profilePage_UserName"> </div>
                    <div className="flex profilePage_Title"> </div>
                    <div className="flex profilePage_Bio"> </div>

                  </div>
                  <div className="flex profilePage_ContactDetails"> </div>
                </div>
              </div>

              <div className="flex flex-col profilePage_BottomRight">
                <div className="flex profilePage_Vehicles "></div>
                <div className="flex profilePage_Voyages "></div>

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
