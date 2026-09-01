import rightOrangeArrow from "../assets/images/arrow-right-orange.png";
import "../assets/css/App.css";
import * as React from "react";
import { useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";



export function VoyageDetailPageImageSwiper({ voyageData, opacity }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const baseUrl = ``;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const images = [voyageData?.profileImage, ...(voyageData?.voyageImages?.map(image => image.voyageImagePath) ?? [])
  ]

  return (
    <div style={{ position: "relative", zIndex: 0 }}>
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
        >
          {images.map((url, index) => (
            <SwiperSlide key={index} style={slideContainerStyle}>
              <img
                src={baseUrl + url}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "95%",
                  width: "50rem",
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
        <div
          ref={prevRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "-1%",
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
            right: "-1%",
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
            opacity: 0.5 !important;
            cursor: default !important;
          }
        `}</style>
      </div>
    </div>
  );
}

const slideContainerStyle = {
  height: "58vh",
  height: "40vh",
  width: "100%",
};



