/* eslint-disable no-undef */
import "./VoyageDetails.css";
import "./assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import {
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
} from "./slices/VoyageSlice";
import { TopBarMenu } from "./components/TopBarMenu";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { TopLeftComponent } from "./components/TopLeftComponent";
import { MarkerWithInfoWindow } from "./components/MainPageMarkerWithInfoWindow";
import { VoyageDetailPageImageSwiper } from "./components/VoyageDetailPageImageSwiper";
import { VoyageDetailPageDetails } from "./components/VoyageDetailPageDetails";
import { VoyageDetailPageDescription } from "./components/VoyageDetailPageDescription";
import { VoyageDetailBids } from "./components/VoyageDetailPageBids";
import { VoyageDetailWaypointSwiper } from "./components/VoyageDetailWaypointSwiper";
import { VoyageDetailMapPanComponent } from "./components/VoyageDetailMapPanComponent";
import { VoyageDetailMarkerWithInfoWindow, VoyageDetailWaypointMarker } from "./components/VoyageDetailMarkerWithInfoWindow";

function VoyageDetails() {

  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";


  const [bounds, setBounds] = useState(null);
  const [initialVoyages, setInitialVoyages] = useState([
    {
      id: 1,
      name: "Voyage from Istanbul to Izmir",
      waypoints: [
        {
          id: 101,
          latitude: 41.0082,
          longitude: 24.9784,
          description: "Starting point in Istanbul",
        },
        {
          id: 102,
          latitude: 38.4237,
          longitude: 25.1428,
          description: "Stopover in Izmir",
        },
      ],
    },
    {
      id: 2,
      name: "Voyage from Izmir to Ankara",
      waypoints: [
        {
          id: 201,
          latitude: 38.4237,
          longitude: 28.1428,
          description: "Starting point in Izmir",
        },
        {
          id: 202,
          latitude: 39.9334,
          longitude: 33.8597,
          description: "Stopover in Ankara",
        },
      ],
    },
    {
      id: 3,
      name: "Voyage from Ankara to Adana",
      waypoints: [
        {
          id: 301,
          latitude: 39.9334,
          longitude: 32.8597,
          description: "Starting point in Ankara",
        },
        {
          id: 302,
          latitude: 37.0,
          longitude: 35.3213,
          description: "Stopover in Adana",
        },
      ],
    },
  ]);


  const [isLoading, setIsLoading] = useState(null);
  const [targetLocation, setTargetLocation] = useState({});
  const markersRef = useRef([]); // Ref to store marker instances
  const markerClustererRef = useRef(null); // Ref to  store MarkerClusterer instance


  const [
    getVoyagesByLocation,
    {
      isError: isErrorVoyages,
      isLoading: isLoadingVoyages,
      isSuccess: isSuccessVoyages,
    },
  ] = useGetVoyagesByLocationMutation();

  const [
    getFilteredVoyages,
    {
      isError: isErrorVoyagesFiltered,
      isLoading: isLoadingVoyagesFiltered,
      isSuccess: isSuccessVoyagesFiltered,
    },
  ] = useGetFilteredVoyagesMutation();

  const handlePanToLocation = (lat, lng) => {
    setTargetLocation({ lat, lng });
  };





  return (
    <div className="App">
      <header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent userName={"Peter Parker"} />

            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>

          <div className="flex voyageDetails_Bottom">
            <div className="flex voyageDetails_BottomLeft">
              <div className="flex voyageDetails_Images">
                <VoyageDetailPageImageSwiper imageUrls={{}} />
              </div>
              <div className="flex voyageDetails_Details">
                <VoyageDetailPageDetails voyage={{}} />
              </div>
              <div className="flex voyageDetails_Description">
                <VoyageDetailPageDescription voyage={{}} />
              </div>
              <div className="flex voyageDetails_Bids">
                <VoyageDetailBids voyage={{}} />
              </div>
            </div>
            <div className="flex flex-col voyageDetails_BottomRight">
              <div
                className="flex voyageDetails_MapContainer"
              >
                <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                  <Map
                    mapId={"mainpageMap"}
                    defaultZoom={10}
                    defaultCenter={{
                      lat: 40.7749,
                      lng: 29.14194,
                    }}
                    gestureHandling={"greedy"}
                    disableDefaultUI
                    onCameraChanged={() => setTargetLocation(null)}
                  >
                    <VoyageDetailMapPanComponent
                      setBounds={setBounds}
                      targetLat={targetLocation?.lat}
                      targetLng={targetLocation?.lng}
                    />

                    {initialVoyages.map((voyage) =>
                      voyage.waypoints.map((waypoint, index) => (
                        <VoyageDetailMarkerWithInfoWindow
                          key={`${voyage.id}-${waypoint.id}`}
                          index={index}
                          position={{
                            lat: waypoint.latitude,
                            lng: waypoint.longitude,
                          }}
                          voyage={voyage}
                          onClick={() =>
                            handlePanToLocation(
                              waypoint.latitude,
                              waypoint.longitude
                            )
                          }
                        />
                      ))
                    )}

                  </Map>
                </APIProvider>
              </div>
              <div className="voyageDetails_waypointsContainer">
                <VoyageDetailWaypointSwiper waypoints={{}} />
              </div>
            </div>
          </div>

        </div>
      </header>

    </div>
  );
}

export default VoyageDetails;

