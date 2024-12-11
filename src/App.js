/* eslint-disable no-undef */
import parrotsLogo from "./assets/parrots-logo-mini.png";
import parrotMarker1 from "./assets/parrotMarker1.png";
import parrotMarker2 from "./assets/parrotMarker2.png";
import parrotMarker3 from "./assets/parrotMarker3.png";
import parrotMarker4 from "./assets/parrotMarker4.png";
import parrotMarker5 from "./assets/parrotMarker5.png";
import parrotMarker6 from "./assets/parrotMarker6.png";
import "./App.css";
import "./assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  CollisionBehavior,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

function App() {
  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  const mapRef = useRef(null);
  const clustererRef = useRef(null);

  const [initialLatitude, setInitialLatitude] = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [initialVoyages, setInitialVoyages] = useState([]);
  const [locationError, setLocationError] = useState(null);

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

  /*
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialLatitude(latitude);
          setInitialLongitude(longitude);
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
*/
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setInitialLatitude(latitude);
            setInitialLongitude(longitude);
            setLocationError(null); // Clear any previous errors
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

  const panToLocation = (lat, lng) => {
    if (mapRef.current) {
      console.log("hello from pan to location");
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
                    ref={mapRef}
                  >
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

const MarkerWithInfoWindow = ({ position, voyage, index }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      >
        <img
          alt={"pin"}
          src={
            index % 6 === 0
              ? parrotMarker1
              : index % 6 === 1
              ? parrotMarker2
              : index % 6 === 2
              ? parrotMarker3
              : index % 6 === 3
              ? parrotMarker4
              : index % 6 === 4
              ? parrotMarker5
              : parrotMarker6
          }
          width={50}
          height={60}
        />
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose} disableAutoPan={true}>
          <div className="info-window-custom">
            <MainPageMapVoyageCard cardData={voyage} />
          </div>
        </InfoWindow>
      )}
    </>
  );
};
