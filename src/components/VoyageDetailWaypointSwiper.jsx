import img1 from "../assets/fareast1.jpg";
import img3 from "../assets/fareast2.jpeg";
import img2 from "../assets/fareast3.jpeg";
import "../App.css";
import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export function VoyageDetailWaypointSwiper({ waypoints }) {

  const images = [img2, img1, img3]

  return (
    <div style={{}}>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        style={{
          width: "100%",
          height: "35vh",
          backgroundColor: "orange"
        }}
      >
        {images.map((url, index) => (
          <SwiperSlide
            key={index}
            style={{
              textAlign: "center",
              fontSize: "18px",
              background: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "pink",
              width:
                index % 3 === 0
                  ? "20%" // For every 3rd slide
                  : index % 2 === 0
                    ? "40%" // For every even slide
                    : "60%", // For all others
            }}
          >
            <img
              src={url}
              alt={`Slide ${index + 1}`}
              style={{
                display: "block",
                height: "100%",
                objectFit: "cover",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                borderRadius: "2rem",
                overflow: "hidden",
                backgroundColor: "red"
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

const slideContainerStyle = {
  height: "30rem", // Adjust height to fit your design
  width: "100%"
};



