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
        console.log("bounds: ", northEast.lat(), southWest.lat(), northEast.lng(), southWest.lng());
        console.log("bounds delta lat : ", northEast.lat() - southWest.lat());
        console.log("bounds delta lng : ", northEast.lng() - southWest.lng());

        // setBounds({
        //   lat: { northEast: northEast.lat(), southWest: southWest.lat() },
        //   lng: { northEast: northEast.lng(), southWest: southWest.lng() },
        // });

        const newBounds = {
          lat: {
            northEast: northEast.lat(),
            southWest: southWest.lat()
          },
          lng: {
            northEast: northEast.lng(),
            southWest: southWest.lng()
          }
        };

        // Only update if bounds actually changed
        setBounds((prevBounds) => {
          const isSame =
            prevBounds &&
            prevBounds.lat?.northEast === newBounds.lat.northEast &&
            prevBounds.lat?.southWest === newBounds.lat.southWest &&
            prevBounds.lng?.northEast === newBounds.lng.northEast &&
            prevBounds.lng?.southWest === newBounds.lng.southWest;

          return isSame ? prevBounds : newBounds;
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
    // if (map && targetLat && targetLng) {
    if (map && targetLat != null && targetLng != null) {

      map.panTo({ lat: targetLat, lng: targetLng });
      map.setZoom(16);
    }
  }, [map, targetLat, targetLng]);

  return null;
}
