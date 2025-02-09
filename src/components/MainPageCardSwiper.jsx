import leftArrow from "../assets/images/mainPageArrow.png";
import rightArrow from "../assets/images/mainPageArrow.png";
import "../assets/css/App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { MainPageVoyageCard } from "./MainPageVoyageCard";

export function MainPageCardSwiper({
  voyagesData,
  panToLocation,
  calendarOpen,
  setCalendarOpen }) {


  console.log(voyagesData.length);
  return (
    voyagesData.length === 0 ?
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        height: "100%",
        width: "92%",
        padding: "1vh",
        borderRadius: "1.5rem",
        position: "relative",
        margin: "auto",
        marginTop: "1rem",
        alignContent: "center"
      }} >
        <span
          style={{
            color: "white",
            padding: "1vh",
            position: "relative",
            margin: "auto",
            alignContent: "center",
            width: "70%", // Added quotes around "100%"
            height: "80%",
            fontSize: "1.6rem", // Changed to camelCase
            fontWeight: 800, // Correct format for font-weight
            textShadow: `
              2px 2px 4px rgba(0, 0, 0, 0.6),  /* Outer shadow */
              -2px -2px 4px rgba(255, 255, 255, 0.2) /* Inner highlight */
            `,
            filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))", // Enhances shadow effect
          }} >

          No Voyages Here</span>

      </div>
      :
      <div
        onClick={() => {
          if (calendarOpen) {
            setCalendarOpen(!calendarOpen)
          }
        }}
      >
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
              stretch: 140,
              // depth: 200,
              depth: 300,
              modifier: 1,
              slideShadows: false,
            }}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            modules={[EffectCoverflow, Navigation]}
            style={{ width: "33rem" }}
          >
            {voyagesData.map((data, index) => (
              <SwiperSlide key={index} style={slideContainerStyle}>
                <MainPageVoyageCard
                  cardData={data}
                  panToLocation={panToLocation}
                />
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
            left: "29%",
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

const slideContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
