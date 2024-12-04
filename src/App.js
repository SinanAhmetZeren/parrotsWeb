import parrotsLogo from "./assets/parrots-logo-mini.png";
import "./App.css";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
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
  const handleMapLoad = (map) => {
    mapRef.current = map;
  };
  const [userLocation, setUserLocation] = useState({});
  const [initialLatitude, setInitialLatitude] = useState();
  const [initialLongitude, setInitialLongitude] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [initialVoyages, setInitialVoyages] = useState([]);

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialLatitude(latitude);
          setInitialLongitude(longitude);
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          setLocationError("Unable to retrieve your location.");
          console.error(error.message);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    const getVoyages = async () => {
      const lat1 = initialLatitude - 10.15;
      const lat2 = initialLatitude + 10.15;
      const lon1 = initialLongitude - 10.2;
      const lon2 = initialLongitude + 10.2;

      setIsLoading(true);

      const voyages = await getVoyagesByLocation({ lon1, lon2, lat1, lat2 });
      setInitialVoyages(voyages.data || []);
      console.log("voyages data: ..........");
      console.log(voyages.data);
      console.log("waypoint0 lat: ", voyages.data[0].waypoints[0].latitude);
      setIsLoading(false);
    };

    if (initialLatitude !== 0 && initialLongitude !== 0) {
      getVoyages();
    }
  }, [initialLatitude, initialLongitude, getVoyagesByLocation]);

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
                  <MainPageCardSwiper voyagesData={initialVoyages} />
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
                <LoadScript googleMapsApiKey={myApiKey}>
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: "100%",
                    }}
                    center={userLocation}
                    zoom={10}
                    onLoad={handleMapLoad} // This initializes the map reference
                    onIdle={() => {
                      if (mapRef.current) {
                        // const center = mapRef.current.getCenter();
                        // const zoom = mapRef.current.getZoom();
                        const bounds = mapRef.current.getBounds();

                        if (bounds) {
                          const ne = bounds.getNorthEast();
                          const sw = bounds.getSouthWest();
                          console.log("Bounds:", {
                            northEast: { lat: ne.lat(), lng: ne.lng() },
                            southWest: { lat: sw.lat(), lng: sw.lng() },
                          });
                          setXDelta(ne.lng() - sw.lng());
                          setYDelta(ne.lat() - sw.lat());
                        }
                      }
                    }}
                  >
                    {isSuccessVoyages && (
                      <Marker
                        key={2}
                        // position={{ lat: 41.11384, lng: 28.94966 }}
                        position={{
                          lat: initialVoyages[0].waypoints[0].latitude,
                          lng: initialVoyages[0].waypoints[0].longitude,
                        }}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          scaledSize: new window.google.maps.Size(50, 50),
                        }}
                        onClick={() => console.log("Marker clicked!")}
                      />
                    )}

                    <Marker
                      key={3}
                      position={{ lat: 41.11384, lng: 28.94966 }}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        scaledSize: new window.google.maps.Size(50, 50),
                      }}
                      onClick={() => console.log("Marker clicked!")}
                    />
                  </GoogleMap>
                </LoadScript>
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
2. pins on map for voyages
*/
