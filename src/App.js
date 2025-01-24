/* eslint-disable no-undef */
import "./assets/css/App.css";
import "./assets/css/advancedmarker.css";
import React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import MainPage from "./MainPage";
import VoyageDetailsPage from "./VoyageDetailsPage";
import ProfilePage from "./ProfilePage";

function App() {
  return (
    <div>
      {/* <MainPage /> */}
      <ProfilePage />
      {/* <VoyageDetailsPage /> */}
    </div>
  );
}

export default App;
