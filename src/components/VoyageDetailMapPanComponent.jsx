import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function VoyageDetailMapPanComponent({ targetLat, targetLng, panKey }) {
  const map = useMap();

  useEffect(() => {
    if (map && targetLat && targetLng) {
      map.flyTo([targetLat, targetLng], Math.max(map.getZoom(), 9));
    }
  }, [map, targetLat, targetLng, panKey]);

  return null;
}
