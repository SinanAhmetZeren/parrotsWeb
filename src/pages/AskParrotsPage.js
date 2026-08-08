import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, CircleMarker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useAskParrotsMutation } from "../slices/AiSlice";
import { PulsatingParrotLogo } from "../components/PulsatingParrotLogo";
import { FaAngleDoubleDown } from "react-icons/fa";
import { invokeHub } from "../signalr/signalRHub";
import { useSelector } from "react-redux";
import { useLazyGetUserByIdQuery } from "../slices/UserSlice";
import parrotCracker from "../assets/images/parrotCookie.png";
import {
  parrotBoatPurple, parrotCarRed, parrotCaravanOrangeRed, parrotBusYellowGreen,
  parrotWalkTurquoise, parrotRunLightOrange, parrotMotorcycleDarkRed,
  parrotBicycleTealGreen, parrotTinyHouseLightYellow, parrotAirplaneLightGreen,
  parrotTrainPink, parrotBlue, parrotPlaceholderGrey, parrotDarkBlue, parrotTextDarkBlue,
} from "../styles/colors";

const VEHICLES = ["Boat", "Car", "Caravan", "Bus", "Walk", "Run", "Motorcycle", "Bicycle", "TinyHouse", "Airplane", "Train"];
const DURATIONS = ["Half day", "1 day", "2-3 days", "1 week", "2 weeks"];
const VIBES = ["Culture", "Food", "Nature", "Chill", "Adventure", "Budget", "Scenic", "Any"];
const RADII = ["1km", "5km", "10km", "50km"];
const ON_FOOT = ["Walk", "Run"];

const VEHICLE_COLORS = {
  Boat: parrotBoatPurple, Car: parrotCarRed, Caravan: parrotCaravanOrangeRed,
  Bus: parrotBusYellowGreen, Walk: parrotWalkTurquoise, Run: parrotRunLightOrange,
  Motorcycle: parrotMotorcycleDarkRed, Bicycle: parrotBicycleTealGreen,
  TinyHouse: parrotTinyHouseLightYellow, Airplane: parrotAirplaneLightGreen, Train: parrotTrainPink,
};

const VIBE_COLORS = {
  Culture: "#F5A623", Food: "#F5A623", Nature: "#F5A623", Chill: "#F5A623",
  Adventure: "#F5A623", Budget: "#F5A623", Scenic: "#F5A623", Any: "#F5A623",
};

const RADIUS_COLORS = {
  "1km": "#06B6D4", "5km": "#06B6D4", "10km": "#06B6D4", "50km": "#06B6D4",
};

const DURATION_COLORS = {
  "Half day": "#2ac898", "1 day": "#2ac898", "2-3 days": "#2ac898",
  "1 week": "#2ac898", "2 weeks": "#2ac898",
};

const VIBE_DESCRIPTIONS = {
  Culture: "Culture (focused on cultural sights and history)",
  Food: "Food (focused on local food and dining)",
  Nature: "Nature (focused on nature and outdoor scenery)",
  Chill: "Chill (relaxed and laid-back)",
  Adventure: "Adventure (adventurous and off the beaten path)",
  Budget: "Budget (budget-friendly)",
  Scenic: "Scenic (focused on scenic landscapes and views)",
};

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

function formatDuration(d) { return d === "Half day" ? "Half a day" : d; }

function buildQueryText(vehicle, duration, vibe, radius, pin) {
  const isOnFoot = ON_FOOT.includes(vehicle);
  const displayDuration = formatDuration(duration);
  const vehiclePart = isOnFoot
    ? `I want to go for a ${vehicle} for ${displayDuration}.`
    : `I have a ${vehicle} and ${displayDuration} available.`;
  const vibePart = vibe === "Any"
    ? "I'm looking for a voyage of any vibe"
    : `I'm looking for a ${VIBE_DESCRIPTIONS[vibe] ?? vibe} experience`;
  const locationPart = pin
    ? `starting within ${radius} of this location (${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)})`
    : `starting within ${radius} of this location`;
  return `${vehiclePart} ${vibePart}, ${locationPart}.`;
}

function PillSelector({ options, selected, onSelect, colorMap, isDark }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {options.map((opt) => {
        const color = colorMap[opt] || parrotBlue;
        const isSelected = selected === opt;
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            style={{
              padding: "0.3rem 0.75rem",
              borderRadius: "999rem",
              border: `0.09rem solid ${isSelected ? color : isDark ? "rgba(255,255,255,0.25)" : parrotPlaceholderGrey}`,
              backgroundColor: isSelected ? color : isDark ? `${color}30` : `${color}15`,
              color: isSelected ? "white" : isDark ? "rgba(255,255,255,0.85)" : "#444",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SectionCard({ label, children, style, isDark }) {
  return (
    <div style={{
      backgroundColor: isDark ? "#011a32" : "white",
      borderRadius: "0.875rem",
      padding: ".75rem 1rem",
      marginBottom: "0.75rem",
      boxShadow: isDark ? "0 0.125rem 0.5rem rgba(0,0,0,0.4)" : "0 0.125rem 0.5rem rgba(0,0,0,0.06)",
      ...style,
    }}>
      {label ? (
        <div style={{
          fontSize: "0.85rem", fontWeight: 800,
          color: isDark ? "rgba(255,255,255,0.9)" : parrotTextDarkBlue,
          letterSpacing: "0.08em", marginBottom: "0.6rem",
        }}>{label}</div>
      ) : null}
      {children}
    </div>
  );
}

function QueryPreview({ vehicle, duration, vibe, radius, pin, isDark }) {
  if (!vehicle || !duration || !vibe || !radius || !pin) return null;
  const isOnFoot = ON_FOOT.includes(vehicle);
  const displayDuration = formatDuration(duration);
  const vibeDesc = vibe !== "Any" ? VIBE_DESCRIPTIONS[vibe] : null;
  const vibeKeyword = vibeDesc ? vibeDesc.split(" (")[0] : null;
  const vibeParenthesis = vibeDesc ? " (" + vibeDesc.split(" (")[1] : null;
  const vc = VEHICLE_COLORS[vehicle] || parrotBlue;
  const dc = DURATION_COLORS[duration] || parrotBlue;
  const vibeC = VIBE_COLORS[vibe] || parrotBlue;
  const rc = RADIUS_COLORS[radius] || parrotBlue;

  return (
    <p style={{ fontSize: "1.1rem", lineHeight: 1.6, margin: 0, color: isDark ? "rgba(255,255,255,0.85)" : "#333" }}>
      {isOnFoot ? "I want to go for a " : "I have a "}
      <span style={{ color: vc, fontWeight: 700 }}>{vehicle}</span>
      {isOnFoot ? " for " : " and "}
      <span style={{ color: dc, fontWeight: 700 }}>{displayDuration}</span>
      {isOnFoot ? ". " : " available. "}
      {vibe === "Any" ? "I'm looking for a voyage of " : "I'm looking for a "}
      {vibe === "Any"
        ? <span style={{ color: vibeC, fontWeight: 700 }}>any vibe</span>
        : <span style={{ color: vibeC, fontWeight: 700 }}>{vibeKeyword}</span>}
      {vibe !== "Any" && vibeParenthesis && <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#888" }}>{vibeParenthesis}</span>}
      {vibe === "Any" ? ", starting within " : " experience, starting within "}
      <span style={{ color: rc, fontWeight: 700 }}>{radius}</span>
      {" of this location "}
      {pin && <span style={{ color: parrotBoatPurple, fontWeight: 600 }}>({pin.lat.toFixed(4)}, {pin.lng.toFixed(4)})</span>}
      {"."}
    </p>
  );
}

export default function AskParrotsPage() {
  const [vehicle, setVehicle] = useState(null);
  const [duration, setDuration] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [radius, setRadius] = useState(null);
  const [pin, setPin] = useState(null);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const currentUserId = useSelector((state) => state.users.userId);
  const isDark = useSelector((state) => state.users.isDarkMode);
  const [mapCenter, setMapCenter] = useState([52.2053, 0.1218]); // Cambridge UK fallback
  const [userLocation, setUserLocation] = useState(null);
  const [askParrots, { isLoading }] = useAskParrotsMutation();
  const navigate = useNavigate();
  const [coinBalance, setCoinBalance] = useState(null);
  const [isCoinHovered, setIsCoinHovered] = useState(false);
  const [triggerGetUser] = useLazyGetUserByIdQuery();

  React.useEffect(() => {
    if (currentUserId) {
      triggerGetUser(currentUserId).then((res) => {
        if (res?.data) setCoinBalance(res.data.parrotCoinBalance ?? 0);
      });
    }
  }, [currentUserId]);

  React.useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setMapCenter(loc);
        setUserLocation(loc);
      },
      () => { }
    );
  }, []);

  const handleMapClick = useCallback((latlng) => setPin(latlng), []);

  const handleAsk = async () => {
    if (!pin) return;
    setResponse(null);
    const radiusNum = parseInt(radius.replace("km", ""), 10);
    try {
      const result = await askParrots({
        vehicleType: vehicle,
        duration: duration === "Half day" ? "Half a Day" : duration,
        vibe,
        radiusKm: radiusNum.toString(),
        latitude: pin.lat,
        longitude: pin.lng,
      }).unwrap();
      setResponse(result.response);
      if (result.remainingBalance !== undefined) setCoinBalance(result.remainingBalance);
    } catch (err) {
      if (err?.status === 402) {
        setCoinBalance(0);
        setResponse(null);
      } else {
        setResponse("Something went wrong. Please try again.");
      }
    }
  };

  const handleSendMe = async () => {
    if (!response) return;
    setSending(true);
    const query = buildQueryText(vehicle, duration, vibe, radius, pin);
    const clean = response.replace(/^\[\[([^\]]+)\]\]\s*/, "($1) ").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\{\{([^}]+)\}\}/g, "$1");
    const text = `🦜 ${query}\n\n➡️ ${clean}`;
    await invokeHub("SendMessage", currentUserId, currentUserId, text, true);
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  const handleCopy = () => {
    if (!response) return;
    const query = buildQueryText(vehicle, duration, vibe, radius, pin);
    const clean = response.replace(/^\[\[([^\]]+)\]\]\s*/, "($1) ").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\{\{([^}]+)\}\}/g, "$1");
    navigator.clipboard.writeText(`${query}\n\n${clean}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extractLocation = (text) => {
    const match = text.match(/^\[\[([^\]]+)\]\]/);
    return match ? match[1] : null;
  };

  const stripLocation = (text) => text.replace(/^\[\[[^\]]+\]\]\s*/, "");

  const renderResponse = (text) => {
    const tokens = text.split(/(\*\*[^*]+\*\*|\{\{[^}]+\}\})/);
    return tokens.map((part, i) => {
      if (/^\*\*[^*]+\*\*$/.test(part))
        return <span key={i} style={{ color: isDark ? "#60A5FA" : parrotBlue, fontWeight: 700 }}>{part.slice(2, -2)}</span>;
      if (/^\{\{[^}]+\}\}$/.test(part))
        return <span key={i} style={{ color: "#8B5CF6", fontWeight: 700 }}>{part.slice(2, -2)}</span>;
      return <span key={i}>{part}</span>;
    });
  };

  const canAsk = !!vehicle && !!duration && !!vibe && !!radius && !!pin;

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", padding: ".5rem 1.25rem", flex: 1, width: "100%", margin: "auto", minHeight: 0, overflow: "hidden" }}>

            {/* Left panel — 2 parts */}
            <div style={{ flex: 2, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {coinBalance === 0 ? (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: isDark ? "#011a32" : "white",
                  borderRadius: "0.875rem", padding: "0.75rem 1rem", marginBottom: "0.75rem",
                  boxShadow: isDark ? "0 0.125rem 0.5rem rgba(0,0,0,0.4)" : "0 0.125rem 0.5rem rgba(0,0,0,0.06)",
                  gap: "1rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img src={parrotCracker} alt="coin" style={{ width: "3rem", height: "3rem" }} />
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: isDark ? "rgba(255,255,255,0.9)" : "#003366", textAlign: "left", paddingLeft: "1.5rem" }}>
                      You're out of ParrotCrackers.<br />Get more before you configure your voyage.
                    </span>
                  </div>
                  <style>{`@keyframes parrotPulse { 0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.5;transform:scale(1.5)} }`}</style>
                  <FaAngleDoubleDown style={{ color: parrotCaravanOrangeRed, fontSize: "1.5rem", animation: "parrotPulse 1.8s ease-in-out infinite" }} />
                </div>
              ) : (
                <div style={{
                  backgroundColor: isDark ? "#011a32" : "white",
                  borderRadius: "0.875rem", padding: "0.75rem 1rem",
                  display: "flex", flexDirection: "row", alignItems: "center", gap: "0.75rem",
                  boxShadow: isDark ? "0 0.125rem 0.5rem rgba(0,0,0,0.4)" : "0 0.125rem 0.5rem rgba(0,0,0,0.06)",
                  marginBottom: "0.75rem",
                }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: isDark ? "white" : "#003366", width: "4rem", lineHeight: 1.2 }}>Ask Parrots</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "0.85rem", color: isDark ? "rgba(255,255,255,0.7)" : parrotPlaceholderGrey }}>
                      Tell me what kind of voyage you're after.
                    </span>
                    <span style={{ fontSize: "0.78rem", color: parrotPlaceholderGrey, fontStyle: "italic" }}>
                      These recommendations are for inspiration, so please verify before you go.
                    </span>
                  </div>
                </div>
              )}
              <SectionCard label="I WANT TO TRAVEL BY..." isDark={isDark}>
                <PillSelector options={VEHICLES} selected={vehicle} onSelect={setVehicle} colorMap={VEHICLE_COLORS} isDark={isDark} />
              </SectionCard>
              <SectionCard label="FOR..." isDark={isDark}>
                <PillSelector options={DURATIONS} selected={duration} onSelect={setDuration} colorMap={DURATION_COLORS} isDark={isDark} />
              </SectionCard>
              <SectionCard label="WITH A VIBE OF..." isDark={isDark}>
                <PillSelector options={VIBES} selected={vibe} onSelect={setVibe} colorMap={VIBE_COLORS} isDark={isDark} />
              </SectionCard>
              <SectionCard label="STARTING WITHIN..." isDark={isDark}>
                <PillSelector options={RADII} selected={radius} onSelect={setRadius} colorMap={RADIUS_COLORS} isDark={isDark} />
              </SectionCard>
              <SectionCard label="" style={{ minHeight: "8rem", padding: "1rem" }} isDark={isDark}>
                <QueryPreview vehicle={vehicle} duration={duration} vibe={vibe} radius={radius} pin={pin} isDark={isDark} />
              </SectionCard>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", gap: "0.75rem" }}>
                {coinBalance !== null && (
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/parrotCoinPage")}>
                      <div style={{
                        width: "3.75rem", height: "3.75rem", borderRadius: "4rem",
                        backgroundColor: "#cad8ec5d", display: "flex", alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <img
                          src={parrotCracker}
                          alt="coin"
                          style={{
                            width: "3.5rem", height: "3.5rem", transform: isCoinHovered ? "scale(1.3)" : "scale(1)", transition: "transform 0.3s ease-in-out", display: "block", marginTop: "1px"
                          }}
                          onMouseEnter={() => setIsCoinHovered(true)}
                          onMouseLeave={() => setIsCoinHovered(false)}
                        />
                      </div>
                    </div>
                    {isCoinHovered && (
                      <div style={{
                        position: "absolute", bottom: "4.5rem", left: "0",
                        backgroundColor: isDark ? "#0d2a45" : "#faf7f2",
                        color: isDark ? "rgba(255,245,220,0.9)" : "#003366",
                        borderRadius: "0.75rem", padding: "0.75rem 1rem",
                        boxShadow: "0 0.25rem 1rem rgba(0,0,0,0.2)",
                        fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap",
                        zIndex: 100,
                      }}>
                        {coinBalance === 0 ? (
                          <>
                            You have no ParrotCrackers left.<br />
                            You need at least 1 ParrotCracker to ask the Parrots.<br />
                            <span style={{ opacity: 0.65, fontWeight: 400 }}>Click to top up your ParrotCrackers.</span>
                          </>
                        ) : (
                          <>
                            You have {coinBalance} ParrotCracker{coinBalance !== 1 ? "s" : ""}.<br />
                            1 ParrotCracker will be deducted per query.<br />
                            <span style={{ opacity: 0.65, fontWeight: 400 }}>Click to manage your ParrotCrackers.</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={coinBalance === 0 ? () => navigate("/parrotCoinPage") : handleAsk}
                  disabled={coinBalance !== 0 && (!canAsk || isLoading)}
                  style={{
                    width: "60%", padding: "0.75rem",
                    backgroundColor: coinBalance === 0 ? parrotCaravanOrangeRed : canAsk && !isLoading ? parrotDarkBlue : isDark ? "#555" : "#ccc",
                    color: "white", fontWeight: 800, fontSize: "1rem",
                    border: "none", borderRadius: "999rem", cursor: coinBalance === 0 ? "pointer" : canAsk && !isLoading ? "pointer" : "not-allowed",
                    boxShadow: canAsk ? "0 0.25rem 0.625rem rgba(0,0,0,0.15)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isLoading ? "Asking Parrots..." : coinBalance === 0 ? "Get ParrotCrackers" : "Ask Parrots"}
                </button>
              </div>
            </div>

            {/* Right panel — 4 parts */}
            <div style={{ flex: 4, display: "flex", flexDirection: "column", gap: "0", minHeight: 0 }}>
              <SectionCard label="AROUND..." style={{ padding: 0, paddingTop: "0.75rem", overflow: "hidden" }} isDark={isDark}>
                <div style={{ position: "relative" }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={11}
                    style={{ height: "23rem", width: "100%" }}
                    scrollWheelZoom
                  >
                    <TileLayer
                      url={`https://api.maptiler.com/maps/outdoor-v4/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAPTILER_KEY}`}
                      attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                    />
                    <MapCenterSetter center={mapCenter} />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {userLocation && (
                      <CircleMarker
                        center={userLocation}
                        radius={5}
                        pathOptions={{ color: "#1a73e8", fillColor: "#1a73e8", fillOpacity: 1, weight: 2 }}
                      />
                    )}
                    {pin && <Marker position={pin} icon={purpleIcon} />}
                  </MapContainer>
                  <span style={{
                    position: "absolute", bottom: "0.75rem", left: "0.75rem",
                    zIndex: 1000, pointerEvents: "none",
                    fontSize: "0.78rem", fontWeight: 700,
                    color: "#003366",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "1.5rem",
                    padding: "0.35rem 1rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    whiteSpace: "nowrap",
                  }}>click to set location</span>
                </div>
              </SectionCard>

              <SectionCard label="" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }} isDark={isDark}>
                {response ? (
                  <>
                    <p style={{
                      fontSize: "1.1rem", lineHeight: 1.6,
                      color: isDark ? "rgba(255,255,255,0.9)" : "#333",
                      margin: 0, textAlign: "left", paddingLeft: "1.5rem",
                      paddingRight: "1.5rem", flex: 1, overflowY: "auto"
                    }}>
                      {extractLocation(response) && (
                        <span style={{ fontWeight: 700, color: "#10B981", marginRight: "0.5rem" }}>
                          <span style={{ color: "#10B981" }}>@</span> {extractLocation(response)}
                        </span>
                      )}
                      {renderResponse(stripLocation(response))}
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", marginBottom: "0.25rem", justifyContent: "center", flexShrink: 0 }}>
                      <button onClick={handleCopy} style={btnStyle(parrotBlue)}>
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button onClick={handleSendMe} disabled={sending} style={{ ...btnStyle("#089ADE"), minWidth: "7rem" }}>
                        {sending ? <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", verticalAlign: "middle" }} /> : sent ? "Sent!" : "Send Me"}
                      </button>
                    </div>
                  </>
                ) : isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem 0" }}>
                    <PulsatingParrotLogo size={128} />
                    <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : parrotPlaceholderGrey, fontSize: "0.85rem", fontWeight: 600, marginTop: "0.5rem" }}>Thinking...</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <PulsatingParrotLogo size={192} style={{ animation: "none", opacity: 0.2 }} />
                  </div>
                )}
              </SectionCard>
            </div>

          </div>
        </div>
      </header>
    </div>
  );
}

const btnStyle = (bg) => ({
  padding: "0.6rem 1.6rem",
  backgroundColor: bg,
  color: "white",
  fontWeight: 700,
  fontSize: "0.95rem",
  border: "none",
  borderRadius: "999rem",
  cursor: "pointer",
  boxShadow: "0 0.125rem 0.375rem rgba(0,0,0,0.15)",
});
