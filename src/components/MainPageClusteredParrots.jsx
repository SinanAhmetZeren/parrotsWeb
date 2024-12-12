import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { MarkerWithInfoWindow } from "./MainPageMarkerWithInfoWindow";

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

  // Create the markerClusterer once the map is available and update it when
  // the markers are changed
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

        const marker = new window.google.maps.Marker({
          position,
          title: voyage.name, // Optional: Set the marker's title
        });

        marker.addListener("click", () =>
          handlePanToLocation(position.lat, position.lng)
        );

        setMarkerRef(marker, `${voyage.waypoints[0].latitude}-${index}`);

        return marker;
      })
      .filter((marker) => marker !== null); // Remove null entries (where no waypoints exist)
  }, [voyages, handlePanToLocation, setMarkerRef]);

  // Add the markers to the clusterer whenever they change
  useEffect(() => {
    if (!clusterer || voyageMarkers.length === 0) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(voyageMarkers);
  }, [clusterer, voyageMarkers]);

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

      {selectedVoyageKey && (
        <InfoWindow
          anchor={markers[selectedVoyageKey]}
          onCloseClick={handleInfoWindowClose}
        >
          {selectedVoyage?.name}
        </InfoWindow>
      )}
    </>
  );
};
