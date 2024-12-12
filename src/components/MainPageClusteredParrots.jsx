import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { MarkerWithInfoWindow } from "./MainPageMarkerWithInfoWindow";
import parrotMarker1 from "../assets/parrotMarker1.png";
import parrotMarker2 from "../assets/parrotMarker2.png";
import parrotMarker3 from "../assets/parrotMarker3.png";
import parrotMarker4 from "../assets/parrotMarker4.png";
import parrotMarker5 from "../assets/parrotMarker5.png";
import parrotMarker6 from "../assets/parrotMarker6.png";
import ReactDOM from "react-dom/client"; // Updated import for React 18
import parrot1 from "../assets/sailboat.jpg";
import * as d3 from "d3"; // Make sure d3 is installed

export const ClusteredVoyageMarkers = ({ voyages }) => {
  const [markers, setMarkers] = useState({});

  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    const palette = (ratio) => {
      return d3.interpolateRgb("red", "blue")(ratio);
    };
    const customRenderer = ({ count, position }, stats) => {
      // Use d3-interpolateRgb to interpolate between red and blue
      const color = palette(count / stats.clusters.markers.max);

      const radiusInner = Math.min(20 + count * 5, 150); // Inner circle size
      const radiusMedium = radiusInner + 15; // Outer circle is slightly larger than inner circle
      const radiusOuter = radiusInner + 25; // Outer circle is slightly larger than inner circle

      // Create SVG with fill color and dynamic radius for both inner and outer circles
      const svg = window.btoa(`
        <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
          <circle cx="120" cy="120" opacity=".3" r="${radiusOuter}" fill="${color}" /> <!-- Outer circle -->
          <circle cx="120" cy="120" opacity=".7" r="${radiusMedium}" fill="${color}" /> <!-- Inner circle -->
          <circle cx="120" cy="120" opacity="1" r="${radiusInner}" fill="${color}" /> <!-- Inner circle -->
        </svg>
      `);

      // Create marker with SVG icon
      return new window.google.maps.Marker({
        position,
        icon: {
          url: `data:image/svg+xml;base64,${svg}`,
          scaledSize: new window.google.maps.Size(75, 75), // Adjust size as needed
        },
        label: {
          text: String(count),
          color: "rgba(255,255,255,0.9)",
          fontSize: "12px", // Adjust font size as needed
        },
        zIndex: 99999, // Ensure z-index is correct
      });
    };

    return new MarkerClusterer({
      map,

      renderer: {
        render: customRenderer, // Use your custom renderer function
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

  const handlePanToLocation = useCallback(
    (lat, lng) => {
      if (map) {
        map.panTo({ lat, lng });
      }
    },
    [map]
  );

  const voyageMarkers = useMemo(() => {
    return voyages
      .map((voyage, index) => {
        if (!voyage.waypoints?.[0]) return null;

        const position = {
          lat: voyage.waypoints[0].latitude,
          lng: voyage.waypoints[0].longitude,
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
          title: voyage.id.toString(),
          content: parrotMarkerImg,
          gmpClickable: true,
        });

        const parrotContent = (cardData) => {
          return (
            <div className="" style={cardContainerStyle}>
              <div className="" style={cardImageStyle}>
                <img src={parrot1} style={imageStyle} alt="Boat tour" />
              </div>
              <div className="" style={cardContentStyle}>
                <div style={cardTitleStyle}>{cardData.name}</div>
                <div style={cardDescriptionStyle}>
                  <div
                    style={{
                      marginTop: "0.2rem",
                      marginBottom: "0.2rem",
                    }}
                  >
                    <span
                      style={{ ...voyageDetailSpan, marginRight: "0.5rem" }}
                    >
                      <VehicleIcon vehicleType={cardData.vehicleType} />
                      {cardData.vehicle.name}
                    </span>
                    <span style={voyageDetailSpan}>
                      👨‍👨‍👦‍👦
                      {cardData.vacancy}
                    </span>
                  </div>
                  <span style={voyageDetailSpan}>
                    📅From {formatCustomDate(cardData.startDate)} to To{" "}
                    {formatCustomDate(cardData.endDate)}
                  </span>
                </div>

                <div style={cardBriefStyle}>{cardData.brief}</div>
              </div>
            </div>
          );
        };

        const infoWindow = new window.google.maps.InfoWindow({
          content: document.createElement("div"), // Creating a container div
        });

        const containerDiv = document.createElement("div"); // Creating a container div for JSX
        const root = ReactDOM.createRoot(containerDiv); // Create the React root inside the container div
        root.render(parrotContent(voyage)); // Render the JSX content into the div

        infoWindow.setContent(containerDiv); // Set the content of InfoWindow

        let isInfoWindowOpen = false;

        marker.addListener("click", () => {
          if (isInfoWindowOpen) {
            infoWindow.close();
          } else {
            infoWindow.open({
              anchor: marker,
              map,
            });
          }
          isInfoWindowOpen = !isInfoWindowOpen; // Toggle the state
        });

        setMarkerRef(marker, `${voyage.waypoints[0].latitude}-${index}`);

        return marker;
      })
      .filter((marker) => marker !== null);
  }, [voyages, handlePanToLocation, setMarkerRef]);

  useEffect(() => {
    if (!clusterer || voyageMarkers.length === 0) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(voyageMarkers);

    const clustersWithIds = clusterer.clusters.map((cluster) =>
      cluster.markers.map((marker) => marker.id)
    );
    console.log("clustersWithIds.", clustersWithIds);
  }, [clusterer, voyageMarkers]);

  return <></>;
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
  width: "30rem",
  backgroundColor: "#fff",
  margin: "0rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 -8px 6px rgba(0, 0, 0, 0.1)
`,
};

const cardImageStyle = {
  width: "50%", // Image takes half the width
  height: "auto", // Maintain aspect ratio
  objectFit: "cover",
};

const cardContentStyle = {
  display: "flex",
  flexDirection: "column",
  width: "50%", // Text content takes half the width
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
