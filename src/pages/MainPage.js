/* eslint-disable no-undef */
import "../assets/css/App.css";
import "../assets/css/advancedmarker.css";
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
import { useDispatch } from "react-redux";
import { TopBarMenu } from "../components/TopBarMenu";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { MainPageFiltersComponent } from "../components/MainPageFiltersComponent";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { MainPageNewVoyageButton } from "../components/MainPageNewVoyageButton";
import { MarkerWithInfoWindow } from "../components/MainPageMarkerWithInfoWindow";
import { MainPageMapPanComponent } from "../components/MainPageMapPanComponent";
import { ClusteredVoyageMarkers } from "../components/MainPageClusteredParrots";
import { convertDateFormat } from "../components/ConvertDateFormat";
import { MainPageRefreshButton } from "../components/MainPageRefreshButton";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";

function MainPage() {
  const userId = localStorage.getItem("storedUserId");
  // const myApiKey2 = "AIzaSyAsqIXNMISkZ0prGc2iTLbiQk0QBtgq0";
  const myApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  console.log("===>>", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
  const [initialLatitude, setInitialLatitude] = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialVoyages, setInitialVoyages] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [targetLocation, setTargetLocation] = useState({});
  const markerClustererRef = useRef(null);
  const markersRef = useRef([]);
  const [dates, setDates] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [selectedVacancy, setSelectedVacancy] = useState();
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [bounds, setBounds] = useState(null);
  const [initialBounds, setInitialBounds] = useState(null);
  const hasMapInitialized = useRef(false);

  const dispatch = useDispatch();
  const [
    getVoyagesByLocation,
    {
      isError: isErrorVoyages,
      isLoading: isLoadingVoyages,
      isSuccess: isSuccessVoyages,
    },
  ] = useLazyGetVoyagesByLocationQuery();
  const [
    getFilteredVoyages,
    {
      isError: isErrorVoyagesFiltered,
      isLoading: isLoadingVoyagesFiltered,
      isSuccess: isSuccessVoyagesFiltered,
    },
  ] = useLazyGetFilteredVoyagesQuery();


  const [
    getFavoriteVehicleIdsByUserId,
    {
      data: favoriteVehiclesData,
      error: favoriteVehiclesError,
      isError: isErrorFavoriteVehicles,
    },
  ] = useLazyGetFavoriteVehicleIdsByUserIdQuery();

  const [
    getFavoriteVoyageIdsByUserId,
    {
      data: favoriteVoyagesData,
      error: favoriteVoyagesError,
      isError: isErrorFavoriteVoyages,
    },
  ] = useLazyGetFavoriteVoyageIdsByUserIdQuery();

  useEffect(() => {
    const token = localStorage.getItem("storedToken");
    if (token) {
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
    console.log("---> filtered: ");
    console.log(filteredVoyages.data);
    setInitialVoyages(filteredVoyages.data || []);
    console.log("bounds: ", bounds);
  }, [
    bounds,
    dates.startDate,
    dates.endDate,
    selectedVacancy,
    selectedVehicle,
    getFilteredVoyages,
  ]);

  const handlePanToLocation = (lat, lng) => {
    setTargetLocation({ lat, lng });
  };


  // get location from browser
  useEffect(() => {
    const sapancaLocation = {
      latitude: 40.6940695769,
      longitude: 30.212527026,
    };
    const selectedLocation = 1;

    if (selectedLocation === 0) {
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
    } else {
      let location;
      if (selectedLocation === 1) location = sapancaLocation;
      const { latitude, longitude } = location;
      setInitialLatitude(latitude);
      setInitialLongitude(longitude);
      setLocationError(null);
      handlePanToLocation(latitude, longitude);
    }
  }, []);

  // get initial voyages using initial location and deltas
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
        // console.log("get voyages by location:", lat1, lon1, lat2, lon2);
        setInitialVoyages(voyages?.data || []);
      } catch (error) {
        console.error("Error fetching voyages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getInitialVoyagesAfterLocation();
  }, [getVoyagesByLocation, initialBounds]);

  // renders markers
  useEffect(() => {
    if (isSuccessVoyages) {
      markersRef.current = [];
      console.log("initial voyages: ", initialVoyages);
      const newMarkers = initialVoyages
        .map((voyage, index) => {
          const waypoint = voyage.waypoints?.[0];
          if (!waypoint) {
            return null;
          }

          return (
            <MarkerWithInfoWindow
              key={`${voyage.waypoints[0].latitude}-${index}`}
              index={index}
              position={{
                lat: waypoint.latitude,
                lng: waypoint.longitude,
              }}
              voyage={voyage}
              onClick={() => {
                handlePanToLocation(
                  voyage.waypoints[0].latitude,
                  voyage.waypoints[0].longitude
                );
              }}
            />
          );
        })
        .filter(Boolean);

      if (!markerClustererRef.current) {
        // console.log("Initializing new MarkerClusterer");
        markerClustererRef.current = new MarkerClusterer({
          // map: mapRef.current,
          markers: newMarkers,
        });
      } else {
        // console.log("Updating existing MarkerClusterer");
        markerClustererRef.current.clearMarkers();
        markerClustererRef.current.addMarkers(newMarkers);
      }

      markersRef.current = newMarkers;
      // console.log("markersRef.current updated:", markersRef.current);
    }
  }, [initialVoyages, isSuccessVoyages]);


  // update favorite vehicles and voyages in local storage with api data
  useEffect(() => {
    const updateFavorites = () => {
      dispatch(
        updateUserFavorites({
          favoriteVehicles: favoriteVehiclesData,
          favoriteVoyages: favoriteVoyagesData,
        })
      );
    };
    updateFavorites();
  }, [favoriteVehiclesData, favoriteVoyagesData, dispatch]);

  function MapInitialBoundsComponent({ setInitialBounds }) {
    const map = useMap();
    useEffect(() => {
      if (!map || hasMapInitialized.current) return;
      const onLoadBounds = map.getBounds();
      if (!onLoadBounds) return;
      const northEast = onLoadBounds.getNorthEast();
      const southWest = onLoadBounds.getSouthWest();
      setInitialBounds({
        lat: {
          northEast: northEast.lat(),
          southWest: southWest.lat(),
        },
        lng: {
          northEast: northEast.lng(),
          southWest: southWest.lng(),
        },
      });
      // console.log("onLoadBounds - Lat: ", onLoadBounds.getNorthEast().lat(), onLoadBounds.getSouthWest().lat());
      hasMapInitialized.current = true;
    }, [map, setInitialBounds]);
    return null;
  }

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (
    isErrorVoyages ||
    isErrorVoyagesFiltered ||
    isErrorFavoriteVehicles ||
    isErrorFavoriteVoyages
  ) {
    return <SomethingWentWrong />;
  }

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
                />
              </div>
              <div style={{ height: "60vh" }}>
                {isLoading ? (
                  <CardSwiperSpinner />
                ) : (
                  <MainPageCardSwiper
                    voyagesData={initialVoyages}
                    panToLocation={handlePanToLocation}
                    setCalendarOpen={setCalendarOpen}
                    calendarOpen={calendarOpen}
                  />
                )}
              </div>
              <MainPageNewVoyageButton />
            </div>

            {isLoading ? (
              <div className="flex mainpage_BottomRight">
                <div className="flex mainpage_MapContainer">
                  <MapSpinner />
                </div>
              </div>
            ) : (
              <div className="flex mainpage_BottomRight">
                <div className="flex mainpage_MapContainer">
                  <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                    {!initialLatitude && (
                      <div className={"cardSwiperSpinner"}>
                        {/* <div className="spinner"></div> */}
                      </div>
                    )}

                    {initialLatitude && (
                      <Map
                        mapId={"mainpageMap"}
                        defaultZoom={15}
                        defaultCenter={{
                          lat: initialLatitude,
                          lng: initialLongitude,
                        }}
                        gestureHandling={"greedy"}
                        disableDefaultUI
                        onCameraChanged={() => setTargetLocation(null)}
                      >
                        <MapInitialBoundsComponent
                          setInitialBounds={setInitialBounds}
                        />
                        <MainPageMapPanComponent
                          initialBounds={initialBounds}
                          setBounds={setBounds}
                          targetLat={targetLocation?.lat}
                          targetLng={targetLocation?.lng}
                        />
                        {isSuccessVoyages && initialVoyages?.length > 0 && (
                          <ClusteredVoyageMarkers voyages={initialVoyages} />
                        )}
                      </Map>
                    )}
                  </APIProvider>
                </div>
              </div>
            )}
            <div style={{ position: "absolute", right: 0, bottom: 0 }}>
              <MainPageRefreshButton applyFilter={applyFilter} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default MainPage;

const CardSwiperSpinner = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, .05)",
        height: "100%",
        width: "92%",
        padding: "1vh",
        borderRadius: "1.5rem",
        position: "relative",
        margin: "auto",
        marginTop: "1rem",
      }}
    >
      <div
        className="spinner"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          height: "5rem",
          width: "5rem",
          border: "8px solid rgba(173, 216, 230, 0.3)",
          borderTop: "8px solid #1e90ff",
        }}
      ></div>
    </div>
  );
};

const MapSpinner = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        height: "100%",
        width: "100%",
        borderRadius: "1.5rem",
        position: "relative",
      }}
    >
      <div
        className="spinner"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          height: "5rem",
          width: "5rem",
          border: "8px solid rgba(173, 216, 230, 0.3)",
          borderTop: "8px solid #1e90ff",
        }}
      ></div>
    </div>
  );
};
