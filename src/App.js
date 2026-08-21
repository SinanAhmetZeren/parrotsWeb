/* eslint-disable no-undef */
import "./assets/css/App.css";
import "./assets/css/advancedmarker.css";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { TermsContent } from "./components/TermsContent";
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
import AskParrotsPage from "./pages/AskParrotsPage";
import { EditProfilePage } from "./pages/EditProfilePage";
import EditVehiclePage from "./pages/EditVehiclePage";
import { useDispatch, useSelector } from "react-redux";
import { initHubConnection } from "./signalr/signalRHub";
import { ParrotCrackerPage } from "./pages/ParrotCrackerPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from "./pages/AdminPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  var isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  const isDarkMode = useSelector((state) => state.users.isDarkMode);
  const bgImageVariant = useSelector((state) => state.users.bgImageVariant);
  const currentUserId = useSelector((state) => state.users.userId);
  const userName = useSelector((state) => state.users.userName);
  const dispatch = useDispatch();
  const [showTermsModal, setShowTermsModal] = useState(true);

  useEffect(() => {
    if (isLoggedIn && currentUserId) {
      initHubConnection(currentUserId, API_URL);
    }
  }, [isLoggedIn, currentUserId]);


  useEffect(() => {
    if (userName) {
      document.title = `${userName} @ Parrots App`;
    }
  }, [userName]);

  useEffect(() => {
    const image = bgImageVariant === "new"
      ? require("./assets/images/seafromabove1.jpg")
      : require("./assets/images/seafromsky.jpg");
    document.body.style.backgroundImage = `url(${image})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }, [bgImageVariant]);

  useEffect(() => {


    if (!currentUserId) return; // <- guard against null

    console.log("unread message useEffect");
    const InitHub = async () => {
      try {
        // Start SignalR
        await initHubConnection(currentUserId, API_URL);
      } catch (error) {
        console.log(error);
      }
    };
    InitHub();
    return () => {
      // stopHubConnection();
    };
  }, [currentUserId]);



  useEffect(() => {
    const handleOffline = () => toast.error("You are offline. Check your connection.", { toastId: "offline", autoClose: false });
    const handleOnline = () => { toast.dismiss("offline"); toast.success("Back online.", { autoClose: 2000 }); };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);



  return (
    <ErrorBoundary>
<Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy" element={<TermsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        {!isLoggedIn ? (
          <Route path="*" element={<Navigate to="/login" />} />
        ) : (
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/parrotcrackerpage" element={<ParrotCrackerPage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/newVehicle" element={<CreateVehiclePage />} />
            <Route path="/newVoyage" element={<CreateVoyagePage />} />
            <Route path="/AskParrots" element={<AskParrotsPage />} />
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
      <Modal
        isOpen={showTermsModal}
        onRequestClose={() => setShowTermsModal(false)}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        style={termsModalStyle}
      >
        <TermsContent onAccept={() => setShowTermsModal(false)} />
      </Modal>
      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        hideProgressBar
        closeButton={false}
        icon={false}
        toastClassName="parrot-pill-toast"
        bodyClassName="parrot-pill-toast-body"
      />

    </Router>
    </ErrorBoundary>
  );
}

const termsModalStyle = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "60rem",
    height: "80vh",
    borderRadius: "1.5rem",
    padding: "2rem",
    border: "none",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    overflowY: "auto",
  },
};

export default App;
