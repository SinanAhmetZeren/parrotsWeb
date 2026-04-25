import "../assets/css/App.css";
import * as React from "react";
import { VoyageDetailBidButton } from "../components/VoyageDetailBidButton";
import { IoPersonOutline, IoPeopleOutline, IoCloseCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { useAcceptBidMutation, useDeleteBidMutation } from "../slices/VoyageSlice";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { parrotGreen, parrotTextDarkBlue } from "../styles/colors";
import { invokeHub } from "../signalr/signalRHub";

const baseUserImageUrl = ``;

export function VoyageDetailBidsNewLight({
  userId, voyageId, voyageData, ownVoyage, userBid, userBidAccepted,
  currentUserId, isSuccessVoyage, refetch, setOpacity,
}) {
  const [acceptBid] = useAcceptBidMutation();
  const [deleteBid] = useDeleteBidMutation();
  const username = localStorage.getItem("storedUserName");
  const [loadingBidId, setLoadingBidId] = React.useState(null);
  const [bidsData, setBidsData] = React.useState(voyageData.bids);

  useEffect(() => { setBidsData(voyageData.bids); }, [voyageData.bids]);
  const makeRefetch = useCallback(() => { refetch(); }, [refetch]);

  const handleAcceptBid = async ({ bidId, bidUserId }) => {
    setLoadingBidId(bidId);
    const text = `Hi there! 👋 Welcome on board to "${voyageData.name}" 🎉`;
    try {
      await invokeHub("SendMessage", currentUserId, bidUserId, text);
      await acceptBid(bidId).unwrap();
      setBidsData((prevBids) => prevBids.map((bid) => bid.id === bidId ? { ...bid, accepted: true } : bid));
      makeRefetch();
    } catch (error) { console.error("Error accepting bid:", error); }
    finally { setLoadingBidId(null); }
  };

  const handleDeleteBid = async ({ bidId, bidUserId }) => {
    setLoadingBidId(bidId);
    const text = `Hi there! 👋 Your bid was deleted by ${username}`;
    try {
      await invokeHub("SendMessage", currentUserId, bidUserId, text);
      await deleteBid(bidId).unwrap();
      setBidsData((prevBids) => prevBids.filter((bid) => bid.id !== bidId));
      makeRefetch();
    } catch (error) { console.error("Error deleting bid:", error); }
    finally { setLoadingBidId(null); }
  };

  return (
    <div style={cardContainerStyle} className="flex row">
      <div style={userVehicleInfoRow}>
        <span style={voyageName}>Current Bids</span>
      </div>
      <div style={{ overflow: "auto", minHeight: "35vh", scrollbarColor: "#1e90ff50" }}>
        <div className="BidsList">
          <BidsList bidsData={bidsData} ownVoyage={ownVoyage} handleAcceptBid={handleAcceptBid} handleDeleteBid={handleDeleteBid} loadingBidId={loadingBidId} />
        </div>
      </div>
      <VoyageDetailBidButton
        ownVoyage={ownVoyage} userBid={userBid} userProfileImage={voyageData.user.profileImageUrl}
        userName={voyageData.user.userName} userBidAccepted={userBidAccepted} setOpacity={setOpacity}
        userId={userId} voyageId={voyageId} refetch={refetch}
      />
    </div>
  );
}

function BidsList({ bidsData, ownVoyage, handleAcceptBid, handleDeleteBid, loadingBidId }) {
  return bidsData.map((bid, i) => (
    <RenderBid
      key={`bid-${i}`}
      username={bid.userName} userImage={baseUserImageUrl + bid.userProfileImage}
      message={bid.message} price={bid.offerPrice} accepted={bid.accepted}
      personCount={bid.personCount} ownVoyage={ownVoyage} handleAcceptBid={handleAcceptBid}
      bidId={bid.id} bidUserId={bid.userId} bidUserPublicId={bid.userPublicId}
      loadingBidId={loadingBidId} handleDeleteBid={handleDeleteBid}
    />
  ));
}

function RenderBid({ username, userImage, message, price, accepted, personCount, ownVoyage, handleAcceptBid, bidId, bidUserId, bidUserPublicId, loadingBidId, handleDeleteBid }) {
  const [hoveredUserImgID, setHoveredUserImgID] = React.useState("");
  const navigate = useNavigate();

  return (
    <div className={"flex"} style={dataRowItem}>
      <div style={userAndVehicleBox}>
        <img
          src={userImage}
          style={{ ...userImageStyle, ...(hoveredUserImgID === bidUserId ? { transform: "scale(1.2)" } : {}) }}
          onMouseEnter={() => setHoveredUserImgID(bidUserId)}
          onMouseLeave={() => setHoveredUserImgID("")}
          alt="User"
          onClick={() => navigate(`/profile-public/${bidUserPublicId}/${username}`)}
        />
        <span style={userNameStyle} title={username}>{username}</span>
        <span style={personCountStyle} title={personCount}>
          {personCount === 1 ? <IoPersonOutline size="1rem" style={{ marginRight: "0.15rem" }} /> : <IoPeopleOutline size="1rem" style={{ marginRight: "0.15rem" }} />}
          {personCount}
        </span>
        <span style={bidMessage}>{ownVoyage ? message || " " : " "}</span>
        <span style={bidAmount}>€{price}</span>
        <span
          onClick={() => ownVoyage && !accepted && !loadingBidId && handleAcceptBid({ bidId, bidUserId })}
          style={{ ...(accepted ? acceptedBidStyle : acceptBidStyle), cursor: ownVoyage && !accepted ? "pointer" : "default" }}
        >
          {loadingBidId === bidId && !accepted ? <AcceptBidSpinner /> : accepted ? "Accepted" : ownVoyage ? "Accept" : "Pending"}
        </span>
        <span style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }} onClick={() => handleDeleteBid({ bidId, bidUserId })}>
          {ownVoyage && (accepted ? <IoCheckmarkCircleOutline color={parrotGreen} /> : <IoCloseCircleOutline color="orangered" />)}
        </span>
      </div>
    </div>
  );
}

const AcceptBidSpinner = () => (
  <div style={{ backgroundColor: "rgba(0,119,234,0.1)", borderRadius: "1.5rem", position: "relative", margin: "auto", height: "1.2rem", display: "flex", alignItems: "center" }}>
    <div className="spinner" style={{ height: "1rem", width: "1rem", border: "3px solid #ccc", borderTop: "3px solid #1e90ff" }} />
  </div>
);

const userImageStyle = { height: "3rem", width: "3rem", borderRadius: "3rem", transition: "transform 0.3s ease-in-out", cursor: "pointer" };

const voyageName = { color: "#0077EA", fontWeight: "800", fontSize: "1.5rem" };
const userVehicleInfoRow = { display: "flex", flexDirection: "row", margin: "0.2rem", marginLeft: "1.3rem" };

const cardContainerStyle = {
  display: "flex", flexDirection: "column", border: "1px solid #ddd", borderRadius: "1rem",
  width: "100%", backgroundColor: "#fff", margin: "0rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  color: parrotTextDarkBlue, padding: "1rem", fontSize: "1.15rem",
  maxHeight: "50vh", scrollbarWidth: "none", msOverflowStyle: "none",
};

const dataRowItem = { marginTop: ".3rem", backgroundColor: "rgba(0,119,234,0.05)", borderRadius: "1rem" };

const userAndVehicleBox = {
  display: "flex", flexDirection: "row", alignItems: "center",
  borderRadius: "4rem", marginLeft: "0.5rem", width: "100%", justifyContent: "space-between",
};

const userNameStyle = { width: "20%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: "500", paddingLeft: "0.2rem" };
const personCountStyle = { width: "10%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: "700" };
const bidMessage = { wordWrap: "break-word", marginLeft: "1rem", width: "50%" };
const bidAmount = { alignSelf: "center", color: "#2ac898", fontWeight: "700", flexShrink: 0, width: "10%" };

const acceptBidStyle = {
  fontWeight: "bold", color: "#0077EA", fontSize: "0.9rem", width: "12%",
  backgroundColor: "rgba(0,119,234,0.1)", borderRadius: "1rem", marginLeft: "0.5rem", marginRight: "0.5rem",
};

const acceptedBidStyle = {
  fontWeight: "bold", color: "#2ac898", fontSize: "0.9rem", width: "12%",
  backgroundColor: "rgba(42,200,152,0.1)", borderRadius: "1rem", marginLeft: "0.5rem", marginRight: "0.5rem",
};
