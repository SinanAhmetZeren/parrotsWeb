import img1 from "../assets/fareast1.jpg";
import img3 from "../assets/fareast2.jpeg";
import img2 from "../assets/fareast3.jpeg";
import "../App.css";
import * as React from "react";

export function VoyageDetailWaypointCard({ waypoint }) {


  return (
    <div style={voyageDetailCard}>
      <div style={imageContainer}>
        <img
          src={img1}
          alt={`Slide ${+1}`}
          style={voyageImage}
        />
      </div>
      <div style={detailsContainer}>
        <div style={heading}>
          hello
        </div>
        <div style={waypointBrief}>
          Waypo int brief
          Wayp oi nt brief
          Wayp oint brief
          Wayp oint brief
          Waypoi nt brief
          Waypoi nt brief
          Wa  oint brief
          Wayp oi nt brief
          Wayp oi nt brief
          Wayp oint brief
          Wayp oint brief
          Wayp oint brief
          Way ypoint brief
        </div>
        <div style={seeOnMap} onClick={() => console.log("hi there")}>
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
  borderRadius: "2rem",
  overflow: "hidden",
};

const imageContainer = {
  backgroundColor: "pink",
  width: "50%",
};

const voyageImage = {
  height: "18rem",
  width: "100%",
  objectFit: "cover",
};

const detailsContainer = {
  backgroundColor: "white",
  width: "50%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

const heading = {
  backgroundColor: "white",
  height: "2rem",
  color: "rgb(0, 119, 234)",
  fontWeight: "600",
};

const waypointBrief = {
  flexGrow: 1,
  color: "rgb(0, 119, 234)",
  margin: ".3rem",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 7,
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
  paddingRight: "0.5rem"
};

