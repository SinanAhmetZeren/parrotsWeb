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
import ReactDOM from "react-dom"; // Ensure you import ReactDOM
import parrot1 from "../assets/sailboat.jpg";

export const ClusteredVoyageMarkers = ({ voyages }) => {
  const [markers, setMarkers] = useState({});
  const [selectedVoyageKey, setSelectedVoyageKey] = useState(null);

  const selectedVoyage = useMemo(
    () =>
      voyages && selectedVoyageKey
        ? voyages.find((v) => v.key === selectedVoyageKey)
        : null,
    [voyages, selectedVoyageKey]
  );

  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;
    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  // This callback will be passed as ref to the markers to keep track of markers currently on the map
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

  const handleInfoWindowClose = useCallback(() => {
    setSelectedVoyageKey(null);
  }, []);

  const handleMarkerClick = useCallback((voyage) => {
    setSelectedVoyageKey(voyage.key);
  }, []);

  const handlePanToLocation = useCallback(
    (lat, lng) => {
      if (map) {
        map.panTo({ lat, lng });
      }
    },
    [map]
  );

  // Create an array of markers that will be added to the clusterer
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

        const parrotMarkerImg2a = document.createElement("img");
        parrotMarkerImg2a.src = markerName;
        parrotMarkerImg2a.style.width = "15rem";
        parrotMarkerImg2a.style.height = "20rem";
        const parrotMarkerImg2b = document.createElement("img");
        parrotMarkerImg2b.src = parrotMarker1;
        parrotMarkerImg2b.style.width = "5rem";
        parrotMarkerImg2b.style.height = "14rem";
        const parrotDiv2 = document.createElement("div");
        parrotDiv2.appendChild(parrotMarkerImg2a);
        parrotDiv2.appendChild(parrotMarkerImg2b);

        const parrotContent2 = () => {
          return (
            <>
              {voyages.map((voyage, index) => {
                return (
                  voyage.waypoints?.[0] && (
                    <div key={`${voyage.waypoints[0].latitude}-${index}`}>
                      <MarkerWithInfoWindow
                        index={index}
                        position={{
                          lat: voyage.waypoints[0].latitude,
                          lng: voyage.waypoints[0].longitude,
                        }}
                        voyage={voyage}
                        onClick={() =>
                          handlePanToLocation(
                            voyage.waypoints[0].latitude,
                            voyage.waypoints[0].longitude
                          )
                        }
                      />
                    </div>
                  )
                );
              })}
            </>
          );
        };

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

        const containerDiv = document.createElement("div"); // Creating a container div to hold your JSX content
        ReactDOM.render(parrotContent(), containerDiv); // Render your JSX content into this div

        infoWindow.setContent(containerDiv); // Set the content of InfoWindow

        const infoWindow2 = new window.google.maps.InfoWindow({
          content: parrotDiv2,
        });
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

  return (
    <>
      {/* {voyages.map((voyage, index) => {
        return (
          voyage.waypoints?.[0] && (
            <div key={`${voyage.waypoints[0].latitude}-${index}`}>
              <MarkerWithInfoWindow
                index={index}
                position={{
                  lat: voyage.waypoints[0].latitude,
                  lng: voyage.waypoints[0].longitude,
                }}
                voyage={voyage}
                onClick={() =>
                  handlePanToLocation(
                    voyage.waypoints[0].latitude,
                    voyage.waypoints[0].longitude
                  )
                }
              />
            </div>
          )
        );
      })} */}
    </>
  );
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
