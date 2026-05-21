import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

const createColorIcon = (color) => {
  const svg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41"><path d="M12.5 0C5.596 0 0 5.596 0 12.5C0 21.875 12.5 41 12.5 41C12.5 41 25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" fill="${color}"/><circle cx="12.5" cy="12.5" r="5" fill="white" fill-opacity="0.5"/></svg>`);
  return L.icon({
    iconUrl: `data:image/svg+xml,${svg}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -43],
  });
};

export const CreateVoyageWaypointsMarkers = ({ waypoints }) => {
  if (!waypoints || waypoints.length === 0) return null;

  return (
    <>
      {waypoints
        .filter((wp) => wp.latitude && wp.longitude)
        .map((waypoint, index) => {
          let color = "#06B6D4";
          if (index === 0) color = "#22C55E";
          else if (index === waypoints.length - 1) color = "red";

          return (
            <Marker
              key={`${waypoint.latitude}-${index}`}
              position={[waypoint.latitude, waypoint.longitude]}
              icon={createColorIcon(color)}
            />
          );
        })}
    </>
  );
};
