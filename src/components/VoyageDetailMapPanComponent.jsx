import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function VoyageDetailMapPanComponent({ targetLat, targetLng }) {
  const map = useMap();

  useEffect(() => {
    if (map && targetLat && targetLng) {
      map.flyTo([targetLat, targetLng], 9);
    }
  }, [map, targetLat, targetLng]);

  return null;
}
