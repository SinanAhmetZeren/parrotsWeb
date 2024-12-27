/* eslint-disable no-undef */
import parrotMarker1 from "../assets/parrotMarker1.png";
import parrotMarker2 from "../assets/parrotMarker2.png";
import parrotMarker3 from "../assets/parrotMarker3.png";
import parrotMarker4 from "../assets/parrotMarker4.png";
import parrotMarker5 from "../assets/parrotMarker5.png";
import parrotMarker6 from "../assets/parrotMarker6.png";
import "../App.css";
import "../assets/css/advancedmarker.css";
import React, { useState, useCallback } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { MainPageMapVoyageCard } from "./MainPageMapVoyageCard";
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

export const MarkerWithInfoWindow = ({
  position,
  voyage,
  index,
  onClick,
  clusterer,
}) => {
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = () => setInfoWindowShown((isShown) => !isShown);
  const handleClose = () => setInfoWindowShown(false);

  // useEffect(() => {
  //   if (clusterer) {
  //     clusterer.addMarker(new google.maps.Marker({ position }));
  //     console.log("hello");
  //   }
  // }, [position, clusterer]);

  return (
    <div onClick={onClick}>
      <AdvancedMarker position={position} onClick={handleMarkerClick}>
        {infoWindowShown && (
          <div className="info-window">
            <div>{voyage.name}</div>
            <button onClick={handleClose}>Close</button>
          </div>
        )}
      </AdvancedMarker>
    </div>
  );
};
