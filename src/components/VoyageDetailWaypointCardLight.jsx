import "../assets/css/App.css";
import * as React from "react";
import { parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";
import he from "he";

export function VoyageDetailWaypointCardLight({ waypoint, handlePanToLocation, voyageImage }) {
  function onClick() {
    handlePanToLocation(waypoint.latitude, waypoint.longitude);
  }

  return (
    <div style={voyageDetailCard}>
      <div style={imageContainer}>
        <img
          src={waypoint.profileImage || voyageImage}
          alt={`Slide ${+1}`}
          style={{
            ...voyageImageStyle,
            opacity: !waypoint.profileImage ? 0.5 : 1,
          }}
        />
      </div>
      <div style={detailsContainer}>
        <div style={heading}>{waypoint.title}</div>
        <div style={waypointBrief}>
          <div
            style={scrollableDescription}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                he.decode(
                  waypoint?.description
                    .replace(/<[^>]+>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()
                )
              ),
            }}
          />
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
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
  width: "40rem",
};

const imageContainer = {
  width: "50%",
  overflow: "hidden",
  padding: "0.2rem",
};

const detailsContainer = {
  width: "50%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  border: "none",
  boxSizing: "border-box",
};

const voyageImageStyle = {
  height: "100%",
  width: "100%",
  objectFit: "cover",
  display: "block",
  borderRadius: "1.5rem",
};

const heading = {
  height: "2rem",
  color: "#2ac898",
  fontWeight: "600",
};

const waypointBrief = {
  flexGrow: 1,
  color: parrotTextDarkBlue,
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 7,
  lineHeight: "1.65rem",
  letterSpacing: "0.015em",
  width: "88%",
  margin: "auto",
  marginTop: "0.6rem",
  textAlign: "left",
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
