import leftArrow from "../assets/mainPageArrow.png";
import rightArrow from "../assets/mainPageArrow.png";
import img1 from "../assets/catamaran.jpeg";
import img2 from "../assets/caravan.jpeg";
import img3 from "../assets/caravanserai.png";
import "../App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";


export function VoyageDetailPageDetails({ voyage }) {

  console.log(voyage);

  const voyage2 = {
    user: "user",
    vehicle: "vehicle",
    vacancy: 3,
    bidsClose: "11,11,1111",
    dates: "11,11,11 - 22,22,22",
    minPrice: "33",
    maxPrice: "99",
    auction: false
  }

  return (
    <div style={{ backgroundColor: "" }}>
      <div>
        <span>User</span>
        <span>{voyage2.user}</span>
      </div>
      <div>
        <span>Vehicle</span>
        <span>{voyage2.vehicle}</span>
      </div>
      <div>
        <span>Vacancy</span>
        <span>{voyage2.vacancy}</span>
      </div>
      <div>
        <span>Bids Close</span>
        <span>{voyage2.bidsClose}</span>
      </div>
      <div>
        <span>Dates</span>
        <span>{voyage2.dates}</span>
      </div>
      <div>
        <span>Min Price</span>
        <span>{voyage2.minPrice}</span>
      </div>
      <div>
        <span>Max Price</span>
        <span>{voyage2.maxPrice}</span>
      </div>
      <div>
        <span>Auction</span>
        <span>{voyage2.auction}</span>
      </div>
    </div>
  );
}

