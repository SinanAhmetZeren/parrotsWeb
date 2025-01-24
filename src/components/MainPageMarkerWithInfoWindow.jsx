/* eslint-disable no-undef */
import parrotMarker1 from "../assets/parrotMarker1.png";
import parrotMarker2 from "../assets/parrotMarker2.png";
import parrotMarker3 from "../assets/parrotMarker3.png";
import parrotMarker4 from "../assets/parrotMarker4.png";
import parrotMarker5 from "../assets/parrotMarker5.png";
import parrotMarker6 from "../assets/parrotMarker6.png";
import "../assets/css/App.css";
import "../assets/css/advancedmarker.css";
import React, { useState, useCallback } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { MainPageMapVoyageCard } from "../components/MainPageMapVoyageCard";
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

export const MarkerWithInfoWindow = ({ position, voyage, index }) => {
  console.log("position", position);
  console.log("voyage", voyage);
  console.log("index", index);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      >
        <img
          alt={"pin"}
          src={
            index % 6 === 0
              ? parrotMarker1
              : index % 6 === 1
                ? parrotMarker2
                : index % 6 === 2
                  ? parrotMarker3
                  : index % 6 === 3
                    ? parrotMarker4
                    : index % 6 === 4
                      ? parrotMarker5
                      : parrotMarker6
          }
          width={50}
          height={60}
        />
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose} disableAutoPan={true}>
          <div className="info-window-custom">
            <MainPageMapVoyageCard cardData={voyage} />
          </div>
        </InfoWindow>
      )}
    </>
  );
};
