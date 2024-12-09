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
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
  APIProvider,
  Map,
  Marker,
  useMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  MapCameraChangedEvent,
  MapCameraProps,
} from "@vis.gl/react-google-maps";

import { MainPageFiltersComponent } from "./components/MainPageFiltersComponent";
import { TopLeftComponent } from "./components/TopLeftComponent";
import { MainPageNewVoyageButton } from "./components/MainPageNewVoyageButton";
import { MarkerWithInfoWindow } from "./components/MainPageMarkerWithInfoWindow";
import { MainPageMapPanComponent } from "./components/MainPageMapPanComponent";

function App() {
  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  const mapRef = useRef(null);
  let mainpageMap;

  console.log("mainpageMap...", mainpageMap);
  const [initialLatitude, setInitialLatitude] = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [initialVoyages, setInitialVoyages] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [targetLocation, setTargetLocation] = useState({});

  const [dates, setDates] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const [
    getVoyagesByLocation,
    {
      isError: isErrorVoyages,
      isLoading: isLoadingVoyages,
      isSuccess: isSuccessVoyages,
    },
  ] = useGetVoyagesByLocationMutation();

  useEffect(() => {
    const getVoyages = async () => {
      if (!initialLatitude || !initialLongitude) return;
      const lat1 = initialLatitude - 10.15;
      const lat2 = initialLatitude + 10.15;
      const lon1 = initialLongitude - 10.2;
      const lon2 = initialLongitude + 10.2;
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
  }, [initialLatitude, initialLongitude, getVoyagesByLocation]);

  const handlePanToLocation = (lat, lng) => {
    setTargetLocation({ lat, lng });
  };

  const handleCameraChange = useCallback((ev) => {
    console.log("camera changed: ", ev.detail);
    console.log(new Date());
  });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("position:", position);
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
              <div className="flex mainpage_MapContainer">
                <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                  <Map
                    mapId={"mainpageMap"}
                    defaultZoom={10}
                    style={{ width: "100%", height: "100%", zIndex: 5 }}
                    defaultCenter={{
                      lat: initialLatitude || 37.7749,
                      lng: initialLongitude || -122.4194,
                    }}
                    gestureHandling={"greedy"}
                    disableDefaultUI
                    onCameraChanged={() => setTargetLocation(null)}
                  >
                    <MainPageMapPanComponent
                      targetLat={targetLocation?.lat}
                      targetLng={targetLocation?.lng}
                    />

                    {isSuccessVoyages &&
                      initialVoyages?.length > 0 &&
                      initialVoyages.map((voyage, index) => {
                        return (
                          voyage.waypoints?.[0] && (
                            <div
                              key={`${voyage.waypoints[0].latitude}-${index}`}
                            >
                              <MarkerWithInfoWindow
                                index={index}
                                position={{
                                  lat: voyage.waypoints[0].latitude,
                                  lng: voyage.waypoints[0].longitude,
                                }}
                                voyage={voyage}
                                onClick={() =>
                                  handlePanToLocation(
                                    voyage.waypoints[0].latitude,
                                    voyage.waypoints[0].longitude
                                  )
                                }
                              />
                            </div>
                          )
                        );
                      })}
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

export default App;
