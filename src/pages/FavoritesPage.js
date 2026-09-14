/* eslint-disable no-undef */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useGetFavoriteVoyagesByUserIdQuery } from "../slices/VoyageSlice";
import { useGetFavoriteVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { MainPageV2VoyageCard } from "../components/MainPageV2VoyageCard";
import { useGetBookmarksQuery } from "../slices/UserSlice";
import he from "he";
import DOMPurify from "dompurify";

// ── Tokens ────────────────────────────────────────────────────────────────────
const blue = "#0A77EA";
const blueDk = "#0A5FBF";
const navy = "#0A2540";
const deep = "#081E36";
const mid = "#5C6B7A";
const line = "#E3E9F0";
const tint = "#F4F7FB";

const clean = (s) =>
  s ? DOMPurify.sanitize(he.decode(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())) : "";

// ── Vehicle card (profile rail style) ────────────────────────────────────────
function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  const VEHICLE_EMOJIS = ["⛵", "🚗", "🚐", "🚌", "🚶", "🏃", "🏍️", "🚲", "🏠", "✈️", "🚄"];
  const emoji = VEHICLE_EMOJIS[vehicle?.type] ?? "❓";
  return (
    <article
      style={{ ...vc, ...(hov ? vcHov : {}) }}
      onClick={() => navigate(`/vehicle-details/${vehicle?.id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span style={vcIm}>
        <img
          src={vehicle?.profileImageThumbnailUrl || vehicle?.profileImageUrl}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </span>
      <span style={vcBd}>
        <span style={vcT}>{vehicle?.name}</span>
        <span style={vcS}>{clean(vehicle?.description)}</span>
        <span style={mt2}>
          {vehicle?.type !== undefined && <span style={vtag}>{emoji}</span>}
          {vehicle?.capacity && (
            <span style={{ ...vtag, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}>
                <circle cx="9" cy="8" r="3" />
                <path d="M3 19a6 6 0 0 1 12 0" />
                <path d="M16 11a3 3 0 0 0 0-6" />
                <path d="M18 19a5 5 0 0 0-2-4" />
              </svg>
              {vehicle.capacity}
            </span>
          )}
        </span>
      </span>
    </article>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ height: 80, borderRadius: 11, background: line, flexShrink: 0, animation: "pulse 1.4s ease-in-out infinite" }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FavoritePage() {
  console.log("entered FavoritePage");

  const userId = localStorage.getItem("storedUserId");
  const [vFilter, setVFilter] = useState("vehicles");
  const [voFilter, setVoFilter] = useState("voyages");
  const navigate = useNavigate();
  const { data: bookmarksRaw, isLoading: isBookmarksLoading } = useGetBookmarksQuery();
  const bookmarks = React.useMemo(() => bookmarksRaw?.map(b => ({
    id: b.bookmarkedUserId,
    userName: b.userName,
    profileImageUrl: b.profileImageThumbnailUrl || b.profileImageUrl,
    publicId: b.publicId,
    title: b.title,
    bio: b.bio,
  })) ?? [], [bookmarksRaw]);

  const {
    data: FavoriteVoyagesData,
    isError: isFavoriteVoyagesError,
    isSuccess: isFavoriteVoyagesSuccess,
    isLoading: isFavoriteVoyagesLoading,
  } = useGetFavoriteVoyagesByUserIdQuery(userId);

  const {
    data: FavoriteVehiclesData,
    isError: isFavoriteVehiclesError,
    isSuccess: isFavoriteVehiclesSuccess,
    isLoading: isFavoriteVehiclesLoading,
  } = useGetFavoriteVehiclesByUserByIdQuery(userId);

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;
  if (isFavoriteVoyagesError || isFavoriteVehiclesError) return <SomethingWentWrong />;

  const vehicles = FavoriteVehiclesData ?? [];
  const voyages = FavoriteVoyagesData ?? [];

  return (
    <div className="App">
      <header className="App-header">
        <div style={pageWrap}>

          {/* Top nav */}
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight"><TopBarMenu /></div>
          </div>

          {/* Two-panel grid */}
          <div style={wrap}>

            {/* ── Vehicles panel ── */}
            <div style={panel}>
              <div style={filters}>
                <span style={filterLabel}>Vehicles</span>
                <span style={ct}>{vehicles.length}</span>
                <span style={{ flex: 1 }} />
                {[["vehicles", "All"], ["owned", "Owned"]].map(([k, label]) => (
                  <button key={k} style={{ ...filterBtn, ...(vFilter === k ? filterBtnOn : {}) }} onClick={() => setVFilter(k)}>{label}</button>
                ))}
              </div>
              <div style={scroll}>
                {isFavoriteVehiclesLoading ? (
                  <Skeleton />
                ) : isFavoriteVehiclesSuccess && vehicles.length === 0 ? (
                  <EmptyState label="No favorite vehicles yet." />
                ) : (
                  vehicles.map((v, i) => <VehicleCard key={v?.id ?? i} vehicle={v} />)
                )}
              </div>
            </div>

            {/* ── Voyages panel ── */}
            <div style={panel}>
              <div style={filters}>
                <span style={filterLabel}>Voyages</span>
                <span style={ct}>{voyages.length}</span>
                <span style={{ flex: 1 }} />
                {[["voyages", "All"], ["upcoming", "Upcoming"]].map(([k, label]) => (
                  <button key={k} style={{ ...filterBtn, ...(voFilter === k ? filterBtnOn : {}) }} onClick={() => setVoFilter(k)}>{label}</button>
                ))}
              </div>
              <div style={scroll}>
                {isFavoriteVoyagesLoading ? (
                  <Skeleton />
                ) : isFavoriteVoyagesSuccess && voyages.length === 0 ? (
                  <EmptyState label="No favorite voyages yet." />
                ) : (
                  voyages.map((v, i) => (
                    <MainPageV2VoyageCard key={v?.id ?? i} cardData={v} panToLocation={() => { }} />
                  ))
                )}
              </div>
            </div>

            {/* ── Bookmarks panel ── */}
            <div style={panel}>
              <div style={filters}>
                <span style={filterLabel}>People</span>
                <span style={ct}>{bookmarks.length}</span>
              </div>
              <div style={scroll}>
                {isBookmarksLoading ? (
                  <Skeleton />
                ) : bookmarks.length === 0 ? (
                  <EmptyState label="No bookmarked users yet." />
                ) : (
                  bookmarks.map((b) => (
                    <BookmarkCard key={b.id} user={b} navigate={navigate} />
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </header>
    </div>
  );
}

function Tip({ text, children }) {
  const [show, setShow] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <span style={tipStyle}>{text}</span>}
    </span>
  );
}

function BookmarkCard({ user, navigate }) {
  const cleanBio = user.bio
    ? DOMPurify.sanitize(he.decode(user.bio.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()))
    : "";
  return (
    <div style={bmCard}>
      <span style={bmAv} onClick={() => navigate(`/profile-public/${user.publicId}/${user.userName}`)}>
        <img src={user.profileImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </span>
      <span style={bmTx}>
        <span style={bmName}>{user.userName}</span>
        {user.title && <span style={bmRole}>{user.title}</span>}
        {cleanBio && <span style={bmBio}>{cleanBio}</span>}
      </span>
      <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
        <Tip text="Message">
          <button style={bmBtn} onClick={() => navigate(`/connect/${user.publicId}/${user.userName}`)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>
          </button>
        </Tip>
        <Tip text="View profile">
          <button style={bmBtn} onClick={() => navigate(`/profile-public/${user.publicId}/${user.userName}`)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 19a6 6 0 0 1 11 0" /></svg>
          </button>
        </Tip>
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div style={{ border: `1.5px dashed ${line}`, borderRadius: 12, padding: "24px 16px", textAlign: "center", flexShrink: 0 }}>
      <div style={{ fontSize: 14.5, fontWeight: 800, color: navy }}>Nothing here yet</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: mid, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const pageWrap = {
  display: "flex", flexDirection: "column",
  width: "100%", height: "100vh", overflow: "hidden",
  fontFamily: "Nunito, sans-serif",
  backgroundColor: deep,
};

const wrap = {
  maxWidth: 1500,
  width: "100%",
  flex: 1,
  minHeight: 0,
  margin: "0 auto",
  padding: "0 20px 16px",
  display: "grid",
  gridTemplateColumns: "28rem 28rem 28rem",
  gap: "5rem",
  justifyContent: "center",
  overflow: "hidden",
};

const panel = {
  backgroundColor: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(0,14,30,.18)",
  padding: "16px 16px 18px",
  display: "flex", flexDirection: "column", gap: 11,
  minHeight: 0, overflowY: "auto",
};

const filters = {
  display: "flex", alignItems: "center", gap: 7, flexShrink: 0,
};

const filterLabel = {
  fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: mid,
};

const ct = {
  fontSize: 12, fontWeight: 800, color: mid, backgroundColor: tint, padding: "3px 9px", borderRadius: 99,
};

const filterBtn = {
  fontFamily: "Nunito, sans-serif",
  border: "none", background: tint, cursor: "pointer",
  fontSize: 12, fontWeight: 800, color: mid,
  padding: "6px 11px", borderRadius: 99, whiteSpace: "nowrap",
};

const filterBtnOn = { backgroundColor: blue, color: "#fff" };

const scroll = {
  display: "flex", flexDirection: "column", gap: 10,
  overflowY: "auto", minHeight: 0, flex: 1,
  margin: "0 -4px", padding: "0 4px 2px",
};

const vc = {
  display: "flex", gap: 11, background: tint,
  border: "1.5px solid transparent", borderRadius: 11,
  padding: 9, cursor: "pointer", flexShrink: 0, minWidth: 0,
  transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
};
const vcHov = { borderColor: blue, background: "#fff", boxShadow: "0 4px 14px rgba(10,119,234,.13)" };
const vcIm = {
  width: 96, height: 96, borderRadius: 9,
  overflow: "hidden", flexShrink: 0, display: "block",
};
const vcBd = { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 };
const vcT = { fontSize: 14.5, fontWeight: 800, color: blueDk, letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" };
const vcS = { fontSize: 12, fontWeight: 600, color: mid, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textAlign: "left" };
const mt2 = { display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginTop: "auto" };
const vtag = { fontSize: 9.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 99, background: "#E4F0FE", color: blueDk, whiteSpace: "nowrap" };

const bmCard = {
  fontFamily: "Nunito, sans-serif",
  display: "flex", alignItems: "flex-start", gap: 13,
  background: "#fff", borderRadius: 14,
  padding: "13px 14px",
  boxShadow: "0 4px 14px rgba(0,14,30,.12)",
  flexShrink: 0,
};
const bmAv = {
  width: 54, height: 54, borderRadius: "50%",
  overflow: "hidden", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: tint, cursor: "pointer",
};
const bmTx = {
  flex: 1, minWidth: 0,
  display: "flex", flexDirection: "column", gap: 2,
};
const bmName = {
  fontSize: 16.5, fontWeight: 800, color: blueDk,
  letterSpacing: "-.01em",
  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  textAlign: "left",
};
const bmRole = {
  fontSize: 12.5, fontWeight: 800, color: "#E8620E", textAlign: "left",
};
const bmBio = {
  fontSize: 13, fontWeight: 600, color: mid, lineHeight: 1.45, marginTop: 3,
  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
  overflow: "hidden", textAlign: "left",
};
const bmBtn = {
  width: 38, height: 38, borderRadius: 10, border: "none",
  background: "#EAF2FD", color: blue,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0, cursor: "pointer", padding: 0, fontFamily: "inherit",
};
const tipStyle = {
  position: "absolute", top: "calc(100% + 6px)", left: "50%",
  transform: "translateX(-50%)",
  background: navy, color: "#fff",
  fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
  padding: "4px 9px", borderRadius: 6,
  pointerEvents: "none", zIndex: 99,
};
