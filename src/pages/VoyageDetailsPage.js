/* eslint-disable no-undef */
import "../assets/css/VoyageDetails.css";
import "../assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import {
  useGetVoyageByIdQuery,
} from "../slices/VoyageSlice";
import { TopBarMenu } from "../components/TopBarMenu";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { VoyageDetailPageImageSwiper } from "../components/VoyageDetailPageImageSwiper";
import { VoyageDetailPageDetails } from "../components/VoyageDetailPageDetails";
import { VoyageDetailPageDescription } from "../components/VoyageDetailPageDescription";
import { VoyageDetailBids } from "../components/VoyageDetailPageBids";
import { VoyageDetailWaypointSwiper } from "../components/VoyageDetailWaypointSwiper";
import { VoyageDetailMapPanComponent } from "../components/VoyageDetailMapPanComponent";
import { VoyageDetailMarkerWithInfoWindow } from "../components/VoyageDetailMarkerWithInfoWindow";
import { VoyageDetailMapPolyLineComponent } from "../components/VoyageDetailMapPolyLineComponent";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useAddVoyageToFavoritesMutation,
  useDeleteVoyageFromFavoritesMutation,
} from "../slices/VoyageSlice";

function VoyageDetailsPage() {
  const dispatch = useDispatch();
  const { voyageId } = useParams();
  const userId = localStorage.getItem("storedUserId")
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  const [userBid, setUserBid] = useState("")
  const mapRef = useRef()
  const [targetLocation, setTargetLocation] = useState({});
  const [latLngBoundsLiteral, setLatLngBoundsLiteral] = useState({
    north: null,
    south: null,
    east: null,
    west: null
  });
  const [isFavorited, setIsFavorited] = useState(false);

  const {
    data: VoyageData,
    isSuccess: isSuccessVoyage,
    isLoading: isLoadingVoyage,
    refetch,
  } = useGetVoyageByIdQuery(voyageId);


  /*
  const [addVoyageToFavorites] = useAddVoyageToFavoritesMutation();
  const [deleteVoyageFromFavorites] = useDeleteVoyageFromFavoritesMutation();

  const handleAddVoyageToFavorites = () => {
    addVoyageToFavorites({ userId, voyageId });
    setIsFavorited(true);
    dispatch(
      addVoyageToUserFavorites({
        favoriteVoyage: voyageId,
      })
    );
  };

  const handleDeleteVoyageFromFavorites = () => {
    deleteVoyageFromFavorites({ userId, voyageId });
    setIsFavorited(false);
    dispatch(
      removeVoyageFromUserFavorites({
        favoriteVoyage: voyageId,
      })
    );
  };

  useEffect(() => {
    console.log("voyage data ---> ", VoyageData);
    
        if (isSuccessVoyages && userFavoriteVoyages) {
          if (userFavoriteVoyages.includes(VoyageData.id)) {
            setIsFavorited(true);
          }
    
          if (VoyageData.bids) {
            setBids(VoyageData.bids);
            let bids = VoyageData.bids;
            setHasBidWithUserId(bids.some((bid) => bid.userId === userId));
    
          }
        }
          
  }, [
    // isSuccessVoyages, 
    VoyageData,
    isFavorited]);
    */



  useEffect(() => {
    if (latLngBoundsLiteral?.east)
      console.log("latLngBoundsLiteral", latLngBoundsLiteral);
  }, [latLngBoundsLiteral])

  useEffect(() => {
    if (isSuccessVoyage && VoyageData?.waypoints?.length > 0) {
      let tempMaxLat = -Infinity;
      let tempMinLat = Infinity;
      let tempMaxLng = -Infinity;
      let tempMinLng = Infinity;

      VoyageData.waypoints.forEach((waypoint) => {
        const { latitude, longitude } = waypoint;

        if (latitude > tempMaxLat) tempMaxLat = latitude;
        if (latitude < tempMinLat) tempMinLat = latitude;
        if (longitude > tempMaxLng) tempMaxLng = longitude;
        if (longitude < tempMinLng) tempMinLng = longitude;
      });
      console.log("diff:....", tempMaxLat - tempMinLat);
      setLatLngBoundsLiteral({
        north: tempMaxLat,
        south: tempMinLat,
        east: tempMaxLng,
        west: tempMinLng,
      });
    } else {
      setLatLngBoundsLiteral({
        north: 0,
        south: 0,
        east: 0,
        west: 0,
      });
    }

    if (VoyageData) {
      setUserBid(VoyageData.bids.find((bid) => bid.userId === userId));
    }
  }, [isSuccessVoyage, VoyageData]);


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
              <TopLeftComponent />
              <div className="flex mainpage_TopRight">
                <TopBarMenu />
              </div>
            </div>
            {/* {isFavorited ? <span>favorited</span> : <span>not favorited</span>} */}
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
                  <VoyageDetailBids
                    voyageData={VoyageData}
                    ownVoyage={userId === VoyageData.userId}
                    userBid={userBid}
                    currentUserId={userId}
                    isSuccessVoyage={isSuccessVoyage}
                    refetch={refetch} />
                </div>
              </div>
              <div className="flex flex-col voyageDetails_BottomRight">
                <div className="flex voyageDetails_MapContainer">
                  <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                    {
                      latLngBoundsLiteral?.east ? (
                        <Map
                          ref={mapRef}
                          mapId={"mainpageMap"}
                          defaultBounds={latLngBoundsLiteral}
                          gestureHandling={"greedy"}
                          disableDefaultUI

                          zoom={latLngBoundsLiteral.east === latLngBoundsLiteral.west &&
                            latLngBoundsLiteral.north === latLngBoundsLiteral.south ? 13 : undefined}  // Adjust zoom if single point


                          onCameraChanged={() => setTargetLocation(null)}
                        >
                          <VoyageDetailMapPanComponent
                            // setBounds={setBounds}
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
                        </Map>) : null
                    }

                  </APIProvider>
                </div>
                <div className="voyageDetails_waypointsContainer">
                  <VoyageDetailWaypointSwiper waypoints={VoyageData.waypoints} handlePanToLocation={handlePanToLocation} />
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    ) : null
  );



}

export default VoyageDetailsPage;



const spinnerContainer = {
  marginTop: "20%",
};
