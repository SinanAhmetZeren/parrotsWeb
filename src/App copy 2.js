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
import FilterComponent from "./components/MainPageFilter";
import { MainPageCardSwiper } from "./components/MainPageCardSwiper";
import { MainPageVoyageCard } from "./components/MainPageVoyageCard";
import { cardData } from "./components/cardData";

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
    color: "purple",
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
          <h2 style={cardTitleStyle}>{cardData.title}</h2>
          <h3 style={cardSubtitleStyle}>{cardData.subtitle}</h3>
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
          style={{ padding: "0rem 0", marginTop: "-7rem", width: "25rem" }}
        >
          {cardData.map((data, index) => (
            <SwiperSlide key={index} style={slideContainerStyle}>
              <MainPageVoyageCard cardData={data} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className="custom-prev"
          style={{
            position: "absolute",
            top: "50%",
            left: "0rem",
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
            left: "35%",
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
          className="grid sm:grid-rows-9 sm:grid-cols-8
         grid-rows-[auto,auto,1fr] 
         grid-cols-1 w-full h-screen"
        >
          {/*  top left  */}
          <div
            className="sm:row-span-1 sm:col-span-3 sm:bg-gray-800 
           row-span-1 col-span-1 bg-blue-100 
           text-white flex items-center 
           sm:justify-start justify-center p-4 h-[100px] sm:h-auto"
          >
            <img src={parrotsLogo} alt="Logo" className="w-10 h-10 mr-4" />
            <div>
              <span className="text-lg font-semibold">Welcome to Parrots</span>
              <span className="text-lg text-yellow-400"> Username</span>
            </div>
          </div>

          {/*  top right  */}

          <div
            className="sm:row-span-1 sm:col-span-5 sm:bg-gray-700 
           row-span-1 col-span-1 bg-blue-200 
           text-white flex items-center justify-center sm:justify-end p-4 h-[100px] sm:h-auto"
          >
            <nav className="flex space-x-6 sm:space-x-6 overflow-x-auto sm:overflow-x-visible">
              <a href="#home" className="hover:text-gray-300">
                Home
              </a>
              <a href="#profile" className="hover:text-gray-300">
                Profile
              </a>
              <a href="#voyage" className="hover:text-gray-300">
                Voyage
              </a>
              <a href="#favorites" className="hover:text-gray-300">
                Favorites
              </a>
              <a href="#connect" className="hover:text-gray-300">
                Connect
              </a>
              <a href="#logout" className="hover:text-gray-300">
                Logout
              </a>
            </nav>
          </div>

          {/*  bottom left  */}

          <div
            className="sm:row-span-8 sm:col-span-3 sm:bg-amber-600 
           row-span-6 col-span-1 bg-blue-300 
           flex  order-4 sm:order-3 h-[500px] sm:h-auto
           flex-col"
          >
            <FilterComponent />
            {/* <MainPageCardSwiper /> */}
          </div>

          {/*  bottom right  */}

          <div
            className="sm:row-span-8 sm:col-span-5 sm:bg-amber-100 
                    row-span-6 col-span-1 bg-green-600 
                    flex items-center justify-center order-3 sm:order-4"
            style={{ height: "100%" }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
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
      </header>
    </div>
  );
}

export default App;
