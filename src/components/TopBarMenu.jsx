import "../assets/css/date-range-custom.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateAsLoggedOut, setIsDarkMode, setBgImageVariant } from "../slices/UserSlice";
import { stopHubConnection } from "../signalr/signalRHub";
import { useState } from "react";
import { parrotBananaLeafGreen, parrotBlue, parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotGreen, parrotGreenTransparent, parrotPistachioGreen, parrotRed } from "../styles/colors";
import { apiSlice } from "../api/apiSlice";
import { store } from '../store/store';
import { IoSunny, IoMoon } from "react-icons/io5";
import { MdOutlineHome, MdOutlineAccountCircle, MdFavoriteBorder, MdOutlineShare } from "react-icons/md";

export function TopBarMenu() {
  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  const unreadMessages = useSelector((state) => state.users.unreadMessages);
  // console.log("--> Unread messages", unreadMessages);
  const isAdmin = useSelector((state) => state.users.isAdmin);
  console.log("isadmin", isAdmin);
  const isDarkMode = useSelector((state) => state.users.isDarkMode);
  const bgImageVariant = useSelector((state) => state.users.bgImageVariant);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  return (
    <nav className="flex space-x-2 sm:space-x-2 overflow-x-auto sm:overflow-x-visible">
      {isLoggedIn ? (
        <>
          {isAdmin &&
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${commonStyle} ${isActive ? activeStyle : inactiveStyle}`
              }
              style={({ isActive }) => ({
                color: !isActive ? parrotGreen : parrotPistachioGreen,
              })}
            >
              Admin
            </NavLink>}




          <div style={navPill}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? iconActiveStyle : iconInactiveStyle
              }
            >
              <div className="nav-icon-wrapper">
                <MdOutlineHome size="1.5rem" />
                <span className="nav-tooltip">Home</span>
              </div>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? iconActiveStyle : iconInactiveStyle
              }
            >
              <div className="nav-icon-wrapper">
                <MdOutlineAccountCircle size="1.5rem" />
                <span className="nav-tooltip">Profile</span>
              </div>
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive ? iconActiveStyle : iconInactiveStyle
              }
            >
              <div className="nav-icon-wrapper">
                <MdFavoriteBorder size="1.5rem" />
                <span className="nav-tooltip">Favorites</span>
              </div>
            </NavLink>

            <NavLink
              to="/connect"
              className={({ isActive }) =>
                isActive ? iconActiveStyle : iconInactiveStyle
              }
            >
              <div className="nav-icon-wrapper">
                <MdOutlineShare size="1.5rem" />
                <span className="nav-tooltip">Connect</span>
                {unreadMessages && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      fill="white"
                      viewBox="0 0 24 24"
                      style={{ marginLeft: 0, padding: 2 }}
                    >
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                )}
              </div>
            </NavLink>

            <div style={{ width: "1px", height: "1.5rem", backgroundColor: "rgba(255,255,255,0.2)", margin: "0 0.25rem" }} />

            <div
              onClick={() => dispatch(setBgImageVariant(bgImageVariant === "new" ? "old" : "new"))}
              title={bgImageVariant === "new" ? "Switch to old background" : "Switch to new background"}
              style={{
                width: "3.6rem",
                height: "2rem",
                borderRadius: "2rem",
                backgroundColor: bgImageVariant === "new" ? "rgba(30,111,168,0.5)" : "rgba(10,15,30,0.5)",
                position: "relative",
                transition: "background-color 0.3s ease",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <div style={{
                position: "absolute",
                top: "0.15rem",
                left: bgImageVariant === "new" ? "0.15rem" : "1.75rem",
                width: "1.7rem",
                height: "1.7rem",
                borderRadius: "50%",
                backgroundColor: bgImageVariant === "new" ? "rgb(7, 159, 200)" : "rgb(11, 23, 53)",
                transition: "left 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                fontWeight: "bold",
                color: "white",
              }}>
                🌊
              </div>
            </div>

            <div style={{ width: "1px", height: "1.5rem", backgroundColor: "rgba(255,255,255,0.2)", margin: "0 0.25rem" }} />

            <div
              onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                width: "3.6rem",
                height: "2rem",
                borderRadius: "2rem",
                backgroundColor: isDarkMode ? "#0a0f1e" : "#cbd5e1",
                position: "relative",
                transition: "background-color 0.3s ease",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <div style={{
                position: "absolute",
                top: "0.15rem",
                left: isDarkMode ? "1.75rem" : "0.15rem",
                width: "1.7rem",
                height: "1.7rem",
                borderRadius: "50%",
                backgroundColor: isDarkMode ? "#1a2744" : "white",
                transition: "left 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {isDarkMode
                  ? <IoMoon size="0.8rem" color="#e2e8f0" />
                  : <IoSunny size="0.8rem" color="goldenrod" />
                }
              </div>
            </div>
          </div>

        </>
      ) : (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? `${activeStyle} ${commonStyle}`
                : `${inactiveStyle} ${commonStyle}`
            }
          >
            Sign In / Sign Up
          </NavLink>
        </>
      )}
    </nav>
  );
}

const darkModeToggleStyle = {
  marginLeft: "0.5rem",
  padding: "0.4rem 0.6rem",
  borderRadius: "2rem",
  border: "none",
  backgroundColor: "rgba(59, 130, 246, 0.2)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const activeStyle = "text-white";
const inactiveStyle = "text-blue-500";

const commonStyle =
  "font-bold text-xl p-1 px-2 hover:bg-opacity-30 hover:bg-blue-800 hover:text-white hover:rounded-2xl";

const navPill = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(8px)",
  borderRadius: "2rem",
  padding: "0.3rem 0.6rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
};

const iconActiveStyle = "text-white p-2 rounded-full bg-white bg-opacity-20";
const iconInactiveStyle = "text-blue-400 p-2 rounded-full hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors";

const buttonStyle = {
  width: "100%",
  padding: "0.6rem",
  paddingLeft: "1.5rem",
  paddingRight: "1.5rem",
  marginTop: "2rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1.2rem",
  border: "none",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

const Logout = {
  backgroundColor: parrotGreen,
};

const Stay = {
  backgroundColor: parrotBlue,
};

const modalButtons = {
  marginTop: "1rem",
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent = {
  background: "white",
  padding: "2rem",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
};
