import { Polyline } from "react-leaflet";

const colors = [
  "#FF0000", "#FF7F00", "#FFD700", "#ADFF2F", "#00FF00",
  "#00FFFF", "#1E90FF", "#0000FF", "#4B0082", "#9400D3",
];

export function VoyageDetailMapPolyLineComponent({ waypoints }) {
  if (!waypoints || waypoints.length < 2) return null;

  return (
    <>
      {waypoints.slice(0, -1).map((wp, i) => (
        <Polyline
          key={i}
          positions={[
            [wp.latitude, wp.longitude],
            [waypoints[i + 1].latitude, waypoints[i + 1].longitude],
          ]}
          color={colors[i % colors.length]}
          opacity={0.8}
          weight={4}
        />
      ))}
    </>
  );
}
