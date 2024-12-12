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

        const parrotContent = () => {
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

        const infoWindow = new window.google.maps.InfoWindow({
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
