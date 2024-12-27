import leftArrow from "../assets/mainPageArrow.png";
import rightArrow from "../assets/mainPageArrow.png";
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

export function VoyageDetailPageImageSwiper({ imageUrls }) {

  const images = [img1, img2, img3]

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
                src={url}
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


        {/* <style>
          {`
          .swiper-button-next, .swiper-button-prev {
            background-size: contain;
            background-repeat: no-repeat;
            width: 40px;
            height: 40px;
          }

          .swiper-button-next {
            background-image: url(${rightArrow});
          }

           .swiper-button-prev {
            background-image: url(${leftArrow});
            transform: rotate(180deg);
          }

          .swiper-button-next::after, .swiper-button-prev::after {
            content: ""; 
          }
          `}
        </style> 
        */}


      </div>

    </div>
  );
}

const slideContainerStyle = {
  height: "30rem", // Adjust height to fit your design
  width: "100%"
};



