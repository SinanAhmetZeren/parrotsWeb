import React from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import parrotMarker1 from "../assets/images/parrotMarker1.png";
import parrotMarker2 from "../assets/images/parrotMarker2.png";
import parrotMarker3 from "../assets/images/parrotMarker3.png";
import parrotMarker4 from "../assets/images/parrotMarker4.png";
import parrotMarker5 from "../assets/images/parrotMarker5.png";
import parrotMarker6 from "../assets/images/parrotMarker6.png";

const markerImages = [
  parrotMarker1, parrotMarker2, parrotMarker3,
  parrotMarker4, parrotMarker5, parrotMarker6,
];

export const CreateVoyageWaypointsMarkers = ({ waypoints }) => {
  if (!waypoints || waypoints.length === 0) return null;

  return (
    <MarkerClusterGroup chunkedLoading>
      {waypoints
        .filter((wp) => wp.latitude && wp.longitude)
        .map((waypoint, index) => {
          const icon = L.icon({
            iconUrl: markerImages[index % 6],
            iconSize: [50, 60],
            iconAnchor: [25, 60],
          });

          return (
            <Marker
              key={`${waypoint.latitude}-${index}`}
              position={[waypoint.latitude, waypoint.longitude]}
              icon={icon}
            />
          );
        })}
    </MarkerClusterGroup>
  );
};
