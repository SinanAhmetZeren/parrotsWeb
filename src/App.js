import parrotsLogo from "./assets/parrots-logo-mini.png";
import "./App.css";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { MainPageDatePicker } from "./components/MainPageDatePicker";
import { MainPageVehiclePicker } from "./components/MainPageVehiclePicker";
import { MainPageVacancyPicker } from "./components/MainPageVacancyPicker";
import { MainPageApplyClearButtons } from "./components/MainPageApplyClearButtons";
import { MainPageCardSwiper } from "./components/MainPageCardSwiper";

function App() {
  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";

  const center = {
    lat: 37.7749,
    lng: -122.4194,
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
                <span className="text-xl font-bold">Welcome to Parrots</span>
                <span className="text-xl font-bold text-yellow-100">
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
              <nav className="flex space-x-6 sm:space-x-6 overflow-x-auto sm:overflow-x-visible">
                <a
                  href="#home"
                  className="hover:text-gray-300 font-bold text-xl"
                >
                  Home
                </a>
                <a
                  href="#profile"
                  className="hover:text-gray-300 font-bold text-xl "
                >
                  Profile
                </a>
                <a
                  href="#voyage"
                  className="hover:text-gray-300 font-bold text-xl"
                >
                  Voyage
                </a>
                <a
                  href="#favorites"
                  className="hover:text-gray-300 font-bold text-xl"
                >
                  Favorites
                </a>
                <a
                  href="#connect"
                  className="hover:text-gray-300 font-bold text-xl"
                >
                  Connect
                </a>
                <a
                  href="#logout"
                  className="hover:text-gray-300 font-bold text-xl"
                >
                  Logout
                </a>
              </nav>
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
                <MainPageCardSwiper />
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
                    center={center}
                    zoom={10}
                  />
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
