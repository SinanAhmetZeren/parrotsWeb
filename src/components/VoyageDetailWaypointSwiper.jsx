
import "../assets/css/App.css";
import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { VoyageDetailWaypointCard } from "./VoyageDetailWaypointCard";

export function VoyageDetailWaypointSwiper({ waypoints, handlePanToLocation, opacity, voyageImage }) {

  return (
    <div style={{ opacity: opacity, overflow: "hidden" }}>
      <Swiper
        slidesPerView={1.65}
        spaceBetween={5}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        style={{
          // width: "100%",
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
            <VoyageDetailWaypointCard waypoint={waypoint} handlePanToLocation={handlePanToLocation} voyageImage={voyageImage} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}




