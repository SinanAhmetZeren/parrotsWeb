/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaAngleDoubleDown } from "react-icons/fa";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useGetUserByPublicIdQuery, useReportUserMutation, useBlockUserMutation, useUnblockUserMutation, useIsBlockedQuery } from "../slices/UserSlice";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { useSelector, useDispatch } from "react-redux";
import { useAddBookmarkMutation, useRemoveBookmarkMutation } from "../slices/UserSlice";
import { addBookmarkedUserId, removeBookmarkedUserId, setPendingChatUserId } from "../slices/UserSlice";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { MainPageV2VoyageCard } from "../components/MainPageV2VoyageCard";
import "leaflet/dist/leaflet.css";
import he from "he";
import DOMPurify from "dompurify";
import imgEmail from "../assets/images/email_logo.png";
import imgInstagram from "../assets/images/instagram_icon.png";
import imgTwitter from "../assets/images/twitter_logo.png";
import imgPhone from "../assets/images/phone_logo.jpeg";
import imgYoutube from "../assets/images/youtube_icon.png";
import imgFacebook from "../assets/images/facebook_logo.png";
import imgLinkedin from "../assets/images/linkedin_logo.png";
import imgTiktok from "../assets/images/tiktok_logo.png";

function FitBoundsWithPadding({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (map && bounds) map.fitBounds(bounds, { padding: [32, 32] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function MapPanner({ target }) {
  const map = useMap();
  useEffect(() => {
    if (map && target) map.setView([target.lat, target.lng], 9, { animate: true });
  }, [map, target]);
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
const red = "#C22F3D";

// ── Contact icons ─────────────────────────────────────────────────────────────
const socialIconImg = { width: "3.45rem", height: "3.45rem", margin: 5, cursor: "pointer", borderRadius: "5rem", objectFit: "cover" };
const ContactIcons = {
  email: <img src={imgEmail} alt="Email" style={socialIconImg} />,
  instagram: <img src={imgInstagram} alt="Instagram" style={socialIconImg} />,
  twitter: <img src={imgTwitter} alt="X" style={socialIconImg} />,
  phoneNumber: <img src={imgPhone} alt="Phone" style={socialIconImg} />,
  youtube: <img src={imgYoutube} alt="YouTube" style={socialIconImg} />,
  facebook: <img src={imgFacebook} alt="Facebook" style={socialIconImg} />,
  linkedin: <img src={imgLinkedin} alt="LinkedIn" style={socialIconImg} />,
  tiktok: <img src={imgTiktok} alt="TikTok" style={socialIconImg} />,
};
const CONTACT_LABELS = {
  email: "Email", instagram: "Instagram", twitter: "X", phoneNumber: "Phone",
  youtube: "YouTube", facebook: "Facebook", linkedin: "LinkedIn", tiktok: "TikTok",
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

const clean = (s) => s ? DOMPurify.sanitize(he.decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())) : "";

const USER_REPORT_REASONS = ["Spam", "Inappropriate behavior", "Harassment", "Scam"];

// ── Vehicle card ──────────────────────────────────────────────────────────────
function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const [hov, setHov] = React.useState(false);
  return (
    <article
      style={{ ...vc, ...(hov ? vcHov : {}) }}
      onClick={() => navigate(`/vehicle-details/${vehicle?.id}`)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <span style={vcIm}>
        <img src={vehicle?.profileImageThumbnailUrl || vehicle?.profileImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </span>
      <span style={vcBd}>
        <span style={vcT}>{vehicle?.name}</span>
        <span style={vcS}>{clean(vehicle?.description)}</span>
        <span style={mt2}>
          {vehicle?.type && <span style={vtag}>{vehicle.type}</span>}
          {vehicle?.capacity && <span style={{ ...vtag, display: "inline-flex", alignItems: "center", gap: 4 }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}><circle cx="9" cy="8" r="3" /><path d="M3 19a6 6 0 0 1 12 0" /><path d="M16 11a3 3 0 0 0 0-6" /><path d="M18 19a5 5 0 0 0-2-4" /></svg>{vehicle.capacity}</span>}
        </span>
      </span>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function ProfilePagePublic() {
  console.log("entered ProfilePagePublic");

  const { userId: publicId, userName } = useParams();
  const local_userId = localStorage.getItem("storedUserId");
  const bookmarkedUserIds = useSelector((state) => state.users.bookmarkedUserIds);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [panTarget, setPanTarget] = useState(null);
  const [enlargedImg, setEnlargedImg] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const moreRef = useRef(null);
  const bioRef = useRef(null);
  const [bioOverflow, setBioOverflow] = useState(false);

  const { data: userData, isLoading, isError, isSuccess } = useGetUserByPublicIdQuery(publicId);
  const [addBookmark] = useAddBookmarkMutation();
  const [removeBookmark] = useRemoveBookmarkMutation();
  const [reportUser] = useReportUserMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const { data: isBlockedData, refetch: refetchIsBlocked } = useIsBlockedQuery(publicId, { skip: !local_userId });
  const isBlocked = isBlockedData ?? false;
  const { isError: isHealthCheckError } = useHealthCheckQuery();

  const internalUserId = userData?.id ?? null;
  const isBookmarked = internalUserId ? bookmarkedUserIds.includes(internalUserId) : false;
  const isOwnProfile = local_userId === internalUserId;

  useEffect(() => {
    const handler = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const el = bioRef.current;
    if (el) setBioOverflow(el.scrollHeight > el.clientHeight);
  }, [userData?.bio]);

  const handleToggleBookmark = async () => {
    if (!internalUserId || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(internalUserId).unwrap();
        dispatch(removeBookmarkedUserId(internalUserId));
      } else {
        await addBookmark(internalUserId).unwrap();
        dispatch(addBookmarkedUserId(internalUserId));
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!selectedReason) return;
    try {
      await reportUser({ publicId, reason: selectedReason, details: null }).unwrap();
      setReportSubmitted(true);
    } catch (err) {
      console.error("Report failed:", err);
    }
  };

  const handleBlockToggle = async () => {
    try {
      if (isBlocked) {
        await unblockUser(publicId).unwrap();
      } else {
        await blockUser(publicId).unwrap();
      }
      refetchIsBlocked();
    } catch (err) {
      console.error("Block toggle failed:", err);
    }
  };

  if (isHealthCheckError) return <SomethingWentWrong />;
  if (isLoading) return <LoadingProfilePage />;
  if (isError) return <SomethingWentWrong />;
  if (!isSuccess) return null;

  const vehicles = userData?.usersVehicles ?? [];
  const voyages = userData?.usersVoyages ?? [];
  const contacts = buildContacts(userData);
  const totalCount = vehicles.length + voyages.length;

  const pins = voyages.filter(v => v?.latitude && v?.longitude);
  const mapCenter = pins.length > 0 ? [pins[0].latitude, pins[0].longitude] : [20, 0];
  const pinBounds = pins.length > 1 ? pins.map(v => [v.latitude, v.longitude]) : null;

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
              <img src={userData?.backgroundImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "zoom-in" }} onClick={() => setEnlargedImg(userData?.backgroundImageUrl)} />
              <div style={avatarWrap}>
                <img src={userData?.profileImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }} onClick={() => setEnlargedImg(userData?.profileImageUrl)} />
              </div>
              <div style={coverBtns}>
                <style>{`
                  .pcb-pub[data-tip]::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 8px);left:0;background:rgba(8,30,54,.92);color:#fff;font-size:11.5px;font-weight:800;font-family:Nunito,sans-serif;padding:5px 10px;border-radius:7px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .13s}
                  .pcb-pub[data-tip]:hover::after{opacity:1}
                  .pcb-pub:hover{background:#fff!important}
                `}</style>

                {/* Message */}
                <button className="pcb-pub" data-tip="Send Message" style={{ ...cbtn, background: "#fff" }}
                  onClick={() => { dispatch(setPendingChatUserId(internalUserId)); navigate(`/connect/${publicId}/${userName}`); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>
                </button>

                {/* Bookmark (only for others) */}
                {!isOwnProfile && (
                  <button className="pcb-pub" data-tip={isBookmarked ? "Remove bookmark" : "Bookmark"} style={{ ...cbtn, background: "#fff", color: isBookmarked ? red : navy }} onClick={handleToggleBookmark} disabled={bookmarkLoading}>
                    <svg viewBox="0 0 24 24" fill={isBookmarked ? red : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                  </button>
                )}

                {/* Own profile shortcut */}
                {isOwnProfile && (
                  <button className="pcb-pub" data-tip="My Profile" style={{ ...cbtn, background: "#fff" }} onClick={() => navigate("/profile")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                  </button>
                )}

                {/* More (report) — only for others */}
                {!isOwnProfile && (
                  <div ref={moreRef} style={{ position: "relative" }}>
                    <button className="pcb-pub" style={cbtn} onClick={() => setMoreOpen(o => !o)} aria-label="More">
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 19, height: 19 }}><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></svg>
                    </button>
                    {moreOpen && (
                      <div style={moreMenu}>
                        <button style={{ ...moreItem, color: "#D97706" }} onClick={() => { setMoreOpen(false); setBlockModalOpen(true); }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                          {isBlocked ? "Unblock user" : "Block user"}
                        </button>
                        <button style={{ ...moreItem, color: red }} onClick={() => { setMoreOpen(false); setReportModalOpen(true); setReportSubmitted(false); setSelectedReason(""); }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                          Report user
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Map ── */}
            <div style={mapCell}>
              {pins.length > 0 ? (
                <MapContainer center={mapCenter} zoom={3} style={{ width: "100%", height: "100%" }} zoomControl={false} scrollWheelZoom>
                  <TileLayer
                    url={`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAPTILER_KEY}`}
                    attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                  />
                  {pins.map((v, i) => (
                    <CircleMarker key={v?.id ?? i} center={[v.latitude, v.longitude]} radius={7}
                      pathOptions={{ color: "#fff", weight: 2, fillColor: blue, fillOpacity: 1 }}>
                      <Tooltip>{v?.name || v?.title}</Tooltip>
                    </CircleMarker>
                  ))}
                  {pinBounds && <FitBoundsWithPadding bounds={pinBounds} />}
                  <MapPanner target={panTarget} />
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
                <h1 style={{ fontSize: 27, fontWeight: 900, letterSpacing: "-.02em", lineHeight: 1.1, color: blueDk }}>{userData?.userName}</h1>
                {userData?.title && <span style={{ fontSize: 15.5, fontWeight: 800, color: blueDk }}>{userData?.title}</span>}
              </div>
              {userData?.bio && (
                <div style={{ position: "relative" }}>
                  <style>{`@keyframes parrotPulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}`}</style>
                  <p ref={bioRef} style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.6, color: navy, textAlign: "left", margin: 0 }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(he.decode(userData.bio.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())) }}
                  />
                  {bioOverflow && (
                    <div style={{ position: "absolute", bottom: 0, right: 0, pointerEvents: "none" }}>
                      <FaAngleDoubleDown style={{ color: blue, fontSize: "1.2rem", animation: "parrotPulse 1.8s ease-in-out infinite" }} />
                    </div>
                  )}
                </div>
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
                    {visibleVoyages.map((v, i) => <MainPageV2VoyageCard key={v?.id ?? i} cardData={v} panToLocation={v?.latitude && v?.longitude ? () => setPanTarget({ lat: v.latitude, lng: v.longitude }) : () => {}} />)}
                  </>
                )}
                {totalCount === 0 && (
                  <div style={{ border: `1.5px dashed ${line}`, borderRadius: 12, padding: "24px 16px", textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: navy }}>Nothing here yet</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: mid, marginTop: 4 }}>This user hasn't added any vehicles or voyages.</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Image enlarge modal */}
      {enlargedImg && (
        <div style={modalOverlay} onClick={() => setEnlargedImg(null)}>
          <img src={enlargedImg} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 14, boxShadow: "0 16px 48px rgba(0,0,0,.5)", objectFit: "contain" }} onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Block modal */}
      {blockModalOpen && (
        <div style={modalOverlay} onClick={() => setBlockModalOpen(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={modalTitle}>{isBlocked ? `Unblock ${userData?.userName}` : `Block ${userData?.userName}`}</div>
            <div style={modalSubtitle}>
              {isBlocked
                ? `${userData?.userName} will be able to message you and bid on your voyages again.`
                : `Their messages won't be shown to you and they won't be able to bid on your voyages. They won't be notified.`}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              <button onClick={() => setBlockModalOpen(false)} style={modalCancelBtn}>Cancel</button>
              <button onClick={() => { setBlockModalOpen(false); handleBlockToggle(); }} style={{ ...modalPrimaryBtn, backgroundColor: "#D97706" }}>
                {isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report modal */}
      {reportModalOpen && (
        <div style={modalOverlay} onClick={() => setReportModalOpen(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            {reportSubmitted ? (
              <>
                <div style={modalTitle}>Report submitted</div>
                <div style={modalSubtitle}>Thank you. Your report stays private.</div>
                <button onClick={() => setReportModalOpen(false)} style={modalPrimaryBtn}>Close</button>
              </>
            ) : (
              <>
                <div style={modalTitle}>Report {userData?.userName}</div>
                <div style={modalSubtitle}>Tell us what's wrong. Your report stays private.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1rem 0" }}>
                  {USER_REPORT_REASONS.map(r => (
                    <div key={r} onClick={() => setSelectedReason(r)} style={reasonItem(selectedReason === r)}>{r}</div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={() => setReportModalOpen(false)} style={modalCancelBtn}>Cancel</button>
                  <button onClick={handleReportSubmit} disabled={!selectedReason} style={{ ...modalPrimaryBtn, opacity: selectedReason ? 1 : 0.4 }}>Submit report</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePagePublic;

// ── Styles ────────────────────────────────────────────────────────────────────

const pageWrap = {
  display: "flex", flexDirection: "column",
  width: "100%", height: "100vh", overflow: "hidden",
  fontFamily: "Nunito, sans-serif",
  backgroundColor: deep,
};

const panel = {
  backgroundColor: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(0,14,30,.18)",
};

const wrap = {
  maxWidth: 1500, width: "100%", flex: 1, minHeight: 0,
  margin: "0 auto", padding: "0 20px 16px",
  display: "grid",
  gridTemplateColumns: "minmax(0,375px) minmax(0,1fr) minmax(0,375px) 28rem",
  gridTemplateRows: "23rem 1fr",
  gap: 16, overflow: "hidden",
};

const coverCell = {
  gridColumn: 1, gridRow: 1,
  position: "relative", borderRadius: 14, overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,14,30,.18)",
};

const avatarWrap = {
  position: "absolute", right: ".25rem", bottom: ".25rem",
  width: "10rem", height: "10rem", borderRadius: "50%",
  border: "4px solid #fff", overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,14,30,.34)",
};

const coverBtns = {
  position: "absolute", left: ".5rem", bottom: ".5rem",
  display: "flex", gap: 7, flexWrap: "nowrap",
  maxWidth: "calc(100% - 156px)",
};

const cbtn = {
  fontFamily: "Nunito, sans-serif",
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 44, height: 44,
  background: "rgba(255,255,255,.95)",
  border: "none", color: navy, borderRadius: "50%",
  cursor: "pointer", boxShadow: "0 3px 10px rgba(0,14,30,.24)",
  position: "relative", padding: 0, flexShrink: 0,
};

const moreMenu = {
  position: "absolute", left: 0, bottom: "calc(100% + 7px)",
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
  gridColumn: "2 / span 2", gridRow: 1,
  position: "relative", borderRadius: 14, overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,14,30,.18)",
};

const mapCount = {
  position: "absolute", left: 14, bottom: 14,
  display: "inline-flex", alignItems: "center", gap: 7,
  background: "rgba(8,30,54,.86)", backdropFilter: "blur(10px)",
  color: "#fff", fontSize: 12.5, fontWeight: 800,
  padding: "8px 13px", borderRadius: 99,
  border: "1px solid rgba(255,255,255,.16)", pointerEvents: "none",
};

const identCell = {
  gridColumn: "1 / span 2", gridRow: 2,
  padding: "18px 20px",
  display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
  overflowY: "auto", minHeight: 0,
};

const socCell = {
  gridColumn: 3, gridRow: 2,
  padding: "16px 16px 18px",
  display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
  overflowY: "auto", minHeight: 0,
};

const railCell = {
  gridColumn: 4, gridRow: "1 / span 2",
  padding: "16px 16px 18px",
  display: "flex", flexDirection: "column", gap: 11, minHeight: 0,
  overflowY: "auto",
};

const sec = { fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: mid };
const ct = { fontSize: 12, fontWeight: 800, color: mid, backgroundColor: tint, padding: "3px 9px", borderRadius: 99 };

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

const filters = { display: "flex", gap: 5, backgroundColor: tint, padding: 4, borderRadius: 99, flexShrink: 0 };
const filterBtn = {
  fontFamily: "Nunito, sans-serif",
  border: "none", background: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 800, color: mid,
  padding: "6px 11px", borderRadius: 99, whiteSpace: "nowrap",
};
const filterBtnOn = { backgroundColor: blue, color: "#fff" };

const sub = { display: "flex", alignItems: "center", gap: 9, flexShrink: 0 };
const scroll = { display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", minHeight: 0, flex: 1, margin: "0 -4px", padding: "0 4px 2px" };

const vc = { display: "flex", gap: 11, background: tint, border: "1.5px solid transparent", borderRadius: 11, padding: 9, cursor: "pointer", flexShrink: 0, minWidth: 0, transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s" };
const vcHov = { borderColor: blue, background: "#fff", boxShadow: "0 4px 14px rgba(10,119,234,.13)" };
const vcIm = { width: 96, height: 96, borderRadius: 9, overflow: "hidden", flexShrink: 0, display: "block" };
const vcBd = { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 };
const vcT = { fontSize: 14.5, fontWeight: 800, color: blueDk, letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" };
const vcS = { fontSize: 12, fontWeight: 600, color: mid, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textAlign: "left" };
const mt2 = { display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginTop: "auto" };
const vtag = { fontSize: 9.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 99, background: "#E4F0FE", color: blueDk, whiteSpace: "nowrap" };

const modalOverlay = { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 };
const modalBox = { backgroundColor: "white", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: "Nunito, sans-serif" };
const modalTitle = { fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" };
const modalSubtitle = { fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" };
const reasonItem = (selected) => ({ padding: "0.6rem 1rem", borderRadius: 8, cursor: "pointer", fontSize: "0.9rem", backgroundColor: selected ? "#eff6ff" : "#f8fafc", color: selected ? "#1d4ed8" : "#334155", fontWeight: selected ? 700 : 400, border: selected ? "1px solid #bfdbfe" : "1px solid #e2e8f0" });
const modalPrimaryBtn = { flex: 1, padding: "0.6rem 1.2rem", borderRadius: 8, border: "none", backgroundColor: red, color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "Nunito, sans-serif" };
const modalCancelBtn = { flex: 1, padding: "0.6rem 1.2rem", borderRadius: 8, border: "1px solid #e2e8f0", backgroundColor: "white", color: "#475569", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "Nunito, sans-serif" };
