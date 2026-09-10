/* eslint-disable no-undef */
import "../assets/css/App.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useLazyGetVoyagesByLocationQuery,
  useLazyGetFilteredVoyagesQuery,
} from "../slices/VoyageSlice";
import {
  updateUserFavorites,
  useLazyGetFavoriteVehicleIdsByUserIdQuery,
  useLazyGetFavoriteVoyageIdsByUserIdQuery,
} from "../slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { MapContainer, TileLayer } from "react-leaflet";
import { MainPageFiltersComponent } from "../components/MainPageFiltersComponent";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { MainPageMapPanComponent } from "../components/MainPageMapPanComponent";
import { ClusteredVoyageMarkers } from "../components/MainPageClusteredParrots";
import { convertDateFormat } from "../components/ConvertDateFormat";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { MainPageRefreshButtonNew } from "../components/MainPageRefreshButtonNew";
import { PulsatingParrotLogo } from "../components/PulsatingParrotLogo";
import { MainPageV2VoyageCard } from "../components/MainPageV2VoyageCard";

const tileAttribution = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const navy   = "#0A2540";
const blue   = "#0A77EA";
const faint  = "#8B98A5";
const dmid   = "#5C6B7A";
const tint   = "#F4F7FB";

function MainPage() {
  console.log("entered MainPage");
  const userId      = localStorage.getItem("storedUserId");
  const maptilerKey = process.env.REACT_APP_MAPTILER_KEY;
  const navigate    = useNavigate();

  const [initialLatitude,  setInitialLatitude]  = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [calendarOpen,     setCalendarOpen]     = useState(false);
  const [isLoading,        setIsLoading]        = useState(false);
  const [initialVoyages,   setInitialVoyages]   = useState([]);
  const [locationError,    setLocationError]    = useState(null);
  const [targetLocation,   setTargetLocation]   = useState({});
  const [dates,            setDates]            = useState({ from: undefined, to: undefined });
  const [selectedVacancy,  setSelectedVacancy]  = useState();
  const [selectedVehicle,  setSelectedVehicle]  = useState();
  const [bounds,           setBounds]           = useState(null);
  const [initialBounds,    setInitialBounds]    = useState(null);
  const [locationReady,    setLocationReady]    = useState(false);

  const dispatch = useDispatch();

  const [getVoyagesByLocation, { isError: isErrorVoyages, isSuccess: isSuccessVoyages }]         = useLazyGetVoyagesByLocationQuery();
  const [getFilteredVoyages,   { isError: isErrorVoyagesFiltered, isLoading: isLoadingFiltered }] = useLazyGetFilteredVoyagesQuery();
  const [getFavoriteVehicleIdsByUserId, { data: favoriteVehiclesData, isError: isErrorFavVehicles }] = useLazyGetFavoriteVehicleIdsByUserIdQuery();
  const [getFavoriteVoyageIdsByUserId,  { data: favoriteVoyagesData,  isError: isErrorFavVoyages  }] = useLazyGetFavoriteVoyageIdsByUserIdQuery();

  useEffect(() => {
    const token = localStorage.getItem("storedToken");
    if (token && userId) {
      getFavoriteVehicleIdsByUserId(userId);
      getFavoriteVoyageIdsByUserId(userId);
    }
  }, [userId, getFavoriteVehicleIdsByUserId, getFavoriteVoyageIdsByUserId]);

  const lastAppliedRef = useRef(null);

  const runFilter = useCallback(async (filterDates, filterVehicle, filterVacancy) => {
    if (!bounds) return;
    const data = {
      latitude:            (bounds.lat.northEast + bounds.lat.southWest) / 2,
      longitude:           (bounds.lng.northEast + bounds.lng.southWest) / 2,
      latitudeDelta:       (bounds.lat.northEast - bounds.lat.southWest) * 0.9,
      longitudeDelta:      (bounds.lng.northEast - bounds.lng.southWest) * 0.9,
      count:               filterVacancy ?? 1,
      selectedVehicleType: filterVehicle,
      formattedStartDate:  convertDateFormat(filterDates?.from, "startDate"),
      formattedEndDate:    convertDateFormat(filterDates?.to,   "endDate"),
    };
    const result = await getFilteredVoyages(data);
    setInitialVoyages(result.data || []);
  }, [bounds, getFilteredVoyages]);

  // Called from the filter's Apply button — uses current selections and saves them
  const applyFilter = useCallback(() => {
    lastAppliedRef.current = { dates, vehicle: selectedVehicle, vacancy: selectedVacancy };
    runFilter(dates, selectedVehicle, selectedVacancy);
  }, [dates, selectedVehicle, selectedVacancy, runFilter]);

  // Called from the Refresh button — uses last applied values, or empty filters if Apply was never pressed
  const refreshFilter = useCallback(() => {
    const { dates: d, vehicle: v, vacancy: vc } = lastAppliedRef.current ?? { dates: { from: undefined, to: undefined }, vehicle: undefined, vacancy: undefined };
    runFilter(d, v, vc);
  }, [runFilter]);

  const handlePanToLocation = (lat, lng) => setTargetLocation({ lat, lng });

  const FALLBACK_LAT = 52.20551962389507;
  const FALLBACK_LNG = 0.11798991656591876;

  useEffect(() => {
    if (!navigator.geolocation) {
      setInitialLatitude(FALLBACK_LAT); setInitialLongitude(FALLBACK_LNG);
      handlePanToLocation(FALLBACK_LAT, FALLBACK_LNG); setLocationReady(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setInitialLatitude(latitude); setInitialLongitude(longitude);
        handlePanToLocation(latitude, longitude); setLocationReady(true);
      },
      () => {
        setInitialLatitude(FALLBACK_LAT); setInitialLongitude(FALLBACK_LNG);
        handlePanToLocation(FALLBACK_LAT, FALLBACK_LNG); setLocationReady(true);
        setLocationError("Location blocked — using default location.");
      }
    );
  }, []);

  useEffect(() => {
    if (!initialBounds) return;
    const { lat, lng } = initialBounds;
    (async () => {
      try {
        setIsLoading(true);
        const res = await getVoyagesByLocation({ lon1: lng.southWest, lon2: lng.northEast, lat1: lat.southWest, lat2: lat.northEast });
        setInitialVoyages(res?.data || []);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    })();
  }, [getVoyagesByLocation, initialBounds]);

  useEffect(() => {
    dispatch(updateUserFavorites({ favoriteVehicles: favoriteVehiclesData, favoriteVoyages: favoriteVoyagesData }));
  }, [favoriteVehiclesData, favoriteVoyagesData, dispatch]);

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;
  if (isErrorVoyages || isErrorVoyagesFiltered || isErrorFavVehicles || isErrorFavVoyages) return <SomethingWentWrong />;

  const tileUrl = `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${maptilerKey}`;

  const isLoadingList = isLoading || isLoadingFiltered;

  return (
    <div className="App">
      <header className="App-header">
        <div style={pageWrap}>

          {/* ── Top nav ── */}
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>

          {/* ── Map + List ── */}
          <div style={lowRow}>

            {/* Map */}
            <div style={mapPanel}>
              {!initialLatitude ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <PulsatingParrotLogo size={100} />
                </div>
              ) : (
                <div style={{ position: "relative", height: "100%", width: "100%" }}>
                  <MapContainer center={[initialLatitude, initialLongitude]} zoom={11}
                    style={{ height: "100%", width: "100%" }} zoomControl={false} scrollWheelZoom={true}>
                    <TileLayer url={tileUrl} attribution={tileAttribution} />
                    <MainPageMapPanComponent
                      setBounds={setBounds} setInitialBounds={setInitialBounds}
                      locationReady={locationReady}
                      targetLat={targetLocation?.lat} targetLng={targetLocation?.lng}
                    />
                    {isSuccessVoyages && initialVoyages?.length > 0 && (
                      <ClusteredVoyageMarkers voyages={initialVoyages} />
                    )}
                  </MapContainer>

                  {/* Filter overlay at top of map */}
                  <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1000, padding: "10px 10px 0" }}>
                    <MainPageFiltersComponent
                      dates={dates} setDates={setDates}
                      selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle}
                      selectedVacancy={selectedVacancy} setSelectedVacancy={setSelectedVacancy}
                      applyFilter={applyFilter}
                      calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen}
                    />
                  </div>

                  {isLoadingList && (
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                      <MapSpinner />
                    </div>
                  )}

                  {locationError && (
                    <div style={locationBanner}>
                      📍 {locationError}
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, zIndex: 1000, width: "100%" }}>
                    <MainPageRefreshButtonNew applyFilter={refreshFilter} />
                  </div>
                </div>
              )}
            </div>

            {/* Voyage list panel */}
            <div style={listPanel}>
              {/* Panel header */}
              <div style={listHeader}>
                <span style={{ ...listLabel, paddingLeft: "1rem" }}>Voyages in view</span>
                {!isLoadingList && (
                  <span style={{ ...countBadge, marginLeft: "2rem" }}>{initialVoyages.length}</span>
                )}
              </div>

              {/* Cards */}
              <div style={listScroll}>
                {isLoadingList ? (
                  <div style={{ display: "flex", justifyContent: "center", paddingTop: "3rem" }}>
                    <PulsatingParrotLogo size={80} />
                  </div>
                ) : initialVoyages.length === 0 ? (
                  <EmptyState navigate={navigate} />
                ) : (
                  initialVoyages.map((v, i) => (
                    <MainPageV2VoyageCard key={v.publicId || i} cardData={v} panToLocation={handlePanToLocation} />
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

export default MainPage;

// ── Sub-components ───────────────────────────────────────────────────────────

const EmptyState = ({ navigate }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "3px", padding: "22px 20px 30px" }}>
    <PulsatingParrotLogo size={112} style={{ animation: "none", opacity: 0.55, marginBottom: "8px" }} />
    <div style={{ fontFamily: "Nunito", fontSize: "17px", fontWeight: 800, color: navy, letterSpacing: "-.01em" }}>
      No voyages here
    </div>
    <div style={{ fontFamily: "Nunito", fontSize: "15px", fontWeight: 800, color: blue, lineHeight: 1.4 }}>
      Why not post one —{" "}
      <span style={{ color: "#E8622A", cursor: "pointer", textDecoration: "none" }} onClick={() => navigate("/NewVoyage")}>
        New Voyage
      </span>
    </div>
  </div>
);

const MapSpinner = () => (
  <div style={{ height: "100%", width: "100%", position: "relative" }}>
    <div className="spinner" style={{ position: "absolute", top: "40%", left: "50%", height: "5rem", width: "5rem", border: "8px solid rgba(173,216,230,0.3)", borderTop: "8px solid #1e90ff" }} />
  </div>
);

// ── Layout styles ─────────────────────────────────────────────────────────────

const pageWrap = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
  gap: "0",
  padding: "0 0 12px",
};

const lowRow = {
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) 380px",
  gap: "11px",
  flex: 1,
  minHeight: 0,
  padding: "8px 12px 0",
};

const mapPanel = {
  borderRadius: "12px",
  overflow: "hidden",
  minWidth: 0,
  height: "100%",
};

const listPanel = {
  width: "380px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
};

const listHeader = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "11px 13px 9px",
  flexShrink: 0,
  borderBottom: "1px solid #f0f4f8",
};

const listLabel = {
  fontFamily: "Nunito, sans-serif",
  fontSize: "9.5px",
  fontWeight: 800,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: faint,
};

const countBadge = {
  fontFamily: "Nunito, sans-serif",
  fontSize: "10px",
  fontWeight: 800,
  color: "#fff",
  backgroundColor: blue,
  padding: "3px 9px",
  borderRadius: "99px",
};

const sortBtn = {
  fontFamily: "Nunito, sans-serif",
  backgroundColor: tint,
  border: "none",
  color: dmid,
  fontSize: "11px",
  fontWeight: 800,
  padding: "4px 9px",
  borderRadius: "7px",
  cursor: "pointer",
};

const newVoyageBtn = {
  fontFamily: "Nunito, sans-serif",
  backgroundColor: blue,
  border: "none",
  color: "#fff",
  fontSize: "11px",
  fontWeight: 800,
  padding: "4px 10px",
  borderRadius: "99px",
  cursor: "pointer",
};

const listScroll = {
  flex: 1,
  overflowY: "auto",
  padding: "8px 11px 11px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  scrollbarWidth: "thin",
  scrollbarColor: "#DDE4EC transparent",
};

const locationBanner = {
  position: "absolute",
  top: 10,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
  backgroundColor: "rgba(0,0,0,0.6)",
  color: "white",
  borderRadius: 20,
  padding: "6px 14px",
  fontSize: 13,
  whiteSpace: "nowrap",
  fontFamily: "Nunito, sans-serif",
  fontWeight: 600,
};
