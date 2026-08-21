import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export function MainPageMapPanComponent({ targetLat, targetLng, setBounds, setInitialBounds, locationReady }) {
  const map = useMap();
  const hasSetInitialBounds = useRef(false);
  const locationReadyRef = useRef(locationReady);

  useEffect(() => {
    locationReadyRef.current = locationReady;
  }, [locationReady]);

  const extractBounds = (b) => ({
    lat: { northEast: b.getNorth(), southWest: b.getSouth() },
    lng: { northEast: b.getEast(), southWest: b.getWest() },
  });

  // Update bounds on every map move; set initialBounds once after location is ready
  useMapEvents({
    moveend() {
      const b = map.getBounds();
      if (!b) return;
      const newBounds = extractBounds(b);
      setBounds((prev) => {
        const isSame =
          prev &&
          prev.lat?.northEast === newBounds.lat.northEast &&
          prev.lat?.southWest === newBounds.lat.southWest &&
          prev.lng?.northEast === newBounds.lng.northEast &&
          prev.lng?.southWest === newBounds.lng.southWest;
        return isSame ? prev : newBounds;
      });
      if (locationReadyRef.current && !hasSetInitialBounds.current && setInitialBounds) {
        setInitialBounds(newBounds);
        hasSetInitialBounds.current = true;
      }
    },
  });

  // Pan to target location
  useEffect(() => {
    if (map && targetLat != null && targetLng != null) {
      map.flyTo([targetLat, targetLng], map.getZoom());
    }
  }, [map, targetLat, targetLng]);

  return null;
}
