import parrotsLogo from "./assets/parrots-logo-mini.png";

import leftArrow from "./assets/mainPageArrow.png";
import rightArrow from "./assets/mainPageArrow.png";
import "./App.css";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { cardData } from "./components/cardData";
import { MainPageDatePicker } from "./components/MainPageDatePicker";
import { MainPageVehiclePicker } from "./components/MainPageVehiclePicker";
import { MainPageVacancyPicker } from "./components/MainPageVacancyPicker";
import { MainPageApplyClearButtons } from "./components/MainPageApplyClearButtons";
import { MainPageVoyageCard } from "./components/MainPageVoyageCard";

function App() {
  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";

  const slideContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const cardContainerStyle = {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    // width: "100%", // Use percentage width
    width: "20rem",
    maxWidth: "600px", // Optional max width for larger screens
    maxHeight: "700px",
    backgroundColor: "#fff",
    margin: "1rem",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    // borderRadius: "8px",
  };

  const cardImageStyle = {
    width: "100%",
    height: "11rem",
    objectFit: "cover",
    borderBottom: "1px solid #ddd",
  };

  const cardContentStyle = {
    display: "flex",
    height: "11rem",
    backgroundColor: "white",
    flexDirection: "column",
  };

  const cardTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "green",
  };

  const cardSubtitleStyle = {
    fontSize: "1.2rem",
    fontWeight: "400",
    color: "red",
  };

  const cardDescriptionStyle = {
    fontSize: "1rem",
    color: "#555",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1rem",
  };

  const buttonStyle = {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    fontWeight: "800",
    borderRadius: "20px",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.3),
      inset 0 -4px 6px rgba(0, 0, 0, 0.3)
    `,
    transition: "box-shadow 0.2s ease",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textShadow: `
    -1px -1px 0 #000d5a, /* Top-left shadow */
    1px -1px 0 #000d5a,  /* Top-right shadow */
    -1px 1px 0 #000d5a,  /* Bottom-left shadow */
    1px 1px 0 #000d5a    /* Bottom-right shadow */
  `,
  };

  function MainPageVoyageCard({ cardData }) {
    return (
      <div className="card" style={cardContainerStyle}>
        <div className="card-image" style={cardImageStyle}>
          <img src={cardData.image} style={imageStyle} alt="Boat tour" />
        </div>
        <div className="card-content" style={cardContentStyle}>
          <h2 style={cardTitleStyle}>{cardData.name}</h2>
          <h3 style={cardSubtitleStyle}>{cardData.brief}</h3>
          <p style={cardDescriptionStyle}>
            {cardData.description}

            {cardData.dates}

            {cardData.lastDate}
          </p>
          <div className="card-buttons" style={buttonContainerStyle}>
            <button style={buttonStyle}>Trip Details</button>
            <button style={buttonStyle}>See on Map</button>
          </div>
        </div>
      </div>
    );
  }

  function MainPageCardSwiper() {
    return (
      <div>
        <div style={{ width: "90%" }}>
          <Swiper
            effect="coverflow"
            onSlideChangeTransitionEnd={(swiper) => {
              console.log("Slide transition completed:", swiper.activeIndex);
            }}
            onSlideChangeTransitionStart={() => {
              console.log("Slide transition started");
            }}
            speed={1000}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            // loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 100,
              depth: 200,
              modifier: 1,
              slideShadows: false,
            }}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            modules={[EffectCoverflow, Navigation]}
            style={{ width: "25rem" }}
          >
            {cardData.map((data, index) => (
              <SwiperSlide key={index} style={slideContainerStyle}>
                <MainPageVoyageCard cardData={data} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div
          className="custom-prev"
          style={{
            position: "absolute",
            top: "50%",
            left: "01%",
            zIndex: 10,
            height: "2.5rem",
            width: "2.5rem",
            cursor: "pointer",
            transform: "scaleX(-1)", // Flipping horizontally
            marginTop: "-4rem",
          }}
        >
          <img src={leftArrow} alt="Previous" />
        </div>
        <div
          className="custom-next"
          style={{
            position: "absolute",
            top: "50%",
            left: "27%",
            zIndex: 10,
            height: "3rem",
            width: "3rem",
            cursor: "pointer",
            marginTop: "-4rem",
          }}
        >
          <img src={rightArrow} alt="Next" />
        </div>
      </div>
    );
  }

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
              flexGrow: 1, // Make this grow to take all remaining height
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
                  width: "83%",
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
                  <MainPageVehiclePicker />
                  <MainPageVacancyPicker />
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
