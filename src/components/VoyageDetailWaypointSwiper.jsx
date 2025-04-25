
import "../assets/css/App.css";
import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { VoyageDetailWaypointCard } from "./VoyageDetailWaypointCard";

export function VoyageDetailWaypointSwiper({ waypoints, handlePanToLocation, opacity }) {

  return (
    <div style={{ opacity: opacity }}>
      <Swiper
        slidesPerView={1.5}
        spaceBetween={10}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        style={{
          width: "100%",
          height: "35vh",
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
            <VoyageDetailWaypointCard waypoint={waypoint} handlePanToLocation={handlePanToLocation} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}




