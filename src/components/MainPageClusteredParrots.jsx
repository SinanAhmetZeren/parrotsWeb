import React, { useCallback, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import * as d3 from "d3";
import parrotMarker1 from "../assets/images/parrotMarker1.png";
import parrotMarker2 from "../assets/images/parrotMarker2.png";
import parrotMarker3 from "../assets/images/parrotMarker3.png";
import parrotMarker4 from "../assets/images/parrotMarker4.png";
import parrotMarker5 from "../assets/images/parrotMarker5.png";
import parrotMarker6 from "../assets/images/parrotMarker6.png";
import { useNavigate } from "react-router-dom";
import { parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";

const markerImages = [
  parrotMarker1, parrotMarker2, parrotMarker3,
  parrotMarker4, parrotMarker5, parrotMarker6,
];

const palette = (ratio) => d3.interpolateRgb("blue", "#26b170")(ratio);

const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  const color = palette(Math.min(count / 20, 1));
  const radiusInner = Math.min(37 + count * 0.5, 50);
  const radiusMedium = radiusInner + 25;
  const radiusOuter = radiusInner + 40;
  const size = 75;

  return L.divIcon({
    html: `
      <div style="position:relative;width:${size}px;height:${size}px">
        <svg viewBox="0 0 240 240" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="120" cy="120" opacity=".2" r="${radiusOuter}" fill="${color}" />
          <circle cx="120" cy="120" opacity=".5" r="${radiusMedium}" fill="${color}" />
          <circle cx="120" cy="120" opacity="1" r="${radiusInner + 3}" fill="${color}" />
        </svg>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:1rem;font-weight:bold;pointer-events:none;">${count}</div>
      </div>
    `,
    className: "",
    iconSize: L.point(size, size, true),
    iconAnchor: [size / 2, size / 2],
  });
};

export const ClusteredVoyageMarkers = ({ voyages }) => {
  const navigate = useNavigate();

  const handleGoToVoyage = useCallback(
    (voyageId) => navigate(`/voyage-details/${voyageId}`),
    [navigate]
  );

  const markers = useMemo(() => {
    return voyages
      .map((voyage, index) => {
        if (!voyage.waypoints?.[0]) return null;
        const { latitude, longitude } = voyage.waypoints[0];

        const icon = L.icon({
          iconUrl: markerImages[index % 6],
          iconSize: [50, 60],
          iconAnchor: [25, 60],
          popupAnchor: [0, -62],
        });

        return (
          <Marker
            key={`${latitude}-${index}`}
            position={[latitude, longitude]}
            icon={icon}
          >
            <Popup maxWidth={540} autoPan={false} className="parrot-popup">
              <div style={cardContainerStyle}>
                <div style={cardImageStyle}>
                  <img
                    src={voyage.profileImage}
                    style={imageStyle}
                    alt="Voyage"
                  />
                </div>
                <div style={cardContentStyle}>
                  <div style={cardTitleStyle}>{voyage.name}</div>
                  <div style={cardDescriptionStyle}>
                    <div style={{ marginTop: "0.2rem", marginBottom: "0.2rem" }}>
                      <span style={{ ...voyageDetailSpan, marginRight: "0.5rem" }}>
                        <VehicleIcon vehicleType={voyage.vehicleType} />
                        {voyage.vehicle?.name}
                      </span>
                      <span style={voyageDetailSpan}>
                        👨‍👨‍👦‍👦 {voyage.vacancy}
                      </span>
                    </div>
                    <span style={voyageDetailSpan}>
                      📅 {formatCustomDate(voyage.startDate)} to {formatCustomDate(voyage.endDate)}
                    </span>
                  </div>
                  <div
                    style={cardBriefStyle}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(voyage.brief),
                    }}
                  />
                  <div
                    style={{ position: "absolute", bottom: "0.6rem", right: "0.6rem", ...buttonStyle }}
                    onClick={() => handleGoToVoyage(voyage.id)}
                  >
                    click to see details
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })
      .filter(Boolean);
  }, [voyages, handleGoToVoyage]);

  return (
    <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon} chunkedLoading>
      {markers}
    </MarkerClusterGroup>
  );
};

function formatCustomDate(dateString) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
    .format(new Date(dateString))
    .replace(/^(\d{2}) (\w+) (\d{2})$/, "$2-$1, $3");
}

export default function VehicleIcon({ vehicleType }) {
  const vehicles = [
    "⛵", "🚗", "🚐", "🚌", "🚶", "🏃", "🏍️", "🚲", "🏠", "✈️", "🚄",
  ];
  return (
    <span style={{ textAlign: "center" }}>
      {vehicles[vehicleType] ?? "❓"}
    </span>
  );
}

const voyageDetailSpan = {
  backgroundColor: "rgba(0, 119, 234,0.1)",
  color: "#007bff",
  borderRadius: "1rem",
  padding: "0.1rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
};

const imageStyle = { width: "100%", height: "100%", objectFit: "cover" };

const cardTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "rgba(10, 119, 234,1)",
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "row",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  width: "33rem",
  height: "15rem",
  backgroundColor: "#fff",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -8px 6px rgba(0,0,0,0.1)",
};

const cardImageStyle = {
  width: "45.45%",
  height: "auto",
  objectFit: "cover",
};

const cardContentStyle = {
  display: "flex",
  flexDirection: "column",
  width: "54.54%",
  padding: "1rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.4), inset 0 -6px 6px rgba(0,0,0,0.4)",
  backgroundColor: "#fff",
  position: "relative",
};

const cardBriefStyle = {
  fontSize: "1rem",
  color: parrotTextDarkBlue,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 5,
  textOverflow: "ellipsis",
};

const cardDescriptionStyle = {
  fontSize: "1rem",
  color: "blue",
  fontWeight: "600",
  marginTop: "0.5rem",
};

const buttonStyle = {
  width: "55%",
  textAlign: "end",
  color: "#007bff",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
};
