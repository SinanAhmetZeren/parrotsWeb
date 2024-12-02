import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { MainPageVoyageCard } from "../components/MainPageVoyageCard";

const slideContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  marginLeft: "-4rem",
  width: "30rem",
};

export function MainPageCardSwiper({ cardData }) {
  return (
    <>
      <Swiper
        effect="coverflow"
        onSlideChangeTransitionEnd={(swiper) => {
          console.log("Slide transition completed:", swiper.activeIndex);
        }}
        onSlideChangeTransitionStart={() => {
          console.log("Slide transition started");
        }}
        speed={1000}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        spaceBetween={-0}
        // loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 100,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        navigation={
          {
            // prevEl: ".custom-prev",
            // nextEl: ".custom-next",
          }
        }
        modules={[EffectCoverflow, Navigation]}
        style={{ padding: "2rem 0", marginTop: "-7rem" }}
      >
        {cardData.map((data, index) => (
          <SwiperSlide key={index} style={slideContainerStyle}>
            <MainPageVoyageCard cardData={data} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
