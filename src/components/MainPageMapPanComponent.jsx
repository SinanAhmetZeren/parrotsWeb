import { useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export function MainPageMapPanComponent({ targetLat, targetLng, setBounds, setInitialBounds }) {
  const map = useMap();
  const hasInit = useRef(false);

  const extractBounds = (b) => ({
    lat: { northEast: b.getNorth(), southWest: b.getSouth() },
    lng: { northEast: b.getEast(), southWest: b.getWest() },
  });

  // Set initial bounds once when map is ready
  useEffect(() => {
    if (!map) return;
    map.whenReady(() => {
      if (hasInit.current) return;
      const b = map.getBounds();
      if (!b) return;
      const newBounds = extractBounds(b);
      setBounds(newBounds);
      if (setInitialBounds) setInitialBounds(newBounds);
      hasInit.current = true;
    });
  }, [map, setBounds, setInitialBounds]);

  // Update bounds on every map move
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
    },
  });

  // Pan to target location
  useEffect(() => {
    if (map && targetLat != null && targetLng != null) {
      map.flyTo([targetLat, targetLng], 16);
    }
  }, [map, targetLat, targetLng]);

  return null;
}
