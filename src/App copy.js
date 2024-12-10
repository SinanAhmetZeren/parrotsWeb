import parrotsLogo from "./assets/parrots-logo-mini.png";
import parrotMarker from "./assets/parrotMarker4.png";
import "./App.css";
// import {
//   GoogleMap,
//   LoadScript,
//   Marker,
//   InfoWindow,
// } from "@react-google-maps/api";

// import {
//   GoogleMap,
//   LoadScript,
//   Marker,
//   AdvancedMarker,
// } from "@vis.gl/react-google-maps";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

import React, { useState, useEffect, useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { MainPageDatePicker } from "./components/MainPageDatePicker";
import { MainPageVehiclePicker } from "./components/MainPageVehiclePicker";
import { MainPageVacancyPicker } from "./components/MainPageVacancyPicker";
import { MainPageApplyClearButtons } from "./components/MainPageApplyClearButtons";
import { MainPageCardSwiper } from "./components/MainPageCardSwiper";
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
  const [xDelta, setXDelta] = useState(null);
  const [yDelta, setYDelta] = useState(null);

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

  const handleMarkerClick = (id, lat, lng) => {
    console.log("clicked voyage id: ", id);
    panToLocation(lat, lng);
    setSelectedMarker({ id, lat, lng });
  };

  const handleCloseClick = () => {
    console.log("selected marker2: ", selectedMarker);
    setSelectedMarker(null);
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
                <APIProvider apiKey={myApiKey}>
                  <Map
                    defaultCenter={{
                      lat: initialLatitude || 37.7749, // Default to San Francisco if `initialLatitude` is undefined
                      lng: initialLongitude || -122.4194,
                    }}
                    defaultZoom={8}
                    style={{ width: "100%", height: "100%" }}
                    mapId="map"
                  >
                    {isSuccessVoyages &&
                      initialVoyages?.length > 0 &&
                      initialVoyages.map((voyage, index) => {
                        return (
                          voyage.waypoints?.[0] && (
                            <AdvancedMarker
                              key={index}
                              position={{
                                lat: voyage.waypoints[0].latitude,
                                lng: voyage.waypoints[0].longitude,
                              }}
                              icon={{
                                url: parrotMarker,
                                scaledSize: window.google?.maps?.Size
                                  ? new window.google.maps.Size(80, 80)
                                  : null,
                              }}
                              onClick={() => {
                                handleMarkerClick(
                                  voyage.id,
                                  voyage.waypoints[0].latitude,
                                  voyage.waypoints[0].longitude
                                );
                              }}
                            />
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
/* 
TODO:

1. adjust xDelta yDelta for request
*/
