/* eslint-disable no-undef */
import "../assets/css/App.css";
import "../assets/css/advancedmarker.css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

export function CreateVoyagePolyLineComponent({ waypoints }) {
  const map = useMap();
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!map || !waypoints || waypoints.length === 0) return;

    // Remove previous polyline if it exists
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // Create the Polyline from the waypoints
    const polylineCoordinates = waypoints.map((waypoint) => ({
      lat: waypoint.latitude,
      lng: waypoint.longitude,
    }));

    polylineRef.current = new google.maps.Polyline({
      path: polylineCoordinates,
      geodesic: true,
      strokeColor: "#2ac", // Line color
      strokeOpacity: 0.6,
      strokeWeight: 4, // Line thickness
    });

    // Set the new Polyline on the map
    polylineRef.current.setMap(map);

    // Cleanup on unmount
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, waypoints]); // Re-run when waypoints change

  return null;
}