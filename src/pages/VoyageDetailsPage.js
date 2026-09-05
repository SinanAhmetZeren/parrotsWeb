/* eslint-disable no-undef */
import "../assets/css/VoyageDetails.css";
import "../assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useGetVoyageByIdQuery, useAddVoyageUpdateMutation } from "../slices/VoyageSlice";
import { invokeHub } from "../signalr/signalRHub";
import { TopBarMenu } from "../components/TopBarMenu";
import { MapContainer, TileLayer } from "react-leaflet";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { VoyageDetailPageImageSwiper } from "../components/VoyageDetailPageImageSwiper";
import { VoyageDetailPageDetails } from "../components/VoyageDetailPageDetails";
import { VoyageDetailPageDetailsLegacy } from "../components/VoyageDetailPageDetailsLegacy";
import { VoyageDetailPageDescription } from "../components/VoyageDetailPageDescription";
import { VoyageDetailBids } from "../components/VoyageDetailPageBids";
import { VoyageDetailWaypointSwiper } from "../components/VoyageDetailWaypointSwiper";
import { VoyageDetailMapPanComponent } from "../components/VoyageDetailMapPanComponent";
import { VoyageDetailMarkerWithInfoWindow } from "../components/VoyageDetailMarkerWithInfoWindow";
import { VoyageDetailMapPolyLineComponent } from "../components/VoyageDetailMapPolyLineComponent";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useAddVoyageToFavoritesMutation,
  useDeleteVoyageFromFavoritesMutation,
} from "../slices/VoyageSlice";
import { updateUserFavoriteVoyages } from "../slices/UserSlice";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { IoHeartSharp } from "react-icons/io5";
import { MdPublic } from "react-icons/md";
import parrotEmojiIcon from "../assets/images/emojipickerparrot.jpg";
import parrotEmojiIconBlue from "../assets/images/emojipickerblueparrot.jpg";
import { EMOJI_CATEGORIES, EMOJIS_BY_CATEGORY, EMOJI_NAMES } from "../constants/emojiData";


import { addVoyageToUserFavorites, removeVoyageFromUserFavorites, useGetFavoriteVoyageIdsByUserIdQuery, useReportVoyageMutation, setIsLegacyView } from "../slices/UserSlice";
import { parrotBlue, parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotBlueSemiTransparent, parrotDarkBlue, parrotGreen, parrotLightBlue, parrotTextDarkBlue } from "../styles/colors";
import { MapTypeButton } from "../components/MapTypeButton";
import { toast } from "react-toastify";
import { CustomToolTip } from "../components/CustomToolTip";
import { PublicAndHeartAndPageStyleIcons } from "../components/PublicAndHeartAndPageStyleIcons";
import { VoyageDetailBidsNew } from "../components/VoyageDetailPageBidsNew";
import { VoyageDetailPageDescriptionNew } from "../components/VoyageDetailPageDescriptionNew";
import { VoyageDetailPageImageSwiperNew } from "../components/VoyageDetailPageImageSwiperNew";
import { VoyageDetailPageDetailsLight } from "../components/VoyageDetailPageDetailsLight";
import { VoyageDetailPageDetailsLegacyLight } from "../components/VoyageDetailPageDetailsLegacyLight";
import { VoyageDetailPageDescriptionLight } from "../components/VoyageDetailPageDescriptionLight";
import { VoyageDetailPageDescriptionNewLight } from "../components/VoyageDetailPageDescriptionNewLight";
import { VoyageDetailBidsLight } from "../components/VoyageDetailPageBidsLight";
import { VoyageDetailBidsNewLight } from "../components/VoyageDetailPageBidsNewLight";
import { VoyageDetailWaypointCardLight } from "../components/VoyageDetailWaypointCardLight";
import { PulsatingParrotLogo } from "../components/PulsatingParrotLogo";

function VoyageDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { voyageId } = useParams();
  console.log("voyageId from params:", voyageId);
  const userId = localStorage.getItem("storedUserId");
  const maptilerKey = process.env.REACT_APP_MAPTILER_KEY;

  const [userBid, setUserBid] = useState("");
  const [userBidAccepted, setUserBidAccepted] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastPlaceholder, setBroadcastPlaceholder] = useState("Message accepted users...");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState("smileys");
  const [emojiSearch, setEmojiSearch] = useState("");
  const emojiRef = useRef(null);
  const mapRef = useRef();
  const [targetLocation, setTargetLocation] = useState({});
  const [latLngBoundsLiteral, setLatLngBoundsLiteral] = useState({
    north: null,
    south: null,
    east: null,
    west: null,
  });
  const [isPublicOnMap, setIsPublicOnMap] = useState(false);
  const [mapTypeId, setMapTypeId] = useState("hybrid"); // "roadmap" or "hybrid"
  const isDarkMode = useSelector((state) => state.users.isDarkMode)
  const isLegacyView = useSelector((state) => state.users.isLegacyView)
  const [voyageReportOpen, setVoyageReportOpen] = useState(false);
  const [voyageSelectedReason, setVoyageSelectedReason] = useState("");
  const [voyageReportSubmitted, setVoyageReportSubmitted] = useState(false);
  const [reportVoyage] = useReportVoyageMutation();

  const VOYAGE_REPORT_REASONS = [
    "Inappropriate Content",
    "Safety / Navigation Hazard",
    "False or Misleading Information",
    "Spam, Scam, or Commercial Activity",
  ];

  const handleReportVoyage = async () => {
    if (!voyageSelectedReason) return;
    try {
      await reportVoyage({ voyageId, reason: voyageSelectedReason }).unwrap();
      setVoyageReportSubmitted(true);
    } catch (err) {
      console.error("Voyage report failed:", err);
    }
  };


  const favoriteVoyages = useSelector((state) => state.users.userFavoriteVoyages);
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: favoriteVoyagesData } =
    useGetFavoriteVoyageIdsByUserIdQuery(userId, {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });


  useEffect(() => {
    const updateFavoriteVoyages = () => {
      dispatch(
        updateUserFavoriteVoyages({
          favoriteVoyages: favoriteVoyagesData,
        })
      );
    };
    updateFavoriteVoyages();
  }, [favoriteVoyagesData, dispatch]);



  const [opacity, setOpacity] = useState(1);
  const {
    data: VoyageData,
    isSuccess: isSuccessVoyage,
    isLoading: isLoadingVoyage,
    isError: isErrorVoyage,
    refetch,
  } = useGetVoyageByIdQuery(voyageId, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const isInFavorites = favoriteVoyages?.includes(VoyageData?.id);

  const sortedWaypoints = VoyageData?.waypoints
    ? [...VoyageData.waypoints].sort((a, b) => a.order - b.order)
    : [];

  const [addVoyageToFavorites] = useAddVoyageToFavoritesMutation();
  const [deleteVoyageFromFavorites] = useDeleteVoyageFromFavoritesMutation();

  const handleAddVoyageToFavorites = async () => {
    try {
      await addVoyageToFavorites({ userId, voyageId: VoyageData?.id }).unwrap();
      setIsFavorited(true);
      dispatch(
        addVoyageToUserFavorites({
          favoriteVoyage: VoyageData?.id,
        })
      );
    } catch (err) {
      console.error("Error adding voyage to favorites:", err);
      toast.error("Failed to add to favorites. Please try again.");
    }
  };

  const handleDeleteVoyageFromFavorites = async () => {
    try {
      await deleteVoyageFromFavorites({ userId, voyageId: VoyageData?.id }).unwrap();
      setIsFavorited(false);
      dispatch(
        removeVoyageFromUserFavorites({
          favoriteVoyage: VoyageData?.id,
        })
      );
    } catch (err) {
      console.error("Error removing voyage from favorites:", err);
      toast.error("Failed to remove from favorites. Please try again.");
    }
  };

  useEffect(() => {
    if (isSuccessVoyage && VoyageData?.waypoints?.length > 0) {
      let tempMaxLat = -Infinity;
      let tempMinLat = Infinity;
      let tempMaxLng = -Infinity;
      let tempMinLng = Infinity;


      VoyageData?.waypoints?.forEach((waypoint) => {
        const { latitude, longitude } = waypoint;

        if (latitude > tempMaxLat) tempMaxLat = latitude;
        if (latitude < tempMinLat) tempMinLat = latitude;
        if (longitude > tempMaxLng) tempMaxLng = longitude;
        if (longitude < tempMinLng) tempMinLng = longitude;
      });

      // Add padding if latitudes or longitudes are equal
      if (tempMaxLat === tempMinLat) {
        tempMaxLat += 0.025;
        tempMinLat -= 0.025;
      }

      if (tempMaxLng === tempMinLng) {
        tempMaxLng += 0.025;
        tempMinLng -= 0.025;
      }

      setLatLngBoundsLiteral({
        north: tempMaxLat,
        south: tempMinLat,
        east: tempMaxLng,
        west: tempMinLng,
      });
      console.log("***********");
      console.log("temopMaxLat", tempMaxLat);
      console.log("tempMinLat", tempMinLat);
      console.log("tempMaxLng", tempMaxLng);
      console.log("tempMinLng", tempMinLng);
      console.log("***********");
    } else {
      setLatLngBoundsLiteral({
        north: 0,
        south: 0,
        east: 0,
        west: 0,
      });
    }

    if (VoyageData) {
      setUserBid(VoyageData?.bids?.find((bid) => bid.userId === userId));
      setUserBidAccepted(
        VoyageData?.bids?.find((bid) => bid.userId === userId)?.accepted ?? false
      );
      setIsPublicOnMap(VoyageData.publicOnMap);
      console.log("----", VoyageData);

      console.log(
        "user bid: -->",
        VoyageData?.bids?.find((bid) => bid.userId === userId)
      );
    }
  }, [isSuccessVoyage, VoyageData, userId]);

  useEffect(() => {
    if (isSuccessVoyage && VoyageData?.placeType > 0) {
      navigate("/");
    }
  }, [isSuccessVoyage, VoyageData, navigate]);

  useEffect(() => {
    if (!emojiOpen) return;
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) { setEmojiOpen(false); setEmojiSearch(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [emojiOpen]);

  const handlePanToLocation = (lat, lng) => {
    setTargetLocation(prev => ({ lat, lng, key: (prev.key ?? 0) + 1 }));
  };

  const handleBroadcast = async () => {
    const acceptedUserIds = (VoyageData?.bids || []).filter((b) => b.accepted).map((b) => b.userId);
    console.log("[Broadcast] message:", broadcastMessage.trim());
    console.log("[Broadcast] acceptedUserIds:", acceptedUserIds);
    console.log("[Broadcast] senderId (userId):", userId);
    if (!broadcastMessage.trim() || acceptedUserIds.length === 0) {
      console.warn("[Broadcast] Aborted — empty message or no accepted users");
      return;
    }
    setIsBroadcasting(true);
    try {
      console.log("[Broadcast] Calling invokeHub BroadcastMessage...");
      await invokeHub("BroadcastMessage", userId, acceptedUserIds, broadcastMessage.trim());
      console.log("[Broadcast] Success");
      setBroadcastMessage("");
      setBroadcastPlaceholder(`Message sent to ${acceptedUserIds.length} user${acceptedUserIds.length !== 1 ? "s" : ""}!`);
      setTimeout(() => setBroadcastPlaceholder("Message accepted users..."), 2000);
    } catch (error) {
      console.error("[Broadcast] Failed:", error);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (isErrorVoyage || (isSuccessVoyage && !VoyageData)) {
    navigate("/");
    return null;
  }

  return isLoadingVoyage ? (
    <div style={spinnerContainer}>
      <PulsatingParrotLogo size={150} />
    </div>
  ) : isSuccessVoyage ? (
    <>
      {isLegacyView ? (

        // legacy view
        <div key="explorer" style={appStyle}>
          <header style={appHeaderStyle}>
            <div style={mainPageContainerStyle} className="flex">
              <div style={mainPageTopRowStyle} className="flex">
                <TopLeftComponent />
                <div style={mainPageTopRightStyle} className="flex">
                  <TopBarMenu />
                </div>
              </div>

              <div style={{ ...mainPageBottomRowStyle }} className="flex">
                <div style={voyageDetailsBottomLeftStyle_explorer} className="flex voyageDetailsBottomLeft hide-scrollbar">


                  <div style={{
                    width: "calc(100% - 2rem)", marginLeft: "1rem", marginRight: "1rem",
                    paddingBottom: "0.2rem", height: "32vh", position: "relative"
                  }} className="flex">
                    {isDarkMode ? <VoyageDetailPageDetailsLegacy voyageData={VoyageData} /> :
                      <VoyageDetailPageDetailsLegacyLight voyageData={VoyageData} />}
                  </div>
                  <div style={{ margin: "0 1rem", paddingTop: 0 }} className="flex">
                    {isDarkMode
                      ? <VoyageDetailBids userId={userId} voyageId={voyageId} voyageData={VoyageData} ownVoyage={userId === VoyageData.userId} userBid={userBid} userBidAccepted={userBidAccepted} currentUserId={userId} isSuccessVoyage={isSuccessVoyage} refetch={refetch} setOpacity={setOpacity} />
                      : <VoyageDetailBidsLight userId={userId} voyageId={voyageId} voyageData={VoyageData} ownVoyage={userId === VoyageData.userId} userBid={userBid} userBidAccepted={userBidAccepted} currentUserId={userId} isSuccessVoyage={isSuccessVoyage} refetch={refetch} setOpacity={setOpacity} />
                    }
                  </div>
                  {userId === VoyageData.userId && (
                    <div style={broadcastCardStyle_explorer(isDarkMode)}>

                      {/* Emoji button + panel */}
                      <div style={{ position: "relative", flexShrink: 0 }} ref={emojiRef}>
                        <button onClick={() => setEmojiOpen(o => !o)} style={broadcastEmojiBtnStyle(isDarkMode, emojiOpen || inputFocused)} disabled={!(VoyageData?.bids || []).some((b) => b.accepted)}>
                          <img src={emojiOpen || inputFocused ? parrotEmojiIconBlue : parrotEmojiIcon} alt="emoji" style={{ width: 42, height: 42, objectFit: "cover", opacity: emojiOpen || inputFocused ? (isDarkMode ? 0.35 : 1) : 0.2 }} />
                        </button>
                        {emojiOpen && (
                          <div style={broadcastEmojiPanelStyle(isDarkMode)}>
                            <div style={{ padding: "0.5rem 0.6rem 0.3rem" }}>
                              <input
                                style={broadcastEmojiSearchInputStyle(isDarkMode)}
                                placeholder="Search emoji..."
                                value={emojiSearch}
                                onChange={e => setEmojiSearch(e.target.value)}
                                autoFocus
                              />
                            </div>
                            {!emojiSearch && (
                              <div style={{ display: "flex", overflowX: "auto", padding: "0.4rem 0.4rem 0", gap: "0.1rem", scrollbarWidth: "none" }}>
                                {EMOJI_CATEGORIES.map(cat => (
                                  <button key={cat.key} onClick={() => setEmojiCategory(cat.key)}
                                    style={{ background: emojiCategory === cat.key ? (isDarkMode ? "#1a4a7a" : "#e8f0fe") : "none", border: "none", borderRadius: "0.5rem", fontSize: "1.625rem", cursor: "pointer", padding: "0.25rem 0.4rem", flexShrink: 0 }}>
                                    {cat.icon}
                                  </button>
                                ))}
                              </div>
                            )}
                            <div style={{ display: "flex", flexWrap: "wrap", padding: "0.4rem", flex: 1, overflowY: "auto", alignContent: "flex-start", gap: "0.1rem" }}>
                              {(emojiSearch
                                ? Object.values(EMOJIS_BY_CATEGORY).flat().filter(e => EMOJI_NAMES[e]?.includes(emojiSearch.toLowerCase()))
                                : (EMOJIS_BY_CATEGORY[emojiCategory] || [])
                              ).map((emoji, i) => (
                                <button key={i}
                                  style={{ background: "none", border: "none", fontSize: "2.5rem", cursor: "pointer", padding: "0.15rem", borderRadius: "0.4rem", lineHeight: 1 }}
                                  onClick={() => setBroadcastMessage(prev => prev + emoji)}
                                >{emoji}</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <input
                        style={broadcastInputStyle(isDarkMode, emojiOpen || inputFocused)}
                        className={broadcastPlaceholder !== "Message accepted users..." ? "broadcast-sent" : ""}
                        placeholder={(VoyageData?.bids || []).some((b) => b.accepted) ? broadcastPlaceholder : "No accepted bids yet..."}
                        value={broadcastMessage}
                        disabled={!(VoyageData?.bids || []).some((b) => b.accepted)}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        onFocus={() => { setEmojiOpen(false); setInputFocused(true); }}
                        onBlur={() => setInputFocused(false)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleBroadcast()}
                      />
                      <button
                        style={{ ...broadcastBtnStyle, opacity: (!broadcastMessage.trim() || isBroadcasting || !(VoyageData?.bids || []).some((b) => b.accepted)) ? 0.5 : 1 }}
                        onClick={handleBroadcast}
                        disabled={!broadcastMessage.trim() || isBroadcasting || !(VoyageData?.bids || []).some((b) => b.accepted)}
                      >
                        {isBroadcasting ? (
                          <span style={{ display: "inline-block", width: "1rem", height: "1rem", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                        ) : "Send"}
                      </button>
                    </div>
                  )}

                </div>

                <div style={voyageDetailsBottomMiddleStyle_explorer} className="flex voyageDetailsBottomLeft custom-scrollbar">
                  <div style={{ ...voyageDetailsImagesStyle_explorer, position: "relative" }} className="flex">
                    {VoyageData?.isOwnerDeleted && (
                      <div style={ownerDeletedNoticeStyle}>
                        Notice: This host has deleted their account and is no longer active on Parrots. The voyage remains visible for viewing purposes only. In case of urgent coordination, Parrots will do its best to reach the host on a good-faith basis.
                      </div>
                    )}
                    <VoyageDetailPageImageSwiper voyageData={VoyageData} opacity={opacity} />
                  </div>

                  <div style={{ ...voyageDetailsIconsRowStyle_explorer, position: "relative" }} className="flex">
                    <PublicAndHeartAndPageStyleIcons
                      handleAddVoyageToFavorites={handleAddVoyageToFavorites}
                      handleDeleteVoyageFromFavorites={handleDeleteVoyageFromFavorites}
                      isFavorited={isFavorited}
                      isPublicOnMap={isPublicOnMap}
                      isLegacyView={isLegacyView}
                      setIsLegacyView={(v) => dispatch(setIsLegacyView(v))}
                      isDarkMode={isDarkMode}
                      onReportPress={() => { setVoyageReportOpen(true); setVoyageReportSubmitted(false); setVoyageSelectedReason(""); }}
                      topOffset="-1rem"
                    />
                  </div>
                  <div style={voyageDetailsDescriptionStyle_explorer} className="flex">
                    {isDarkMode
                      ? <VoyageDetailPageDescription voyageDescription={VoyageData.description} voyageName={VoyageData} />
                      : <VoyageDetailPageDescriptionLight voyageDescription={VoyageData.description} voyageName={VoyageData} />
                    }
                  </div>
                  <div>
                    <VoyageUpdatesSectionExplorer updates={VoyageData.updates || []} voyageId={VoyageData.id} isOwner={userId === VoyageData.userId} isDarkMode={isDarkMode} />

                  </div>
                </div>

                <div style={{ ...voyageDetailsBottomRightStyle_explorer, display: "flex", flexDirection: "column" }}>
                  <div style={voyageDetailsMapContainerStyle_explorer} className="flex">
                    {latLngBoundsLiteral?.east ? (
                      <div style={{ position: "relative", height: "100%", width: "100%" }}>
                        <MapContainer
                          bounds={[[latLngBoundsLiteral.south, latLngBoundsLiteral.west], [latLngBoundsLiteral.north, latLngBoundsLiteral.east]]}
                          style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
                          zoomControl={false}
                          scrollWheelZoom={true}
                        >
                          <TileLayer
                            url={mapTypeId === "roadmap"
                              ? `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${maptilerKey}`
                              : `https://api.maptiler.com/maps/outdoor-v4/{z}/{x}/{y}.png?key=${maptilerKey}`}
                            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                          />
                          <VoyageDetailMapPanComponent targetLat={targetLocation?.lat} targetLng={targetLocation?.lng} panKey={targetLocation?.key} />
                          <VoyageDetailMapPolyLineComponent waypoints={sortedWaypoints} />
                          {sortedWaypoints.map((waypoint, index) => (
                            <VoyageDetailMarkerWithInfoWindow
                              key={`${waypoint.id}`}
                              index={index}
                              total={sortedWaypoints.length}
                              waypointTitle={waypoint.title}
                              position={{ lat: waypoint.latitude, lng: waypoint.longitude }}
                            />
                          ))}
                        </MapContainer>
                        <MapTypeButton mapTypeId={mapTypeId} setMapTypeId={setMapTypeId} />
                      </div>
                    ) : null}
                  </div>

                  <div style={voyageDetailsWaypointsContainerStyle_explorer}>
                    <VoyageDetailWaypointSwiper
                      waypoints={sortedWaypoints}
                      handlePanToLocation={handlePanToLocation}
                      opacity={opacity}
                      voyageImage={VoyageData.profileImage}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>
              </div>
            </div>

            <style>
              {`
                    .custom-scrollbar::-webkit-scrollbar {
                        background-color: #091b46;
                        background-color: transparent;
                        width: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: #1a3a8a;
                        background-color: transparent;
                        border-radius: 10px;
                    }
                `}
            </style>

          </header>
        </div>
      ) : (
        // new view
        <div key="navigator" style={appStyle}>
          <header style={appHeaderStyle}>
            <div style={mainPageContainerStyle} className="flex">
              <div style={mainPageTopRowStyle} className="flex">
                <TopLeftComponent />
                <div style={mainPageTopRightStyle} className="flex">
                  <TopBarMenu />
                </div>
              </div>

              <div style={{ ...mainPageBottomRowStyle }} className="flex">
                <div style={voyageDetailsBottomLeftStyle_navigator}
                  className="flex voyageDetailsBottomLeft hide-scrollbar"
                >
                  <div style={{ ...voyageDetailsImagesStyle_navigator, position: "relative" }}>
                    {VoyageData?.isOwnerDeleted && (
                      <div style={{ ...ownerDeletedNoticeStyle, top: "0rem", width: "60%" }}>
                        Notice: This host has deleted their account and is no longer active on Parrots. The voyage remains visible for viewing purposes only. In case of urgent coordination, Parrots will do its best to reach the host on a good-faith basis.
                      </div>
                    )}
                    <VoyageDetailPageImageSwiperNew voyageData={VoyageData} />
                  </div>

                  <div style={voyageDetailsDetailsStyle_navigator}>
                    <div style={{ position: "relative", width: "100%", height: "100%" }} className="flex">
                      <PublicAndHeartAndPageStyleIcons
                        handleAddVoyageToFavorites={handleAddVoyageToFavorites}
                        handleDeleteVoyageFromFavorites={handleDeleteVoyageFromFavorites}
                        isFavorited={isFavorited}
                        isPublicOnMap={isPublicOnMap}
                        isLegacyView={isLegacyView}
                        setIsLegacyView={(v) => dispatch(setIsLegacyView(v))}
                        isDarkMode={isDarkMode}
                        onReportPress={() => { setVoyageReportOpen(true); setVoyageReportSubmitted(false); setVoyageSelectedReason(""); }}
                      />
                      {isDarkMode ? <VoyageDetailPageDetails voyageData={VoyageData} /> : <VoyageDetailPageDetailsLight voyageData={VoyageData} />}
                    </div>
                  </div>

                  <div style={voyageDetailsDescriptionStyle_navigator}>
                    <div style={{ width: "100%", height: "100%" }} className="flex">
                      {isDarkMode
                        ? <VoyageDetailPageDescriptionNew voyageDescription={VoyageData.description} />
                        : <VoyageDetailPageDescriptionNewLight voyageDescription={VoyageData.description} />
                      }
                    </div>
                  </div>

                  <div style={voyageDetailsUpdatesStyle_navigator}>
                    <VoyageUpdatesSectionNavigator updates={VoyageData.updates || []} voyageId={VoyageData.id} isOwner={userId === VoyageData.userId} isDarkMode={isDarkMode} />
                  </div>

                  <div style={voyageDetailsBidsStyle_navigator}>
                    <div style={{ width: "100%", height: "100%" }} className="flex">
                      {isDarkMode
                        ? <VoyageDetailBidsNew userId={userId} voyageId={voyageId} voyageData={VoyageData} ownVoyage={userId === VoyageData.userId} userBid={userBid} userBidAccepted={userBidAccepted} currentUserId={userId} isSuccessVoyage={isSuccessVoyage} refetch={refetch} setOpacity={setOpacity} />
                        : <VoyageDetailBidsNewLight userId={userId} voyageId={voyageId} voyageData={VoyageData} ownVoyage={userId === VoyageData.userId} userBid={userBid} userBidAccepted={userBidAccepted} currentUserId={userId} isSuccessVoyage={isSuccessVoyage} refetch={refetch} setOpacity={setOpacity} />
                      }
                    </div>
                  </div>
                  {userId === VoyageData.userId && (
                    <div style={broadcastCardStyle_navigator(isDarkMode)}>

                      {/* Emoji button + panel */}
                      <div style={{ position: "relative", flexShrink: 0 }} ref={emojiRef}>
                        <button onClick={() => setEmojiOpen(o => !o)} style={{ ...broadcastEmojiBtnStyle(isDarkMode, emojiOpen || inputFocused), width: 44, height: 44 }} disabled={!(VoyageData?.bids || []).some((b) => b.accepted)}>
                          <img src={emojiOpen || inputFocused ? parrotEmojiIconBlue : parrotEmojiIcon} alt="emoji" style={{ width: 46, height: 46, objectFit: "cover", opacity: emojiOpen || inputFocused ? (isDarkMode ? 0.35 : 1) : 0.2 }} />
                        </button>
                        {emojiOpen && (
                          <div style={broadcastEmojiPanelStyle(isDarkMode)}>
                            <div style={{ padding: "0.5rem 0.6rem 0.3rem" }}>
                              <input
                                style={broadcastEmojiSearchInputStyle(isDarkMode)}
                                placeholder="Search emoji..."
                                value={emojiSearch}
                                onChange={e => setEmojiSearch(e.target.value)}
                                autoFocus
                              />
                            </div>
                            {!emojiSearch && (
                              <div style={{ display: "flex", overflowX: "auto", padding: "0.4rem 0.4rem 0", gap: "0.1rem", scrollbarWidth: "none" }}>
                                {EMOJI_CATEGORIES.map(cat => (
                                  <button key={cat.key} onClick={() => setEmojiCategory(cat.key)}
                                    style={{ background: emojiCategory === cat.key ? (isDarkMode ? "#1a4a7a" : "#e8f0fe") : "none", border: "none", borderRadius: "0.5rem", fontSize: "1.625rem", cursor: "pointer", padding: "0.25rem 0.4rem", flexShrink: 0 }}
                                  >{cat.icon}</button>
                                ))}
                              </div>
                            )}
                            <div style={{ display: "flex", flexWrap: "wrap", padding: "0.4rem", flex: 1, overflowY: "auto", alignContent: "flex-start", gap: "0.1rem" }}>
                              {(emojiSearch
                                ? Object.values(EMOJIS_BY_CATEGORY).flat().filter(e => EMOJI_NAMES[e]?.includes(emojiSearch.toLowerCase()))
                                : (EMOJIS_BY_CATEGORY[emojiCategory] || [])
                              ).map((emoji, i) => (
                                <button key={i}
                                  style={{ background: "none", border: "none", fontSize: "2.5rem", cursor: "pointer", padding: "0.15rem", borderRadius: "0.4rem", lineHeight: 1 }}
                                  onClick={() => setBroadcastMessage(prev => prev + emoji)}
                                >{emoji}</button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <input
                        style={{ ...broadcastInputStyle(isDarkMode, emojiOpen || inputFocused), height: "3.5rem" }}
                        className={broadcastPlaceholder !== "Message accepted users..." ? "broadcast-sent" : ""}
                        placeholder={(VoyageData?.bids || []).some((b) => b.accepted) ? broadcastPlaceholder : "No accepted bids yet..."}
                        value={broadcastMessage}
                        disabled={!(VoyageData?.bids || []).some((b) => b.accepted)}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        onFocus={() => { setEmojiOpen(false); setInputFocused(true); }}
                        onBlur={() => setInputFocused(false)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleBroadcast()}
                      />
                      <button
                        style={{ ...broadcastBtnStyle, height: "3.5rem", opacity: (!broadcastMessage.trim() || isBroadcasting || !(VoyageData?.bids || []).some((b) => b.accepted)) ? 0.5 : 1 }}
                        onClick={handleBroadcast}
                        disabled={!broadcastMessage.trim() || isBroadcasting || !(VoyageData?.bids || []).some((b) => b.accepted)}
                      >
                        {isBroadcasting ? (
                          <span style={{
                            display: "inline-block",
                            width: "1rem", height: "1rem",
                            border: "2px solid rgba(255,255,255,0.4)",
                            borderTopColor: "white",
                            borderRadius: "50%",
                            animation: "spin 0.7s linear infinite",
                          }} />
                        ) : "Send"}
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ ...voyageDetailsBottomRightStyle_navigator, display: "flex", flexDirection: "column" }}>
                  <div style={voyageDetailsMapContainerStyle_navigator} className="flex">
                    {latLngBoundsLiteral?.east ? (
                      <div style={{ position: "relative", height: "100%", width: "100%" }}>
                        <MapContainer
                          bounds={[[latLngBoundsLiteral.south, latLngBoundsLiteral.west], [latLngBoundsLiteral.north, latLngBoundsLiteral.east]]}
                          style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
                          zoomControl={false}
                          scrollWheelZoom={true}
                        >
                          <TileLayer
                            url={mapTypeId === "roadmap"
                              ? `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${maptilerKey}`
                              : `https://api.maptiler.com/maps/outdoor-v4/{z}/{x}/{y}.png?key=${maptilerKey}`}
                            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                          />
                          <VoyageDetailMapPanComponent targetLat={targetLocation?.lat} targetLng={targetLocation?.lng} panKey={targetLocation?.key} />
                          <VoyageDetailMapPolyLineComponent waypoints={sortedWaypoints} />
                          {sortedWaypoints.map((waypoint, index) => (
                            <VoyageDetailMarkerWithInfoWindow
                              key={`${waypoint.id}`}
                              index={index}
                              total={sortedWaypoints.length}
                              waypointTitle={waypoint.title}
                              position={{ lat: waypoint.latitude, lng: waypoint.longitude }}
                            />
                          ))}
                        </MapContainer>
                      </div>
                    ) : null}
                  </div>

                  <div style={voyageDetailsWaypointsContainerStyle_navigator}>
                    <VoyageDetailWaypointSwiper
                      waypoints={sortedWaypoints}
                      handlePanToLocation={handlePanToLocation}
                      opacity={opacity}
                      voyageImage={VoyageData.profileImage}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>
              </div>
            </div>

            <style>
              {`
                    .custom-scrollbar::-webkit-scrollbar {
                        background-color: #091b46;
                        background-color: transparent;
                        width: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: #1a3a8a;
                        background-color: transparent;
                        border-radius: 10px;
                    }
                `}
            </style>

          </header>
        </div>
      )}
      {/* Voyage report modal */}
      {voyageReportOpen && (
        <div style={vModalOverlay} onClick={() => setVoyageReportOpen(false)}>
          <div style={vModalBox} onClick={e => e.stopPropagation()}>
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
                  {VOYAGE_REPORT_REASONS.map(r => (
                    <div key={r} onClick={() => setVoyageSelectedReason(r)} style={vReasonItem(voyageSelectedReason === r)}>
                      {r}
                    </div>
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
    </>
  ) : null;
}

export default VoyageDetailsPage;

const spinnerContainer = {
  marginTop: "20%",
  display: "flex",
  justifyContent: "center",
};

const heartIconRed = {
  position: "absolute",
  backgroundColor: "white",
  right: "1rem",
  top: "-.50rem",
  borderRadius: "3rem",
  padding: "0.5rem",
  zIndex: 1000,
  border: "2px red solid",
};

const heartIconOrange = {
  position: "absolute",
  backgroundColor: "white",
  right: "1rem",
  top: "-.50rem",
  borderRadius: "3rem",
  padding: "0.5rem",
  zIndex: 1000,
  border: "2px orange solid",
};



const publicIconStyle = (borderColor, backgroundColor) => ({
  position: "absolute",
  // backgroundColor: "white",
  backgroundColor: backgroundColor,
  right: "4.5rem",
  top: "-.50rem",
  borderRadius: "3rem",
  padding: "0.5rem",
  zIndex: 1000,
  // border: `2px solid ${borderColor}`,
  borderWidth: "2px",
  borderColor: borderColor,
  borderStyle: "solid",
});


export const appStyle = {
  textAlign: "center",
};

export const appLogoStyle = {
  height: "40vmin",
  pointerEvents: "none",
};

export const appHeaderStyle = {
  backgroundColor: "transparent",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(10px + 2vmin)",
  color: "white",
  backgroundImage: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  margin: 0,
  height: "100vh",
};

export const appLinkStyle = {
  color: "#61dafb",
};

export const slideContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};

export const swiperButtonStyle = {
  backgroundSize: "3rem 3rem",
  width: "3rem",
  height: "3rem",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

export const swiperSlideInactiveStyle = {
  opacity: 0.7,
  filter: "brightness(0.8)",
  transition: "all 5s ease-in-out",
};

export const spinnerStyle = {
  border: "4px solid rgba(0, 0, 0, 0.1)",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  borderLeftColor: "#09f",
  animation: "spin 1s ease infinite",
  margin: "auto",
};

export const cardContainerStyle = {
  transform: "scale(0.3) translateY(0%)",
  opacity: 1,
  transition: "transform 0.3s ease-out, opacity 0.3s ease-out, visibility 0s linear 0.3s",
  transformOrigin: "bottom center",
  position: "relative",
  zIndex: 9999,
};

export const cardContainerVisibleStyle = {
  transform: "scale(1) translateY(0)",
  opacity: 1,
  transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
};

export const customPinStyle = {
  position: "relative",
  zIndex: 0,
};

export const buttonStyle = {
  width: "40%",
  backgroundColor: "#007bff",
  padding: "0.6rem",
  marginTop: "2rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1.4rem",
  border: "none",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

export const mainPageContainerStyle = {
  flexDirection: "column",
  width: "100%",
  height: "100vh",
};

export const mainPageTopRowStyle = {
  padding: "0.1rem",
  flexDirection: "row",
  backgroundColor: "#011a32",
};

export const mainPageTopRightStyle = {
  height: "3rem",
  width: "65%",
  alignItems: "center",
  justifyContent: "flex-end",
};

export const mainPageBottomRowStyle = {
  flexGrow: 1,
  width: "100%",
};

export const voyageDetailsBottomRightStyle_explorer = {
  height: "calc(100vh - 4rem)",
  width: "35%",
};

export const voyageDetailsBottomMiddleStyle_explorer = {
  height: "calc(100vh - 4rem)",
  width: "35%",
  flexDirection: "column",
  overflowY: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

export const voyageDetailsBottomLeftStyle_explorer = {
  height: "calc(100vh - 4rem)",
  width: "30%",
  flexDirection: "column",
  overflowY: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

export const voyageDetailsMapContainerStyle_explorer = {
  width: "100%",
  // padding: "0.2rem",
  height: "58vh",
};

export const voyageDetailsMapContainerStyle_navigator = {
  width: "100%",
  // padding: "0.2rem",
  height: "58vh",
};

export const voyageDetailsWaypointsContainerStyle_explorer = {
  flexGrow: 1,
  margin: 0,
  marginTop: "0.2rem",
  height: "auto",
  backgroundColor: "rgba(255,255,255,0.5)",
  borderRadius: "1rem",
};

export const voyageDetailsWaypointsContainerStyle_navigator = {
  flexGrow: 1,
  margin: 0,
  marginTop: "0.2rem",
  height: "auto",
  backgroundColor: "rgba(255,255,255,0.5)",
  borderRadius: "1rem",
};





export const voyageDetailsIconsRowStyle_explorer = {
  width: "calc(100% - 2rem)",
  marginLeft: "1rem",
  marginRight: "1rem",
  padding: "0.1rem",
};

export const voyageDetailsDescriptionStyle_explorer = {
  width: "98%",
  height: "50vh",
  marginLeft: 0,
  marginRight: 0,
};

export const voyageDetailsDescriptionStyle_navigator = {
  width: "calc(100% - 2rem)",
  marginLeft: "1rem",
  marginRight: "1rem",
  marginTop: "0.2rem",
  height: "auto",
};

export const voyageDetailsImagesStyle_explorer = {
  alignItems: "center",
  justifyContent: "center",
  width: "98%",
  margin: "auto",
  marginLeft: 0,
};

export const voyageDetailsImagesStyle_navigator = {
  width: "calc(100% - 2rem)",
  marginLeft: "1rem",
  marginRight: "1rem",
  marginTop: "0.2rem",
};

export const voyageDetailsBidsStyle_explorer = {
  margin: "0 1rem 0 1rem",
  padding: "0.3rem",
  paddingTop: 0,
};

export const voyageDetailsBidsStyle_navigator = {
  width: "calc(100% - 2rem)",
  marginLeft: "1rem",
  marginRight: "1rem",
  marginTop: "0.2rem",
  height: "auto",
};

export const voyageDetailsUpdatesStyle_navigator = {
  marginTop: "0.2rem",
  height: "auto",
};

export const voyageDetailsDetailsStyle_explorer = {
  width: "calc(100% - 2rem)",
  marginLeft: "1rem",
  marginRight: "1rem",
  padding: "0.3rem",
  height: "32vh",
};

export const voyageDetailsDetailsStyle_navigator = {
  width: "calc(100% - 2rem)",
  marginLeft: "1rem",
  marginRight: "1rem",
  marginTop: "0.2rem",
  height: "auto",
};

export const voyageDetailsBottomLeftStyle_navigator = {
  height: "calc(100vh - 3.5rem)",
  width: "50%",
  flexDirection: "column",
  overflowY: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

export const voyageDetailsBottomRightStyle_navigator = {
  height: "calc(100vh - 3.5rem)",
  width: "50%",
};

export const voyageDetailsIconsRowStyle_navigator = {
  width: "calc(100% - 2rem)",
  marginLeft: "1rem",
  marginRight: "1rem",
  // padding: "0.3rem",
};

const broadcastCardStyle_explorer = (dark) => ({
  display: "flex",
  flexDirection: "row",
  gap: "0.6rem",
  alignItems: "center",
  margin: "0.2rem 1rem",
  padding: "0.7rem 1rem",
  backgroundColor: dark ? "#0d2b4e" : "#fdf9f5",
  borderRadius: "1rem",
  boxSizing: "border-box",
  position: "relative",
  boxShadow: dark ? "0 4px 6px rgba(0,0,0,0.3), inset 0 -8px 6px rgba(0,0,0,0.2)" : "none",
  color: dark ? "rgba(255,255,255,0.9)" : "black",
});

const broadcastCardStyle_navigator = (dark) => ({
  display: "flex",
  flexDirection: "row",
  gap: "0.6rem",
  alignItems: "center",
  margin: "0.2rem 1rem",
  padding: "2rem 1rem",
  backgroundColor: dark ? "#0d2b4e" : "#fdf9f5",
  borderRadius: "1rem",
  boxSizing: "border-box",
  position: "relative",
  boxShadow: dark ? "0 4px 6px rgba(0,0,0,0.3), inset 0 -8px 6px rgba(0,0,0,0.2)" : "none",
  color: dark ? "rgba(255,255,255,0.9)" : "black",
});

const broadcastInputStyle = (dark, active) => ({
  flex: 1,
  minWidth: 0,
  height: "2.8rem",
  padding: "0.4rem 1rem",
  fontSize: "1rem",
  color: dark ? "rgba(255,255,255,0.9)" : "black",
  backgroundColor: dark ? "#0d2b4e" : "white",
  overflowY: "hidden",
  resize: "none",
  borderRadius: "2rem",
  border: active ? "2px solid rgba(0,119,234,0.4)" : dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070",
  outline: "none",
  fontFamily: "inherit",
});

const broadcastBtnStyle = {
  width: "5rem",
  height: "2.8rem",
  fontSize: "0.9rem",
  fontWeight: "bold",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "2rem",
  cursor: "pointer",
};

const broadcastEmojiBtnStyle = (dark, active) => ({
  background: "none",
  border: active ? "2px solid rgba(0,119,234,0.4)" : dark ? "2px solid rgba(255,255,255,0.15)" : "2px solid #c0c0c070",
  cursor: "pointer",
  padding: 0,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  overflow: "hidden",
  flexShrink: 0,
});

const broadcastEmojiPanelStyle = (dark) => ({
  position: "absolute",
  bottom: "calc(100% + 8px + 2vh)",
  left: "-1vw",
  width: "calc(30vw - 2.6rem)",
  height: "30rem",
  display: "flex",
  flexDirection: "column",
  backgroundColor: dark ? "#0a2745" : "white",
  border: dark ? "1px solid #1a4a7a" : "1px solid #dde8f5",
  borderRadius: "1rem",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  zIndex: 999,
  overflow: "hidden",
});

const broadcastEmojiSearchInputStyle = (dark) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "0.4rem 0.9rem",
  borderRadius: "2rem",
  border: dark ? "1px solid #1a4a7a" : "1px solid #cce0f5",
  backgroundColor: dark ? "#011a32" : "#f5f8ff",
  color: dark ? "white" : "black",
  fontSize: "1.1rem",
  outline: "none",
});


const vModalOverlay = {
  position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000,
};

const vModalBox = {
  backgroundColor: "white", borderRadius: "16px", padding: "2rem",
  width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
};

const vModalTitle = {
  fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem",
};

const vModalSubtitle = {
  fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem",
};

const vReasonItem = (selected) => ({
  padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem",
  backgroundColor: selected ? "#eff6ff" : "#f8fafc",
  color: selected ? "#1d4ed8" : "#334155",
  fontWeight: selected ? 700 : 400,
  border: selected ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
});

const vModalPrimaryBtn = {
  flex: 1, padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none",
  backgroundColor: "#dc2626", color: "white", fontWeight: 700,
  fontSize: "0.9rem", cursor: "pointer",
};

const vModalCancelBtn = {
  flex: 1, padding: "0.6rem 1.2rem", borderRadius: "8px",
  border: "1px solid #e2e8f0", backgroundColor: "white",
  color: "#475569", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
};

const ownerDeletedNoticeStyle = {
  position: "absolute", top: "2rem", left: "1rem", right: "1rem",
  backgroundColor: "rgba(203,4,4,0.55)", borderRadius: "0.5rem",
  borderLeft: "3px solid #cb0404", padding: "0.75rem 1rem",
  zIndex: 10, color: "white", fontSize: "1.1rem", lineHeight: 1.5,
  fontWeight: 600, textAlign: "left", width: "75%", margin: "auto"
};

const VoyageUpdatesSectionExplorer = ({ updates, voyageId, isOwner, isDarkMode }) => {
  const [text, setText] = useState("");
  const [addVoyageUpdate, { isLoading }] = useAddVoyageUpdateMutation();
  const [localUpdates, setLocalUpdates] = useState(updates || []);

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
    <div style={{
      padding: "1rem 1.5rem", marginTop: "0.3rem",
      backgroundColor: isDarkMode ? "#0f2744" : "white",
      borderRadius: "1rem", width: "98%", marginLeft: 0, marginRight: 0,
      boxSizing: "border-box", position: "relative", zIndex: 10
    }}>
      <div style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.75rem", color: "#2ac898", textAlign: "left", marginLeft: "1.3rem" }}>
        Updates
      </div>
      <div style={{ marginLeft: "1.3rem", marginRight: "0.5rem" }}>
        {localUpdates.length === 0 && (
          <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0.75rem" }}>No updates yet.</div>
        )}
        {localUpdates.map((u) => (
          <div key={u.id} style={{
            padding: "0.5rem 0.9rem",
            borderLeft: "3px solid #2ac898",
            background: isDarkMode ? "linear-gradient(to right, rgba(42,200,152,0.15), rgba(42,200,152,0.03))" : "linear-gradient(to right, rgba(42,200,152,0.12), transparent)",
            marginBottom: "0.6rem",
            boxSizing: "border-box",
            borderRadius: "0 0.5rem 0.5rem 0",
          }}>
            <div style={{ fontSize: "0.75rem", color: isDarkMode ? "rgba(255,255,255,0.4)" : "#64748b", marginBottom: "0.2rem", textAlign: "right" }}>
              {new Date(u.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </div>
            <div style={{ fontSize: "0.95rem", color: isDarkMode ? "rgba(255,255,255,0.85)" : "darkblue", wordBreak: "break-word", textAlign: "left" }}>{u.text}</div>
          </div>
        ))}
        {isOwner && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Write an update..."
              style={{ ...broadcastInputStyle(isDarkMode, false), height: "auto", borderRadius: "1rem", width: "100%", boxSizing: "border-box" }}
            />
            <button onClick={handleSubmit} disabled={isLoading || !text.trim()} style={{ backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "2rem", padding: "0.4rem 1.2rem", cursor: text.trim() ? "pointer" : "default", fontSize: "0.9rem", fontWeight: "bold", opacity: (isLoading || !text.trim()) ? 0.5 : 1, alignSelf: "flex-start" }}>
              {isLoading ? "Posting…" : "Post"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const VoyageUpdatesSectionNavigator = ({ updates, voyageId, isOwner, isDarkMode }) => {
  const [text, setText] = useState("");
  const [addVoyageUpdate, { isLoading }] = useAddVoyageUpdateMutation();
  const [localUpdates, setLocalUpdates] = useState(updates || []);

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
    <div style={{
      padding: "1rem", marginTop: 0,
      backgroundColor: isDarkMode ? "#0f2744" : "white",
      borderRadius: "1rem", width: "calc(100% - 2rem)", marginLeft: "1rem", marginRight: "1rem",
      boxSizing: "border-box", position: "relative", zIndex: 10
    }}>
      <div style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.75rem", color: "#2ac898", textAlign: "left", marginLeft: "1.3rem" }}>
        Updates
      </div>
      <div style={{ marginLeft: "1.3rem", marginRight: "0.5rem" }}>
        {localUpdates.length === 0 && (
          <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0.75rem" }}>No updates yet.</div>
        )}
        {localUpdates.map((u) => (
          <div key={u.id} style={{
            padding: "0.5rem 0.9rem",
            borderLeft: "3px solid #2ac898",
            background: isDarkMode ? "linear-gradient(to right, rgba(42,200,152,0.15), rgba(42,200,152,0.03))" : "linear-gradient(to right, rgba(42,200,152,0.12), transparent)",
            marginBottom: "0.6rem",
            boxSizing: "border-box",
            borderRadius: "0 0.5rem 0.5rem 0",
          }}>
            <div style={{ fontSize: "0.75rem", color: isDarkMode ? "rgba(255,255,255,0.4)" : "#64748b", marginBottom: "0.2rem", textAlign: "right" }}>
              {new Date(u.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </div>
            <div style={{ fontSize: "0.95rem", color: isDarkMode ? "rgba(255,255,255,0.85)" : "darkblue", wordBreak: "break-word", textAlign: "left" }}>{u.text}</div>
          </div>
        ))}
        {isOwner && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Write an update..."
              style={{ ...broadcastInputStyle(isDarkMode, false), height: "auto", borderRadius: "1rem", width: "100%", boxSizing: "border-box" }}
            />
            <button onClick={handleSubmit} disabled={isLoading || !text.trim()} style={{ backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "2rem", padding: "0.4rem 1.2rem", cursor: text.trim() ? "pointer" : "default", fontSize: "0.9rem", fontWeight: "bold", opacity: (isLoading || !text.trim()) ? 0.5 : 1, alignSelf: "flex-start" }}>
              {isLoading ? "Posting…" : "Post"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
