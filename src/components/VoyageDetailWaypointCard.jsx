
import "../assets/css/App.css";
import * as React from "react";

export function VoyageDetailWaypointCard({ waypoint, handlePanToLocation }) {

  const apiUrl = process.env.REACT_APP_API_URL;
  const baseWaypointImageUrl = `${apiUrl}/Uploads/WaypointImages/`;

  /*
{
  "id": 107,
  "latitude": 40.99,
  "longitude": 29.09,
  "title": "Istanbul",
  "description": "Spend a day in Istanbul, starting with the stunning Hagia Sophia, a mix of history and beauty. Explore the lively Grand Bazaar, full of colors, sounds, and unique items. Finish with a relaxing Bosphorus cruise, enjoying the view of the city that connects two continents.",
  "profileImage": "014b817b-142f-4777-9a6b-5e2a82b52e4f.jpg",
  "order": 1,
  "voyageId": 88
}*/

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
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 -8px 6px rgba(0, 0, 0, 0.2)
`,
};


const heading = {
  backgroundColor: "white",
  height: "2rem",
  color: "rgb(0, 119, 234)",
  color: "#2ac898",
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
  paddingRight: "0.5rem",
};

const scrollableDescription = {
  maxHeight: "25vh", // Adjust this height as needed
  overflowY: "auto",  // Enables vertical scrolling
  scrollbarWidth: "none", // Hides scrollbar in Firefox
  msOverflowStyle: "none", // Hides scrollbar in Internet Explorer and Edge
  WebkitOverflowScrolling: "touch", // Ensures smooth scrolling on iOS
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};
