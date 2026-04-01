import parrotMarker1 from "../assets/images/parrotMarker1.png";
import parrotMarker2 from "../assets/images/parrotMarker2.png";
import parrotMarker3 from "../assets/images/parrotMarker3.png";
import parrotMarker4 from "../assets/images/parrotMarker4.png";
import parrotMarker5 from "../assets/images/parrotMarker5.png";
import parrotMarker6 from "../assets/images/parrotMarker6.png";
import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerImages = [
  parrotMarker1, parrotMarker2, parrotMarker3,
  parrotMarker4, parrotMarker5, parrotMarker6,
];

export const VoyageDetailMarkerWithInfoWindow = ({ position, waypointTitle, index }) => {
  const icon = L.icon({
    iconUrl: markerImages[index % 6],
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -62],
  });

  return (
    <Marker position={[position.lat, position.lng]} icon={icon}>
      <Popup autoClose={false} closeOnClick={false} autoPan={false}>
        <span style={popupStyle}>{waypointTitle}</span>
      </Popup>
    </Marker>
  );
};

const popupStyle = {
  color: "rgb(0, 119, 234)",
  fontWeight: "bold",
  fontSize: "1rem",
};
