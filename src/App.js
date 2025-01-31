/* eslint-disable no-undef */
import "./assets/css/App.css";
import "./assets/css/advancedmarker.css";
import React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import MainPage from "./pages/MainPage";
import VoyageDetailsPage from "./pages/VoyageDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import ConnectPage from "./pages/ConnectPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";
import ProfilePagePublic from "./pages/ProfilePagePublic";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile-public/:userId" element={<ProfilePagePublic />} />
        <Route path="/voyage-details/:voyageId" element={<VoyageDetailsPage />} />
        <Route path="/vehicle-details/:vehicleId" element={<VehicleDetailsPage />} />
        <Route path="/connect" element={<ConnectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
