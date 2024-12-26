/* eslint-disable no-undef */
import "./App.css";
import "./assets/css/advancedmarker.css";
import React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import MainPage from "./MainPage";
import VoyageDetails from "./VoyageDetails";

function App() {
  return (
    <div>
      <VoyageDetails />
      {/* <MainPage /> */}
    </div>
  );
}

export default App;
