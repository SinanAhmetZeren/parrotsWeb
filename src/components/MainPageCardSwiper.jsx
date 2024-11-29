import leftArrow from "../assets/mainPageArrow.png";
import rightArrow from "../assets/mainPageArrow.png";
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
        {/* <SwiperSlide style={slideContainerStyle}>
            <img src={parrot4} style={parrotImageStyle} alt="Slide 4" />
          </SwiperSlide> */}

        {cardData.map((data, index) => (
          <SwiperSlide key={index} style={slideContainerStyle}>
            <MainPageVoyageCard cardData={data} />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 
      <div
        className="custom-prev"
        style={{
          position: "absolute",
          top: "50%",
          left: ".5rem",
          zIndex: 10,
          height: "2.5rem",
          width: "2.5rem",
          cursor: "pointer",
          transform: "scaleX(-1)", // Flipping horizontally
          marginTop: "-4rem",
        }}
      >
        <img src={leftArrow} alt="Previous" />
      </div>
      <div
        className="custom-next"
        style={{
          position: "absolute",
          top: "50%",
          left: "29rem",
          zIndex: 10,
          height: "3rem",
          width: "3rem",
          cursor: "pointer",
          marginTop: "-4rem",
        }}
      >
        <img src={rightArrow} alt="Next" />
      </div> */}
    </>
  );
}
