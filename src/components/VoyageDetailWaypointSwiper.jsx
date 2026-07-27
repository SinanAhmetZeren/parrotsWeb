
import "../assets/css/App.css";
import * as React from "react";
import { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import rightOrangeArrow from "../assets/images/arrow-right-orange.png";
import { VoyageDetailWaypointCard } from "./VoyageDetailWaypointCard";
import { VoyageDetailWaypointCardLight } from "./VoyageDetailWaypointCardLight";

export function VoyageDetailWaypointSwiper({ waypoints, handlePanToLocation, opacity, voyageImage, isDarkMode = true }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div style={{ opacity: opacity, overflow: "hidden", position: "relative" }}>
      <Swiper
        slidesPerView={1.65}
        spaceBetween={5}
        centeredSlides={true}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        modules={[Navigation]}
        style={{
          width: "100vh",
          height: "35vh",
          left: "-10vh"
        }}
      >
        {waypoints.map((waypoint, index) => (
          <SwiperSlide
            key={index}
            style={{
              textAlign: "center",
              fontSize: "1.1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isDarkMode
              ? <VoyageDetailWaypointCard waypoint={waypoint} handlePanToLocation={handlePanToLocation} voyageImage={voyageImage} />
              : <VoyageDetailWaypointCardLight waypoint={waypoint} handlePanToLocation={handlePanToLocation} voyageImage={voyageImage} />
            }
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        ref={prevRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "5%",
          zIndex: 10,
          height: "2.5rem",
          width: "2.5rem",
          cursor: "pointer",
          transform: "translateY(-50%)",
        }}
      >
        <img src={rightOrangeArrow} alt="Previous" style={{ width: "100%", height: "100%", transform: "scaleX(-1)" }} />
      </div>
      <div
        ref={nextRef}
        style={{
          position: "absolute",
          top: "50%",
          right: "5%",
          zIndex: 10,
          height: "2.5rem",
          width: "2.5rem",
          cursor: "pointer",
          transform: "translateY(-50%)",
        }}
      >
        <img src={rightOrangeArrow} alt="Next" style={{ width: "100%", height: "100%" }} />
      </div>
      <style>{`
        .swiper-button-disabled {
          opacity: 0 !important;
          cursor: default !important;
        }
      `}</style>
    </div>
  );
}




