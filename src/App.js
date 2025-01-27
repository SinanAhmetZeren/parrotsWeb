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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/voyage-details/:voyageId" element={<VoyageDetailsPage />} />
        <Route path="/vehicle-details/:vehicleId" element={<VehicleDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
