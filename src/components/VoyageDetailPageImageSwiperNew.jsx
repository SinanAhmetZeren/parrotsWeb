
import "../assets/css/App.css";
import * as React from "react";
import { useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import rightOrangeArrow from "../assets/images/arrow-right-orange.png";



export function VoyageDetailPageImageSwiperNew({ voyageData }) {
  const baseUrl = ``;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const images = [voyageData?.profileImage, ...(voyageData?.voyageImages?.map(image => image.voyageImagePath) ?? [])];

  return (
    <div style={{ position: "relative" }}>
      <div style={{ borderRadius: "1rem", overflow: "hidden" }}>
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
        navigation={images.length > 1 ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
        onBeforeInit={(swiper) => {
          if (images.length > 1) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        modules={[Navigation]}
      >
        {images.map((url, index) => (
          <SwiperSlide key={index} style={slideContainerStyle}>
            <img
              src={baseUrl + url}
              alt={`Slide ${index + 1}`}
              style={{
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

      <style>{`
        .swiper-button-disabled {
          opacity: 0 !important;
          cursor: default !important;
        }
      `}</style>
      </div>
      {images.length > 1 && (
        <>
          <div
            ref={prevRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "-3.5rem",
              transform: "translateY(-50%)",
              height: "2.5rem",
              width: "2.5rem",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <img src={rightOrangeArrow} alt="Previous" style={{ width: "100%", height: "100%", transform: "scaleX(-1)" }} />
          </div>
          <div
            ref={nextRef}
            style={{
              position: "absolute",
              top: "50%",
              right: "-3.5rem",
              transform: "translateY(-50%)",
              height: "2.5rem",
              width: "2.5rem",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <img src={rightOrangeArrow} alt="Next" style={{ width: "100%", height: "100%" }} />
          </div>
        </>
      )}
    </div>
  );
}

const slideContainerStyle = {
  height: "58vh",
  width: "100%",
};
