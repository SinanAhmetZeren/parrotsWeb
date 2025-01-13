/* eslint-disable no-undef */
import "./VoyageDetails.css";
import "./assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import {
  useGetVoyageByIdQuery,
} from "./slices/VoyageSlice";
import { TopBarMenu } from "./components/TopBarMenu";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { TopLeftComponent } from "./components/TopLeftComponent";
import { VoyageDetailPageImageSwiper } from "./components/VoyageDetailPageImageSwiper";
import { VoyageDetailPageDetails } from "./components/VoyageDetailPageDetails";
import { VoyageDetailPageDescription } from "./components/VoyageDetailPageDescription";
import { VoyageDetailBids } from "./components/VoyageDetailPageBids";
import { VoyageDetailWaypointSwiper } from "./components/VoyageDetailWaypointSwiper";
import { VoyageDetailMapPanComponent } from "./components/VoyageDetailMapPanComponent";
import { VoyageDetailMarkerWithInfoWindow } from "./components/VoyageDetailMarkerWithInfoWindow";
import { VoyageDetailMapPolyLineComponent } from "./components/VoyageDetailMapPolyLineComponent";

const markers = [
  { lat: 37.7749, lng: 30.4194 }, // San Francisco
  { lat: 34.0522, lng: 30.2437 }, // Los Angeles
  { lat: 36.1699, lng: 30.1398 }, // Las Vegas
];

// Create an array of coordinates for the Polyline path
const coordinates = markers.map(marker => ({
  lat: marker.lat,
  lng: marker.lng,
}));


function VoyageDetails() {

  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  let voyageId = 88;

  const [bounds, setBounds] = useState(null);
  const mapRef = useRef()

  const [targetLocation, setTargetLocation] = useState({});
  const markersRef = useRef([]); // Ref to store marker instances
  const markerClustererRef = useRef(null); // Ref to  store MarkerClusterer instance

  const {
    data: VoyageData,
    isSuccess: isSuccessVoyage,
    isLoading: isLoadingVoyage,
    refetch,
  } = useGetVoyageByIdQuery(voyageId);



  const handlePanToLocation = (lat, lng) => {
    setTargetLocation({ lat, lng });
  };



  return (
    isLoadingVoyage ? (
      <div style={spinnerContainer}>
        <div className="spinner"></div>
      </div>
    ) : isSuccessVoyage ? (
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
                  <VoyageDetailPageImageSwiper voyageData={VoyageData} />
                </div>
                <div className="flex voyageDetails_Details">
                  <VoyageDetailPageDetails voyageData={VoyageData} />
                </div>
                <div className="flex voyageDetails_Description">
                  <VoyageDetailPageDescription voyageDescription={VoyageData.description} />
                </div>
                <div className="flex voyageDetails_Bids">
                  <VoyageDetailBids voyage={{}} />
                </div>
              </div>
              <div className="flex flex-col voyageDetails_BottomRight">
                <div className="flex voyageDetails_MapContainer">
                  <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                    <Map
                      ref={mapRef}
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
                      <VoyageDetailMapPolyLineComponent
                        waypoints={VoyageData.waypoints}

                      />
                      {
                        VoyageData.waypoints.map((waypoint, index) => (
                          <VoyageDetailMarkerWithInfoWindow
                            key={`$${waypoint.id}`}
                            index={index}
                            waypointTitle={waypoint.title}
                            position={{
                              lat: waypoint.latitude,
                              lng: waypoint.longitude,
                            }}
                            onClick={() =>
                              handlePanToLocation(
                                waypoint.latitude,
                                waypoint.longitude
                              )
                            }
                          />
                        ))
                      }
                    </Map>
                  </APIProvider>
                </div>
                <div className="voyageDetails_waypointsContainer">
                  <VoyageDetailWaypointSwiper waypoints={VoyageData.waypoints} />
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    ) : null
  );



}

export default VoyageDetails;



const spinnerContainer = {
  marginTop: "20%",
};
