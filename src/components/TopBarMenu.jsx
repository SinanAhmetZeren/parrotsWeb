import "../assets/css/date-range-custom.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";
import { useState } from "react";
import { parrotBlue, parrotGreen } from "../styles/colors";
import { apiSlice } from "../api/apiSlice";
import { store } from '../store/store';

export function TopBarMenu() {
  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  const unreadMessages = useSelector((state) => state.users.unreadMessages);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  return (
    <nav className="flex space-x-2 sm:space-x-2 overflow-x-auto sm:overflow-x-visible">
      {isLoggedIn ? (
        <>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${activeStyle} ${commonStyle}`
                : `${inactiveStyle} ${commonStyle}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? `${activeStyle} ${commonStyle}`
                : `${inactiveStyle} ${commonStyle}`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive
                ? `${activeStyle} ${commonStyle}`
                : `${inactiveStyle} ${commonStyle}`
            }
          >
            Favorites
          </NavLink>
          <NavLink
            to="/connect"
            className={({ isActive }) =>
              isActive
                ? `${activeStyle} ${commonStyle}`
                : `${inactiveStyle} ${commonStyle}`
            }
          >
            {/* Connect */}


            <div className="flex items-center relative">
              Connect
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

          <>
            <button
              onClick={() => {
                setShowModal(true);
              }}
              className={`${inactiveStyle} ${commonStyle}`}
            >
              Logout
            </button>

            {showModal && (
              // <div className="modal-overlay" style={modalOverlay}>
              //   <div className="modal-content" style={modalContent}>

              <div
                className="modal-overlay"
                style={modalOverlay}
                onClick={() => setShowModal(false)} // closes on any overlay click
              >
                <div
                  className="modal-content"
                  style={modalContent}
                  onClick={(e) => e.stopPropagation()} // prevents the inner click from bubbling
                >
                  <h3
                    style={{
                      color: "rgba(10, 119, 234,.7)",
                      fontWeight: "bold",
                    }}
                  >
                    Are you sure you want to log out?
                  </h3>
                  <div className="modal-buttons" style={modalButtons}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => {
                          dispatch(updateAsLoggedOut());
                          dispatch(apiSlice.util.resetApiState());
                          navigate("/login");

                          console.log(store.getState().api); // check RTK Query slice

                        }}
                        style={{ ...buttonStyle, ...Logout }}
                      >
                        Yes, Logout
                      </button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => setShowModal(false)}
                        style={{ ...buttonStyle, ...Stay }}
                      >
                        No, Stay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
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

const activeStyle = "text-white";
const inactiveStyle = "text-blue-500";
const commonStyle =
  "font-bold text-xl p-1 px-6 hover:bg-opacity-30 hover:bg-blue-800 hover:text-white hover:rounded-2xl";

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
