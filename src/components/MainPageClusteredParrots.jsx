import React, { useCallback, useMemo, useRef, useState } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import * as d3 from "d3";
import parrotMarker1 from "../assets/images/parrotMarker1.png";
import parrotMarker2 from "../assets/images/parrotMarker2.png";
import parrotMarker3 from "../assets/images/parrotMarker3.png";
import parrotMarker4 from "../assets/images/parrotMarker4.png";
import parrotMarker5 from "../assets/images/parrotMarker5.png";
import parrotMarker6 from "../assets/images/parrotMarker6.png";
import whiteegg from "../assets/images/whiteegg.png";
import crackedwhiteegg from "../assets/images/crackedwhiteegg.png";
import silveregg from "../assets/images/silveregg.png";
import crackedsilveregg from "../assets/images/crackedsilveregg.png";
import goldenegg from "../assets/images/goldenegg.png";
import crackedgoldenegg from "../assets/images/crackedgoldenegg.png";
import { useNavigate } from "react-router-dom";
import { parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";


const placeIcons = {
  1: { normal: whiteegg, open: crackedwhiteegg },
  2: { normal: silveregg, open: crackedsilveregg },
  3: { normal: goldenegg, open: crackedgoldenegg },
};


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

function VoyageMarker({ voyage, icon, onGoToVoyage }) {
  const markerRef = useRef(null);

  return (
    <Marker ref={markerRef} position={[voyage.waypoints[0].latitude, voyage.waypoints[0].longitude]} icon={icon}>
      <Tooltip
        permanent
        direction="top"
        offset={[0, -62]}
        className="place-tooltip"
        eventHandlers={{ click: () => markerRef.current?.openPopup() }}
        interactive
      >
        {voyage.name}
      </Tooltip>
      <Popup maxWidth={540} autoPan={false} className="parrot-popup">
        <div style={cardContainerStyle}>
          <div style={cardImageStyle}>
            <img src={voyage.profileImageThumbnail || voyage.profileImage} style={imageStyle} alt="Voyage" />
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
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(voyage.brief) }}
            />
            <div
              style={{ position: "absolute", bottom: "0.6rem", right: "0.6rem", ...buttonStyle }}
              onClick={() => onGoToVoyage(voyage.id)}
            >
              see details
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

function PlaceMarker({ voyage, icon }) {
  const markerRef = useRef(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const eggSet = placeIcons[voyage.placeType] || placeIcons[3];
  const openIcon = L.icon({ iconUrl: eggSet.open, iconSize: [50, 60], iconAnchor: [25, 60], popupAnchor: [0, -41] });

  return (
    <Marker
      ref={markerRef}
      position={[voyage.waypoints[0].latitude, voyage.waypoints[0].longitude]}
      icon={popupOpen ? openIcon : icon}
      eventHandlers={{ popupopen: () => setPopupOpen(true), popupclose: () => setPopupOpen(false) }}
    >
      <Tooltip
        permanent
        direction="top"
        offset={[0, -62]}
        className="place-tooltip place-tooltip-place"
        eventHandlers={{ click: () => markerRef.current?.openPopup() }}
        interactive
      >
        {voyage.name}
      </Tooltip>
      <Popup maxWidth={540} autoPan={false} className="parrot-popup">
        <div style={cardContainerStyle}>
          <div style={cardImageStyle}>
            <img src={voyage.profileImageThumbnail || voyage.profileImage} style={imageStyle} alt="Place" />
          </div>
          <div style={cardContentStyle}>
            <div style={cardTitleStyle}>{voyage.name}</div>
            <div
              style={{ ...cardBriefStyle, WebkitLineClamp: 6, marginTop: "0.5rem" }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(voyage.description) }}
            />
            {voyage.brief && (
              <a
                href={voyage.brief.startsWith("http") ? voyage.brief : `https://${voyage.brief}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: "absolute", bottom: "0.6rem", right: "0.6rem", ...buttonStyle }}
              >
                visit website
              </a>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

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

        const isPlace = voyage.placeType > 0;
        const eggSet = placeIcons[voyage.placeType];

        const icon = L.icon({
          iconUrl: isPlace ? eggSet.normal : markerImages[index % 6],
          iconSize: [50, 60],
          iconAnchor: [25, 60],
          popupAnchor: isPlace ? [0, -41] : [0, -62],
        });

        if (isPlace) {
          return <PlaceMarker key={`place-${voyage.id}`} voyage={voyage} icon={icon} />;
        }

        return (
          <VoyageMarker
            key={`voyage-${voyage.id}-${index}`}
            voyage={voyage}
            icon={icon}
            onGoToVoyage={handleGoToVoyage}
          />
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
  fontSize: "1.1rem",
  fontFamily: "Nunito, sans-serif",
  fontWeight: "600",
  color: parrotTextDarkBlue,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 4,
  textOverflow: "ellipsis",
  lineHeight: "1.65rem",
  letterSpacing: "0.015em",
};

const cardDescriptionStyle = {
  fontSize: "1rem",
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
