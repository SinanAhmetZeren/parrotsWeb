import img1 from "../assets/fareast1.jpg";
import img3 from "../assets/fareast2.jpeg";
import img2 from "../assets/fareast3.jpeg";
import "../App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";



export function VoyageDetailPageImageSwiper({ voyageData }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const baseUrl = `${apiUrl}/Uploads/VoyageImages/`;

  const images = [voyageData.profileImage, ...voyageData.voyageImages.map(image => image.voyageImagePath)
  ]

  return (
    <div style={{ backgroundColor: "" }}>
      <div style={{ backgroundColor: "" }}>
        <Swiper
          effect="coverflow"
          onSlideChangeTransitionEnd={(swiper) => {
            console.log("Slide transition completed:", swiper.activeIndex);
          }}
          onSlideChangeTransitionStart={() => {
            console.log("Slide transition started");
          }}
          speed={500}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 100,
            stretch: 150,
            depth: 600,
            modifier: 1,
            slideShadows: false,
          }}
          navigation={true}
          modules={[EffectCoverflow, Navigation]}
        >
          {images.map((url, index) => (
            <SwiperSlide key={index} style={slideContainerStyle}>
              <img
                src={baseUrl + url}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "2rem",
                  overflow: "hidden"
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

const slideContainerStyle = {
  height: "30rem", // Adjust height to fit your design
  width: "100%"
};



