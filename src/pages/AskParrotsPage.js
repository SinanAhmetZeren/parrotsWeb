import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, CircleMarker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useAskParrotsMutation } from "../slices/AiSlice";
import { PulsatingParrotLogoWithText } from "../components/PulsatingParrotLogoWithText";
import { FaAngleDoubleDown } from "react-icons/fa";
import { invokeHub } from "../signalr/signalRHub";
import { useSelector } from "react-redux";
import { useLazyGetUserByIdQuery } from "../slices/UserSlice";
import parrotCracker from "../assets/images/parrotCracker.png";
import placeholderParrots from "../assets/images/placeholderparrots.png";
import {
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed,
  parrotBicycleTealGreen, parrotTinyHouseLightYellow, parrotAirplaneLightGreen,
  parrotTrainPink,
} from "../styles/colors";

// ── Tokens ────────────────────────────────────────────────────────────────────
const blue = "#0A77EA";
const blueDk = "#0A5FBF";
const navy = "#0A2540";
const mid = "#5C6B7A";
const faint = "#8B98A5";
const line = "#E3E9F0";
const tint = "#F4F7FB";
const greenInk = "#0B6B4E";
const purple = "#7C4DE0";
const amber = "#B03A6E";

// ── Data ──────────────────────────────────────────────────────────────────────
const VEHICLES = ["Boat", "Car", "Caravan", "Bus", "Walk", "Run", "Motorcycle", "Bicycle", "TinyHouse", "Airplane", "Train"];
const DURATIONS = ["Half day", "1 day", "2-3 days", "1 week", "2 weeks"];
const VIBES = ["Culture", "Food", "Nature", "Chill", "Adventure", "Budget", "Scenic", "Any"];
const SPOT_TYPES = ["Popular spots", "Local favourites", "Hidden gems", "Mixed"];
const ON_FOOT = ["Walk", "Run"];
const TRANSIT = ["Bus", "Train", "Airplane"];

const VIBES_CONFIG = {
  Culture: { label: "culture-focused", detail: "cultural sights and history" },
  Food: { label: "food-focused", detail: "local food and dining" },
  Nature: { label: "nature-focused", detail: "outdoor scenery and nature" },
  Chill: { label: "relaxed", detail: "laid-back pace" },
  Adventure: { label: "adventurous", detail: "off the beaten path" },
  Budget: { label: "budget-friendly", detail: "low-cost spots" },
  Scenic: { label: "scenic", detail: "landscapes and views" },
  Any: { label: "any vibe", detail: "" },
};

const SPOT_TYPES_CONFIG = {
  "Popular spots": { label: "popular spots", detail: "iconic landmarks and high-profile highlights" },
  "Local favourites": { label: "local favorites", detail: "authentic neighborhood staples where locals actually go" },
  "Hidden gems": { label: "hidden gems", detail: "lesser-known, off-the-beaten-path secret spots" },
  "Mixed": { label: "mixed picks", detail: "a curated mix of popular spots, local favorites, and hidden gems" },
};

const VEHICLE_COLORS = {
  Boat: parrotBoatPurple, Car: parrotCarRed, Caravan: parrotCaravanOrangeRed,
  Bus: "#D9F27A", Walk: parrotWalkTurquoise, Run: parrotRunLightOrange,
  Motorcycle: parrotMotorcycleDarkRed, Bicycle: parrotBicycleTealGreen,
  TinyHouse: "#FCD786", Airplane: parrotAirplaneLightGreen, Train: parrotTrainPink,
};

// chips with light colors get a darker bg when selected for legibility
const DARK_BG_CHIPS = { Bus: "#9DC41A", TinyHouse: "#D4880D" };

// group active colors matching mockup
const GROUP_COLORS = {
  vehicle: blueDk,
  duration: greenInk,
  vibe: amber,
  spot: purple,
};

const DURATION_COLORS = {
  "Half day": "#2ac898", "1 day": "#2ac898", "2-3 days": "#2ac898", "1 week": "#2ac898", "2 weeks": "#2ac898",
};
const VIBE_COLORS = {
  Culture: amber, Food: amber, Nature: amber, Chill: amber,
  Adventure: amber, Budget: amber, Scenic: amber, Any: amber,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getIndefiniteArticle(w) { return /^[aeiou]/i.test(w) ? "an" : "a"; }
function formatDuration(d) { return d === "Half day" ? "half a day" : d; }
function formatVehicleName(v) { return v === "TinyHouse" ? "tiny house" : v.toLowerCase(); }

function buildQueryText(vehicle, duration, vibe, spotType, pin) {
  const dv = formatDuration(duration);
  const vn = formatVehicleName(vehicle);
  let vp;
  if (ON_FOOT.includes(vehicle)) vp = `I want to go for a ${vn} for ${dv}.`;
  else if (TRANSIT.includes(vehicle)) vp = `I'm traveling by ${vn} for ${dv}.`;
  else vp = `I have ${getIndefiniteArticle(vn)} ${vn} and ${dv} available.`;
  let vibePart = vibe === "Any"
    ? "I'm looking for a voyage of any vibe"
    : `I'm looking for ${getIndefiniteArticle(VIBES_CONFIG[vibe].label)} ${VIBES_CONFIG[vibe].label} experience${VIBES_CONFIG[vibe].detail ? ` (${VIBES_CONFIG[vibe].detail})` : ""}`;
  const sc = SPOT_TYPES_CONFIG[spotType];
  return `${vp} ${vibePart}${sc ? `, focusing on ${sc.label} (${sc.detail})` : ""}, ${pin ? "starting from this location" : ""}.`;
}

// ── Map ───────────────────────────────────────────────────────────────────────
const purpleIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}
function MapCenterSetter({ center }) {
  const map = useMap();
  React.useEffect(() => { map.setView(center); }, [center, map]);
  return null;
}

// ── QueryPreview ──────────────────────────────────────────────────────────────
function QueryPreview({ vehicle, duration, vibe, spotType }) {
  if (!vehicle || !duration || !vibe || !spotType) return null;
  const isOnFoot = ON_FOOT.includes(vehicle);
  const isTransit = TRANSIT.includes(vehicle);
  const dv = formatDuration(duration);
  const vn = formatVehicleName(vehicle);
  const vibeConf = VIBES_CONFIG[vibe];
  const vibeLabel = vibeConf.label;
  const vibeDetail = vibeConf.detail;
  const vibeArticle = vibe === "Any" ? "a" : getIndefiniteArticle(vibeLabel);
  const spotConf = SPOT_TYPES_CONFIG[spotType];
  const vc = VEHICLE_COLORS[vehicle] || blue;
  const dc = DURATION_COLORS[duration] || greenInk;
  const vibeC = VIBE_COLORS[vibe] || amber;
  const sc = purple;
  return (
    <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, color: mid, textAlign: "left" }}>
      {isOnFoot && "I want to go for a "}
      {isTransit && "I'm traveling by "}
      {!isOnFoot && !isTransit && `I have ${getIndefiniteArticle(vn)} `}
      <b style={{ color: vc }}>{vn}</b>
      {(isOnFoot || isTransit) ? " for " : " and "}
      <b style={{ color: dc }}>{dv}</b>
      {(!isOnFoot && !isTransit) ? " available. " : ". "}
      {vibe === "Any" ? "I'm looking for a voyage of " : `I'm looking for ${vibeArticle} `}
      <b style={{ color: vibeC }}>{vibe === "Any" ? "any vibe" : vibeLabel}</b>
      {vibe === "Any" ? " voyage" : " experience"}
      {vibe !== "Any" && vibeDetail && <span style={{ color: "#aaa" }}>{` (${vibeDetail})`}</span>}
      {spotConf && <span>{", focusing on "}<b style={{ color: sc }}>{spotConf.label}</b><span style={{ color: "#aaa" }}>{` (${spotConf.detail})`}</span></span>}
      {"."}
    </p>
  );
}

// ── ChipGroup ─────────────────────────────────────────────────────────────────
function ChipGroup({ label, options, selected, onSelect, activeColor, colorMap }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={grpLabel}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map((opt) => {
          const isOn = selected === opt;
          const color = colorMap ? (colorMap[opt] || activeColor) : activeColor;
          const activeBg = isOn ? (DARK_BG_CHIPS[opt] || color) : `${color}0D`;
          return (
            <button
              key={opt}
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: 12.5, fontWeight: 900,
                padding: "6px 14px", borderRadius: 99,
                border: `1.5px solid ${isOn ? activeBg : line}`,
                backgroundColor: activeBg,
                color: isOn ? "#fff" : mid,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all .12s",
              }}
              onClick={() => onSelect(opt)}
            >
              {opt === "TinyHouse" ? "Tiny House" : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AskParrotsPage() {
  console.log("entered AskParrotsPage");

  const [vehicle, setVehicle] = useState(null);
  const [duration, setDuration] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [spotType, setSpotType] = useState(null);
  const [pin, setPin] = useState(null);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [crackerBalance, setCrackerBalance] = useState(null);
  const [isCrackerHovered, setIsCrackerHovered] = useState(false);
  const [mapCenter, setMapCenter] = useState([52.2053, 0.1218]);
  const [userLocation, setUserLocation] = useState(null);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [showResponseArrow, setShowResponseArrow] = useState(false);

  const currentUserId = useSelector((s) => s.users.userId);
  const [askParrots, { isLoading }] = useAskParrotsMutation();
  const [triggerGetUser] = useLazyGetUserByIdQuery();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const responseScrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const check = () => setShowScrollArrow(el.scrollTop + el.clientHeight < el.scrollHeight - 8);
    check(); el.addEventListener("scroll", check);
    return () => el.removeEventListener("scroll", check);
  }, []);

  useEffect(() => {
    const el = responseScrollRef.current; if (!el) return;
    const check = () => setShowResponseArrow(el.scrollTop + el.clientHeight < el.scrollHeight - 8);
    check(); el.addEventListener("scroll", check);
    return () => el.removeEventListener("scroll", check);
  }, [response]);

  React.useEffect(() => {
    if (currentUserId) triggerGetUser(currentUserId).then((res) => {
      if (res?.data) setCrackerBalance(res.data.parrotCrackerBalance ?? 0);
    });
  }, [currentUserId]);

  React.useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => { const loc = [pos.coords.latitude, pos.coords.longitude]; setMapCenter(loc); setUserLocation(loc); },
      () => { }
    );
  }, []);

  const handleMapClick = useCallback((latlng) => setPin(latlng), []);

  const handleAsk = async () => {
    if (!pin) return;
    setResponse(null);
    try {
      const result = await askParrots({
        vehicleType: vehicle,
        duration: duration === "Half day" ? "Half a Day" : duration,
        vibe, spotType,
        latitude: pin.lat, longitude: pin.lng,
      }).unwrap();
      setResponse(result.response);
      if (result.remainingBalance !== undefined) setCrackerBalance(result.remainingBalance);
    } catch (err) {
      if (err?.status === 402) { setCrackerBalance(0); setResponse(null); }
      else setResponse("Something went wrong. Please try again.");
    }
  };

  const handleSendMe = async () => {
    if (!response) return;
    setSending(true);
    const query = buildQueryText(vehicle, duration, vibe, spotType, pin);
    const clean = response.replace(/^\[\[([^\]]+)\]\]\s*/, "($1) ").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\{\{([^}]+)\}\}/g, "$1");
    await invokeHub("SendMessage", currentUserId, currentUserId, `🦜 ${query}\n\n➡️ ${clean}`, true);
    setSending(false); setSent(true); setTimeout(() => setSent(false), 2000);
  };

  const handleCopy = () => {
    if (!response) return;
    const query = buildQueryText(vehicle, duration, vibe, spotType, pin);
    const clean = response.replace(/^\[\[([^\]]+)\]\]\s*/, "($1) ").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\{\{([^}]+)\}\}/g, "$1");
    navigator.clipboard.writeText(`${query}\n\n${clean}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const extractLocation = (text) => { const m = text.match(/^\[\[([^\]]+)\]\]/); return m ? m[1] : null; };
  const stripLocation = (text) => text.replace(/^\[\[[^\]]+\]\]\s*/, "");

  const renderParagraph = (text, keyPrefix) =>
    text.split(/(\*\*[^*]+\*\*|\{\{[^}]+\}\})/).map((part, i) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) return <span key={`${keyPrefix}-${i}`} style={{ color: blue, fontWeight: 700, borderBottom: `1.5px solid rgba(10,119,234,.3)`, cursor: "pointer" }}>{part.slice(2, -2)}</span>;
      if (/^\{\{[^}]+\}\}$/.test(part)) return <span key={`${keyPrefix}-${i}`} style={{ color: purple, fontWeight: 700, borderBottom: `1.5px solid rgba(124,77,224,.3)`, cursor: "pointer" }}>{part.slice(2, -2)}</span>;
      return <span key={`${keyPrefix}-${i}`}>{part}</span>;
    });

  const renderResponse = (text) =>
    text.split(/\n\n+/).map((para, i) => (
      <p key={i} style={{ margin: i === 0 ? "0 0 .75rem 0" : ".75rem 0 0 0" }}>{renderParagraph(para, i)}</p>
    ));

  const canAsk = !!vehicle && !!duration && !!vibe && !!spotType && !!pin;
  const locationLabel = response ? extractLocation(response) : null;


  return (
    <div className="App">
      <header className="App-header">
        <div style={pageWrap}>

          {/* Top nav */}
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight"><TopBarMenu /></div>
          </div>

          {/* Body */}
          <div style={body}>

            {/* ── Left panel ── */}
            <div style={leftPanel}>

              {/* Header */}
              <div style={panelHd}>
                <img src={require("../assets/images/parrotslogoblueribbontransparent.png")} alt="" style={{ width: 52, height: 52, flexShrink: 0 }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: parrotCaravanOrangeRed, letterSpacing: "-.01em", textAlign: "left" }}>Ask Parrots</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: navy, marginTop: 2, textAlign: "left" }}>Pick your preferences, set the vibe, and explore recommendations.</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: blue, marginTop: 2, textAlign: "left" }}>These tips are for inspiration, so please verify before you go.</div>
                </div>
              </div>

              {/* Chips + summary — scrollable */}
              <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
                <div ref={scrollRef} style={chipsArea}>
                  <ChipGroup label="Travelling by" options={VEHICLES} selected={vehicle} onSelect={setVehicle} activeColor={GROUP_COLORS.vehicle} colorMap={VEHICLE_COLORS} />
                  <ChipGroup label="For" options={DURATIONS} selected={duration} onSelect={setDuration} activeColor={GROUP_COLORS.duration} />
                  <ChipGroup label="Vibe" options={VIBES} selected={vibe} onSelect={setVibe} activeColor={GROUP_COLORS.vibe} />
                  <ChipGroup label="Focusing on" options={SPOT_TYPES} selected={spotType} onSelect={setSpotType} activeColor={GROUP_COLORS.spot} />
                  {/* Summary box — always visible, text only when all 4 selected */}
                  <div style={summaryBox}>
                    {vehicle && duration && vibe && spotType && (
                      <QueryPreview vehicle={vehicle} duration={duration} vibe={vibe} spotType={spotType} />
                    )}
                  </div>
                </div>
                {showScrollArrow && (
                  <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", pointerEvents: "none" }}>
                    <style>{`@keyframes parrotPulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}`}</style>
                    <FaAngleDoubleDown style={{ color: parrotCaravanOrangeRed, fontSize: "1.5rem", animation: "parrotPulse 1.8s ease-in-out infinite" }} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={panelFoot}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: mid, cursor: "pointer", whiteSpace: "nowrap" }}
                    onMouseEnter={() => setIsCrackerHovered(true)}
                    onMouseLeave={() => setIsCrackerHovered(false)}
                    onClick={() => navigate("/parrotCrackerPage")}
                  >
                    <img src={parrotCracker} alt="" style={{ width: 16, height: 16 }} />
                    {crackerBalance !== null ? `${crackerBalance} cracker${crackerBalance !== 1 ? "s" : ""}` : "1 cracker"}
                  </div>
                  {isCrackerHovered && crackerBalance !== null && (
                    <div style={{ position: "absolute", bottom: "2.8rem", left: 0, backgroundColor: "#0d2a45", color: "rgba(255,245,220,.9)", borderRadius: 12, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,.3)", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", zIndex: 100, lineHeight: 1.6 }}>
                      {crackerBalance === 0
                        ? <>You have no ParrotCrackers left.<br />Click to top up.</>
                        : <>You have <b>{crackerBalance}</b> ParrotCracker{crackerBalance !== 1 ? "s" : ""}.<br />1 will be deducted per query.</>}
                    </div>
                  )}
                </div>

                <span style={{ flex: 1 }} />

                <button
                  style={{
                    fontFamily: "Nunito, sans-serif", border: "none", color: "#fff",
                    fontSize: 14, fontWeight: 800, padding: "11px 22px", borderRadius: 99,
                    backgroundColor: crackerBalance === 0 ? parrotCaravanOrangeRed : canAsk && !isLoading ? blue : "#ccc",
                    cursor: (crackerBalance === 0 || (canAsk && !isLoading)) ? "pointer" : "not-allowed",
                    transition: "background .15s",
                  }}
                  disabled={crackerBalance !== 0 && (!canAsk || isLoading)}
                  onClick={crackerBalance === 0 ? () => navigate("/parrotCrackerPage") : handleAsk}
                >
                  {isLoading ? "Asking Parrots…" : crackerBalance === 0 ? "Get ParrotCrackers" : "Ask Parrots"}
                </button>
              </div>
            </div>

            {/* ── Right panel ── */}
            <div style={rightPanel}>

              {/* Map */}
              <div style={mapWrap}>
                <MapContainer center={mapCenter} zoom={11} style={{ height: "100%", width: "100%" }} scrollWheelZoom zoomControl={false}>
                  <TileLayer
                    url={`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAPTILER_KEY}`}
                    attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                  />
                  <MapCenterSetter center={mapCenter} />
                  <MapClickHandler onMapClick={handleMapClick} />
                  {userLocation && <CircleMarker center={userLocation} radius={5} pathOptions={{ color: "#1a73e8", fillColor: "#1a73e8", fillOpacity: 1, weight: 2 }} />}
                  {pin && <Marker position={pin} icon={purpleIcon} />}
                </MapContainer>
                <span style={mapHint}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M4 4l7 16 2-7 7-2z" /></svg>
                  Tap the map to move your start point
                </span>
              </div>

              {/* Result */}
              <div style={resPanel}>

                <div style={resHd}>
                  {locationLabel
                    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 800, color: greenInk }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" /></svg>
                      {locationLabel}
                    </span>
                    : <span style={{ fontSize: 13, fontWeight: 700, color: faint }}>Response</span>
                  }
                  <span style={{ flex: 1 }} />
                  {response && (
                    <button style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${line}`, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: mid, flexShrink: 0 }} onClick={handleAsk} title="Refresh">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M20 11a8 8 0 1 0-2.3 6" /><path d="M20 4v7h-7" /></svg>
                    </button>
                  )}
                </div>

                {response && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 18px", borderBottom: `1px solid ${line}`, flexShrink: 0 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, color: mid }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: blue, display: "inline-block" }} />Places
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, color: mid }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: purple, display: "inline-block" }} />Food &amp; drink
                    </span>
                  </div>
                )}

                <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
                  {response ? (
                    <>
                      <div ref={responseScrollRef} style={{ padding: "15px 18px", fontSize: 14, fontWeight: 600, color: navy, lineHeight: 1.65, height: "100%", overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#DDE4EC transparent", textAlign: "left" }}>
                        {renderResponse(stripLocation(response))}
                      </div>
                      {showResponseArrow && (
                        <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", pointerEvents: "none" }}>
                          <FaAngleDoubleDown style={{ color: parrotCaravanOrangeRed, fontSize: "1.5rem", animation: "parrotPulse 1.8s ease-in-out infinite" }} />
                        </div>
                      )}
                    </>
                  ) : isLoading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <PulsatingParrotLogoWithText size={150} />
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <img src={placeholderParrots} alt="" style={{ height: "8rem", objectFit: "contain", opacity: 0.4 }} />
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 18px", borderTop: `1px solid ${line}`, backgroundColor: "#FAFCFE", flexShrink: 0 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: faint }}>Verify opening times before you go.</span>
                  <span style={{ flex: 1 }} />
                  <button
                    style={{ fontFamily: "Nunito, sans-serif", display: "inline-flex", alignItems: "center", gap: 7, border: `1.5px solid ${line}`, backgroundColor: "#fff", color: mid, fontSize: 13, fontWeight: 800, padding: "9px 15px", borderRadius: 99, cursor: "pointer", whiteSpace: "nowrap" }}
                    onClick={handleCopy} disabled={!response}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" style={{ width: 14, height: 14 }}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5h10" /></svg>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    style={{ fontFamily: "Nunito, sans-serif", display: "inline-flex", alignItems: "center", gap: 7, border: `1.5px solid ${blue}`, backgroundColor: blue, color: "#fff", fontSize: 13, fontWeight: 800, padding: "9px 15px", borderRadius: 99, cursor: "pointer", whiteSpace: "nowrap" }}
                    onClick={handleSendMe} disabled={!response || sending}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21 4L3 10l7 3 3 7z" /></svg>
                    {sending ? "Sending…" : sent ? "Sent!" : "Send me this"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const pageWrap = {
  display: "flex", flexDirection: "column",
  width: "100%", height: "100vh",
  overflow: "hidden", fontFamily: "Nunito, sans-serif",
  backgroundColor: navy,
};

const body = {
  display: "grid",
  gridTemplateColumns: "36rem minmax(0,1fr)",
  gap: 12, flex: 1, minHeight: 0,
  padding: "8px 12px 12px",
};

const leftPanel = {
  backgroundColor: "#fff",
  borderRadius: 14,
  display: "flex", flexDirection: "column",
  overflow: "hidden", minHeight: 0,
  boxShadow: "0 4px 24px rgba(0,14,30,.22)",
};

const panelHd = {
  display: "flex", alignItems: "center", gap: 10,
  padding: "14px 16px",
  backgroundColor: "#FAFCFE",
  borderBottom: `1px solid ${line}`,
  flexShrink: 0,
};

const grpLabel = {
  fontSize: 9.5, fontWeight: 800, letterSpacing: ".12em",
  textTransform: "uppercase", color: faint,
};

const chipsArea = {
  height: "100%", overflowY: "auto",
  scrollbarWidth: "none", msOverflowStyle: "none",
  padding: "14px 16px 8px",
  display: "flex", flexDirection: "column", gap: 16,
};

const summaryBox = {
  backgroundColor: tint,
  borderRadius: 10,
  padding: "11px 13px",
  height: "6rem",
  flexShrink: 0,
};

const panelFoot = {
  display: "flex", alignItems: "center", gap: 10,
  padding: "12px 16px",
  borderTop: `1px solid ${line}`,
  backgroundColor: "#FAFCFE",
  flexShrink: 0,
};

const rightPanel = {
  display: "flex", flexDirection: "column",
  gap: 12, minHeight: 0,
};

const mapWrap = {
  position: "relative",
  borderRadius: 14, overflow: "hidden",
  height: "22rem", flexShrink: 0,
  boxShadow: "0 4px 20px rgba(0,14,30,.25)",
};

const mapHint = {
  position: "absolute", left: 12, bottom: 12, zIndex: 1000,
  display: "inline-flex", alignItems: "center", gap: 7,
  backgroundColor: "rgba(6,26,48,.82)",
  backdropFilter: "blur(10px)",
  color: "#fff", fontSize: 12, fontWeight: 800,
  padding: "8px 13px", borderRadius: 99,
  border: "1px solid rgba(255,255,255,.16)",
  pointerEvents: "none",
};

const resPanel = {
  flex: 1, minHeight: 0,
  backgroundColor: "#fff",
  borderRadius: 14,
  display: "flex", flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,14,30,.15)",
};

const resHd = {
  display: "flex", alignItems: "center", gap: 8,
  padding: "12px 18px",
  borderBottom: `1px solid ${line}`,
  backgroundColor: "#FAFCFE",
  flexShrink: 0,
};
