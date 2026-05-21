import React from "react";
import { Marker, Popup } from "react-leaflet";
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

export const VoyageDetailMarkerWithInfoWindow = ({ position, waypointTitle, index, total }) => {
  let color = "#ffff00";
  if (index === 0) color = "#22C55E";
  else if (index === total - 1) color = "red";

  const icon = createColorIcon(color);

  return (
    <Marker position={[position.lat, position.lng]} icon={icon}>
      <Popup autoClose={false} closeOnClick={false} autoPan={false}>
        <span style={popupStyle}>{waypointTitle}</span>
      </Popup>
    </Marker>
  );
};

const popupStyle = {
  color: "rgb(0, 119, 234)",
  fontWeight: "bold",
  fontSize: "1rem",
};
