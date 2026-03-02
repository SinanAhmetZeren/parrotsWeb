/* eslint-disable no-undef */
import "../assets/css/App.css";
import "../assets/css/advancedmarker.css";
import { useEffect } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useMap } from "@vis.gl/react-google-maps";
import { parrotDarkBlue, parrotGreen, parrotTextDarkBlue } from "../styles/colors";

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
        strokeColor: parrotGreen, // Line color
        strokeOpacity: 0.1,
        strokeWeight: 7, // Line thickness

        icons: [
          {
            icon: {
              path: "M 0,-1 0,2",
              strokeOpacity: 1,
              strokeColor: parrotTextDarkBlue, // White outline
              scale: 4,
              strokeWeight: 8,       // THICKER (Outer)
            },
            offset: "0",
            repeat: "30px"
          },
          {
            // --- THE GREEN DASH ---
            icon: {
              path: "M 0,-1 0,2",
              strokeOpacity: 1,
              strokeColor: "#2ac898", // Green center
              scale: 4,
              strokeWeight: 7,       // THINNER (Inner)
            },
            offset: "0",
            repeat: "30px"
          }
        ]

      });

      // Set the Polyline on the map
      polyline.setMap(map);
    }
  }, [map, waypoints]); // Re-run when waypoints change

  return null;
}