import { Polyline } from "react-leaflet";

export function CreateVoyagePolyLineComponent3({ waypoints }) {
  if (!waypoints || waypoints.length < 2) return null;

  const positions = waypoints.map((wp) => [wp.latitude, wp.longitude]);

  return (
    <Polyline positions={positions} color="rgb(10, 119, 234)" opacity={0.8} weight={3} dashArray="20, 7" />
  );
}

export function CreateVoyagePolyLineComponent({ waypoints }) {
  if (!waypoints || waypoints.length < 2) return null;

  const positions = waypoints.map((wp) => [wp.latitude, wp.longitude]);

  return (
    <Polyline positions={positions} color="rgb(10, 119, 234)" opacity={0.8} weight={3} dashArray="20, 7" />
  );
}
