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
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
} from "../slices/VoyageSlice";

import {
  useGetFavoriteVoyageIdsByUserIdQuery,
  useGetFavoriteVehicleIdsByUserIdQuery,
  updateUserFavorites
} from "../slices/UserSlice"
import { useSelector, useDispatch } from "react-redux";
import { TopBarMenu } from "../components/TopBarMenu";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { MainPageFiltersComponent } from "../components/MainPageFiltersComponent";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { MainPageNewVoyageButton } from "../components/MainPageNewVoyageButton";
import { MarkerWithInfoWindow } from "../components/MainPageMarkerWithInfoWindow";
import { MainPageMapPanComponent } from "../components/MainPageMapPanComponent";
import { ClusteredVoyageMarkers } from "../components/MainPageClusteredParrots";
import { convertDateFormat } from "../components/ConvertDateFormat";
import { MainPageRefreshButton } from "../components/MainPageRefreshButton"


function MainPage() {
  const userId = localStorage.getItem("storedUserId")
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  const [initialLatitude, setInitialLatitude] = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [initialLatDelta, setInitialLatDelta] = useState(1);
  const [initialLngDelta, setInitialLngDelta] = useState(1);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialVoyages, setInitialVoyages] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [targetLocation, setTargetLocation] = useState({});
  const markerClustererRef = useRef(null); // Ref to store MarkerClusterer instance
  const markersRef = useRef([]); // Ref to store marker instances
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

  const dispatch = useDispatch()
  const [
    getVoyagesByLocation,
    {
      isError: isErrorVoyages,
      isLoading: isLoadingVoyages,
      isSuccess: isSuccessVoyages,
    },
  ] = useGetVoyagesByLocationMutation();

  const [
    getFilteredVoyages,
    {
      isError: isErrorVoyagesFiltered,
      isLoading: isLoadingVoyagesFiltered,
      isSuccess: isSuccessVoyagesFiltered,
    },
  ] = useGetFilteredVoyagesMutation();

  const {
    data: favoriteVoyagesData
  } = useGetFavoriteVoyageIdsByUserIdQuery(userId);

  const {
    data: favoriteVehiclesData
  } = useGetFavoriteVehicleIdsByUserIdQuery(userId);

  useEffect(() => {
    const updateFavorites = () => {
      dispatch(
        updateUserFavorites({
          favoriteVehicles: favoriteVehiclesData,
          favoriteVoyages: favoriteVoyagesData,
        })
      );
    }
    updateFavorites()

  }, [favoriteVehiclesData, favoriteVoyagesData])

  const applyFilter = useCallback(async () => {
    const formattedStartDate = convertDateFormat(dates.startDate, "startDate");
    const formattedEndDate = convertDateFormat(dates.endDate, "endDate");
    const data = {
      latitude: (bounds.lat.northEast + bounds.lat.southWest) / 2,
      longitude: (bounds.lng.northEast + bounds.lng.southWest) / 2,
      latitudeDelta: bounds.lat.northEast - bounds.lat.southWest,
      longitudeDelta: bounds.lng.northEast - bounds.lng.southWest,
      count: selectedVacancy ?? 1,
      selectedVehicleType: selectedVehicle,
      formattedStartDate: formattedStartDate,
      formattedEndDate: formattedEndDate,
    };

    const filteredVoyages = await getFilteredVoyages(data);
    setInitialVoyages(filteredVoyages.data || []);
  }, [
    bounds,
    dates.startDate,
    dates.endDate,
    selectedVacancy,
    selectedVehicle,
    getFilteredVoyages,
  ]);

  useEffect(() => {
    const getVoyages = async () => {
      if (!initialLatitude || !initialLongitude) return;
      const lat1 = initialLatitude - initialLatDelta;
      const lat2 = initialLatitude + initialLatDelta;
      const lon1 = initialLongitude - initialLngDelta;
      const lon2 = initialLongitude + initialLngDelta;
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
    getVoyages();
  }, [
    initialLatitude,
    initialLongitude,
    initialLatDelta,
    initialLngDelta,
    getVoyagesByLocation,
  ]);

  const handlePanToLocation = (lat, lng) => {
    setTargetLocation({ lat, lng });
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setInitialLatitude(latitude);
            setInitialLongitude(longitude);
            setLocationError(null); // Clear any previous errors
            handlePanToLocation(latitude, longitude); // Pan to the user's location
          },
          (error) => {
            console.error(error.message);
            setLocationError("Unable to retrieve your location.");
            setTimeout(getLocation, 5000); // Retry after 5 seconds
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
      }
    };
    getLocation(); // Initial location request
  }, []);

  useEffect(() => {
    if (
      isSuccessVoyages
    ) {
      markersRef.current = [];

      const newMarkers = initialVoyages
        .map((voyage, index) => {
          const waypoint = voyage.waypoints?.[0];
          if (!waypoint) return null;

          return (
            <MarkerWithInfoWindow
              key={`${voyage.waypoints[0].latitude}-${index}`}
              index={index}
              position={{
                lat: waypoint.latitude,
                lng: waypoint.longitude,
              }}
              voyage={voyage}
              onClick={() =>
                handlePanToLocation(
                  voyage.waypoints[0].latitude,
                  voyage.waypoints[0].longitude
                )
              }
            />
          );
        })
        .filter(Boolean);

      // console.log(mapRef.current);

      if (!markerClustererRef.current) {
        markerClustererRef.current = new MarkerClusterer({
          // map: mapRef.current,
          markers: newMarkers,
        });
      } else {
        markerClustererRef.current.clearMarkers();
        markerClustererRef.current.addMarkers(newMarkers);
      }

      markersRef.current = newMarkers;
    }
  }, [initialVoyages, isSuccessVoyages]);

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

            {
              isLoading ?
                <div className="flex mainpage_BottomRight">
                  <div className="flex mainpage_MapContainer">
                    <MapSpinner />
                  </div>
                </div>
                :
                <div className="flex mainpage_BottomRight">
                  <div className="flex mainpage_MapContainer">
                    <APIProvider apiKey={myApiKey} libraries={["marker"]}>

                      {
                        !initialLatitude && (
                          <div className={"cardSwiperSpinner"}>
                            {/* <div className="spinner"></div> */}
                          </div>
                        )
                      }

                      {
                        initialLatitude && (
                          <Map
                            mapId={"mainpageMap"}
                            defaultZoom={10}
                            defaultCenter={{
                              lat: initialLatitude, //|| 37.7749,
                              lng: initialLongitude //|| -122.4194,
                            }}
                            gestureHandling={"greedy"}
                            disableDefaultUI
                            onCameraChanged={() => setTargetLocation(null)}
                          >
                            <MainPageMapPanComponent
                              setBounds={setBounds}
                              targetLat={targetLocation?.lat}
                              targetLng={targetLocation?.lng}
                            />
                            {isSuccessVoyages && initialVoyages?.length > 0 && (
                              <ClusteredVoyageMarkers voyages={initialVoyages} />
                            )}
                          </Map>
                        )
                      }
                    </APIProvider>
                  </div>
                </div>
            }
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
    <div style={{
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      height: "100%",
      width: "92%",
      padding: "1vh",
      borderRadius: "1.5rem",
      position: "relative",
      margin: "auto",
      marginTop: "1rem"
    }}>
      <div className="spinner"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          height: "5rem",
          width: "5rem",
          border: "8px solid rgba(173, 216, 230, 0.3)",
          borderTop: "8px solid #1e90ff",
        }}></div>
    </div>

  )
}

const MapSpinner = () => {
  return (
    <div style={{
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      height: "100%", width: "100%",
      borderRadius: "1.5rem",
      position: "relative"

    }}>
      <div className="spinner"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          height: "5rem",
          width: "5rem",
          border: "8px solid rgba(173, 216, 230, 0.3)",
          borderTop: "8px solid #1e90ff",
        }}></div>
    </div>
  )
}