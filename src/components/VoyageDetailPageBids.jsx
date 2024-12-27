import img1 from "../assets/catamaran.jpeg";
import img2 from "../assets/parrot-looks.jpg";
import "../App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";

export function VoyageDetailBids({ voyage }) {
  return (
    <div style={cardContainerStyle} className="flex row">
      <RenderBid />
      <RenderBid />
      <RenderBid />
      <RenderBid />
      <RenderBid />
    </div>
  );

}



function acceptBid() {
  console.log("bid accepted");
}
function RenderBid() {
  return (
    <div className={"flex"} style={dataRowItem}>
      <div style={userAndVehicleBox}>
        <img src={img2} style={userImage} alt=" " />
        <span style={userNameStyle} title="Peter Parker">
          Peter Parker
        </span>
        <span style={bidMessage}>
          bid message bid message bid message bid message bid message
          bid message bid
        </span>
        <span style={bidAmount}>€15</span>
        <span onClick={() => acceptBid()} style={acceptBidStyle}>
          Accept
        </span>
      </div>
    </div>
  );
}


const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ddd",
  borderRadius: "1rem",
  overflow: "hidden",
  width: "100%",
  backgroundColor: "#fff",
  margin: "0rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 -8px 6px rgba(0, 0, 0, 0.2)
`,
  color: "rgba(0, 119, 234,1)",
  padding: "1rem",
  fontSize: "1.4rem",
};

const dataRowItem = {
  marginTop: ".3rem",
  backgroundColor: "red"
};

const userAndVehicleBox = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "4rem",
  marginLeft: "0.5rem",
  width: "100%",
  justifyContent: "space-between",

};


const userImage = {
  height: "3rem",
  width: "3rem",
  borderRadius: "3rem",
};

const userNameStyle = {
  backgroundColor: "yellow",
  width: "20%", // Fixed width
  whiteSpace: "nowrap", // Prevent line breaks
  overflow: "hidden", // Hide overflow text
  textOverflow: "ellipsis", // Show "..." for overflow text
};


const bidMessage = {
  backgroundColor: "pink",
  wordWrap: "break-word", // Allow the message to break into multiple lines
  marginLeft: "1rem",
  width: "60%",

};

const bidAmount = {
  alignSelf: "center",
  backgroundColor: "orange",
  color: "#2ac898",
  fontWeight: "700",
  flexShrink: 0, // Prevent shrinking
  width: "10%", // Fixed width for bid amount
};

const acceptBidStyle = {
  fontWeight: "bold",
  color: "#0077EA",
  cursor: "pointer",
  backgroundColor: "lightgreen",
  width: "10%", // Fixed width for the "Accept Bid" button
};

