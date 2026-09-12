import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { updateAsLoggedOut } from "../slices/UserSlice";
import { stopHubConnection } from "../signalr/signalRHub";
import { apiSlice } from "../api/apiSlice";
import { store } from "../store/store";
import { ParrotMemoryGame } from "./ParrotMemoryGame";
import parrotsLogo from "../assets/images/parrotsreallife.jpg";

// Icons
import { MdOutlineHome, MdOutlineAccountCircle, MdFavoriteBorder, MdOutlineShare, MdDirectionsCar } from "react-icons/md";
import { IoBoatOutline } from "react-icons/io5";

// Design tokens (from reference HTML)
const green = "#2AC898";
const blue  = "#0A77EA";
const navy  = "#0A2540";

export function TopBarMenu() {
  const isLoggedIn  = useSelector((state) => state.users.isLoggedIn);
  const isAdmin     = useSelector((state) => state.users.isAdmin);
  const unreadMessages = useSelector((state) => state.users.unreadMessages);
  const storedUserName = useSelector((state) => state.users.userName);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    stopHubConnection();
    dispatch(updateAsLoggedOut());
    dispatch(apiSlice.util.resetApiState());
    store.dispatch({ type: "RESET" });
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={hdr}>
      <style>{hoverCSS}</style>
      {/* Left third */}
      <div style={thirdLeft}>
      <div ref={dropdownRef} style={brand} onClick={() => setShowDropdown((p) => !p)}>
        <img
          src={parrotsLogo}
          alt="Parrots"
          style={logoImg}
          onClick={(e) => { e.stopPropagation(); setShowGame(true); }}
        />
        <span style={brandText}>
          Welcome to Parrots,{" "}
          <em style={{ fontStyle: "normal", color: green }}>
            {storedUserName || "Voyager"}
          </em>
        </span>

        {/* Dropdown */}
        {showDropdown && (
          <div style={dropdown}>
            <div style={dropItem} onClick={(e) => { e.stopPropagation(); setShowDropdown(false); navigate("/profile"); }}>
              Profile
            </div>
            {isAdmin && (
              <div style={dropItem} onClick={(e) => { e.stopPropagation(); setShowDropdown(false); navigate("/admin"); }}>
                Admin
              </div>
            )}
            <div style={{ ...dropItem, color: "#e05555" }} onClick={(e) => { e.stopPropagation(); setShowDropdown(false); setShowLogoutModal(true); }}>
              Logout
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Centre third */}
      <div style={thirdCenter}>
        {isLoggedIn && (
          <>
            <button className="tbm-action-btn" style={pbTurquoise} onClick={() => navigate("/newVehicle")}>
              <MdDirectionsCar size={15} />
              New Vehicle
            </button>
            <button className="tbm-action-btn" style={pbTurquoise} onClick={() => navigate("/NewVoyage")}>
              <IoBoatOutline size={15} />
              New Voyage
            </button>
            <button className="tbm-action-btn" style={pbTurquoise} onClick={() => navigate("/AskParrots")}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>
                <path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>
              </svg>
              Ask Parrots
            </button>
          </>
        )}
      </div>

      {/* Right third */}
      <div style={thirdRight}>
        {isLoggedIn ? (
          <>
            <NavLink to="/" className="tbm-nav-link" style={nv(isActive("/"))}>
              <MdOutlineHome size={15} /><span style={nvSpan}>Home</span>
            </NavLink>
            <NavLink to="/profile" className="tbm-nav-link" style={nv(isActive("/profile"))}>
              <MdOutlineAccountCircle size={15} /><span style={nvSpan}>Profile</span>
            </NavLink>
            <NavLink to="/favorites" className="tbm-nav-link" style={nv(isActive("/favorites"))}>
              <MdFavoriteBorder size={15} /><span style={nvSpan}>Favourites</span>
            </NavLink>
            <NavLink to="/connect" className="tbm-nav-link" style={nv(isActive("/connect"))}>
              <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <MdOutlineShare size={15} />
                {unreadMessages && <span style={unreadDot} />}
              </span>
              <span style={nvSpan}>Connect</span>
            </NavLink>
          </>
        ) : (
          <NavLink to="/login" style={nv(false)}>Sign In / Sign Up</NavLink>
        )}
      </div>

      {/* Memory game easter egg */}
      {showGame && <ParrotMemoryGame onClose={() => setShowGame(false)} />}

      {/* Logout confirm modal */}
      {showLogoutModal && (
        <div style={modalOverlay} onClick={() => setShowLogoutModal(false)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: "1.2rem", color: navy, marginBottom: "1rem" }}>
              Are you sure you want to log out?
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button onClick={handleLogout} style={{ ...modalBtn, backgroundColor: green }}>Yes, Logout</button>
              <button onClick={() => setShowLogoutModal(false)} style={{ ...modalBtn, backgroundColor: blue }}>Stay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Hover CSS ───────────────────────────────────────────────────────────────

const hoverCSS = `
  .tbm-action-btn:hover {
    background: rgba(42,200,152,0.32) !important;
    color: #fff !important;
  }
  .tbm-nav-link:hover {
    background: rgba(255,255,255,0.12) !important;
    color: #fff !important;
    border-color: rgba(255,255,255,0.35) !important;
  }
  .tbm-brand:hover .tbm-brand-text {
    color: rgba(255,255,255,0.85);
  }
`;

// ── Styles (matching reference HTML) ────────────────────────────────────────

const hdr = {
  display: "flex",
  alignItems: "center",
  padding: "9px 14px",
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: "12px",
  flexWrap: "nowrap",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "Nunito, sans-serif",
  position: "relative",
};

const thirdLeft = {
  flex: "0 0 33.333%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  minWidth: 0,
};

const thirdCenter = {
  flex: "0 0 33.333%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  minWidth: 0,
};

const thirdRight = {
  flex: "0 0 33.333%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "5px",
  minWidth: 0,
};

const brand = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minWidth: 0,
  marginRight: "6px",
  cursor: "pointer",
  position: "relative",
  flexShrink: 0,
};

const logoImg = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  objectFit: "cover",
  background: "rgba(255,255,255,.12)",
  flexShrink: 0,
};

const brandText = {
  fontSize: "14.5px",
  fontWeight: 800,
  color: "#fff",
  whiteSpace: "nowrap",
};

const dropdown = {
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 16px rgba(0,20,30,.2)",
  zIndex: 2000,
  minWidth: "9rem",
  overflow: "hidden",
};

const dropItem = {
  padding: "0.6rem 1.2rem",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 700,
  color: navy,
  borderBottom: "1px solid #f0f0f0",
  fontFamily: "Nunito, sans-serif",
};

const pbBase = {
  fontFamily: "Nunito, sans-serif",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontSize: "13.5px",
  fontWeight: 800,
  padding: "9px 13px",
  borderRadius: "99px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const pbTurquoise = {
  ...pbBase,
  background: "rgba(42,200,152,0.18)",
  color: "#fff",
  border: "none",
};


const nv = (active) => ({
  fontFamily: "Nunito, sans-serif",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "9px 13px",
  borderRadius: "99px",
  border: active ? "1.5px solid rgba(255,255,255,.4)" : "1.5px solid rgba(255,255,255,.18)",
  color: active ? "#fff" : "rgba(255,255,255,.66)",
  background: active ? "rgba(255,255,255,.14)" : "none",
  cursor: "pointer",
  textDecoration: "none",
  whiteSpace: "nowrap",
  flexShrink: 0,
});

const nvSpan = {
  fontSize: "13.5px",
  fontWeight: 800,
  letterSpacing: 0,
};

const unreadDot = {
  position: "absolute",
  top: "-2px",
  right: "-4px",
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  backgroundColor: "#ef4444",
};

const modalOverlay = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex", justifyContent: "center", alignItems: "center",
  zIndex: 3000,
};

const modalBox = {
  background: "white",
  padding: "2rem",
  borderRadius: "1rem",
  textAlign: "center",
  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
};

const modalBtn = {
  fontFamily: "Nunito, sans-serif",
  padding: "0.6rem 1.5rem",
  borderRadius: "1.5rem",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: "1rem",
  border: "none",
};
