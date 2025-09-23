
import "../assets/css/App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";



export function VoyageDetailPageImageSwiper({ voyageData }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const baseUrl = ``;

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
            rotate: 0,
            stretch: 990,
            depth: 110,
            modifier: 1,
            slideShadows: false,
          }}
          navigation={true}
          modules={[Navigation]}
        >
          {images.map((url, index) => (
            <SwiperSlide key={index} style={slideContainerStyle}>
              <img
                src={baseUrl + url}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "95%",
                  margin: "auto",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  backgroundColor: "white",
                  marginTop: "0vh"
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
  height: "58vh",
  width: "100%",
};



