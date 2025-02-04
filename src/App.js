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
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";
import ProfilePagePublic from "./pages/ProfilePagePublic";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const isLoggedIn = localStorage.getItem("storedToken"); // Check if user is logged in


  return (

    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {!isLoggedIn ? (
          // If not logged in, redirect all other routes to login
          <Route path="*" element={<Navigate to="/login" />} />
        ) : (
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile-public/:userId/:userName" element={<ProfilePagePublic />} />
            <Route path="/voyage-details/:voyageId" element={<VoyageDetailsPage />} />
            <Route path="/vehicle-details/:vehicleId" element={<VehicleDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/connect/:conversationUserId/:conversationUserUsername" element={<ConnectPage />} />
          </>
        )}
      </Routes>
    </Router>

    /*
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile-public/:userId/:userName" element={<ProfilePagePublic />} />
            <Route path="/voyage-details/:voyageId" element={<VoyageDetailsPage />} />
            <Route path="/vehicle-details/:vehicleId" element={<VehicleDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/connect/:conversationUserId/:conversationUserUsername" element={<ConnectPage />} />
          </Routes>
        </Router>
        */
  );
}

export default App;
