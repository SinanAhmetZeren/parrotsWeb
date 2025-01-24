/* eslint-disable no-undef */
import parrotMarker1 from "../assets/parrotMarker1.png";
import parrotMarker2 from "../assets/parrotMarker2.png";
import parrotMarker3 from "../assets/parrotMarker3.png";
import parrotMarker4 from "../assets/parrotMarker4.png";
import parrotMarker5 from "../assets/parrotMarker5.png";
import parrotMarker6 from "../assets/parrotMarker6.png";
import "../assets/css/App.css";
import "../assets/css/advancedmarker.css";
import React, { useState, useCallback, useEffect } from "react";
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

export const VoyageDetailMarkerWithInfoWindow = ({ position, waypointTitle, index }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(true);

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  // Ensure the InfoWindow opens once the marker is ready
  useEffect(() => {
    if (marker) {
      console.log("marker: ", marker);
      console.log("infosohwn: ", infoWindowShown);
      setInfoWindowShown(true);
    }
  }, [marker]);

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
      {(infoWindowShown) && (
        <InfoWindow anchor={marker} onClose={() => handleClose()} disableAutoPan={true}>
          <div className="info-window-custom">
            <span style={popupStyle}>{waypointTitle}</span>
          </div>

        </InfoWindow>
      )}
    </>
  );
};


const popupStyle = {
  backgroundColor: "white",
  padding: ".5rem",
  borderRadius: "1rem",
  color: "rgb(0, 119, 234)",
  margin: "1rem",
  zIndex: 100,
  fontWeight: "bold"
}

