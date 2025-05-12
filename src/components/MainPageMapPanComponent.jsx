/* eslint-disable no-undef */
import "../assets/css/App.css";
import "../assets/css/advancedmarker.css";
import { useEffect } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useMap } from "@vis.gl/react-google-maps";


export function MainPageMapPanComponent({ targetLat, targetLng, setBounds, initialBounds }) {
  const map = useMap();
  // console.log("initialbouds: ", initialBounds);
  // Fetch bounds once on mount, retrying if needed
  useEffect(() => {
    if (!map) return;

    let intervalId = null;
    let tryCount = 0;
    const maxTries = 20;

    const trySetInitialBounds = () => {
      const bounds = map.getBounds();
      if (!bounds) {
        tryCount++;
        if (tryCount >= maxTries) clearInterval(intervalId);
        return;
      }

      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      const newBounds = {
        lat: {
          northEast: northEast.lat(),
          southWest: southWest.lat(),
        },
        lng: {
          northEast: northEast.lng(),
          southWest: southWest.lng(),
        },
      };

      setBounds((prevBounds) => {
        const isSame =
          prevBounds &&
          prevBounds.lat?.northEast === newBounds.lat.northEast &&
          prevBounds.lat?.southWest === newBounds.lat.southWest &&
          prevBounds.lng?.northEast === newBounds.lng.northEast &&
          prevBounds.lng?.southWest === newBounds.lng.southWest;

        return isSame ? prevBounds : newBounds;
      });

      clearInterval(intervalId);
    };

    intervalId = setInterval(trySetInitialBounds, 200);
    return () => clearInterval(intervalId);
  }, [map, setBounds]);

  // Listen for bounds_changed and update
  useEffect(() => {
    if (!map) return;

    const onBoundsChanged = () => {
      const bounds = map.getBounds();
      if (!bounds) return;

      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      const newBounds = {
        lat: {
          northEast: northEast.lat(),
          southWest: southWest.lat(),
        },
        lng: {
          northEast: northEast.lng(),
          southWest: southWest.lng(),
        },
      };

      setBounds((prevBounds) => {
        const isSame =
          prevBounds &&
          prevBounds.lat?.northEast === newBounds.lat.northEast &&
          prevBounds.lat?.southWest === newBounds.lat.southWest &&
          prevBounds.lng?.northEast === newBounds.lng.northEast &&
          prevBounds.lng?.southWest === newBounds.lng.southWest;

        return isSame ? prevBounds : newBounds;
      });
    };

    const listener = google.maps.event.addListener(map, "bounds_changed", onBoundsChanged);
    return () => google.maps.event.removeListener(listener);
  }, [map, setBounds]);

  // Pan to marker if targetLat/Lng is provided
  useEffect(() => {
    // if (map && targetLat && targetLng) {
    if (map && targetLat != null && targetLng != null) {
      map.panTo({ lat: targetLat, lng: targetLng });
      map.setZoom(16);
    }
  }, [map, targetLat, targetLng]);

  return null;
}
