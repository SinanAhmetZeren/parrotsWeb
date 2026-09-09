
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import "../assets/css/CreateVehicle.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import parrotsLogo from "../assets/images/ParrotsLogo.png";
import uploadImage from "../assets/images/ParrotsLogoPlus.jpg";
import { useAddWaypointMutation, useAddWaypointNoImageMutation, useConfirmVoyageMutation, useDeleteWaypointMutation } from "../slices/VoyageSlice";
import { CreateVoyageWaypointsMarkers } from "./CreateVoyageWaypointsMarkers";
import { CreateVoyagePolyLineComponent } from "./CreateVoyagePolyLineComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const maptilerKey = process.env.REACT_APP_MAPTILER_KEY;
const tileUrl = `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${maptilerKey}`;
const tileAttribution = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const clickMarkerIcon = L.divIcon({
    className: "",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" width="25" height="41"><path d="M12.5 0C5.596 0 0 5.596 0 12.5C0 21.875 12.5 41 12.5 41C12.5 41 25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#FACC15"/><circle cx="12.5" cy="12.5" r="5" fill="white" fill-opacity="0.6"/></svg>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) { onMapClick(e.latlng.lat, e.latlng.lng); },
    });
    return null;
}

function ConfirmModal({ voyageName, startDate, endDate, isPublicOnMap, setShowConfirmModal, handleGoToProfilePage, isConfirming, voyageCreated }) {
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 0, 0);
    const today = new Date(); today.setHours(23, 59, 0, 0);
    const cost = isPublicOnMap && end ? Math.max(0, Math.round((end - today) / (1000 * 60 * 60 * 24)) + 1) : 0;
    const startD = startDate ? new Date(startDate) : null;
    const formatDate = (d) => d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";
    const formatYear = (d) => d ? String(d.getFullYear()).slice(-2) : "";
    const dateLabel = startD && end && startD.toDateString() !== end.toDateString()
        ? `${formatDate(startD)} – ${formatDate(end)} ${formatYear(end)}`
        : `${formatDate(startD)} ${formatYear(startD)}`;
    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <span style={modalTitle}>Post this voyage?</span>
                <div style={modalSummaryCard}>
                    <div style={modalSummaryRow}>
                        <span style={modalSummaryLabel}>Voyage</span>
                        <span style={modalSummaryValue}>{voyageName || "—"}</span>
                    </div>
                    <div style={modalSummaryRow}>
                        <span style={modalSummaryLabel}>Dates</span>
                        <span style={modalSummaryValue}>{dateLabel || "—"}</span>
                    </div>
                </div>
                <div style={{ ...modalPill, backgroundColor: "rgba(0,100,200,0.12)" }}>
                    <span style={{ fontSize: "1rem" }}>🌍</span>
                    <span style={{ ...modalPillText, color: "#007bff" }}>
                        {isPublicOnMap
                            ? "Goes public on the map right away. Anyone can find it and place a bid."
                            : "This voyage won't appear on the map. People can still view it through your profile."}
                    </span>
                </div>
                <div style={{ ...modalPill, backgroundColor: "rgba(0,150,100,0.12)" }}>
                    <span style={{ fontSize: "1rem" }}>🦜</span>
                    <span style={{ ...modalPillText, color: "#065f46" }}>
                        {isPublicOnMap && cost > 0 ? `${cost} ParrotCrackers will be used` : "Free, no ParrotCrackers used."}
                    </span>
                </div>
                <div style={{ ...modalPill, backgroundColor: "#fef3c7", marginBottom: 0 }}>
                    <span style={{ fontSize: "1rem" }}>🔒</span>
                    <span style={{ ...modalPillText, color: "#92400e" }}>
                        The details lock once posted. You can still post updates later.
                    </span>
                </div>
                <div style={modalButtonRow}>
                    {!isConfirming && !voyageCreated && (
                        <span style={modalCancelText} onClick={() => setShowConfirmModal(false)}>Cancel</span>
                    )}
                    <button
                        style={{ ...modalConfirmBtn, backgroundColor: voyageCreated ? "#16a34a" : "#007bff", pointerEvents: isConfirming || voyageCreated ? "none" : "auto" }}
                        onClick={handleGoToProfilePage}
                    >
                        {isConfirming
                            ? <div style={{ height: "1.2rem", width: "1.2rem", border: "3px solid white", borderTop: "3px solid rgba(255,255,255,0.3)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "auto" }} />
                            : voyageCreated ? "Voyage Created!" : "Post voyage"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export const AddWaypointsPage = ({
    voyageId,
    setPageState,
    order,
    setOrder,
    voyageName,
    startDate,
    endDate,
    isPublicOnMap,
    crackerBalance,
}) => {
    const [waypointTitle, setWaypointTitle] = useState("");
    const [waypointLatitude, setWaypointLatitude] = useState(null);
    const [waypointLongitude, setWaypointLongitude] = useState(null);
    const [waypointImage, setWaypointImage] = useState(null);
    const [waypointBrief, setWaypointBrief] = useState("");
    const [initialLatitude, setInitialLatitude] = useState();
    const [initialLongitude, setInitialLongitude] = useState();
    const [addedWaypoints, setAddedWaypoints] = useState([
        { waypointId: "dummy-1", waypointImage: null, latitude: 48.8566, longitude: 2.3522, title: "Paris", description: "Starting point in the heart of Paris.", voyageId, order: 1 },
        { waypointId: "dummy-2", waypointImage: null, latitude: 46.2044, longitude: 6.1432, title: "Geneva", description: "Overnight stop by the lake.", voyageId, order: 2 },
        { waypointId: "dummy-3", waypointImage: null, latitude: 45.0703, longitude: 7.6869, title: "Turin", description: "Refuel and a long lunch.", voyageId, order: 3 },
        { waypointId: "dummy-4", waypointImage: null, latitude: 43.7696, longitude: 11.2558, title: "Florence", description: "Two nights, museums and pasta.", voyageId, order: 4 },
        { waypointId: "dummy-5", waypointImage: null, latitude: 41.9028, longitude: 12.4964, title: "Rome", description: "Final stop, three nights.", voyageId, order: 5 },
    ]);
    const [imagePreview, setImagePreview] = useState("");
    const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [voyageCreated, setVoyageCreated] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const fileInputRef = useRef(null);
    const [addWaypoint] = useAddWaypointMutation();
    const [addWaypointNoImage] = useAddWaypointNoImageMutation();
    const [deleteWaypoint] = useDeleteWaypointMutation();
    const [confirmVoyage] = useConfirmVoyageMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => { setInitialLatitude(pos.coords.latitude); setInitialLongitude(pos.coords.longitude); },
                () => { setInitialLatitude(48.8566); setInitialLongitude(2.3522); }
            );
        } else {
            setInitialLatitude(48.8566);
            setInitialLongitude(2.3522);
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setWaypointImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleAddWaypoint = async () => {
        setIsAddingWaypoint(true);
        const hasImage = waypointImage instanceof File;
        try {
            const result = hasImage
                ? await addWaypoint({ waypointImage, latitude: waypointLatitude, longitude: waypointLongitude, title: waypointTitle, description: waypointBrief, voyageId, order })
                : await addWaypointNoImage({ latitude: waypointLatitude, longitude: waypointLongitude, title: waypointTitle, description: waypointBrief, voyageId, order });
            if (result.error || !result.data?.data) {
                toast.error("Could not add waypoint. Check your connection and try again.");
                setIsAddingWaypoint(false);
                return;
            }
            const waypointId = result.data.data;
            setOrder(order + 1);
            setAddedWaypoints((prev) => [...prev, { waypointId, waypointImage, latitude: waypointLatitude, longitude: waypointLongitude, title: waypointTitle, description: waypointBrief, voyageId, order }]);
            setWaypointLatitude(null);
            setWaypointLongitude(null);
            setWaypointTitle("");
            setWaypointBrief("");
            setWaypointImage(null);
            setImagePreview("");
        } catch {
            toast.error("Could not add waypoint. Check your connection and try again.");
        }
        setIsAddingWaypoint(false);
    };

    const handleDeleteWaypoint = async (waypointId) => {
        if (waypointId.startsWith("dummy-")) {
            setAddedWaypoints((prev) => prev.filter((wp) => wp.waypointId !== waypointId));
            return;
        }
        const result = await deleteWaypoint({ waypointId });
        if (result.error) { toast.error("Could not delete waypoint."); return; }
        setAddedWaypoints((prev) => prev.filter((wp) => wp.waypointId !== waypointId));
    };

    async function handleGoToProfilePage() {
        setIsConfirming(true);
        try {
            const result = await confirmVoyage(voyageId).unwrap();
            if (result?.success === false) {
                toast.error(result.message || "Failed to post voyage.");
                setIsConfirming(false);
                return;
            }
            const voyagePublicId = result?.data;
            setIsConfirming(false);
            setVoyageCreated(true);
            setTimeout(() => navigate(`/voyage-details/${voyagePublicId}`), 3000);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to post voyage. Please try again.");
            setIsConfirming(false);
        }
    }

    const [hoveredWaypoint, setHoveredWaypoint] = useState(null);

    const canAdd = !!(waypointTitle && waypointLatitude && waypointLongitude && waypointBrief);

    return (
        <div style={{ flex: 1, minHeight: 0, display: "flex", fontFamily: "Nunito", padding: "0.75rem 3rem", gap: "1.5rem", boxSizing: "border-box" }}>

            {/* ── Left panel ── */}
            <div style={{ width: "380px", flexShrink: 0, backgroundColor: "white", borderRadius: "1rem", display: "flex", flexDirection: "column", boxShadow: "0 4px 24px rgba(0,14,30,0.18)", overflow: "hidden" }}>

                {/* NEW WAYPOINT */}
                <div style={{ padding: "1rem 1rem 0.75rem" }}>
                    <div style={secLabel}>New Waypoint</div>

                    {/* Coords / hint */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "9px 13px", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "13px", fontWeight: 800, color: waypointLatitude != null ? "#0A2540" : "#9CA3AF", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ fontSize: "15px" }}>📍</span>
                            {waypointLatitude != null ? `${waypointLatitude.toFixed(4)}, ${waypointLongitude.toFixed(4)}` : "Click the map to pin a location"}
                        </span>
                    </div>

                    {/* Image + inputs row */}
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                        {/* Image uploader */}
                        <div style={{ position: "relative", flexShrink: 0 }}>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: "none" }} />
                            {/* Outer grey */}
                            <div
                                onClick={() => !imagePreview && fileInputRef.current?.click()}
                                style={{ width: "7.5rem", height: "7.5rem", borderRadius: "1rem", backgroundColor: "#F0F2F5", padding: "0.75rem", cursor: imagePreview ? "default" : "pointer", boxSizing: "border-box", position: "relative" }}
                            >
                                {/* Inner white */}
                                <div style={{ width: "100%", height: "100%", borderRadius: "0.7rem", backgroundColor: "white", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {imagePreview
                                        ? <img src={imagePreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        : <img src={uploadImage} alt="" style={{ width: "90%", height: "90%", opacity: 0.45, objectFit: "contain" }} />
                                    }
                                </div>
                            </div>
                            {imagePreview && (
                                <div onClick={() => { if (imagePreview) URL.revokeObjectURL(imagePreview); setWaypointImage(null); setImagePreview(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                    style={{ position: "absolute", top: "0.3rem", right: "0.3rem", width: "1.1rem", height: "1.1rem", backgroundColor: "rgba(30,30,30,0.6)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.65rem", fontWeight: 700, zIndex: 10 }}>✕</div>
                            )}
                        </div>

                        {/* Title + brief */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "7px" }}>
                            <input
                                type="text"
                                placeholder="Waypoint title"
                                maxLength={25}
                                value={waypointTitle}
                                onChange={(e) => setWaypointTitle(e.target.value)}
                                style={{ fontFamily: "Nunito", fontSize: "13px", fontWeight: 600, color: "#0A2540", border: "none", borderRadius: "8px", padding: "9px 12px", outline: "none", width: "100%", backgroundColor: "#F3F4F6", boxSizing: "border-box", textAlign: "left" }}
                            />
                            <textarea
                                placeholder="What happens here"
                                maxLength={300}
                                value={waypointBrief}
                                onChange={(e) => setWaypointBrief(e.target.value)}
                                style={{ fontFamily: "Nunito", fontSize: "13px", fontWeight: 600, color: "#0A2540", border: "none", borderRadius: "8px", padding: "9px 12px", outline: "none", width: "100%", backgroundColor: "#F3F4F6", resize: "none", height: "3.875rem", boxSizing: "border-box", textAlign: "left" }}
                            />
                        </div>
                    </div>

                    {/* Char count */}
                    <div style={{ textAlign: "right", fontSize: "10.5px", fontWeight: 700, color: "#9CA3AF", marginTop: "5px" }}>{waypointBrief.length} / 300</div>

                    {/* Add button */}
                    <button
                        onClick={canAdd && !isAddingWaypoint ? handleAddWaypoint : undefined}
                        style={{ width: "100%", backgroundColor: canAdd ? "#3B82F6" : "#E5E7EB", color: canAdd ? "white" : "#9CA3AF", border: "none", borderRadius: "99px", padding: "11px", fontFamily: "Nunito", fontSize: "14px", fontWeight: 800, cursor: canAdd ? "pointer" : "not-allowed", marginTop: "0.625rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    >
                        {isAddingWaypoint
                            ? <div style={{ width: "16px", height: "16px", border: "2.5px solid white", borderTop: "2.5px solid transparent", borderRadius: "50%" }} />
                            : "+ Add waypoint"}
                    </button>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", backgroundColor: "#E3E9F0" }} />

                {/* ROUTE header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 1rem 0.5rem" }}>
                    <span style={secLabel}>Route</span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", backgroundColor: "#F3F4F6", borderRadius: "99px", padding: "3px 10px" }}>{addedWaypoints.length} stop{addedWaypoints.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Waypoint list */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0 1rem" }}>
                    {addedWaypoints.length === 0 && (
                        <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: "12.5px", fontWeight: 600, padding: "1.5rem 0" }}>No waypoints yet</div>
                    )}
                    {addedWaypoints.map((wp, index) => {
                        const isFirst = index === 0;
                        const isLast = index === addedWaypoints.length - 1 && addedWaypoints.length > 1;
                        const badgeColor = isFirst ? "#22C55E" : isLast ? "#EF4444" : "#3B82F6";
                        const isHovered = hoveredWaypoint === wp.waypointId;
                        return (
                            <div
                                key={wp.waypointId}
                                style={{ position: "relative" }}
                                onMouseEnter={() => setHoveredWaypoint(wp.waypointId)}
                                onMouseLeave={() => setHoveredWaypoint(null)}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.625rem", marginBottom: "6px", backgroundColor: isHovered ? "#EEF2FF" : "#F9FAFB", borderRadius: "10px", cursor: "default" }}>
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: badgeColor, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900, flexShrink: 0, fontFamily: "Nunito" }}>{index + 1}</div>
                                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                                        <img src={wp.waypointImage instanceof File ? URL.createObjectURL(wp.waypointImage) : parrotsLogo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                                        <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#3B82F6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{wp.title}</div>
                                        <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{wp.description}</div>
                                    </div>
                                    <div style={{ color: "#9CA3AF", cursor: "pointer", fontSize: "18px", fontWeight: 400, flexShrink: 0, lineHeight: 1 }} onClick={() => handleDeleteWaypoint(wp.waypointId)}>×</div>
                                </div>

                                {/* Hover popover */}
                                {isHovered && (() => {
                                    const above = index === addedWaypoints.length - 1;
                                    return (
                                        <div style={{ position: "absolute", left: "3rem", ...(above ? { bottom: "calc(100% + 8px)" } : { top: "calc(100% + 8px)" }), zIndex: 200, backgroundColor: "white", borderRadius: "10px", padding: "12px 14px", boxShadow: "0 8px 24px rgba(0,14,30,0.18)", border: "1px solid #E3E9F0", width: "240px" }}>
                                            {above
                                                ? <div style={{ position: "absolute", bottom: "-7px", left: "24px", width: "13px", height: "13px", backgroundColor: "white", border: "1px solid #E3E9F0", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)" }} />
                                                : <div style={{ position: "absolute", top: "-7px", left: "24px", width: "13px", height: "13px", backgroundColor: "white", border: "1px solid #E3E9F0", borderRight: "none", borderBottom: "none", transform: "rotate(45deg)" }} />
                                            }
                                            <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#3B82F6", marginBottom: "5px", fontFamily: "Nunito", textAlign: "left" }}>{wp.title}</div>
                                            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", lineHeight: 1.5, fontFamily: "Nunito", textAlign: "left" }}>{wp.description}</div>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderTop: "1px solid #E3E9F0" }}>
                    <button onClick={() => setPageState(2)} style={{ fontFamily: "Nunito", border: "1.5px solid #E3E9F0", fontSize: "13px", fontWeight: 700, padding: "7px 16px", borderRadius: "99px", cursor: "pointer", backgroundColor: "white", color: "#374151" }}>‹ Images</button>
                    <button
                        onClick={() => addedWaypoints.length > 0 && setShowConfirmModal(true)}
                        style={{ fontFamily: "Nunito", border: "none", fontSize: "13px", fontWeight: 800, padding: "7px 18px", borderRadius: "99px", cursor: addedWaypoints.length > 0 ? "pointer" : "not-allowed", backgroundColor: addedWaypoints.length > 0 ? "#22C55E" : "#E3E9F0", color: addedWaypoints.length > 0 ? "white" : "#9CA3AF" }}
                    >Complete voyage</button>
                </div>
            </div>

            {/* ── Map ── */}
            <div style={{ flex: 1, minWidth: 0, minHeight: 0, position: "relative", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,14,30,0.18)" }}>

                {!initialLatitude || !initialLongitude ? (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Nunito", fontSize: "1.2rem" }}>Locating you…</div>
                ) : (
                    <MapContainer
                        center={[initialLatitude, initialLongitude]}
                        zoom={5}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false}
                        scrollWheelZoom={true}
                    >
                        <TileLayer url={tileUrl} attribution={tileAttribution} />
                        <MapClickHandler onMapClick={(lat, lng) => { setWaypointLatitude(lat); setWaypointLongitude(lng); }} />
                        {waypointLatitude != null && waypointLongitude != null && (
                            <Marker position={[waypointLatitude, waypointLongitude]} icon={clickMarkerIcon} />
                        )}
                        <CreateVoyageWaypointsMarkers waypoints={addedWaypoints} />
                        <CreateVoyagePolyLineComponent waypoints={addedWaypoints} />
                    </MapContainer>
                )}

                {/* Legend */}
                <div style={{ position: "absolute", bottom: "16px", left: "16px", zIndex: 1000, backgroundColor: "rgba(0,0,0,0.65)", borderRadius: "8px", padding: "8px 12px", display: "flex", flexDirection: "column", gap: "5px" }}>
                    {[["#22C55E", "Start"], ["#3B82F6", "Stop"], ["#EF4444", "Finish"]].map(([color, label]) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
                            <span style={{ fontSize: "11.5px", fontWeight: 700, color: "white", fontFamily: "Nunito" }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {showConfirmModal && <ConfirmModal voyageName={voyageName} startDate={startDate} endDate={endDate} isPublicOnMap={isPublicOnMap} setShowConfirmModal={setShowConfirmModal} handleGoToProfilePage={handleGoToProfilePage} isConfirming={isConfirming} voyageCreated={voyageCreated} />}
        </div>
    );
};

const secLabel = {
    fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
    color: "#5C6B7A", marginBottom: "0.5rem", fontFamily: "Nunito",
};

const modalOverlay = { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1.5rem" };
const modalBox = { backgroundColor: "white", borderRadius: "1.25rem", padding: "1.5rem", width: "100%", maxWidth: "26rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" };
const modalTitle = { fontWeight: 800, fontSize: "1.15rem", color: "#1a2e4a", marginBottom: "0.5rem" };
const modalSummaryCard = { backgroundColor: "#f3f4f6", borderRadius: "0.625rem", padding: "0.875rem", width: "100%", display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.375rem" };
const modalSummaryRow = { display: "flex", justifyContent: "space-between", gap: "0.5rem" };
const modalSummaryLabel = { fontWeight: 800, fontSize: "0.875rem", color: "#6b7280" };
const modalSummaryValue = { fontWeight: 800, fontSize: "0.875rem", color: "#1a2e4a", textAlign: "right" };
const modalPill = { display: "flex", alignItems: "center", gap: "0.375rem", borderRadius: "1.25rem", padding: "0.625rem 0.875rem", width: "100%", marginBottom: "0.625rem" };
const modalPillText = { fontWeight: 700, fontSize: "0.875rem", textAlign: "left" };
const modalButtonRow = { display: "flex", flexDirection: "row", gap: "0.75rem", marginTop: "1.25rem", width: "100%", alignItems: "center" };
const modalCancelText = { flex: 1, textAlign: "center", fontWeight: 700, fontSize: "0.9375rem", color: "#6b7280", cursor: "pointer" };
const modalConfirmBtn = { flex: 1, backgroundColor: "#007bff", border: "none", borderRadius: "1.875rem", padding: "0.75rem", fontWeight: 700, fontSize: "0.9375rem", color: "white", cursor: "pointer" };
