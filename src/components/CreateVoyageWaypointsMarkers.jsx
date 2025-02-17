import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import ReactDOM from "react-dom/client";
import parrot1 from "../assets/images/sailboat.jpg";
import * as d3 from "d3";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import parrotMarker1 from "../assets/images/parrotMarker1.png";
import parrotMarker2 from "../assets/images/parrotMarker2.png";
import parrotMarker3 from "../assets/images/parrotMarker3.png";
import parrotMarker4 from "../assets/images/parrotMarker4.png";
import parrotMarker5 from "../assets/images/parrotMarker5.png";
import parrotMarker6 from "../assets/images/parrotMarker6.png";
import { useNavigate } from "react-router-dom";


export const CreateVoyageWaypointsMarkers = ({ waypoints }) => {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState({});
  const map = useMap();

  const handleGoToVoyage = (voyageId) => {
    navigate(`/voyage-details/${voyageId}`);
  };

  const clusterer = useMemo(() => {
    if (!map) return null;
    const palette = (ratio) => {
      return d3.interpolateRgb("blue", "#26b170")(ratio);
    };
    const customRenderer = ({ count, position }, stats) => {
      const color = palette(count / stats.clusters.markers.max);

      const minRadiusInner = 37;
      const maxRadiusInner = 50;

      const min = stats.clusters.markers.min;
      const max = stats.clusters.markers.max;
      let normalizedCount;
      if (max !== min && !isNaN(count) && !isNaN(min) && !isNaN(max)) {
        normalizedCount = (count - min) / (max - min);
      } else {
        normalizedCount = 0;
      }

      const radiusInner =
        minRadiusInner + normalizedCount * (maxRadiusInner - minRadiusInner);
      const radiusMedium = radiusInner + 25;
      const radiusOuter = radiusInner + 40;

      const svg = window.btoa(`
        <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
          <circle cx="120" cy="120" opacity=".2" r="${radiusOuter}" fill="${color}" /> <!-- Outer circle -->
          <circle cx="120" cy="120" opacity=".5" r="${radiusMedium}" fill="${color}" /> <!-- Inner circle -->
          <circle cx="120" cy="120" opacity="1" r="${radiusInner + 3
        }" fill="${color}" /> <!-- Inner circle -->
        </svg>
      `);

      return new window.google.maps.marker.AdvancedMarkerElement({
        position,

        content: (() => {
          const markerContainer = document.createElement("div");
          const img = document.createElement("img");
          img.src = `data:image/svg+xml;base64,${svg}`;
          img.width = 75;
          img.height = 75;
          img.alt = "Marker";
          markerContainer.appendChild(img);

          const label = document.createElement("div");
          label.textContent = String(count);
          label.style.position = "absolute";
          label.style.top = "50%";
          label.style.left = "50%";
          label.style.transform = "translate(-50%, -50%)";
          label.style.color = "white";
          label.style.fontSize = "1rem";
          label.style.fontWeight = "bold";
          label.style.zIndex = "1000";

          markerContainer.appendChild(label);

          return markerContainer;
        })(),

        zIndex: 99999,
      });
    };

    return new MarkerClusterer({
      map,
      renderer: {
        render: customRenderer,
      },
    });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;
    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker, key) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;
      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;
        return newMarkers;
      }
    });
  }, []);

  const voyageMarkers = useMemo(() => {
    return waypoints
      .map((waypoint, index) => {
        if (!waypoint.latitude || !waypoint.longitude) return null;

        const position = {
          lat: waypoint.latitude,
          lng: waypoint.longitude,
        };

        let markerName =
          index % 6 === 0
            ? parrotMarker1
            : index % 6 === 1
              ? parrotMarker2
              : index % 6 === 2
                ? parrotMarker3
                : index % 6 === 3
                  ? parrotMarker4
                  : index % 6 === 4
                    ? parrotMarker5
                    : parrotMarker6;
        const parrotMarkerImg = document.createElement("img");
        parrotMarkerImg.src = markerName;
        parrotMarkerImg.style.width = "3rem";
        parrotMarkerImg.style.height = "4rem";
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position,
          title: waypoint.id ? waypoint.id.toString() : "Unknown",
          content: parrotMarkerImg,
          gmpClickable: true,
        });
        setMarkerRef(marker, `${waypoint.latitude}-${index}`);
        return marker;
      })
      .filter((marker) => marker !== null);
  }, [waypoints, setMarkerRef]);

  useEffect(() => {
    if (!clusterer || voyageMarkers.length === 0) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(voyageMarkers);
  }, [clusterer, voyageMarkers]);

  return null;
};


const voyageDetailSpan = {
  backgroundColor: "rgba(0, 119, 234,0.1)",
  color: "#007bff",
  borderRadius: "1rem",
  padding: "0.1rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "rgba(10, 119, 234,1)",
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

const cardContainerStyle = {
  display: "flex", // Flex for horizontal layout
  flexDirection: "row", // Ensure content is side-by-side
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  width: "33rem",
  height: "15rem",
  backgroundColor: "#fff",
  margin: "0rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 -8px 6px rgba(0, 0, 0, 0.1)
`,
};

// 12 & 18 -> 15 & 18

const cardImageStyle = {
  width: "45.45%", // Image takes half the width
  height: "auto", // Maintain aspect ratio
  objectFit: "cover",
};

const cardContentStyle = {
  display: "flex",
  flexDirection: "column",
  width: "54.54%", // Text content takes half the width
  padding: "1rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.4),
  inset 0 -6px 6px rgba(0, 0, 0, 0.4)
`,
  backgroundColor: "#fff", // Neutral background
};

const cardBriefStyle = {
  fontSize: "1rem",
  color: "black",
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

export default function VehicleIcon({ vehicleType }) {
  const getVehicleEmoji = (typeIndex) => {
    if (typeIndex >= 0 && typeIndex < vehicles.length) {
      return vehicles[typeIndex];
    }
    return "❓";
  };

  return (
    <span style={{ textAlign: "center" }}>{getVehicleEmoji(vehicleType)}</span>
  );
}

const vehicles = [
  "⛵", // Boat
  "🚗", // Car
  "🏕️", // Caravan
  "🚌", // Bus
  "🚶", // Walk
  "🏃", // Run
  "🏍️", // Motorcycle
  "🚲", // Bicycle
  "🏠", // Tinyhouse
  "✈️", // Airplane
];

const buttonStyle = {
  width: "55%", // Match the input width
  textAlign: "end",
  color: "#007bff",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
  marginTop: "auto",
};
