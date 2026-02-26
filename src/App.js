/* eslint-disable no-undef */
import "./assets/css/App.css";
import "./assets/css/advancedmarker.css";
import React, { useEffect } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import MainPage from "./pages/MainPage";
import VoyageDetailsPage from "./pages/VoyageDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import ConnectPage from "./pages/ConnectPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";
import ProfilePagePublic from "./pages/ProfilePagePublic";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import CreateVehiclePage from "./pages/CreateVehiclePage";
import CreateVoyagePage from "./pages/CreateVoyagePage";
import { EditProfilePage } from "./pages/EditProfilePage";
import EditVehiclePage from "./pages/EditVehiclePage";
import { useSelector } from "react-redux";
import { initHubConnection, register_ReceiveUnreadNotification, unregister_ReceiveUnreadNotification } from "./signalr/signalRHub";
import { setUnreadMessages } from "./slices/UserSlice";
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  var isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  const currentUserId = useSelector((state) => state.users.userId);


  useEffect(() => {
    if (isLoggedIn && currentUserId) {
      // Initialize the SignalR hub once for the app
      initHubConnection(currentUserId, API_URL);
    }
  }, [isLoggedIn, currentUserId]);


  useEffect(() => {
    let unreadHandlerTrue;
    const InitHub = async () => {
      try {
        // Start SignalR
        await initHubConnection(currentUserId, API_URL);
        // Initial unread check
        try {
          const hasUnread = await invokeHub(
            "CheckUnreadMessages",
            currentUserId
          );
          dispatch(setUnreadMessages(hasUnread));
        } catch { }
        finally {
          setIsInitialLoading(false);
        }
        // Listen for unread   event only
        unreadHandlerTrue = () => {
          dispatch(setUnreadMessages(true)); // ReceiveUnreadNotification
        };
        register_ReceiveUnreadNotification(unreadHandlerTrue);
      } catch (error) {
        console.log(error);
      }
    };
    InitHub();
    return () => {
      unregister_ReceiveUnreadNotification(unreadHandlerTrue);
      // stopHubConnection();
    };
  }, []);



  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {!isLoggedIn ? (
          <Route path="*" element={<Navigate to="/login" />} />
        ) : (
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/newVehicle" element={<CreateVehiclePage />} />
            <Route path="/newVoyage" element={<CreateVoyagePage />} />
            <Route
              path="/profile-public/:userId/:userName" // using publicId for userId
              element={<ProfilePagePublic />}
            />
            <Route
              path="/voyage-details/:voyageId"
              element={<VoyageDetailsPage />}
            />
            <Route
              path="/vehicle-details/:vehicleId"
              element={<VehicleDetailsPage />}
            />
            <Route
              path="/edit-vehicle/:vehicleId"
              element={<EditVehiclePage />}
            />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route
              path="/connect/:conversationUserId/:conversationUserUsername"
              element={<ConnectPage />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
