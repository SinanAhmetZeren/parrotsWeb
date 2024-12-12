/* eslint-disable no-undef */
import "../App.css";
import "../assets/css/advancedmarker.css";
import { useEffect } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useMap } from "@vis.gl/react-google-maps";

export function MainPageMapPanComponent({ targetLat, targetLng }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
    }

    if (map && targetLat && targetLng) {
      map.panTo({ lat: targetLat, lng: targetLng });
      map.setZoom(16);
    }
  }, [map, targetLat, targetLng]);

  return null;
}
