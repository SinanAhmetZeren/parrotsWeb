/* eslint-disable no-undef */
import "./App.css";
import "./assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { MainPageCardSwiper } from "./components/MainPageCardSwiper";
import {
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
} from "./slices/VoyageSlice";
import { TopBarMenu } from "./components/TopBarMenu";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import { MainPageFiltersComponent } from "./components/MainPageFiltersComponent";
import { TopLeftComponent } from "./components/TopLeftComponent";
import { MainPageNewVoyageButton } from "./components/MainPageNewVoyageButton";
import { MarkerWithInfoWindow } from "./components/MainPageMarkerWithInfoWindow";
import { MainPageMapPanComponent } from "./components/MainPageMapPanComponent";
import { ClusteredVoyageMarkers } from "./components/MainPageClusteredParrots";
import { convertDateFormat } from "./components/ConvertDateFormat";

function MainPage() {
  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  const [initialLatitude, setInitialLatitude] = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [initialLatDelta, setInitialLatDelta] = useState(5);
  const [initialLngDelta, setInitialLngDelta] = useState(5);

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
    console.log("filtered voyages", filteredVoyages);
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
    getVoyagesByLocation,
    initialLatDelta,
    initialLngDelta,
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
      //  && mapRef.current
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
            <TopLeftComponent userName={"Peter Parker"} />

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
                />
              </div>
              <div style={{ height: "60vh" }}>
                {isLoading ? (
                  <div className={"cardSwiperSpinner"}>
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <MainPageCardSwiper
                    voyagesData={initialVoyages}
                    panToLocation={handlePanToLocation}
                  />
                )}
              </div>
              <MainPageNewVoyageButton />
            </div>

            <div className="flex mainpage_BottomRight">
              <div
                className="flex mainpage_MapContainer"
                // ref={mapRef}
              >
                <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                  <Map
                    mapId={"mainpageMap"}
                    defaultZoom={10}
                    defaultCenter={{
                      lat: initialLatitude || 37.7749,
                      lng: initialLongitude || -122.4194,
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
                </APIProvider>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default MainPage;

/* 
TODO: 
- map refresh button 
- username from fixed userId
- clear filter button
- get filtered voyages


*/
