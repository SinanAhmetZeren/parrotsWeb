import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useLazyGetUserByIdQuery } from "../slices/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";
import { stopHubConnection } from "../signalr/signalRHub";
import { apiSlice } from "../api/apiSlice";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import TermsOfUseComponent from "../components/TermsOfUseComponent";
import parrotCracker from "../assets/images/parrotCracker.png";
import imgEmail from "../assets/images/email_logo.png";
import imgInstagram from "../assets/images/instagram_icon.png";
import imgTwitter from "../assets/images/twitter_logo.png";
import imgPhone from "../assets/images/phone_logo.jpeg";
import imgYoutube from "../assets/images/youtube_icon.png";
import imgFacebook from "../assets/images/facebook_logo.png";
import imgLinkedin from "../assets/images/linkedin_logo.png";
import imgTiktok from "../assets/images/tiktok_logo.png";
import he from "he";
import DOMPurify from "dompurify";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitBoundsWithPadding({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds, { padding: [32, 32] });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// ── Tokens ────────────────────────────────────────────────────────────────────
const blue = "#0A77EA";
const blueDk = "#0A5FBF";
const navy = "#0A2540";
const deep = "#081E36";
const mid = "#5C6B7A";
const line = "#E3E9F0";
const tint = "#F4F7FB";
const green = "#2AC898";
const greenInk = "#0B6B4E";
const orange = "#E8620E";
const red = "#C22F3D";

// ── Contact icons (brand images) ──────────────────────────────────────────────
const socialIconImg = { width: "3.45rem", height: "3.45rem", margin: 5, cursor: "pointer", borderRadius: "5rem", objectFit: "cover" };
const ContactIcons = {
  email:       <img src={imgEmail}     alt="Email"     style={socialIconImg} />,
  instagram:   <img src={imgInstagram} alt="Instagram" style={socialIconImg} />,
  twitter:     <img src={imgTwitter}   alt="X"         style={socialIconImg} />,
  phoneNumber: <img src={imgPhone}     alt="Phone"     style={socialIconImg} />,
  website:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: "3rem", height: "3rem", margin: 5 }}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" /></svg>,
  youtube:     <img src={imgYoutube}   alt="YouTube"   style={socialIconImg} />,
  facebook:    <img src={imgFacebook}  alt="Facebook"  style={socialIconImg} />,
  linkedin:    <img src={imgLinkedin}  alt="LinkedIn"  style={socialIconImg} />,
  tiktok:      <img src={imgTiktok}    alt="TikTok"    style={socialIconImg} />,
};

const CONTACT_LABELS = {
  email: "Email", instagram: "Instagram", twitter: "X", phoneNumber: "Phone",
  website: "Website", youtube: "YouTube", facebook: "Facebook", linkedin: "LinkedIn", tiktok: "TikTok",
};

function buildContacts(userData) {
  const rows = [];
  if (userData?.emailVisible && userData?.displayEmail) rows.push({ key: "email", value: userData.displayEmail });
  if (userData?.instagram) rows.push({ key: "instagram", value: userData.instagram });
  if (userData?.twitter) rows.push({ key: "twitter", value: userData.twitter });
  if (userData?.phoneNumber) rows.push({ key: "phoneNumber", value: userData.phoneNumber });
  if (userData?.youtube) rows.push({ key: "youtube", value: userData.youtube });
  if (userData?.facebook) rows.push({ key: "facebook", value: userData.facebook });
  if (userData?.linkedin) rows.push({ key: "linkedin", value: userData.linkedin });
  if (userData?.tiktok) rows.push({ key: "tiktok", value: userData.tiktok });
  return rows;
}

// ── Vehicle card ──────────────────────────────────────────────────────────────
function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const clean = (s) => s ? DOMPurify.sanitize(he.decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())) : "";
  return (
    <article style={gc} onClick={() => navigate(`/vehicle-details/${vehicle?.id}`)}>
      <div style={gcIm}>
        <img src={vehicle?.profileImageThumbnailUrl || vehicle?.profileImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <span style={gcBdg}>Vehicle</span>
      </div>
      <div style={gcTx}>
        <h3 style={gcH3}>{vehicle?.name}</h3>
        <p style={gcP} dangerouslySetInnerHTML={{ __html: clean(vehicle?.description) }} />
        <div style={metas}>
          <span style={meta}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}><path d="M4 15h16v-3l-1.6-4.4A2 2 0 0 0 16.5 6h-9a2 2 0 0 0-1.9 1.6L4 12z" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></svg>{vehicle?.type}</span>
          {vehicle?.capacity && <span style={meta}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}><circle cx="9" cy="8" r="3" /><path d="M3 19a6 6 0 0 1 12 0" /><path d="M16 11a3 3 0 0 0 0-6" /><path d="M18 19a5 5 0 0 0-2-4" /></svg>{vehicle?.capacity}</span>}
        </div>
      </div>
    </article>
  );
}

// ── Voyage card ───────────────────────────────────────────────────────────────
function VoyageCard({ voyage }) {
  const navigate = useNavigate();
  const clean = (s) => s ? DOMPurify.sanitize(he.decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())) : "";
  const dateStr = voyage?.startDate ? new Date(voyage.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";
  return (
    <article style={gc} onClick={() => navigate(`/voyage-details/${voyage?.publicId}`)}>
      <div style={gcIm}>
        <img src={voyage?.profileImageThumbnail || voyage?.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <span style={gcBdg}>Voyage</span>
        {voyage?.publicOnMap && (
          <span style={gcPub} title="Public on the map">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" /></svg>
          </span>
        )}
      </div>
      <div style={gcTx}>
        <h3 style={gcH3}>{voyage?.name || voyage?.title}</h3>
        <p style={gcP} dangerouslySetInnerHTML={{ __html: clean(voyage?.description) }} />
        <div style={metas}>
          {voyage?.vehicleType && <span style={meta}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}><path d="M4 15h16v-3l-1.6-4.4A2 2 0 0 0 16.5 6h-9a2 2 0 0 0-1.9 1.6L4 12z" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></svg>{voyage?.vehicleType}</span>}
          {voyage?.maxParticipants && <span style={meta}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}><circle cx="9" cy="8" r="3" /><path d="M3 19a6 6 0 0 1 12 0" /><path d="M16 11a3 3 0 0 0 0-6" /><path d="M18 19a5 5 0 0 0-2-4" /></svg>{voyage?.maxParticipants}</span>}
          {dateStr && <span style={meta}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" style={{ width: 12, height: 12 }}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>{dateStr}</span>}
        </div>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function ProfilePage() {
  console.log("entered ProfilePage");

  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const isDarkMode = useSelector((state) => state.users.isDarkMode);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const moreRef = useRef(null);

  const handleLogout = () => {
    stopHubConnection();
    dispatch(updateAsLoggedOut());
    dispatch(apiSlice.util.resetApiState());
    navigate("/login");
  };

  useEffect(() => {
    const handler = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [triggerGetUserById, { data: userData, isLoading: isLoadingUser, isError: isErrorUser, isSuccess: isSuccessUser }] = useLazyGetUserByIdQuery();

  useEffect(() => {
    const token = localStorage.getItem("storedToken");
    if (userId && token && !isSuccessUser) triggerGetUserById(userId);
  }, [userId, triggerGetUserById]);

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;
  if (isLoadingUser) return <LoadingProfilePage />;
  if (isErrorUser) return <SomethingWentWrong />;
  if (!isSuccessUser) return null;

  const vehicles = userData?.usersVehicles ?? [];
  const voyages = userData?.usersVoyages ?? [];
  const contacts = buildContacts(userData);
  const totalCount = vehicles.length + voyages.length;

  const pins = voyages.filter(v => v?.latitude && v?.longitude);
  const mapCenter = pins.length > 0
    ? [pins[0].latitude, pins[0].longitude]
    : [20, 0];
  const pinBounds = pins.length > 1
    ? pins.map(v => [v.latitude, v.longitude])
    : null;

  const visibleVehicles = filter === "voyages" ? [] : vehicles;
  const visibleVoyages = filter === "vehicles" ? [] : voyages;

  return (
    <div className="App">
      <header className="App-header">
        <div style={pageWrap}>

          {/* Top nav */}
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight"><TopBarMenu /></div>
          </div>

          {/* 4-col grid */}
          <div style={wrap}>

            {/* ── Cover ── */}
            <div style={coverCell}>
              <img src={userData?.backgroundImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {/* Avatar bottom-left */}
              <div style={avatarWrap}>
                <img src={userData?.profileImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* Action buttons bottom-right */}
              <div style={coverBtns}>
                <button style={cbtn} onClick={() => navigate(`/profile-public/${userData?.publicId}/${userData?.userName}`)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" /><circle cx="12" cy="12" r="2.6" /></svg>
                  <span>Public Profile</span>
                </button>
                <button style={{ ...cbtn, backgroundColor: blue, color: "#fff" }} onClick={() => navigate("/edit-profile")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                  <span>Edit Profile</span>
                </button>
                <div ref={moreRef} style={{ position: "relative" }}>
                  <button style={{ ...cbtn, width: 36, padding: 0 }} onClick={() => setMoreOpen(o => !o)} aria-label="More">
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 15, height: 15 }}><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></svg>
                  </button>
                  {moreOpen && (
                    <div style={moreMenu}>
                      <TermsOfUseComponent isDarkMode={isDarkMode} asMenuItem />
                      <div style={{ height: 1, background: line, margin: "4px 6px" }} />
                      <button style={{ ...moreItem, color: red }} onClick={() => { setMoreOpen(false); setShowLogoutModal(true); }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: red }}><path d="M15 17l5-5-5-5" /><path d="M20 12H9" /><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6" /></svg>
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Map ── */}
            <div style={mapCell}>
              {pins.length > 0 ? (
                <MapContainer
                  center={mapCenter}
                  zoom={3}
                  style={{ width: "100%", height: "100%" }}
                  zoomControl={false}
                  scrollWheelZoom
                >
                  <TileLayer
                    url={`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAPTILER_KEY}`}
                    attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                  />
                  {pins.map((v, i) => (
                    <CircleMarker
                      key={v?.id ?? i}
                      center={[v.latitude, v.longitude]}
                      radius={7}
                      pathOptions={{ color: "#fff", weight: 2, fillColor: blue, fillOpacity: 1 }}
                    >
                      <Tooltip>{v?.name || v?.title}</Tooltip>
                    </CircleMarker>
                  ))}
                  {pinBounds && <FitBoundsWithPadding bounds={pinBounds} />}
                </MapContainer>
              ) : (
                <div style={{ width: "100%", height: "100%", backgroundColor: "#d4e6f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: mid }}>No voyage pins yet</span>
                </div>
              )}
              {pins.length > 0 && (
                <span style={mapCount}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" /></svg>
                  {pins.length} voyage{pins.length !== 1 ? "s" : ""} pinned
                </span>
              )}
            </div>

            {/* ── Identity ── */}
            <div style={{ ...panel, ...identCell }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 14px" }}>
                <h1 style={{ fontSize: 27, fontWeight: 900, letterSpacing: "-.02em", lineHeight: 1.1, color: navy }}>{userData?.userName}</h1>
                {userData?.title && <span style={{ fontSize: 15.5, fontWeight: 800, color: orange }}>{userData?.title}</span>}
                <span style={{ flex: 1 }} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  <button style={chip} onClick={() => navigate("/parrotCrackerPage")}>
                    <img src={parrotCracker} alt="" style={{ width: 15, height: 15 }} />
                    Balance {userData?.parrotCrackerBalance ?? "…"}
                  </button>
                  <button style={{ ...chip, borderStyle: "dashed", color: blueDk, borderColor: "#C8D6E6" }} onClick={() => navigate("/parrotCrackerPage")}>Top up</button>
                </div>
              </div>
              {userData?.bio && (
                <p style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.6, color: navy, textAlign: "left", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 4, overflow: "hidden" }}>{userData?.bio}</p>
              )}
            </div>

            {/* ── Socials ── */}
            <div style={{ ...panel, ...socCell }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={sec}>Socials</span>
                {contacts.length > 0 && <span style={ct}>{contacts.length}</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, overflowY: "auto", flex: 1 }}>
                {contacts.map(({ key, value }) => (
                  <div key={key} style={crow}>
                    <span style={crowG}>{ContactIcons[key]}</span>
                    <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3, textAlign: "left" }}>
                      <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: mid }}>{CONTACT_LABELS[key]}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: navy }}>{value}</span>
                    </span>
                  </div>
                ))}
                {contacts.length === 0 && <span style={{ fontSize: 13, color: mid, fontWeight: 600 }}>No contacts added yet.</span>}
              </div>
            </div>

            {/* ── Rail ── */}
            <div style={{ ...panel, ...railCell }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-.01em", color: navy }}>Vehicles &amp; voyages</h2>
                <span style={ct}>{totalCount}</span>
                <span style={{ flex: 1 }} />
              </div>
              <div style={filters}>
                {[["all", `All ${totalCount}`], ["vehicles", `Vehicles ${vehicles.length}`], ["voyages", `Voyages ${voyages.length}`]].map(([k, label]) => (
                  <button key={k} style={{ ...filterBtn, ...(filter === k ? filterBtnOn : {}) }} onClick={() => setFilter(k)}>{label}</button>
                ))}
              </div>
              <div style={scroll}>
                {visibleVehicles.length > 0 && (
                  <>
                    <div style={sub}><span style={sec}>Vehicles · {vehicles.length}</span><span style={{ flex: 1, height: 1, background: line }} /></div>
                    {visibleVehicles.map((v, i) => <VehicleCard key={v?.id ?? i} vehicle={v} />)}
                  </>
                )}
                {visibleVoyages.length > 0 && (
                  <>
                    <div style={sub}><span style={sec}>Voyages · {voyages.length}</span><span style={{ flex: 1, height: 1, background: line }} /></div>
                    {visibleVoyages.map((v, i) => <VoyageCard key={v?.id ?? i} voyage={v} />)}
                  </>
                )}
                {totalCount === 0 && (
                  <div style={{ border: `1.5px dashed ${line}`, borderRadius: 12, padding: "24px 16px", textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: navy }}>Nothing here yet</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: mid, marginTop: 4 }}>Add a vehicle or create a voyage to get started.</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                <button style={{ ...chip, borderStyle: "dashed", color: blueDk, borderColor: "#C8D6E6", flex: 1, justifyContent: "center" }} onClick={() => navigate("/newVehicle")}>+ Add vehicle</button>
                <button style={{ ...chip, borderStyle: "dashed", color: blueDk, borderColor: "#C8D6E6", flex: 1, justifyContent: "center" }} onClick={() => navigate("/newVoyage")}>+ New voyage</button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Logout modal */}
      {showLogoutModal && (
        <div style={modalOverlay} onClick={() => setShowLogoutModal(false)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: "rgba(10,119,234,.7)", fontWeight: "bold" }}>Are you sure you want to log out?</h3>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button onClick={handleLogout} style={modalBtn("#2ac898")}>Yes, Logout</button>
              <button onClick={() => setShowLogoutModal(false)} style={modalBtn("rgba(10,119,234,1)")}>Stay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;

// ── Styles ────────────────────────────────────────────────────────────────────

const pageWrap = {
  display: "flex", flexDirection: "column",
  width: "100%", minHeight: "100vh",
  fontFamily: "Nunito, sans-serif",
  backgroundColor: deep,
};

const panel = {
  backgroundColor: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(0,14,30,.18)",
};

const wrap = {
  maxWidth: 1500,
  width: "100%",
  margin: "0 auto",
  padding: "0 20px 32px",
  display: "grid",
  gridTemplateColumns: "minmax(0,375px) minmax(0,1fr) minmax(0,375px) minmax(0,340px)",
  gridTemplateRows: "375px auto",
  gap: 16,
};

const coverCell = {
  gridColumn: 1,
  gridRow: 1,
  position: "relative",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,14,30,.18)",
};

const avatarWrap = {
  position: "absolute",
  left: 16, bottom: 16,
  width: 118, height: 118,
  borderRadius: "50%",
  border: "4px solid #fff",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,14,30,.34)",
};

const coverBtns = {
  position: "absolute",
  right: 14, bottom: 16,
  display: "flex", gap: 7, flexWrap: "nowrap", justifyContent: "flex-end",
  maxWidth: "calc(100% - 156px)",
};

const cbtn = {
  fontFamily: "Nunito, sans-serif",
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
  height: 36,
  background: "rgba(255,255,255,.95)",
  border: "none",
  color: navy,
  fontSize: 13, fontWeight: 800, lineHeight: 1,
  padding: "0 14px",
  borderRadius: 99,
  cursor: "pointer", whiteSpace: "nowrap",
  boxShadow: "0 3px 10px rgba(0,14,30,.2)",
};

const moreMenu = {
  position: "absolute", right: 0, bottom: "calc(100% + 7px)",
  minWidth: 168, backgroundColor: "#fff",
  border: `1px solid ${line}`, borderRadius: 11,
  boxShadow: "0 12px 30px rgba(0,14,30,.24)",
  padding: 5, zIndex: 40,
};

const moreItem = {
  fontFamily: "Nunito, sans-serif",
  width: "100%", textAlign: "left",
  border: "none", background: "none",
  fontSize: 13.5, fontWeight: 700, color: navy,
  padding: "9px 11px", borderRadius: 7,
  cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
};

const mapCell = {
  gridColumn: "2 / span 2",
  gridRow: 1,
  position: "relative",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,14,30,.18)",
};

const mapCount = {
  position: "absolute", left: 14, bottom: 14,
  display: "inline-flex", alignItems: "center", gap: 7,
  background: "rgba(8,30,54,.86)",
  backdropFilter: "blur(10px)",
  color: "#fff", fontSize: 12.5, fontWeight: 800,
  padding: "8px 13px", borderRadius: 99,
  border: "1px solid rgba(255,255,255,.16)",
  pointerEvents: "none",
};

const identCell = {
  gridColumn: "1 / span 2",
  gridRow: 2,
  padding: "18px 20px",
  display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
};

const socCell = {
  gridColumn: 3,
  gridRow: 2,
  padding: "16px 16px 18px",
  display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
};

const railCell = {
  gridColumn: 4,
  gridRow: "1 / span 2",
  padding: "16px 16px 18px",
  display: "flex", flexDirection: "column", gap: 11, minHeight: 0,
  maxHeight: 766,
};

const sec = {
  fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: mid,
};

const ct = {
  fontSize: 12, fontWeight: 800, color: mid, backgroundColor: tint, padding: "3px 9px", borderRadius: 99,
};

const chip = {
  fontFamily: "Nunito, sans-serif",
  display: "inline-flex", alignItems: "center", gap: 6,
  border: `1.5px solid ${line}`, backgroundColor: "#fff",
  borderRadius: 99, padding: "6px 12px",
  fontSize: 12.5, fontWeight: 800, color: navy,
  cursor: "pointer", whiteSpace: "nowrap",
};

const crow = {
  display: "flex", alignItems: "center", gap: 10,
  border: `1.5px solid ${line}`, borderRadius: 99,
  padding: "8px 11px", minWidth: 0, flexShrink: 0,
};

const crowG = {
  width: 41, height: 41, borderRadius: "50%",
  backgroundColor: tint, display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0, color: mid, overflow: "hidden",
};

const filters = {
  display: "flex", gap: 5, backgroundColor: tint, padding: 4, borderRadius: 99, flexShrink: 0,
};

const filterBtn = {
  fontFamily: "Nunito, sans-serif",
  border: "none", background: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 800, color: mid,
  padding: "6px 11px", borderRadius: 99, whiteSpace: "nowrap",
};

const filterBtnOn = { backgroundColor: blue, color: "#fff" };

const sub = { display: "flex", alignItems: "center", gap: 9, flexShrink: 0 };

const scroll = {
  display: "flex", flexDirection: "column", gap: 10,
  overflowY: "auto", minHeight: 0, flex: 1,
  margin: "0 -4px", padding: "0 4px 2px",
};

const gc = {
  border: `1.5px solid ${line}`, borderRadius: 12,
  overflow: "hidden", display: "flex", flexDirection: "column",
  cursor: "pointer", backgroundColor: "#fff", flexShrink: 0,
};

const gcIm = {
  position: "relative", aspectRatio: "4/3", overflow: "hidden",
};

const gcBdg = {
  position: "absolute", left: 9, top: 9,
  backgroundColor: "rgba(8,30,54,.86)", color: "#fff",
  fontSize: 9.5, fontWeight: 800, letterSpacing: ".09em", textTransform: "uppercase",
  padding: "4px 9px", borderRadius: 99,
};

const gcPub = {
  position: "absolute", right: 9, top: 9,
  width: 24, height: 24, borderRadius: "50%",
  backgroundColor: "#fff", color: greenInk,
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 2px 7px rgba(0,14,30,.2)",
};

const gcTx = {
  padding: "11px 13px 13px",
  display: "flex", flexDirection: "column", gap: 7, flex: 1,
};

const gcH3 = {
  fontSize: 15.5, fontWeight: 800, color: blueDk,
  letterSpacing: "-.01em", lineHeight: 1.25,
};

const gcP = {
  fontSize: 12.5, fontWeight: 600, color: mid, lineHeight: 1.45,
  display: "-webkit-box", WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical", overflow: "hidden",
};

const metas = {
  display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto",
};

const meta = {
  display: "inline-flex", alignItems: "center", gap: 5,
  backgroundColor: tint, borderRadius: 99, padding: "4px 9px",
  fontSize: 11.5, fontWeight: 800, color: mid, whiteSpace: "nowrap",
};

const modalOverlay = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  background: "rgba(0,0,0,0.5)", display: "flex",
  justifyContent: "center", alignItems: "center", zIndex: 2000,
};

const modalContent = {
  background: "white", padding: "2rem", borderRadius: 8,
  textAlign: "center", boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
  fontFamily: "Nunito, sans-serif",
};

const modalBtn = (bg) => ({
  padding: "0.6rem 1.5rem", borderRadius: "1.5rem", color: "white",
  fontWeight: "bold", cursor: "pointer", fontSize: "1.2rem",
  border: "none", backgroundColor: bg,
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
  fontFamily: "Nunito, sans-serif",
});
