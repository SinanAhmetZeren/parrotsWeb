/* eslint-disable no-undef */
import "../assets/css/App.css";
import "../assets/css/advancedmarker.css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

export function CreateVoyagePolyLineComponent3({ waypoints }) {
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


export function CreateVoyagePolyLineComponent({ waypoints }) {
  const map = useMap();
  const polylinesRef = useRef([]);

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) return;

    // Remove previous polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    const colors = [
      "#FF0000", "#FF7F00", "#FFD700", "#ADFF2F", "#00FF00",
      "#00FFFF", "#1E90FF", "#0000FF", "#4B0082", "#9400D3"
    ];


    // Create multiple polylines with different colors
    for (let i = 0; i < waypoints.length - 1; i++) {
      const segment = [
        { lat: waypoints[i].latitude, lng: waypoints[i].longitude },
        { lat: waypoints[i + 1].latitude, lng: waypoints[i + 1].longitude },
      ];

      const color = colors[i % colors.length]; // Cycle through colors

      const polyline = new google.maps.Polyline({
        path: segment,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 4,
      });

      polyline.setMap(map);
      polylinesRef.current.push(polyline);
    }

    return () => {
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
    };
  }, [map, waypoints]);

  return null;
}
