/* eslint-disable no-undef */
import "../assets/css/App.css";
import "../assets/css/advancedmarker.css";
import { useEffect } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useMap } from "@vis.gl/react-google-maps";

export function MainPageMapPanComponent({ targetLat, targetLng, setBounds }) {
  const map = useMap();

  useEffect(() => {
    const logMapBounds = () => {
      const bounds = map.getBounds();
      if (bounds) {
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();

        // console.log("Map Bounds:");
        // console.log("North-East:", northEast.lat(), northEast.lng());
        // console.log("South-West:", southWest.lat(), southWest.lng());

        setBounds({
          lat: { northEast: northEast.lat(), southWest: southWest.lat() },
          lng: { northEast: northEast.lng(), southWest: southWest.lng() },
        });
      }
    };

    if (map) {
      logMapBounds();
      const boundsChangedListener = google.maps.event.addListener(
        map,
        "bounds_changed",
        logMapBounds
      );
      return () => {
        google.maps.event.removeListener(boundsChangedListener);
      };
    }
  }, [map, setBounds]);

  useEffect(() => {
    if (map && targetLat && targetLng) {
      map.panTo({ lat: targetLat, lng: targetLng });
      map.setZoom(16);
    }
  }, [map, targetLat, targetLng]);

  return null;
}
