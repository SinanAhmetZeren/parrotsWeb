/* eslint-disable no-undef */
import "./VoyageDetails.css";
import "./assets/css/advancedmarker.css";
import React, { useState, useEffect } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { MainPageCardSwiper } from "./components/MainPageCardSwiper";
import {
  useGetVoyagesByLocationMutation,
  useGetFilteredVoyagesMutation,
} from "./slices/VoyageSlice";
import { TopBarMenu } from "./components/TopBarMenu";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

import { TopLeftComponent } from "./components/TopLeftComponent";
import { MainPageNewVoyageButton } from "./components/MainPageNewVoyageButton";
import { MarkerWithInfoWindow } from "./components/MainPageMarkerWithInfoWindow";
import { MainPageMapPanComponent } from "./components/MainPageMapPanComponent";
import { ClusteredVoyageMarkers } from "./components/MainPageClusteredParrots";
import { convertDateFormat } from "./components/ConvertDateFormat";
import { VoyageDetailPageImageSwiper } from "./components/VoyageDetailPageImageSwiper";
import { VoyageDetailPageDetails } from "./components/VoyageDetailPageDetails";
import { VoyageDetailPageDescription } from "./components/VoyageDetailPageDescription";
import { VoyageDetailBids } from "./components/VoyageDetailPageBids";
import { VoyageDetailWaypointSwiper } from "./components/VoyageDetailWaypointSwiper";
// import { VoyageDetailWaypointSwiper } from "./components/VoyageDetailWaypointSwiper";

function VoyageDetails() {

  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";


  const [bounds, setBounds] = useState(null);
  const [initialVoyages, setInitialVoyages] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [targetLocation, setTargetLocation] = useState({});


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



  useEffect(() => {
    if (
      isSuccessVoyages
    ) {
      markersRef.current = [];
      const newMarkers = initialVoyages
        .map((voyage, index) => {
          const waypoint = voyage.waypoints?.[0];
          if (!waypoint) return null;
          return (
            <MarkerWithInfoWindow
              key={`${voyage.waypoints[0].latitude}-${index}`}
              index={index}
              position={{
                lat: waypoint.latitude,
                lng: waypoint.longitude,
              }}
              voyage={voyage}
              onClick={() =>
                handlePanToLocation(
                  voyage.waypoints[0].latitude,
                  voyage.waypoints[0].longitude
                )
              }
            />
          );
        })
        .filter(Boolean);
      if (!markerClustererRef.current) {
        markerClustererRef.current = new MarkerClusterer({
          markers: newMarkers,
        });
      } else {
        markerClustererRef.current.clearMarkers();
        markerClustererRef.current.addMarkers(newMarkers);
      }
      markersRef.current = newMarkers;
    }
  }, [initialVoyages, isSuccessVoyages]);

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
                    <MainPageMapPanComponent
                      setBounds={setBounds}
                      targetLat={targetLocation?.lat}
                      targetLng={targetLocation?.lng}
                    />
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

