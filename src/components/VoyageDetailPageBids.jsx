import img1 from "../assets/catamaran.jpeg";
import img2 from "../assets/parrot-looks.jpg";
import "../App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { VoyageDetailBidButton } from "../components/VoyageDetailBidButton"
import { IoPersonOutline, IoPeopleOutline } from 'react-icons/io5';


export function VoyageDetailBids({ voyageData, ownVoyage, userBid }) {

  const apiUrl = process.env.REACT_APP_API_URL;
  const baseUserImageUrl = `${apiUrl}/Uploads/UserImages/`;
  const bids = [];
  console.log("VoyageDetailBids userBid", userBid);
  console.log("VoyageDetailBids ownVoyage", ownVoyage);

  voyageData.bids.forEach((bid, i) => {
    const bidId = `bid-${i}`; // Unique bid identifier
    bids.push(
      <RenderBid
        key={bidId}
        username={bid.userName}
        userImage={baseUserImageUrl + bid.userProfileImage}
        message={bid.message}
        price={bid.offerPrice}
        accepted={bid.accepted}
        personCount={bid.personCount}
        ownVoyage={ownVoyage}
      />
    );
  });



  return (
    <div style={cardContainerStyle} className="flex row">
      <div style={userVehicleInfoRow}>
        <span style={voyageName}>Current Bids</span>
      </div>
      {bids}

      <VoyageDetailBidButton ownVoyage={ownVoyage} userBid={userBid} />
    </div>
  );
}

function acceptBid() {
  console.log("bid accepted");
}




function RenderBid({ username, userImage, message, price, accepted, personCount, ownVoyage }) {
  return (
    <div className={"flex"} style={dataRowItem}>
      <div style={userAndVehicleBox}>
        <img src={userImage} style={userImageStyle} alt="User" />
        <span style={userNameStyle} title={username}>
          {username}
        </span>
        <span style={personCountStyle} title={personCount}>
          {personCount === 1 ?
            <IoPersonOutline size="1rem" style={{ marginRight: '0.15rem' }} />
            : <IoPeopleOutline size="1rem" style={{ marginRight: '0.15rem' }} />
          }
          {personCount}

        </span>
        <span style={bidMessage}>
          {ownVoyage ? (message || " ") : " "}
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
  backgroundColor: "rgba(0, 119, 234,0.05)",
  borderRadius: "1rem"
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
  width: "20%", // Fixed width
  whiteSpace: "nowrap", // Prevent line breaks
  overflow: "hidden", // Hide overflow text
  textOverflow: "ellipsis", // Show "..." for overflow text
  fontWeight: "700",
  paddingLeft: "0.2rem"
};

const personCountStyle = {
  width: "10%", // Fixed width
  whiteSpace: "nowrap", // Prevent line breaks
  overflow: "hidden", // Hide overflow text
  textOverflow: "ellipsis", // Show "..." for overflow text
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: "center",
  fontWeight: "700"
};

const bidMessage = {
  wordWrap: "break-word", // Allow the message to break into multiple lines
  marginLeft: "1rem",
  width: "50%",
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


