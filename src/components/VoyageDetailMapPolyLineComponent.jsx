/* eslint-disable no-undef */
import "../assets/css/App.css";
import "../assets/css/advancedmarker.css";
import { useEffect } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useMap } from "@vis.gl/react-google-maps";

export function VoyageDetailMapPolyLineComponent({ waypoints }) {
  const map = useMap();

  useEffect(() => {
    if (map && waypoints && waypoints.length > 0) {
      // Create the Polyline from the waypoints
      const polylineCoordinates = waypoints.map((waypoint) => ({
        lat: waypoint.latitude,
        lng: waypoint.longitude,
      }));

      const polyline = new google.maps.Polyline({
        path: polylineCoordinates,
        geodesic: true,
        strokeColor: "#2ac898", // Line color
        strokeOpacity: 0.6,
        strokeWeight: 4, // Line thickness
      });

      // Set the Polyline on the map
      polyline.setMap(map);
    }
  }, [map, waypoints]); // Re-run when waypoints change

  return null;
}