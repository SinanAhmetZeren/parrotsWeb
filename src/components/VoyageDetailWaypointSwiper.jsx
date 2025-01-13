import img1 from "../assets/fareast1.jpg";
import img3 from "../assets/fareast2.jpeg";
import img2 from "../assets/fareast3.jpeg";
import "../App.css";
import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { VoyageDetailWaypointCard } from "./VoyageDetailWaypointCard";

export function VoyageDetailWaypointSwiper({ waypoints, handlePanToLocation }) {

  return (
    <div style={{}}>
      <Swiper
        slidesPerView={1.5}
        spaceBetween={10}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
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




