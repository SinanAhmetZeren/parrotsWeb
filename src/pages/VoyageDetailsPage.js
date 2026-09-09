/* eslint-disable no-undef */
import "../assets/css/VoyageDetails.css";
import "../assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { useGetVoyageByIdQuery, useAddVoyageUpdateMutation, useAcceptBidMutation, useDeleteBidMutation } from "../slices/VoyageSlice";
import { invokeHub } from "../signalr/signalRHub";
import { TopBarMenu } from "../components/TopBarMenu";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { VoyageDetailMapPanComponent } from "../components/VoyageDetailMapPanComponent";
import { VoyageDetailMarkerWithInfoWindow } from "../components/VoyageDetailMarkerWithInfoWindow";
import { VoyageDetailMapPolyLineComponent } from "../components/VoyageDetailMapPolyLineComponent";
import { VoyageDetailBidButton } from "../components/VoyageDetailBidButton";
import { CustomToolTip } from "../components/CustomToolTip";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useAddVoyageToFavoritesMutation,
  useDeleteVoyageFromFavoritesMutation,
} from "../slices/VoyageSlice";
import {
  updateUserFavoriteVoyages,
  addVoyageToUserFavorites,
  removeVoyageFromUserFavorites,
  useGetFavoriteVoyageIdsByUserIdQuery,
  useReportVoyageMutation,
} from "../slices/UserSlice";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { PulsatingParrotLogo } from "../components/PulsatingParrotLogo";
import { EMOJI_CATEGORIES, EMOJIS_BY_CATEGORY, EMOJI_NAMES } from "../constants/emojiData";
import parrotEmojiIcon from "../assets/images/emojipickerparrot.jpg";
import parrotEmojiIconBlue from "../assets/images/emojipickerblueparrot.jpg";
import { IoPeopleOutline, IoPersonOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { MdPublic } from "react-icons/md";
import DOMPurify from "dompurify";
import he from "he";
import { toast } from "react-toastify";

const maptilerKey = process.env.REACT_APP_MAPTILER_KEY;

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return `${date.getDate()} ${date.toLocaleString("en-GB", { month: "short" })}`;
}

function VoyageDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { voyageId } = useParams();
  console.log("voyageId from params:", voyageId);
  const userId = localStorage.getItem("storedUserId");

  // ── State ──────────────────────────────────────────────────────────────────
  // selectedImageIndex lives inside ImageGallery component now
  const [userBid, setUserBid] = useState("");
  const [userBidAccepted, setUserBidAccepted] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastPlaceholder, setBroadcastPlaceholder] = useState("Message accepted users...");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("smileys");
  const [emojiSearch, setEmojiSearch] = useState("");
  const [bidsData, setBidsData] = useState([]);
  const [loadingBidId, setLoadingBidId] = useState(null);
  const emojiRef = useRef(null);
  const dotMenuRef = useRef(null);
  const [dotMenuOpen, setDotMenuOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [targetLocation, setTargetLocation] = useState({});
  const [latLngBoundsLiteral, setLatLngBoundsLiteral] = useState({ north: null, south: null, east: null, west: null });
  const [isPublicOnMap, setIsPublicOnMap] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [voyageReportOpen, setVoyageReportOpen] = useState(false);
  const [voyageSelectedReason, setVoyageSelectedReason] = useState("");
  const [voyageReportSubmitted, setVoyageReportSubmitted] = useState(false);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const [reportVoyage] = useReportVoyageMutation();
  const [addVoyageToFavorites] = useAddVoyageToFavoritesMutation();
  const [deleteVoyageFromFavorites] = useDeleteVoyageFromFavoritesMutation();
  const [acceptBid] = useAcceptBidMutation();
  const [deleteBid] = useDeleteBidMutation();

  const VOYAGE_REPORT_REASONS = [
    "Inappropriate Content",
    "Safety / Navigation Hazard",
    "False or Misleading Information",
    "Spam, Scam, or Commercial Activity",
  ];

  // ── Favorites ──────────────────────────────────────────────────────────────
  const favoriteVoyages = useSelector((state) => state.users.userFavoriteVoyages);
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: favoriteVoyagesData } = useGetFavoriteVoyageIdsByUserIdQuery(userId, { refetchOnFocus: true, refetchOnReconnect: true });

  useEffect(() => {
    dispatch(updateUserFavoriteVoyages({ favoriteVoyages: favoriteVoyagesData }));
  }, [favoriteVoyagesData, dispatch]);

  // ── Voyage data ────────────────────────────────────────────────────────────
  const { data: VoyageData, isSuccess: isSuccessVoyage, isLoading: isLoadingVoyage, isError: isErrorVoyage, refetch } =
    useGetVoyageByIdQuery(voyageId, { refetchOnFocus: true, refetchOnReconnect: true });

  const isInFavorites = favoriteVoyages?.includes(VoyageData?.id);
  const sortedWaypoints = VoyageData?.waypoints ? [...VoyageData.waypoints].sort((a, b) => a.order - b.order) : [];
  const ownVoyage = userId === VoyageData?.userId;
  const username = localStorage.getItem("storedUserName");

  // Sync bidsData from server
  useEffect(() => {
    if (VoyageData?.bids) setBidsData(VoyageData.bids);
  }, [VoyageData?.bids]);

  useEffect(() => {
    if (isSuccessVoyage && VoyageData?.waypoints?.length > 0) {
      let maxLat = -Infinity, minLat = Infinity, maxLng = -Infinity, minLng = Infinity;
      VoyageData.waypoints.forEach(({ latitude, longitude }) => {
        if (latitude > maxLat) maxLat = latitude;
        if (latitude < minLat) minLat = latitude;
        if (longitude > maxLng) maxLng = longitude;
        if (longitude < minLng) minLng = longitude;
      });
      if (maxLat === minLat) { maxLat += 0.025; minLat -= 0.025; }
      if (maxLng === minLng) { maxLng += 0.025; minLng -= 0.025; }
      setLatLngBoundsLiteral({ north: maxLat, south: minLat, east: maxLng, west: minLng });
      console.log("***********");
      console.log("maxLat", maxLat, "minLat", minLat, "maxLng", maxLng, "minLng", minLng);
      console.log("***********");
    } else {
      setLatLngBoundsLiteral({ north: 0, south: 0, east: 0, west: 0 });
    }
    if (VoyageData) {
      setUserBid(VoyageData?.bids?.find((bid) => bid.userId === userId));
      setUserBidAccepted(VoyageData?.bids?.find((bid) => bid.userId === userId)?.accepted ?? false);
      setIsPublicOnMap(VoyageData.publicOnMap);
      console.log("----", VoyageData);
      console.log("user bid: -->", VoyageData?.bids?.find((bid) => bid.userId === userId));
    }
  }, [isSuccessVoyage, VoyageData, userId]);

  useEffect(() => {
    if (isSuccessVoyage && VoyageData?.placeType > 0) navigate("/");
  }, [isSuccessVoyage, VoyageData, navigate]);

  useEffect(() => {
    if (!emojiOpen) return;
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) { setEmojiOpen(false); setEmojiSearch(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [emojiOpen]);

  useEffect(() => {
    if (!dotMenuOpen) return;
    const handler = (e) => {
      if (dotMenuRef.current && !dotMenuRef.current.contains(e.target)) setDotMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dotMenuOpen]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handlePanToLocation = (lat, lng) => setTargetLocation((prev) => ({ lat, lng, key: (prev.key ?? 0) + 1 }));

  const handleAddVoyageToFavorites = async () => {
    try {
      await addVoyageToFavorites({ userId, voyageId: VoyageData?.id }).unwrap();
      setIsFavorited(true);
      dispatch(addVoyageToUserFavorites({ favoriteVoyage: VoyageData?.id }));
    } catch (err) {
      console.error("Error adding voyage to favorites:", err);
      toast.error("Failed to add to favorites. Please try again.");
    }
  };

  const handleDeleteVoyageFromFavorites = async () => {
    try {
      await deleteVoyageFromFavorites({ userId, voyageId: VoyageData?.id }).unwrap();
      setIsFavorited(false);
      dispatch(removeVoyageFromUserFavorites({ favoriteVoyage: VoyageData?.id }));
    } catch (err) {
      console.error("Error removing voyage from favorites:", err);
      toast.error("Failed to remove from favorites. Please try again.");
    }
  };

  const handleReportVoyage = async () => {
    if (!voyageSelectedReason) return;
    try {
      await reportVoyage({ voyageId, reason: voyageSelectedReason }).unwrap();
      setVoyageReportSubmitted(true);
    } catch (err) {
      console.error("Voyage report failed:", err);
    }
  };

  const handleAcceptBid = useCallback(async ({ bidId, bidUserId }) => {
    setLoadingBidId(bidId);
    const text = `[parrots-bid] Welcome aboard "${VoyageData?.name}"! Your bid has been accepted.`;
    try {
      await invokeHub("SendMessage", userId, bidUserId, text, false);
      await acceptBid(bidId).unwrap();
      setBidsData((prev) => prev.map((b) => b.id === bidId ? { ...b, accepted: true } : b));
      refetch();
    } catch (error) {
      console.error("Error accepting bid:", error);
    } finally {
      setLoadingBidId(null);
    }
  }, [VoyageData?.name, userId, acceptBid, refetch]);

  const handleDeleteBid = useCallback(async ({ bidId, bidUserId }) => {
    setLoadingBidId(bidId);
    const text = `Hi there! 👋 Your bid was deleted by ${username}`;
    try {
      await invokeHub("SendMessage", userId, bidUserId, text, false);
      await deleteBid(bidId).unwrap();
      setBidsData((prev) => prev.filter((b) => b.id !== bidId));
      refetch();
    } catch (error) {
      console.error("Error deleting bid:", error);
    } finally {
      setLoadingBidId(null);
    }
  }, [userId, username, deleteBid, refetch]);

  const handleBroadcast = async () => {
    const acceptedUserIds = (VoyageData?.bids || []).filter((b) => b.accepted).map((b) => b.userId);
    if (!broadcastMessage.trim() || acceptedUserIds.length === 0) return;
    setIsBroadcasting(true);
    try {
      await invokeHub("BroadcastMessage", userId, acceptedUserIds, broadcastMessage.trim());
      setBroadcastMessage("");
      setBroadcastPlaceholder(`Message sent to ${acceptedUserIds.length} user${acceptedUserIds.length !== 1 ? "s" : ""}!`);
      setTimeout(() => setBroadcastPlaceholder("Message accepted users..."), 2000);
    } catch (error) {
      console.error("[Broadcast] Failed:", error);
    } finally {
      setIsBroadcasting(false);
    }
  };

  // ── Health check ───────────────────────────────────────────────────────────
  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;
  if (isErrorVoyage || (isSuccessVoyage && !VoyageData)) { navigate("/"); return null; }

  if (isLoadingVoyage) {
    return <div style={{ marginTop: "20%", display: "flex", justifyContent: "center" }}><PulsatingParrotLogo size={150} /></div>;
  }

  if (!isSuccessVoyage) return null;

  // ── Derived values ─────────────────────────────────────────────────────────
  const images = [VoyageData.profileImage, ...(VoyageData.voyageImages?.map((i) => i.voyageImagePath) || [])].filter(Boolean);
  const pendingBidsCount = bidsData?.filter((b) => !b.accepted).length || 0;
  const hasAcceptedBid = bidsData?.some((b) => b.accepted && b.userId === userId);
  const descriptionHtml = DOMPurify.sanitize(he.decode((VoyageData.description || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()));
  const hasAcceptedBids = bidsData?.some((b) => b.accepted);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Nunito", backgroundColor: "#EAECEF" }}>

        {/* Top bar */}
        <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#011a32", padding: "0.1rem", flexShrink: 0 }}>
          <TopLeftComponent />
          <div style={{ height: "3rem", flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <TopBarMenu />
          </div>
        </div>

        {/* Top banner wrapper — dark background with padding */}
        <div style={{ backgroundColor: "#011a32", height: "15rem", boxSizing: "border-box" }}>
          {/* Top banner — 3-col grid matching HTML spec */}
          <div style={{ display: "grid", gridTemplateColumns: "250px minmax(0,1fr) minmax(340px,1.05fr)", background: "linear-gradient(112deg,#0A2A48,#071F38)", borderRadius: "12px", boxShadow: "0 12px 32px rgba(0,14,30,0.34)", overflow: "hidden" }}>

            {/* Col 1: Image gallery */}
            <ImageGallery images={images} />

            {/* Col 2: Details */}
            <div style={{ position: "relative", padding: "1.2rem 1.125rem", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
              {/* Action icons — absolute top-right of this column */}
              <div style={{ position: "absolute", right: "18px", top: "14px", display: "flex", gap: "6px", zIndex: 4 }}>
                <div style={{ position: "relative" }} ref={dotMenuRef}>
                  <button
                    onClick={() => setDotMenuOpen((o) => !o)}
                    onMouseEnter={() => setHoveredIcon("more")}
                    onMouseLeave={() => setHoveredIcon(null)}
                    style={iconBtnSm}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ width: 14, height: 14 }}><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>
                  </button>
                  <CustomToolTip isHovered={hoveredIcon === "more" && !dotMenuOpen} message="More" direction="down" />
                  {dotMenuOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.18)", minWidth: "150px", zIndex: 10, overflow: "hidden" }}>
                      <button
                        onClick={() => { setDotMenuOpen(false); setVoyageReportOpen(true); setVoyageReportSubmitted(false); setVoyageSelectedReason(""); }}
                        style={{ width: "100%", padding: "0.6rem 1rem", background: "none", border: "none", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, color: "#EF4444", cursor: "pointer", fontFamily: "Nunito" }}
                      >
                        Report voyage
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <button
                    onMouseEnter={() => setHoveredIcon("public")}
                    onMouseLeave={() => setHoveredIcon(null)}
                    style={{ ...iconBtnSm, color: "#10B981" }}
                  >
                    <MdPublic size={14} />
                  </button>
                  <CustomToolTip isHovered={hoveredIcon === "public"} message="Public on map" direction="down" />
                </div>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={isInFavorites ? handleDeleteVoyageFromFavorites : handleAddVoyageToFavorites}
                    onMouseEnter={() => setHoveredIcon("fav")}
                    onMouseLeave={() => setHoveredIcon(null)}
                    style={{ ...iconBtnSm, backgroundColor: isInFavorites ? "#F5821F" : "rgba(255,255,255,0.1)", borderColor: isInFavorites ? "#F5821F" : "rgba(255,255,255,0.28)" }}
                  >
                    <IoHeartSharp size={14} />
                  </button>
                  <CustomToolTip isHovered={hoveredIcon === "fav"} message={isInFavorites ? "Remove from favorites" : "Add to favorites"} direction="down" />
                </div>
              </div>

              {/* Pills */}
              <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "9px" }}>
                {VoyageData.publicOnMap && (
                  <span style={bnrPill("#2AC898", "#05372A")}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 10, height: 10 }}><circle cx="12" cy="12" r="5" /></svg>
                    Live on map
                  </span>
                )}
                {VoyageData.fixedPrice && (
                  <span style={bnrPill("rgba(255,255,255,0.13)", "#fff")}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" style={{ width: 10, height: 10 }}><path d="M4 12h16" /><path d="M7 7h10" /><path d="M7 17h10" /></svg>
                    Fixed price
                  </span>
                )}
                {VoyageData.auction && (
                  <span style={bnrPill("rgba(255,255,255,0.13)", "#fff")}>⚖ Auction</span>
                )}
              </div>

              {/* Title */}
              <h3 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.025em", color: "#fff", lineHeight: 1.24, paddingBottom: "2px", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {VoyageData.name}
              </h3>

              {/* Host + Vehicle */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, cursor: "pointer" }}
                  onClick={() => navigate(`/profile-public/${VoyageData.user?.publicId}/${VoyageData.user?.userName}`)}
                >
                  <img src={VoyageData.user?.profileImageThumbnailUrl || VoyageData.user?.profileImageUrl} alt="" style={avatarSpec} />
                  <span>
                    <span style={specLabel}>Host</span>
                    <span style={specValue}>{VoyageData.user?.userName}</span>
                  </span>
                </div>
                {VoyageData.vehicle && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                    <img src={VoyageData.vehicle.profileImageUrl} alt="" style={avatarSpec} />
                    <span>
                      <span style={specLabel}>Vehicle</span>
                      <span style={specValue}>{VoyageData.vehicle.name}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Stats — 5-column grid with Duration */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: "14px", marginTop: "14px", paddingTop: "13px", borderTop: "1px solid rgba(255,255,255,0.14)" }}>
                <span><span style={specLabel}>Dates</span><span style={specStat}>{fmtDate(VoyageData.startDate)} – {fmtDate(VoyageData.endDate)}</span></span>
                <span><span style={specLabel}>Price</span><span style={specStat}>{VoyageData.currency || "€"}{VoyageData.minPrice} – {VoyageData.currency || "€"}{VoyageData.maxPrice}</span></span>
                <span><span style={specLabel}>Spots</span><span style={specStat}>{bidsData?.filter((b) => b.accepted).length || 0} / {VoyageData.vacancy}</span></span>
                <span><span style={specLabel}>Stops</span><span style={specStat}>{sortedWaypoints.length}</span></span>
                <span>
                  <span style={specLabel}>Duration</span>
                  <span style={specStat}>
                    {VoyageData.endDate && VoyageData.startDate
                      ? `${Math.max(1, Math.round((new Date(VoyageData.endDate) - new Date(VoyageData.startDate)) / 86400000))} days`
                      : "—"}
                  </span>
                </span>
              </div>
            </div>

            {/* Col 3: Description */}
            <div style={{ padding: "1.2rem 1.125rem 1.3rem", borderLeft: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontSize: "9.5px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Description</span>
              <div style={{ position: "relative", flex: 1, minHeight: 0, marginTop: "7px" }}>
                <div style={{ position: "absolute", inset: 0, overflowY: "auto", paddingRight: "4px", scrollbarWidth: "none" }}>
                  <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "rgba(255,255,255,0.94)", lineHeight: 1.6, margin: 0 }}>{descriptionHtml}</p>
                </div>
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "34px", background: "linear-gradient(180deg,rgba(8,32,56,0),#082038)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
        </div>{/* end banner wrapper */}

        {/* Bottom: map + sidebar */}
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "row", gap: "0.75rem", padding: "0.75rem", backgroundColor: "#011a32" }}>

          {/* Map area */}
          <div style={{ flex: 1, minWidth: 0, position: "relative", borderRadius: "1rem", overflow: "hidden" }}>
            {latLngBoundsLiteral?.east ? (
              <MapContainer
                bounds={[[latLngBoundsLiteral.south, latLngBoundsLiteral.west], [latLngBoundsLiteral.north, latLngBoundsLiteral.east]]}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url={`https://api.maptiler.com/maps/outdoor-v4/{z}/{x}/{y}.png?key=${maptilerKey}`}
                  attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                />
                <FitBoundsWithPadding bounds={[[latLngBoundsLiteral.south, latLngBoundsLiteral.west], [latLngBoundsLiteral.north, latLngBoundsLiteral.east]]} />
                <VoyageDetailMapPanComponent targetLat={targetLocation?.lat} targetLng={targetLocation?.lng} panKey={targetLocation?.key} />
                <VoyageDetailMapPolyLineComponent waypoints={sortedWaypoints} />
                {sortedWaypoints.map((waypoint, index) => (
                  <VoyageDetailMarkerWithInfoWindow
                    key={waypoint.id}
                    index={index}
                    total={sortedWaypoints.length}
                    waypointTitle={waypoint.title}
                    position={{ lat: waypoint.latitude, lng: waypoint.longitude }}
                  />
                ))}
              </MapContainer>
            ) : null}

            {/* Left waypoint panel */}
            {sortedWaypoints.length > 0 && (
              <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "17rem", zIndex: 1000, display: "flex", flexDirection: "column" }}>
                {/* Dark overlay — covers full panel width plus fade beyond */}
                <div style={{ position: "absolute", inset: 0, width: "20rem", background: "linear-gradient(90deg, rgba(10,20,35,0.38) 80%, transparent)", pointerEvents: "none" }} />
                {/* Header */}
                <div style={{ position: "relative", padding: "0.75rem 0.75rem 0.4rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>ROUTE</span>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: "99px", padding: "0.1rem 0.5rem" }}>
                    {sortedWaypoints.length} stop{sortedWaypoints.length !== 1 ? "s" : ""}{VoyageData.endDate && VoyageData.startDate ? ` · ${Math.max(1, Math.round((new Date(VoyageData.endDate) - new Date(VoyageData.startDate)) / 86400000))} days` : ""}
                  </span>
                </div>
                {/* Stacked cards */}
                <div style={{ position: "relative", flex: 1, overflowY: "auto", scrollbarWidth: "none", display: "flex", flexDirection: "column", gap: "6px", padding: "0 0.6rem 0.75rem" }}>
                  {sortedWaypoints.map((wp, idx) => (
                    <WaypointStripCard
                      key={wp.id}
                      waypoint={wp}
                      index={idx}
                      total={sortedWaypoints.length}
                      voyageImage={VoyageData.profileImage}
                      onClick={() => handlePanToLocation(wp.latitude, wp.longitude)}
                      vertical
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ width: "300px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", scrollbarWidth: "none" }}>

            {ownVoyage ? (
              <>
                {/* Updates card — owner */}
                <UpdatesCard updates={VoyageData.updates || []} voyageId={VoyageData.id} isOwner={true} />

                {/* Bids card — owner */}
                <div style={sideCard}>
                  <div style={cardHeader}>
                    <span style={cardHeaderTitle}>BIDS</span>
                    {pendingBidsCount > 0 && (
                      <span style={{ backgroundColor: "#10B981", color: "white", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 800, padding: "0.1rem 0.5rem" }}>
                        {pendingBidsCount} new
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "260px", overflowY: "auto", scrollbarWidth: "none" }}>
                    {bidsData.length === 0 && (
                      <div style={{ color: "#94A3B8", fontSize: "0.82rem", padding: "0.5rem 0" }}>No bids yet.</div>
                    )}
                    {bidsData.map((bid) => (
                      <OwnerBidRow
                        key={bid.id}
                        bid={bid}
                        loadingBidId={loadingBidId}
                        onAccept={handleAcceptBid}
                        onDelete={handleDeleteBid}
                      />
                    ))}
                  </div>
                  {/* Broadcast row */}
                  <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "row", gap: "0.5rem", alignItems: "center" }}>
                    {/* Emoji btn */}
                    <div style={{ position: "relative", flexShrink: 0 }} ref={emojiRef}>
                      <button
                        onClick={() => setEmojiOpen((o) => !o)}
                        disabled={!hasAcceptedBids}
                        style={{ background: "none", border: inputFocused || emojiOpen ? "2px solid rgba(0,119,234,0.4)" : "2px solid #E2E8F0", borderRadius: "50%", width: 36, height: 36, padding: 0, cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                      >
                        <img src={emojiOpen || inputFocused ? parrotEmojiIconBlue : parrotEmojiIcon} alt="emoji" style={{ width: 38, height: 38, objectFit: "cover", opacity: hasAcceptedBids ? 1 : 0.3 }} />
                      </button>
                      {emojiOpen && (
                        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, width: "260px", height: "280px", display: "flex", flexDirection: "column", backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", zIndex: 999, overflow: "hidden" }}>
                          <div style={{ padding: "0.4rem 0.5rem 0.2rem" }}>
                            <input
                              style={{ width: "100%", boxSizing: "border-box", padding: "0.35rem 0.8rem", borderRadius: "2rem", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", fontSize: "0.9rem", outline: "none" }}
                              placeholder="Search emoji..."
                              value={emojiSearch}
                              onChange={(e) => setEmojiSearch(e.target.value)}
                              autoFocus
                            />
                          </div>
                          {!emojiSearch && (
                            <div style={{ display: "flex", overflowX: "auto", padding: "0.3rem 0.3rem 0", gap: "0.1rem", scrollbarWidth: "none" }}>
                              {EMOJI_CATEGORIES.map((cat) => (
                                <button key={cat.key} onClick={() => setEmojiCategory(cat.key)}
                                  style={{ background: emojiCategory === cat.key ? "#E8F0FE" : "none", border: "none", borderRadius: "0.5rem", fontSize: "1.3rem", cursor: "pointer", padding: "0.2rem 0.3rem", flexShrink: 0 }}>
                                  {cat.icon}
                                </button>
                              ))}
                            </div>
                          )}
                          <div style={{ display: "flex", flexWrap: "wrap", padding: "0.3rem", flex: 1, overflowY: "auto", alignContent: "flex-start", gap: "0.05rem" }}>
                            {(emojiSearch
                              ? Object.values(EMOJIS_BY_CATEGORY).flat().filter((e) => EMOJI_NAMES[e]?.includes(emojiSearch.toLowerCase()))
                              : (EMOJIS_BY_CATEGORY[emojiCategory] || [])
                            ).map((emoji, i) => (
                              <button key={i}
                                style={{ background: "none", border: "none", fontSize: "1.6rem", cursor: "pointer", padding: "0.1rem", borderRadius: "0.3rem", lineHeight: 1 }}
                                onClick={() => setBroadcastMessage((prev) => prev + emoji)}
                              >{emoji}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      style={{ flex: 1, minWidth: 0, height: "2.5rem", padding: "0.4rem 0.9rem", fontSize: "0.85rem", color: "#0F172A", backgroundColor: "#F8FAFC", borderRadius: "2rem", border: inputFocused || emojiOpen ? "2px solid rgba(0,119,234,0.4)" : "2px solid #E2E8F0", outline: "none", fontFamily: "Nunito" }}
                      placeholder={hasAcceptedBids ? broadcastPlaceholder : "No accepted bids yet..."}
                      value={broadcastMessage}
                      disabled={!hasAcceptedBids}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      onFocus={() => { setEmojiOpen(false); setInputFocused(true); }}
                      onBlur={() => setInputFocused(false)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleBroadcast()}
                    />
                    <button
                      onClick={handleBroadcast}
                      disabled={!broadcastMessage.trim() || isBroadcasting || !hasAcceptedBids}
                      style={{ height: "2.5rem", padding: "0 1rem", backgroundColor: "#3B82F6", color: "white", border: "none", borderRadius: "2rem", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", opacity: (!broadcastMessage.trim() || !hasAcceptedBids) ? 0.5 : 1, flexShrink: 0 }}
                    >
                      {isBroadcasting ? <span style={{ display: "inline-block", width: "0.9rem", height: "0.9rem", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : "Send"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Updates card — guest (read-only) */}
                <UpdatesCard updates={VoyageData.updates || []} voyageId={VoyageData.id} isOwner={false} />

                {/* Bids card — guest */}
                <div style={{ ...sideCard, flex: 1 }}>
                  <div style={cardHeader}>
                    <span style={cardHeaderTitle}>BIDS</span>
                    <span style={{ backgroundColor: "#F1F5F9", color: "#64748B", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 700, padding: "0.15rem 0.55rem" }}>
                      {bidsData.length}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
                    {bidsData.length === 0 && (
                      <div style={{ color: "#94A3B8", fontSize: "0.82rem" }}>No bids yet. Be the first!</div>
                    )}
                    {bidsData.map((bid) => (
                      <GuestBidRow key={bid.id} bid={bid} isMyBid={bid.userId === userId} />
                    ))}
                  </div>
                  {/* Send a bid button */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <VoyageDetailBidButton
                      ownVoyage={false}
                      userBid={userBid}
                      userProfileImage={VoyageData?.user?.profileImageUrl}
                      userName={VoyageData?.user?.userName}
                      userBidAccepted={userBidAccepted}
                      setOpacity={setOpacity}
                      userId={userId}
                      voyageId={voyageId}
                      refetch={refetch}
                      isOwnerDeleted={VoyageData?.isOwnerDeleted}
                      endDate={VoyageData?.endDate}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Voyage report modal */}
      {voyageReportOpen && (
        <div style={vModalOverlay} onClick={() => setVoyageReportOpen(false)}>
          <div style={vModalBox} onClick={(e) => e.stopPropagation()}>
            {voyageReportSubmitted ? (
              <>
                <div style={vModalTitle}>Report submitted</div>
                <div style={vModalSubtitle}>Thank you. Your report stays private.</div>
                <button onClick={() => setVoyageReportOpen(false)} style={vModalPrimaryBtn}>Close</button>
              </>
            ) : (
              <>
                <div style={vModalTitle}>Report voyage</div>
                <div style={vModalSubtitle}>Tell us what's wrong. Your report stays private.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "1rem 0" }}>
                  {VOYAGE_REPORT_REASONS.map((r) => (
                    <div key={r} onClick={() => setVoyageSelectedReason(r)} style={vReasonItem(voyageSelectedReason === r)}>{r}</div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={() => setVoyageReportOpen(false)} style={vModalCancelBtn}>Cancel</button>
                  <button onClick={handleReportVoyage} disabled={!voyageSelectedReason} style={{ ...vModalPrimaryBtn, opacity: voyageSelectedReason ? 1 : 0.4 }}>Submit report</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

export default VoyageDetailsPage;

// ── Sub-components ─────────────────────────────────────────────────────────────

function FitBoundsWithPadding({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds, { paddingTopLeft: [map.getSize().x * 0.22, 20], paddingBottomRight: [20, 20] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

const THUMB_STEP = 39; // 34px thumb + 5px gap
const VISIBLE = 5;

function ImageGallery({ images }) {
  const [idx, setIdx] = useState(0);
  const [first, setFirst] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const navigate = (n) => {
    n = ((n % images.length) + images.length) % images.length;
    let f = first;
    if (n < f) f = n;
    if (n > f + VISIBLE - 1) f = n - VISIBLE + 1;
    f = Math.max(0, Math.min(f, Math.max(0, images.length - VISIBLE)));
    setIdx(n);
    setFirst(f);
  };

  const showL = first > 0;
  const showR = first + VISIBLE < images.length;

  return (
    <>
      <div style={{ width: "250px", position: "relative", overflow: "hidden" }}>
        {/* Main image */}
        <img src={images[idx] || images[0]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

        {/* Counter */}
        <div style={{ position: "absolute", left: 8, top: 8, zIndex: 3, background: "rgba(4,16,30,0.6)", border: "1px solid rgba(255,255,255,0.24)", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "3px 8px", borderRadius: "99px", fontVariantNumeric: "tabular-nums" }}>
          <b>{idx + 1}</b> / {images.length}
        </div>

        {/* Expand button */}
        <button onClick={() => setLightbox(true)} title="Enlarge" style={{ position: "absolute", right: 8, top: 8, zIndex: 3, width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.55)", backdropFilter: "blur(5px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M14 4h6v6" /><path d="M20 4l-7 7" /><path d="M10 20H4v-6" /><path d="M4 20l7-7" />
          </svg>
        </button>

        {/* Prev / Next arrows */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 7px", pointerEvents: "none" }}>
          {[{ dir: -1, path: "M15 5l-7 7 7 7" }, { dir: 1, path: "M9 5l7 7-7 7" }].map(({ dir, path }) => (
            <button key={dir} onClick={() => navigate(idx + dir)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.55)", backdropFilter: "blur(5px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, pointerEvents: "auto" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><path d={path} /></svg>
            </button>
          ))}
        </div>

        {/* Thumbnail zone */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2, padding: "22px 8px 8px", background: "linear-gradient(180deg, rgba(4,16,30,0), rgba(4,16,30,0.78) 58%)", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", overflow: "hidden", width: `${Math.min(images.length, VISIBLE) * THUMB_STEP - 5}px` }}>
            {showL && <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 26, zIndex: 3, background: "linear-gradient(90deg, rgba(4,16,30,0.72), transparent)", pointerEvents: "none" }} />}
            {showR && <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 26, zIndex: 3, background: "linear-gradient(270deg, rgba(4,16,30,0.72), transparent)", pointerEvents: "none" }} />}
            <div style={{ display: "flex", gap: 5, transition: "transform 0.2s ease", transform: `translateX(-${first * THUMB_STEP}px)` }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => navigate(i)} style={{ flex: "0 0 34px", height: 34, borderRadius: 6, overflow: "hidden", border: i === idx ? "2px solid white" : "2px solid rgba(255,255,255,0.42)", cursor: "pointer", boxShadow: i === idx ? "0 0 0 2px rgba(255,255,255,0.28)" : "none", flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={images[idx]} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 12 }} />
          <button onClick={(e) => { e.stopPropagation(); navigate(idx - 1); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.7)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); navigate(idx + 1); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.7)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => setLightbox(false)} style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.7)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, padding: 0 }}>✕</button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 800 }}>{idx + 1} / {images.length}</div>
        </div>
      )}
    </>
  );
}

function WaypointStripCard({ waypoint, index, total, voyageImage, onClick, vertical }) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const badgeColor = isFirst ? "#2AC898" : isLast ? "#E0455B" : "#0A77EA";
  return (
    <div onClick={onClick} style={{ ...(vertical ? { width: "100%" } : { flex: "0 0 182px" }), position: "relative", marginTop: "10px", cursor: "pointer", flexShrink: 0 }}>
      {/* Badge: overhangs top-left corner */}
      <div style={{ position: "absolute", top: "-4px", left: "-4px", width: "19px", height: "19px", borderRadius: "50%", backgroundColor: badgeColor, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10.5px", fontWeight: 900, color: "white", zIndex: 2 }}>
        {index + 1}
      </div>
      {/* Card */}
      <div style={{ ...(vertical ? {} : { width: "182px" }), borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.97)", boxShadow: "0 2px 10px rgba(0,0,0,0.18)", display: "grid", gridTemplateColumns: "44px 1fr", gap: "9px", padding: "8px 9px", boxSizing: "border-box", alignItems: "center" }}>
        <img
          src={waypoint.profileImage || voyageImage}
          alt=""
          style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", display: "block", backgroundColor: "#DDE4EC" }}
        />
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#0A5FBF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{waypoint.title}</div>
          <div style={{ fontSize: "10.5px", fontWeight: 600, color: "#5C6B7A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
            {(waypoint.description || "").replace(/<[^>]+>/g, " ").trim()}
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnerBidRow({ bid, loadingBidId, onAccept, onDelete }) {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: bid.accepted ? "#F0FDF4" : "#F8FAFC", borderRadius: "0.75rem", padding: "0.6rem 0.75rem", border: bid.accepted ? "1px solid #BBF7D0" : "1px solid #E2E8F0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
        <img
          src={bid.userProfileImage}
          alt=""
          style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", cursor: "pointer", flexShrink: 0 }}
          onClick={() => navigate(`/profile-public/${bid.userPublicId}/${bid.userName}`)}
        />
        <span style={{ flex: 1, fontWeight: 700, fontSize: "0.88rem", color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bid.userName}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "#64748B", fontSize: "0.78rem", fontWeight: 600, flexShrink: 0 }}>
          {bid.personCount === 1 ? <IoPersonOutline size={14} /> : <IoPeopleOutline size={14} />}
          {bid.personCount}
        </span>
        <span style={{ color: "#10B981", fontWeight: 800, fontSize: "0.95rem", flexShrink: 0 }}>€{bid.offerPrice}</span>
      </div>
      {bid.message ? (
        <div style={{ fontSize: "0.8rem", color: "#475569", backgroundColor: "white", borderRadius: "0.5rem", padding: "0.4rem 0.6rem", marginBottom: "0.4rem", border: "1px solid #E2E8F0" }}>{bid.message}</div>
      ) : null}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem" }}>
        {bid.accepted ? (
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#10B981", display: "flex", alignItems: "center", gap: "0.25rem" }}>✓ Accepted</span>
        ) : (
          <>
            <button
              onClick={() => onAccept({ bidId: bid.id, bidUserId: bid.userId })}
              disabled={!!loadingBidId}
              style={{ padding: "0.25rem 0.75rem", backgroundColor: "#3B82F6", color: "white", border: "none", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", opacity: loadingBidId === bid.id ? 0.6 : 1 }}
            >
              {loadingBidId === bid.id ? "..." : "Accept"}
            </button>
            <button
              onClick={() => onDelete({ bidId: bid.id, bidUserId: bid.userId })}
              disabled={!!loadingBidId}
              style={{ padding: "0.25rem 0.6rem", backgroundColor: "#FEE2E2", color: "#EF4444", border: "none", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
            >
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function GuestBidRow({ bid, isMyBid }) {
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: bid.accepted ? "#F0FDF4" : "white", borderRadius: "0.75rem", padding: "0.75rem", border: bid.accepted ? "1px solid #BBF7D0" : "1px solid #E2E8F0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <img
          src={bid.userProfileImage}
          alt=""
          style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", cursor: "pointer", flexShrink: 0 }}
          onClick={() => navigate(`/profile-public/${bid.userPublicId}/${bid.userName}`)}
        />
        <span style={{ flex: 1, fontWeight: 700, fontSize: "0.9rem", color: "#0F172A" }}>{bid.userName}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "#64748B", fontSize: "0.82rem", fontWeight: 600 }}>
          {bid.personCount === 1 ? <IoPersonOutline size={15} /> : <IoPeopleOutline size={15} />}
          {bid.personCount}
        </span>
        <span style={{ color: "#10B981", fontWeight: 800, fontSize: "1rem", flexShrink: 0 }}>€{bid.offerPrice}</span>
      </div>
      {isMyBid && bid.message ? (
        <div style={{ fontSize: "0.82rem", color: "#475569", backgroundColor: "#F8FAFC", borderRadius: "0.5rem", padding: "0.5rem 0.65rem", marginBottom: "0.5rem", border: "1px solid #E2E8F0" }}>{bid.message}</div>
      ) : null}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {bid.accepted ? (
          <span style={{ backgroundColor: "#DCFCE7", color: "#166534", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.7rem" }}>✓ Accepted</span>
        ) : (
          <span style={{ backgroundColor: "#FEF3C7", color: "#92400E", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.7rem" }}>Pending</span>
        )}
      </div>
    </div>
  );
}

function UpdatesCard({ updates, voyageId, isOwner }) {
  const [text, setText] = useState("");
  const [addVoyageUpdate, { isLoading }] = useAddVoyageUpdateMutation();
  const [localUpdates, setLocalUpdates] = useState(updates || []);

  useEffect(() => { setLocalUpdates(updates || []); }, [updates]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      const result = await addVoyageUpdate({ voyageId, text }).unwrap();
      setLocalUpdates([result, ...localUpdates]);
      setText("");
    } catch (e) {
      console.error("Failed to post update", e);
    }
  };

  return (
    <div style={sideCard}>
      <div style={cardHeader}>
        <span style={cardHeaderTitle}>UPDATES</span>
        {localUpdates.length > 0 && (
          <span style={{ backgroundColor: "#F1F5F9", color: "#64748B", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 700, padding: "0.15rem 0.55rem" }}>
            {localUpdates.length}
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "220px", overflowY: "auto", scrollbarWidth: "none" }}>
        {localUpdates.length === 0 && (
          <div style={{ color: "#94A3B8", fontSize: "0.82rem" }}>No updates yet.</div>
        )}
        {localUpdates.map((u) => (
          <div key={u.id} style={{ borderLeft: "3px solid #10B981", background: "linear-gradient(to right, rgba(16,185,129,0.08), transparent)", borderRadius: "0 0.5rem 0.5rem 0", padding: "0.4rem 0.6rem" }}>
            <div style={{ fontSize: "0.7rem", color: "#94A3B8", textAlign: "right", marginBottom: "0.15rem" }}>
              {new Date(u.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#1E3A5F", lineHeight: 1.5, textAlign: "left" }}>{u.text}</div>
          </div>
        ))}
      </div>
      {isOwner && (
        <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", marginTop: "0.6rem", alignItems: "flex-start" }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            maxLength={500}
            placeholder="Write an update..."
            style={{ flex: 1, height: "2.4rem", padding: "0.4rem 0.9rem", fontSize: "0.82rem", color: "#0F172A", backgroundColor: "#F8FAFC", borderRadius: "2rem", border: "2px solid #E2E8F0", outline: "none", fontFamily: "Nunito" }}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !text.trim()}
            style={{ height: "2.4rem", padding: "0 1rem", backgroundColor: "#3B82F6", color: "white", border: "none", borderRadius: "2rem", fontSize: "0.82rem", fontWeight: 700, cursor: text.trim() ? "pointer" : "default", opacity: (isLoading || !text.trim()) ? 0.5 : 1, flexShrink: 0 }}
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}

// ── Inline styles ──────────────────────────────────────────────────────────────

const statusPill = (bg, color) => ({
  backgroundColor: bg,
  color,
  borderRadius: "99px",
  padding: "0.2rem 0.7rem",
  fontSize: "0.7rem",
  fontWeight: 800,
  letterSpacing: "0.05em",
  fontFamily: "Nunito",
});

const bannerLabel = {
  fontSize: "0.65rem",
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.45)",
  fontFamily: "Nunito",
};

const statBlock = {
  display: "flex",
  flexDirection: "column",
  gap: "0.15rem",
};

const statValue = {
  color: "white",
  fontWeight: 800,
  fontSize: "0.9rem",
  fontFamily: "Nunito",
};

const avatarSmall = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  objectFit: "cover",
};

const iconBtn = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.12)",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255,255,255,0.85)",
  fontSize: "1.1rem",
  fontWeight: 700,
};

const sideCard = {
  backgroundColor: "white",
  borderRadius: "1rem",
  padding: "1rem",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "0.75rem",
};

const cardHeaderTitle = {
  fontSize: "0.7rem",
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#64748B",
};

const vModalOverlay = {
  position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000,
};
const vModalBox = {
  backgroundColor: "white", borderRadius: "16px", padding: "2rem",
  width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
};
const vModalTitle = { fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" };
const vModalSubtitle = { fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" };
const vReasonItem = (selected) => ({
  padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem",
  backgroundColor: selected ? "#eff6ff" : "#f8fafc",
  color: selected ? "#1d4ed8" : "#334155",
  fontWeight: selected ? 700 : 400,
  border: selected ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
});
const vModalPrimaryBtn = {
  flex: 1, padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none",
  backgroundColor: "#dc2626", color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
};
const vModalCancelBtn = {
  flex: 1, padding: "0.6rem 1.2rem", borderRadius: "8px",
  border: "1px solid #e2e8f0", backgroundColor: "white",
  color: "#475569", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
};

// ── Banner spec styles ─────────────────────────────────────────────────────────

const iconBtnSm = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.28)",
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const bnrPill = (bg, color) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  padding: "4px 10px",
  borderRadius: "99px",
  background: bg,
  border: "1px solid rgba(255,255,255,0.24)",
  color,
  whiteSpace: "nowrap",
});

const avatarSpec = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "1.5px solid rgba(255,255,255,0.38)",
  flexShrink: 0,
};

const specLabel = {
  display: "block",
  fontSize: "8.5px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.52)",
};

const specValue = {
  display: "block",
  fontSize: "13px",
  fontWeight: 800,
  color: "#fff",
  whiteSpace: "nowrap",
};

const specStat = {
  display: "block",
  fontSize: "15px",
  fontWeight: 800,
  color: "#fff",
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
  marginTop: "2px",
};

export const appStyle = { textAlign: "center" };
export const appHeaderStyle = { backgroundColor: "transparent", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "calc(10px + 2vmin)", color: "white" };
export const mainPageContainerStyle = { flexDirection: "column", width: "100%", height: "100vh" };
export const mainPageTopRowStyle = { padding: "0.1rem", flexDirection: "row", backgroundColor: "#011a32" };
export const mainPageTopRightStyle = { height: "3rem", width: "65%", alignItems: "center", justifyContent: "flex-end" };
export const mainPageBottomRowStyle = { flexGrow: 1, width: "100%" };
