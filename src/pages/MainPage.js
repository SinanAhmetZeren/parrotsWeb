/* eslint-disable no-undef */
import "../assets/css/App.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { MainPageCardSwiper } from "../components/MainPageCardSwiper";
import {
  useLazyGetVoyagesByLocationQuery,
  useLazyGetFilteredVoyagesQuery
} from "../slices/VoyageSlice";
import {
  updateUserFavorites,
  useLazyGetFavoriteVehicleIdsByUserIdQuery,
  useLazyGetFavoriteVoyageIdsByUserIdQuery,
} from "../slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { TopBarMenu } from "../components/TopBarMenu";
import { MapContainer, TileLayer } from "react-leaflet";
import { MainPageFiltersComponent } from "../components/MainPageFiltersComponent";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { MainPageNewVoyageButton } from "../components/MainPageNewVoyageButton";
import { MainPageMapPanComponent } from "../components/MainPageMapPanComponent";
import { ClusteredVoyageMarkers } from "../components/MainPageClusteredParrots";
import { convertDateFormat } from "../components/ConvertDateFormat";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { MapTypeButton } from "../components/MapTypeButton";
import { MainPageRefreshButtonNew } from "../components/MainPageRefreshButtonNew";

const tileAttribution = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

function MainPage() {
  const userId = localStorage.getItem("storedUserId");
  const maptilerKey = process.env.REACT_APP_MAPTILER_KEY;

  const [initialLatitude, setInitialLatitude] = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialVoyages, setInitialVoyages] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [targetLocation, setTargetLocation] = useState({});
  const [dates, setDates] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);
  const [selectedVacancy, setSelectedVacancy] = useState();
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [bounds, setBounds] = useState(null);
  const [initialBounds, setInitialBounds] = useState(null);
  const [mapTypeId, setMapTypeId] = useState("hybrid");

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.users.isDarkMode);
  const [
    getVoyagesByLocation,
    { isError: isErrorVoyages, isLoading: isLoadingVoyages, isSuccess: isSuccessVoyages },
  ] = useLazyGetVoyagesByLocationQuery();
  const [
    getFilteredVoyages,
    { isError: isErrorVoyagesFiltered, isLoading: isLoadingVoyagesFiltered, isSuccess: isSuccessVoyagesFiltered },
  ] = useLazyGetFilteredVoyagesQuery();

  const [
    getFavoriteVehicleIdsByUserId,
    { data: favoriteVehiclesData, isError: isErrorFavoriteVehicles },
  ] = useLazyGetFavoriteVehicleIdsByUserIdQuery();

  const [
    getFavoriteVoyageIdsByUserId,
    { data: favoriteVoyagesData, isError: isErrorFavoriteVoyages },
  ] = useLazyGetFavoriteVoyageIdsByUserIdQuery();

  useEffect(() => {
    const token = localStorage.getItem("storedToken");
    if (token && userId) {
      getFavoriteVehicleIdsByUserId(userId);
      getFavoriteVoyageIdsByUserId(userId);
    }
  }, [userId, getFavoriteVehicleIdsByUserId, getFavoriteVoyageIdsByUserId]);

  const applyFilter = useCallback(async () => {
    const formattedStartDate = convertDateFormat(dates.startDate, "startDate");
    const formattedEndDate = convertDateFormat(dates.endDate, "endDate");
    const data = {
      latitude: (bounds.lat.northEast + bounds.lat.southWest) / 2,
      longitude: (bounds.lng.northEast + bounds.lng.southWest) / 2,
      latitudeDelta: (bounds.lat.northEast - bounds.lat.southWest) * 0.9,
      longitudeDelta: (bounds.lng.northEast - bounds.lng.southWest) * 0.9,
      count: selectedVacancy ?? 1,
      selectedVehicleType: selectedVehicle,
      formattedStartDate: formattedStartDate,
      formattedEndDate: formattedEndDate,
    };
    const filteredVoyages = await getFilteredVoyages(data);
    setInitialVoyages(filteredVoyages.data || []);
  }, [bounds, dates.startDate, dates.endDate, selectedVacancy, selectedVehicle, getFilteredVoyages]);

  const handlePanToLocation = (lat, lng) => {
    setTargetLocation({ lat, lng });
  };

  // Get location from browser
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialLatitude(latitude);
          setInitialLongitude(longitude);
          setLocationError(null);
          handlePanToLocation(latitude, longitude);
        },
        (error) => {
          console.error(error.message);
          setLocationError("Unable to retrieve your location.");
          setTimeout(() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setInitialLatitude(latitude);
                setInitialLongitude(longitude);
                setLocationError(null);
                handlePanToLocation(latitude, longitude);
              },
              (err) => {
                console.error("Retry failed:", err.message);
                setLocationError("Still unable to retrieve your location.");
              }
            );
          }, 5000);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch initial voyages once map bounds are set
  useEffect(() => {
    const getInitialVoyagesAfterLocation = async () => {
      if (!initialBounds) return;
      const { lat, lng } = initialBounds;
      const lat1 = lat.southWest;
      const lat2 = lat.northEast;
      const lon1 = lng.southWest;
      const lon2 = lng.northEast;

      try {
        setIsLoading(true);
        const voyages = await getVoyagesByLocation({ lon1, lon2, lat1, lat2 });
        setInitialVoyages(voyages?.data || []);
      } catch (error) {
        console.error("Error fetching voyages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getInitialVoyagesAfterLocation();
  }, [getVoyagesByLocation, initialBounds]);

  // Update favorite vehicles and voyages in local storage
  useEffect(() => {
    dispatch(
      updateUserFavorites({
        favoriteVehicles: favoriteVehiclesData,
        favoriteVoyages: favoriteVoyagesData,
      })
    );
  }, [favoriteVehiclesData, favoriteVoyagesData, dispatch]);

  const { data: healthCheckData, isError: isHealthCheckError } = useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (isErrorVoyages || isErrorVoyagesFiltered || isErrorFavoriteVehicles || isErrorFavoriteVoyages) {
    return <SomethingWentWrong />;
  }

  const tileUrl = mapTypeId === "roadmap"
    ? `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${maptilerKey}`
    : `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${maptilerKey}`;

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
          <div className="flex mainpage_BottomRow">
            <div className="flex mainpage_BottomLeft">
              <div>
                <MainPageFiltersComponent
                  dates={dates}
                  setDates={setDates}
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                  selectedVacancy={selectedVacancy}
                  setSelectedVacancy={setSelectedVacancy}
                  applyFilter={applyFilter}
                  calendarOpen={calendarOpen}
                  setCalendarOpen={setCalendarOpen}
                  isDarkMode={isDarkMode}
                />
              </div>
              <div style={{ height: "60vh" }}>
                {isLoading || isLoadingVoyagesFiltered ? (
                  <CardSwiperSpinner />
                ) : (
                  <MainPageCardSwiper
                    voyagesData={initialVoyages}
                    panToLocation={handlePanToLocation}
                    setCalendarOpen={setCalendarOpen}
                    calendarOpen={calendarOpen}
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
              <MainPageNewVoyageButton />
            </div>

            <div className="flex mainpage_BottomRight">
              <div className="flex mainpage_MapContainer">
                {!initialLatitude ? (
                  <div className={"cardSwiperSpinner"}></div>
                ) : (
                  <div style={{ position: "relative", height: "100%", width: "100%" }}>
                    <MapContainer
                      center={[initialLatitude, initialLongitude]}
                      zoom={11}
                      style={{ height: "100%", width: "100%" }}
                      zoomControl={false}
                      scrollWheelZoom={true}
                    >
                      <TileLayer url={tileUrl} attribution={tileAttribution} />
                      <MainPageMapPanComponent
                        setBounds={setBounds}
                        setInitialBounds={setInitialBounds}
                        targetLat={targetLocation?.lat}
                        targetLng={targetLocation?.lng}
                      />
                      {isSuccessVoyages && initialVoyages?.length > 0 && (
                        <ClusteredVoyageMarkers voyages={initialVoyages} />
                      )}
                    </MapContainer>
                    {(isLoading || isLoadingVoyagesFiltered) && (
                      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                        <MapSpinner />
                      </div>
                    )}
                    <div style={{ position: "absolute", top: 0, right: 0, zIndex: 1000 }}>
                      <MapTypeButton mapTypeId={mapTypeId} setMapTypeId={setMapTypeId} />
                    </div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, zIndex: 1000, width: "100%" }}>
                      <MainPageRefreshButtonNew applyFilter={applyFilter} />
                    </div>
                  </div>
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

const CardSwiperSpinner = () => (
  <div style={{
    backgroundColor: "rgba(255,255,255,.05)", height: "100%", width: "92%",
    padding: "1vh", borderRadius: "1.5rem", position: "relative",
    margin: "auto", marginTop: "1rem",
  }}>
    <div className="spinner" style={{
      position: "absolute", top: "40%", left: "50%",
      height: "5rem", width: "5rem",
      border: "8px solid rgba(173,216,230,0.3)", borderTop: "8px solid #1e90ff",
    }}></div>
  </div>
);

const MapSpinner = () => (
  <div style={{
    backgroundColor: "rgba(255,255,255,0.05)", height: "100%", width: "100%",
    borderRadius: "1.5rem", position: "relative",
  }}>
    <div className="spinner" style={{
      position: "absolute", top: "40%", left: "50%",
      height: "5rem", width: "5rem",
      border: "8px solid rgba(173,216,230,0.3)", borderTop: "8px solid #1e90ff",
    }}></div>
  </div>
);
