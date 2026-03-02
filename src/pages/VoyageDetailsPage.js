/* eslint-disable no-undef */
import "../assets/css/VoyageDetails.css";
import "../assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useGetVoyageByIdQuery } from "../slices/VoyageSlice";
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
import { updateUserFavoriteVoyages } from "../slices/UserSlice";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { IoHeartSharp } from "react-icons/io5";
import { MdPublic } from "react-icons/md";
import seafromsky from '../assets/images/seafromsky.jpg';


import { addVoyageToUserFavorites, removeVoyageFromUserFavorites, useGetFavoriteVoyageIdsByUserIdQuery } from "../slices/UserSlice";
import { parrotBlue, parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotBlueSemiTransparent, parrotDarkBlue, parrotGreen, parrotLightBlue, parrotTextDarkBlue } from "../styles/colors";
import { MapTypeButton } from "../components/MapTypeButton";
import { CustomToolTip } from "../components/CustomToolTip";

function VoyageDetailsPage() {
  const dispatch = useDispatch();
  const { voyageId } = useParams();
  console.log("voyageId from params:", voyageId);
  const userId = localStorage.getItem("storedUserId");
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";
  const [userBid, setUserBid] = useState("");
  const [userBidAccepted, setUserBidAccepted] = useState("");
  const mapRef = useRef();
  const [targetLocation, setTargetLocation] = useState({});
  const [latLngBoundsLiteral, setLatLngBoundsLiteral] = useState({
    north: null,
    south: null,
    east: null,
    west: null,
  });
  const [isPublicOnMap, setIsPublicOnMap] = useState(false);
  const [mapTypeId, setMapTypeId] = useState("hybrid"); // "roadmap" or "hybrid"
  const [isLegacyView, setIsLegacyView] = useState(true)


  let favoriteVoyages;
  try {
    favoriteVoyages = JSON.parse(
      localStorage.getItem("storedFavoriteVoyages")
    );
  } catch (err) {
    console.log(err);
  }
  const isInFavorites = favoriteVoyages?.includes(Number(voyageId));
  const [isFavorited, setIsFavorited] = useState(isInFavorites);
  const { data: favoriteVoyagesData } =
    useGetFavoriteVoyageIdsByUserIdQuery(userId, {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });


  useEffect(() => {
    const updateFavoriteVoyages = () => {
      dispatch(
        updateUserFavoriteVoyages({
          favoriteVoyages: favoriteVoyagesData,
        })
      );
    };
    updateFavoriteVoyages();
  }, [favoriteVoyagesData, dispatch]);



  const [opacity, setOpacity] = useState(1);
  const {
    data: VoyageData,
    isSuccess: isSuccessVoyage,
    isLoading: isLoadingVoyage,
    isError: isErrorVoyage,
    refetch,
  } = useGetVoyageByIdQuery(voyageId, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [addVoyageToFavorites] = useAddVoyageToFavoritesMutation();
  const [deleteVoyageFromFavorites] = useDeleteVoyageFromFavoritesMutation();

  const handleAddVoyageToFavorites = () => {
    const voyageId_number = Number(voyageId);
    console.log("voyageId ", voyageId);
    console.log("voyageId_number", voyageId_number);

    addVoyageToFavorites({ userId, voyageId: voyageId_number });
    setIsFavorited(true);
    dispatch(
      addVoyageToUserFavorites({
        favoriteVoyage: voyageId_number,
      })
    );
  };

  const handleDeleteVoyageFromFavorites = () => {
    const voyageId_number = Number(voyageId);
    deleteVoyageFromFavorites({ userId, voyageId: voyageId_number });
    setIsFavorited(false);
    dispatch(
      removeVoyageFromUserFavorites({
        favoriteVoyage: voyageId_number,
      })
    );
  };

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

      // Add padding if latitudes or longitudes are equal
      if (tempMaxLat === tempMinLat) {
        tempMaxLat += 0.025;
        tempMinLat -= 0.025;
      }

      if (tempMaxLng === tempMinLng) {
        tempMaxLng += 0.025;
        tempMinLng -= 0.025;
      }

      setLatLngBoundsLiteral({
        north: tempMaxLat,
        south: tempMinLat,
        east: tempMaxLng,
        west: tempMinLng,
      });
      console.log("***********");
      console.log("temopMaxLat", tempMaxLat);
      console.log("tempMinLat", tempMinLat);
      console.log("tempMaxLng", tempMaxLng);
      console.log("tempMinLng", tempMinLng);
      console.log("***********");
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
      setUserBidAccepted(
        VoyageData.bids.find((bid) => bid.userId === userId)?.accepted ?? false
      );
      setIsPublicOnMap(VoyageData.publicOnMap);
      console.log("----", VoyageData);

      console.log(
        "user bid: -->",
        VoyageData.bids.find((bid) => bid.userId === userId)
      );
    }
  }, [isSuccessVoyage, VoyageData, userId]);

  const handlePanToLocation = (lat, lng) => {
    setTargetLocation({ lat, lng });
  };

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (isErrorVoyage) return <SomethingWentWrong />;

  return isLoadingVoyage ? (
    <div style={spinnerContainer}>
      <div className="spinner"></div>
    </div>
  ) : isSuccessVoyage ? isLegacyView ? (

    <div style={appStyle}>
      <header style={appHeaderStyle}>
        <div style={mainPageContainerStyle} className="flex">
          <div style={mainPageTopRowStyle} className="flex">
            <TopLeftComponent />
            <div style={mainPageTopRightStyle} className="flex">
              <TopBarMenu />
            </div>
          </div>

          <div style={{ ...mainPageBottomRowStyle }} className="flex">
            <div style={voyageDetailsBottomLeftStyle} className="flex voyageDetailsBottomLeft custom-scrollbar">
              <div style={{ ...voyageDetailsDetailsStyle, position: "relative" }} className="flex">
                <VoyageDetailPageDetails voyageData={VoyageData} />
              </div>
              <div style={voyageDetailsBidsStyle} className="flex">
                <VoyageDetailBids
                  userId={userId}
                  voyageId={voyageId}
                  voyageData={VoyageData}
                  ownVoyage={userId === VoyageData.userId}
                  userBid={userBid}
                  userBidAccepted={userBidAccepted}
                  currentUserId={userId}
                  isSuccessVoyage={isSuccessVoyage}
                  refetch={refetch}
                  setOpacity={setOpacity}
                />
              </div>
            </div>

            <div style={voyageDetailsBottomMiddleStyle} className="flex voyageDetailsBottomLeft custom-scrollbar">
              <div style={voyageDetailsImagesStyle} className="flex">
                <VoyageDetailPageImageSwiper voyageData={VoyageData} />
              </div>

              <div style={{ ...voyageDetailsDetailsStyle2, position: "relative" }} className="flex">
                <PublicAndHeartIcons
                  isFavorited={isFavorited}
                  handleAddVoyageToFavorites={handleAddVoyageToFavorites}
                  handleDeleteVoyageFromFavorites={handleDeleteVoyageFromFavorites}
                  isPublicOnMap={isPublicOnMap}
                  parrotDarkBlue={parrotDarkBlue}
                  parrotBlueDarkTransparent={parrotBlueDarkTransparent}
                  parrotBlueDarkTransparent2={parrotBlueDarkTransparent2}
                />
              </div>
              <div style={voyageDetailsDescriptionStyle} className="flex">
                <VoyageDetailPageDescription voyageDescription={VoyageData.description} voyageName={VoyageData} />
              </div>
            </div>

            <div style={{ ...voyageDetailsBottomRightStyle, display: "flex", flexDirection: "column" }}>
              <div style={voyageDetailsMapContainerStyle} className="flex">
                <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                  {latLngBoundsLiteral?.east ? (
                    <Map
                      ref={mapRef}
                      mapId={"mainpageMap"}
                      defaultBounds={latLngBoundsLiteral}
                      style={{ borderRadius: "1rem", overflow: "hidden" }}
                      gestureHandling={"greedy"}
                      disableDefaultUI
                      zoom={undefined}
                      onCameraChanged={() => setTargetLocation(null)}
                      mapTypeControl={false} // Hide the big bulky Google button
                      mapTypeId={mapTypeId} // <--- CRITICAL: Add this line to link the state to the map
                    >


                      <MapTypeButton mapTypeId={mapTypeId} setMapTypeId={setMapTypeId} />
                      <VoyageDetailMapPanComponent targetLat={targetLocation?.lat} targetLng={targetLocation?.lng} />
                      <VoyageDetailMapPolyLineComponent waypoints={VoyageData.waypoints} />
                      {VoyageData.waypoints.map((waypoint, index) => (
                        <VoyageDetailMarkerWithInfoWindow
                          key={`$${waypoint.id}`}
                          index={index}
                          waypointTitle={waypoint.title}
                          position={{ lat: waypoint.latitude, lng: waypoint.longitude }}
                          onClick={() => handlePanToLocation(waypoint.latitude, waypoint.longitude)}
                        />
                      ))}
                    </Map>
                  ) : null}
                </APIProvider>
              </div>

              <div style={voyageDetailsWaypointsContainerStyle}>
                <VoyageDetailWaypointSwiper
                  waypoints={VoyageData.waypoints}
                  handlePanToLocation={handlePanToLocation}
                  opacity={opacity}
                  voyageImage={VoyageData.profileImage}
                />
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
                    .custom-scrollbar::-webkit-scrollbar {
                        background-color: #091b46;
                        background-color: transparent;
                        width: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: #1a3a8a;
                        background-color: transparent;
                        border-radius: 10px;
                    }
                `}
        </style>

      </header>
    </div>
  ) : (
    <div style={appStyle}>
      <header style={appHeaderStyle}>
        <div style={mainPageContainerStyle} className="flex">
          <div style={mainPageTopRowStyle} className="flex">
            <TopLeftComponent />
            <div style={mainPageTopRightStyle} className="flex">
              <TopBarMenu />
            </div>
          </div>

          <div style={{ ...mainPageBottomRowStyle }} className="flex">
            <div style={voyageDetailsBottomLeftStyle}

              className="flex voyageDetailsBottomLeft custom-scrollbar"

            >
              <div style={voyageDetailsImagesStyle} className="flex">
                <VoyageDetailPageImageSwiper voyageData={VoyageData} />
              </div>

              <div style={{ ...voyageDetailsDetailsStyle, position: "relative" }} className="flex">
                {isFavorited ? (
                  <div onClick={() => handleDeleteVoyageFromFavorites()} style={heartIconRed} title="In Favorites">
                    <IoHeartSharp size="1.5rem" color="red" />
                  </div>
                ) : (
                  <div onClick={() => handleAddVoyageToFavorites()} style={heartIconOrange} title="Not In Favorites">
                    <IoHeartSharp size="1.5rem" color="orange" />
                  </div>
                )}

                {!isPublicOnMap ? (
                  <div style={publicIconStyle(parrotDarkBlue, "parrotBlueDarkTransparent")} title="Is public on map, visible to everyone on their Home page">
                    <MdPublic size="1.5rem" color={parrotDarkBlue} />
                  </div>
                ) : (
                  <div style={publicIconStyle(parrotBlueDarkTransparent2, "white")} title="Is not public on map, not visible to everyone on their Home page">
                    <MdPublic size="1.5rem" color={parrotBlueDarkTransparent2} />
                  </div>
                )}

                <VoyageDetailPageDetails voyageData={VoyageData} />
              </div>

              <div style={voyageDetailsDescriptionStyle} className="flex">
                <VoyageDetailPageDescription voyageDescription={VoyageData.description} />
              </div>

              <div style={voyageDetailsBidsStyle} className="flex">
                <VoyageDetailBids
                  userId={userId}
                  voyageId={voyageId}
                  voyageData={VoyageData}
                  ownVoyage={userId === VoyageData.userId}
                  userBid={userBid}
                  userBidAccepted={userBidAccepted}
                  currentUserId={userId}
                  isSuccessVoyage={isSuccessVoyage}
                  refetch={refetch}
                  setOpacity={setOpacity}
                />
              </div>
            </div>

            <div style={{ ...voyageDetailsBottomRightStyle, display: "flex", flexDirection: "column" }}>
              <div style={voyageDetailsMapContainerStyle} className="flex">
                <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                  {latLngBoundsLiteral?.east ? (
                    <Map
                      ref={mapRef}
                      mapId={"mainpageMap"}
                      defaultBounds={latLngBoundsLiteral}
                      style={{ borderRadius: "1rem", overflow: "hidden" }}
                      gestureHandling={"greedy"}
                      disableDefaultUI
                      zoom={undefined}
                      onCameraChanged={() => setTargetLocation(null)}
                    >
                      <VoyageDetailMapPanComponent targetLat={targetLocation?.lat} targetLng={targetLocation?.lng} />
                      <VoyageDetailMapPolyLineComponent waypoints={VoyageData.waypoints} />
                      {VoyageData.waypoints.map((waypoint, index) => (
                        <VoyageDetailMarkerWithInfoWindow
                          key={`$${waypoint.id}`}
                          index={index}
                          waypointTitle={waypoint.title}
                          position={{ lat: waypoint.latitude, lng: waypoint.longitude }}
                          onClick={() => handlePanToLocation(waypoint.latitude, waypoint.longitude)}
                        />
                      ))}
                    </Map>
                  ) : null}
                </APIProvider>
              </div>

              <div style={voyageDetailsWaypointsContainerStyle}>
                <VoyageDetailWaypointSwiper
                  waypoints={VoyageData.waypoints}
                  handlePanToLocation={handlePanToLocation}
                  opacity={opacity}
                  voyageImage={VoyageData.profileImage}
                />
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
                        .custom-scrollbar::-webkit-scrollbar {
                            background-color: #091b46;
                            background-color: transparent;
                            width: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background-color: #1a3a8a;
                            background-color: transparent;
                            border-radius: 10px;
                        }
                    `}
        </style>

      </header>
    </div>
  ) : null;
}

export default VoyageDetailsPage;

const spinnerContainer = {
  marginTop: "20%",
};

const heartIconRed = {
  position: "absolute",
  backgroundColor: "white",
  right: "1rem",
  top: "-.50rem",
  borderRadius: "3rem",
  padding: "0.5rem",
  zIndex: 1000,
  border: "2px red solid",
};

const heartIconOrange = {
  position: "absolute",
  backgroundColor: "white",
  right: "1rem",
  top: "-.50rem",
  borderRadius: "3rem",
  padding: "0.5rem",
  zIndex: 1000,
  border: "2px orange solid",
};



const publicIconStyle = (borderColor, backgroundColor) => ({
  position: "absolute",
  // backgroundColor: "white",
  backgroundColor: backgroundColor,
  right: "4.5rem",
  top: "-.50rem",
  borderRadius: "3rem",
  padding: "0.5rem",
  zIndex: 1000,
  // border: `2px solid ${borderColor}`,
  borderWidth: "2px",
  borderColor: borderColor,
  borderStyle: "solid",
});


export const appStyle = {
  textAlign: "center",
};

export const appLogoStyle = {
  height: "40vmin",
  pointerEvents: "none",
};

export const appHeaderStyle = {
  backgroundColor: "#282c34",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(10px + 2vmin)",
  color: "white",
  backgroundImage: `url(${seafromsky})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  margin: 0,
  height: "100vh",
};

export const appLinkStyle = {
  color: "#61dafb",
};

export const slideContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};

export const swiperButtonStyle = {
  backgroundSize: "3rem 3rem",
  width: "3rem",
  height: "3rem",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

export const swiperSlideInactiveStyle = {
  opacity: 0.7,
  filter: "brightness(0.8)",
  transition: "all 5s ease-in-out",
};

export const spinnerStyle = {
  border: "4px solid rgba(0, 0, 0, 0.1)",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  borderLeftColor: "#09f",
  animation: "spin 1s ease infinite",
  margin: "auto",
};

export const cardContainerStyle = {
  transform: "scale(0.3) translateY(0%)",
  opacity: 1,
  transition: "transform 0.3s ease-out, opacity 0.3s ease-out, visibility 0s linear 0.3s",
  transformOrigin: "bottom center",
  position: "relative",
  zIndex: 9999,
};

export const cardContainerVisibleStyle = {
  transform: "scale(1) translateY(0)",
  opacity: 1,
  transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
};

export const customPinStyle = {
  position: "relative",
  zIndex: 0,
};

export const buttonStyle = {
  width: "40%",
  backgroundColor: "#007bff",
  padding: "0.6rem",
  marginTop: "2rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1.4rem",
  border: "none",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

export const mainPageContainerStyle = {
  flexDirection: "column",
  width: "100%",
  height: "100vh",
};

export const mainPageTopRowStyle = {
  padding: "0.1rem",
  flexDirection: "row",
};

export const mainPageTopRightStyle = {
  height: "3rem",
  width: "65%",
  alignItems: "center",
  justifyContent: "flex-end",
};

export const mainPageBottomRowStyle = {
  flexGrow: 1,
  width: "100%",
};

export const voyageDetailsBottomRightStyle = {
  height: "calc(100vh - 4rem)",
  width: "40%",
};

export const voyageDetailsBottomMiddleStyle = {
  height: "calc(100vh - 4rem)",
  width: "30%",
  flexDirection: "column",
  overflowY: "auto",
};

export const voyageDetailsBottomLeftStyle = {
  height: "calc(100vh - 4rem)",
  width: "30%",
  flexDirection: "column",
  overflowY: "auto",
};

export const voyageDetailsMapContainerStyle = {
  width: "100%",
  padding: "0.2rem",
  height: "58vh",
};

export const voyageDetailsWaypointsContainerStyle = {
  flexGrow: 1,
  margin: "0.2rem",
  height: "auto",
};





export const voyageDetailsDetailsStyle2 = {
  width: "calc(100% - 2rem)",
  marginLeft: "1rem",
  marginRight: "1rem",
  padding: "0.3rem",
};

export const voyageDetailsDescriptionStyle = {
  width: "calc(100% - 2rem)",
  height: "50vh",
  marginLeft: "1rem",
  marginRight: "1rem",
  padding: "0.3rem",
  paddingTop: 0,
};

export const voyageDetailsImagesStyle = {
  alignItems: "center",
  justifyContent: "center",
  width: "calc(100% - 2rem)",
  margin: "auto"
};

export const voyageDetailsBidsStyle = {
  // flex: "0 0 45vh",
  // width: "calc(100% - 2rem)",
  // height: "65vh",
  margin: "1rem",
  marginTop: 0,
  padding: "0.3rem",
  paddingTop: 0,
  // backgroundColor: "red"
};

export const voyageDetailsDetailsStyle = {
  width: "calc(100% - 2rem)",
  marginLeft: "1rem",
  marginRight: "1rem",
  padding: "0.3rem",
  height: "35vh",

};


export const PublicAndHeartIcons = ({
  isFavorited,
  handleAddVoyageToFavorites,
  handleDeleteVoyageFromFavorites,
  isPublicOnMap,
  parrotDarkBlue,
  parrotBlueDarkTransparent,
  parrotBlueDarkTransparent2,
}) => {
  const [isHoveredHeart, setIsHoveredHeart] = useState(false)
  const [isHoveredPublicOnMap, setIsHoveredPublicOnMap] = useState(false)
  return (
    <>
      {isFavorited ? (
        <div
          onClick={() => handleDeleteVoyageFromFavorites()}
          onMouseEnter={() => setIsHoveredHeart(true)}
          onMouseLeave={() => setIsHoveredHeart(false)}
          style={{ ...heartIconRed, cursor: "pointer" }} >
          <IoHeartSharp size="1.5rem" color="red" />
          <CustomToolTip isHovered={isHoveredHeart} message={"In Favorites"} />
        </div>
      ) : (
        <div
          onClick={() => handleAddVoyageToFavorites()}
          onMouseEnter={() => setIsHoveredHeart(true)}
          onMouseLeave={() => setIsHoveredHeart(false)}
          style={{ ...heartIconOrange, cursor: "pointer" }} >
          <IoHeartSharp size="1.5rem" color="orange" />
          <CustomToolTip isHovered={isHoveredHeart} message={"Add to Favorites"} />
        </div>
      )}

      {isPublicOnMap ? (
        <div
          onMouseEnter={() => setIsHoveredPublicOnMap(true)}
          onMouseLeave={() => setIsHoveredPublicOnMap(false)}
          style={publicIconStyle(parrotDarkBlue, "white")} >
          <MdPublic size="1.5rem" color={parrotDarkBlue} />
          <CustomToolTip isHovered={isHoveredPublicOnMap} message={"Visible on Map"} />
        </div>
      ) : (
        <div
          onMouseEnter={() => setIsHoveredPublicOnMap(true)}
          onMouseLeave={() => setIsHoveredPublicOnMap(false)}
          style={publicIconStyle(parrotBlueDarkTransparent2, "parrotBlueDarkTransparent")} >
          <MdPublic size="1.5rem" color={parrotBlueDarkTransparent2} />
          <CustomToolTip isHovered={isHoveredPublicOnMap} message={"Not Visible Globally"} />
        </div>
      )}
    </>
  );
};

