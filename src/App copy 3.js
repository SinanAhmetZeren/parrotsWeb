/* eslint-disable no-undef */
import parrotsLogo from "./assets/parrots-logo-mini.png";
import parrotMarker from "./assets/parrotMarker4.png";
import "./App.css";
import "./assets/css/advancedmarker.css";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  CollisionBehavior,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { MainPageDatePicker } from "./components/MainPageDatePicker";
import { MainPageVehiclePicker } from "./components/MainPageVehiclePicker";
import { MainPageVacancyPicker } from "./components/MainPageVacancyPicker";
import { MainPageApplyClearButtons } from "./components/MainPageApplyClearButtons";
import { MainPageCardSwiper } from "./components/MainPageCardSwiper";
import { MainPageMapVoyageCard } from "./components/MainPageMapVoyageCard ";
import {
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
} from "./slices/VoyageSlice";
import { TopBarMenu } from "./components/TopBarMenu";

function App() {
  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  const mapRef = useRef(null);

  const [userLocation, setUserLocation] = useState({});
  const [initialLatitude, setInitialLatitude] = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [initialVoyages, setInitialVoyages] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [locationError, setLocationError] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

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
      if (!initialLatitude || !initialLongitude) return; // Wait until coordinates are set
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialLatitude(latitude);
          setInitialLongitude(longitude);
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error(error.message);
          setLocationError("Unable to retrieve your location.");
          setInitialLatitude(37.7749);
          setInitialLongitude(-122.4194);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  const panToLocation = (lat, lng) => {
    if (mapRef.current) {
      const map = mapRef.current;
      const currentCenter = map.getCenter();
      const targetCenter = new window.google.maps.LatLng(lat, lng);

      const startLat = currentCenter.lat();
      const startLng = currentCenter.lng();
      const endLat = targetCenter.lat();
      const endLng = targetCenter.lng();

      let startTime = null;

      const animatePan = (timestamp) => {
        if (!startTime) {
          startTime = timestamp;
        }

        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime, 1);

        const newLat = startLat + (endLat - startLat) * progress;
        const newLng = startLng + (endLng - startLng) * progress;

        map.panTo(new window.google.maps.LatLng(newLat, newLng));

        if (progress < 1) {
          requestAnimationFrame(animatePan);
        }
      };

      requestAnimationFrame(animatePan);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          className="flex mainpage_Container"
          style={{
            flexDirection: "column",
            width: "100%",
            height: "100vh",
          }}
        >
          <div
            className="flex mainpage_TopRow"
            style={{
              padding: ".1rem",
              flexDirection: "row",
            }}
          >
            <div
              className="flex mainpage_TopLeft"
              style={{
                height: "3rem",
                width: "33%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={parrotsLogo} alt="Logo" className="w-10 h-10 mr-4" />
              <div>
                <span
                  className="text-xl font-bold"
                  style={{ color: "rgba(10, 119, 234,1)", fontWeight: "900" }}
                >
                  Welcome to Parrots
                </span>
                <span
                  className="text-xl "
                  style={{ color: "#2ac898", fontWeight: "900" }}
                >
                  {" "}
                  {"Peter Parker".toUpperCase()}
                </span>
              </div>
            </div>
            <div
              className="flex mainpage_TopRight"
              style={{
                height: "3rem",
                width: "65%",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <TopBarMenu />
            </div>
          </div>

          <div
            className="flex mainpage_BottomRow"
            style={{
              flexGrow: 1,
              width: "100%",
            }}
          >
            <div
              className="flex mainpage_BottomLeft"
              style={{
                display: "flex",
                flexDirection: "column",
                width: "33%",
              }}
            >
              <div // FILTER COMPONENT
                style={{
                  backgroundColor: "rgba(5, 8, 58, 0.85)",
                  height: "17vh",
                  width: "95%",
                  padding: "1vh",
                  borderRadius: "1rem",
                  alignSelf: "center",
                }}
              >
                <div
                  style={{
                    paddingTop: "0.2rem",
                  }}
                >
                  <MainPageDatePicker />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: ".5rem",
                    paddingLeft: ".5rem",
                    paddingRight: ".5rem",
                    cursor: "pointer",
                    width: "100%",
                    paddingTop: "0.2rem",
                  }}
                >
                  <div style={{ width: "50%" }}>
                    <MainPageVehiclePicker />
                  </div>
                  <div style={{ width: "50%" }}>
                    <MainPageVacancyPicker />
                  </div>
                </div>
                <div>
                  <MainPageApplyClearButtons />
                </div>
              </div>
              <div style={{ height: "60vh" }}>
                {isLoading ? (
                  <div
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      height: "100%",
                    }}
                  >
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <MainPageCardSwiper
                    voyagesData={initialVoyages}
                    panToLocation={panToLocation}
                  />
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => {
                    console.log("apply");
                  }}
                  style={buttonStyle}
                >
                  New Voyage
                </button>
              </div>
            </div>

            <div
              className="flex mainpage_BottomRight"
              style={{
                width: "67%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                  <Map
                    mapId={"bf51a910020fa25a"}
                    defaultZoom={10}
                    style={{ width: "100%", height: "100%", zIndex: 5 }}
                    defaultCenter={{
                      lat: initialLatitude || 37.7749, // Default to San Francisco if `initialLatitude` is undefined
                      lng: initialLongitude || -122.4194,
                    }}
                    gestureHandling={"greedy"}
                    disableDefaultUI
                  >
                    {isSuccessVoyages &&
                      initialVoyages?.length > 0 &&
                      initialVoyages.map((voyage, index) => {
                        const isSelected = voyage.id === clicked;

                        return (
                          voyage.waypoints?.[0] && (
                            <div>
                              <AdvancedMarker
                                collisionBehavior={
                                  CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
                                }
                                key={voyage.id || index}
                                position={{
                                  lat: voyage.waypoints[0].latitude,
                                  lng: voyage.waypoints[0].longitude,
                                }}
                                title={
                                  "AdvancedMarker with custom html content."
                                }
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                className={classNames("real-estate-marker", {
                                  clicked,
                                  hovered,
                                })}
                                onClick={() => {
                                  setClicked(isSelected ? null : voyage.id);
                                }}
                              >
                                <div>
                                  <div
                                    className={classNames("card-container", {
                                      visible: isSelected,
                                    })}
                                  >
                                    <MainPageMapVoyageCard cardData={voyage} />
                                  </div>

                                  <div
                                    className="custom-pin"
                                    style={{
                                      justifyItems: "center",
                                      position: "relative",
                                    }}
                                  >
                                    <div className="image-container">
                                      <span
                                        className={classNames("map-icon", {
                                          clicked: isSelected,
                                        })}
                                      >
                                        <img
                                          src={parrotMarker}
                                          alt="Map Icon"
                                          width="70"
                                          height="70"
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </AdvancedMarker>
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

const buttonStyle = {
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
  boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.3),
      inset 0 -4px 6px rgba(0, 0, 0, 0.3)
    `,
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};
