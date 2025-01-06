import img1 from "../assets/catamaran.jpeg";
import img2 from "../assets/parrot-looks.jpg";
import "../App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";

export function VoyageDetailBids({ voyage }) {

  const username = "Peter Parker";
  const userImage = img2;
  const message = "This is my bid message";
  const price = "145";
  const accepted = false;
  const bids = [];

  for (let i = 0; i < 10; i++) {
    if (i % 2 === 1) {
      bids.push(
        <RenderBid
          username={username}
          userImage={userImage}
          message={message}
          price={price}
          accepted={accepted}
        />
      );
    }
    else {
      bids.push(
        <RenderBid
          username={username}
          userImage={userImage}
          message={message}
          price={price}
          accepted={!accepted}
        />
      );
    }

  }

  return (
    <div style={cardContainerStyle} className="flex row">
      <div style={userVehicleInfoRow}>
        <span style={voyageName}>Current Bids</span>
      </div>
      {bids}
    </div>
  );
}

function acceptBid() {
  console.log("bid accepted");
}




function RenderBid({ username, userImage, message, price, accepted }) {
  return (
    <div className={"flex"} style={dataRowItem}>
      <div style={userAndVehicleBox}>
        <img src={userImage} style={userImageStyle} alt="User" />
        <span style={userNameStyle} title={username}>
          {username}
        </span>
        <span style={bidMessage}>
          {message || " "}
        </span>
        <span style={bidAmount}>€{price}</span>
        <span
          onClick={() => acceptBid()}
          style={accepted ? acceptedBidStyle : acceptBidStyle}
        >
          {accepted ? "Accepted" : "Accept"}
        </span>
      </div>
    </div>
  );
}


const voyageName = {
  color: "#2ac898",
  fontWeight: "800",
  fontSize: "1.5rem"
}

const userVehicleInfoRow = {
  display: 'flex',
  flexDirection: 'row',
  margin: "0.2rem",
  // justifyContent: "center"
  marginLeft: "1.3rem"
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ddd",
  borderRadius: "1rem",
  width: "100%",
  backgroundColor: "#fff",
  margin: "0rem",
  boxShadow: `
    0 4px 6px rgba(0, 0, 0, 0.3),
    inset 0 -8px 6px rgba(0, 0, 0, 0.2)
  `,
  color: "rgba(0, 119, 234,1)",
  padding: "1rem",
  fontSize: "1.15rem",
  maxHeight: "50vh",
  overflow: "scroll",
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // Internet Explorer and Edge
};

const dataRowItem = {
  marginTop: ".3rem",
  // backgroundColor: "red"
};

const userAndVehicleBox = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  // backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "4rem",
  marginLeft: "0.5rem",
  width: "100%",
  justifyContent: "space-between",
};

const userImageStyle = {
  height: "3rem",
  width: "3rem",
  borderRadius: "3rem",
};

const userNameStyle = {
  // backgroundColor: "yellow",
  width: "20%", // Fixed width
  whiteSpace: "nowrap", // Prevent line breaks
  overflow: "hidden", // Hide overflow text
  textOverflow: "ellipsis", // Show "..." for overflow text
};

const bidMessage = {
  // backgroundColor: "pink",
  wordWrap: "break-word", // Allow the message to break into multiple lines
  marginLeft: "1rem",
  width: "60%",
};

const bidAmount = {
  alignSelf: "center",
  // backgroundColor: "orange",
  color: "#2ac898",
  fontWeight: "700",
  flexShrink: 0, // Prevent shrinking
  width: "10%", // Fixed width for bid amount
};

const acceptBidStyle = {
  fontWeight: "bold",
  color: "#0077EA",
  cursor: "pointer",
  fontSize: "0.9rem",
  // backgroundColor: "green",
  width: "12%", // Fixed width for the "Accept Bid" button
  backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "0.5rem"
};

const acceptedBidStyle = {
  fontWeight: "bold",
  color: "#2ac898",
  cursor: "pointer",
  // backgroundColor: "green",
  fontSize: "0.9rem",
  width: "12%", // Fixed width for the "Accept Bid" button
  backgroundColor: "rgba(42,200,152,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "0.5rem"

};

