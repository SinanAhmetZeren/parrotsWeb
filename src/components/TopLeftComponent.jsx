import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../assets/css/date-range-custom.css";
import parrotsLogo from "../assets/images/ParrotLogoHead.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { updateAsLoggedOut } from "../slices/UserSlice";
import { stopHubConnection } from "../signalr/signalRHub";
import { apiSlice } from "../api/apiSlice";
import { store } from "../store/store";

export const TopLeftComponent = () => {
  const storedUserName = useSelector((state) => state.users.userName);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);

  const handleCardClick = () => {
    navigate(`/profile`);
  };

  const handleLogout = () => {
    stopHubConnection();
    dispatch(updateAsLoggedOut());
    dispatch(apiSlice.util.resetApiState());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="flex mainpage_TopLeft"
      style={{
        height: "3rem",
        width: "33%",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
      ref={dropdownRef}
    >
      <img
        src={parrotsLogo}
        alt="Logo"
        className="w-10 h-10 mr-4"
        style={{ borderRadius: "10rem", cursor: "pointer" }}
        onClick={handleCardClick}
      />
      <div
        style={{ cursor: "pointer", position: "relative" }}
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <span
          className="text-xl font-bold"
          style={{ color: "rgba(10, 119, 234,1)", fontWeight: "900" }}
        >
          Welcome to Parrots
        </span>
        <span
          className="text-xl"
          style={{ color: "#2ac898", fontWeight: "900" }}
        >
          {" "}
          {storedUserName ? storedUserName.toUpperCase() : "Voyager"}
        </span>
        {showDropdown && (
          <div style={dropdownStyle}>
            <div style={dropdownItem} onClick={handleCardClick}>
              Profile
            </div>
            <div style={{ ...dropdownItem, color: "#e05555" }} onClick={() => { setShowDropdown(false); setShowModal(true); }}>
              Logout
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={modalOverlay} onClick={() => setShowModal(false)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "rgba(10,119,234,.7)", fontWeight: "bold" }}>
              Are you sure you want to log out?
            </h3>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button onClick={handleLogout} style={{ ...modalBtn, backgroundColor: "#2ac898" }}>Yes, Logout</button>
              <button onClick={() => setShowModal(false)} style={{ ...modalBtn, backgroundColor: "rgba(10,119,234,1)" }}>Stay</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const dropdownStyle = {
  position: "absolute",
  top: "3.2rem",
  right: "0",
  left: "auto",
  backgroundColor: "white",
  borderRadius: "1rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  zIndex: 1000,
  minWidth: "8rem",
  overflow: "hidden",
};

const modalOverlay = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
  alignItems: "center", zIndex: 2000,
};

const modalContent = {
  background: "white", padding: "2rem", borderRadius: "8px",
  textAlign: "center", boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
};

const modalBtn = {
  padding: "0.6rem 1.5rem", borderRadius: "1.5rem", color: "white",
  fontWeight: "bold", cursor: "pointer", fontSize: "1.2rem", border: "none",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
};

const dropdownItem = {
  padding: "0.6rem 1.2rem",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  color: "rgba(10,119,234,1)",
  borderBottom: "1px solid #f0f0f0",
};
