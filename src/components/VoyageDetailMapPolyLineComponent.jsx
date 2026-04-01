import { Polyline } from "react-leaflet";
import { parrotTextDarkBlue } from "../styles/colors";

export function VoyageDetailMapPolyLineComponent({ waypoints }) {
  if (!waypoints || waypoints.length === 0) return null;

  const positions = waypoints.map((wp) => [wp.latitude, wp.longitude]);

  return (
    <Polyline
      positions={positions}
      color={parrotTextDarkBlue}
      weight={4}
      dashArray="8 8"
      opacity={0.85}
    />
  );
}
