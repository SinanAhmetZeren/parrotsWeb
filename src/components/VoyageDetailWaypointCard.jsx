import "../assets/css/App.css";
import * as React from "react";
import { parrotTextDarkBlue } from "../styles/colors";

export function VoyageDetailWaypointCard({ waypoint, handlePanToLocation }) {

  const apiUrl = process.env.REACT_APP_API_URL;
  const baseWaypointImageUrl = `${apiUrl}/Uploads/WaypointImages/`;

  function onClick() {
    console.log("hi there ", waypoint.latitude);
    handlePanToLocation(
      waypoint.latitude,
      waypoint.longitude
    )
  }

  return (
    <div style={voyageDetailCard}>
      <div style={imageContainer}>
        <img
          src={baseWaypointImageUrl + waypoint.profileImage}
          alt={`Slide ${+1}`}
          style={voyageImage}
        />
      </div>
      <div style={detailsContainer}>
        <div style={heading}>
          {waypoint.title}
        </div>
        <div style={waypointBrief}>
          <div style={scrollableDescription}>
            {waypoint.description}
          </div>
        </div>
        <div style={seeOnMap} onClick={onClick}>

          See on map
        </div>
      </div>
    </div>
  );
}



const voyageDetailCard = {
  display: "flex",
  flexDirection: "row",
  height: "18rem",
  borderRadius: "1.5rem",
  overflow: "hidden",
  backgroundColor: "white",
  boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 6px, rgba(0, 0, 0, 0.2) 0px -8px 6px inset",
};

const imageContainer = {
  // backgroundColor: "white",
  width: "50%",
  overflow: "hidden",
  padding: "0.2rem",
};

const voyageImage = {
  height: "100%",
  width: "100%",
  objectFit: "cover",
  display: "block",
  borderRadius: "1.5rem",

};

const detailsContainer = {
  // backgroundColor: "white",
  width: "50%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  border: "none",
  boxSizing: "border-box",
};

const heading = {
  // backgroundColor: "white",
  height: "2rem",
  color: "#2ac898",
  color: "rgb(0, 119, 234)",

  fontWeight: "600",
};

const waypointBrief = {
  flexGrow: 1,
  color: "rgb(0, 119, 234)",
  color: parrotTextDarkBlue,
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 7,
  lineHeight: "1.2rem",
  width: "88%",
  margin: "auto",
  marginTop: "0.6rem",
  textAlign: "justify",
  // fontWeight: "500",
};

const seeOnMap = {
  height: "1.5rem",
  alignSelf: "end",
  color: "#2ac898",
  fontWeight: "bold",
  fontSize: "0.9rem",
  cursor: "pointer",
  backgroundColor: "rgba(42,200,152,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "1rem",
  paddingLeft: "0.5rem",
  paddingRight: "0.5rem",
};

const scrollableDescription = {
  maxHeight: "25vh",
  overflowY: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  WebkitOverflowScrolling: "touch",
};