import "../assets/css/App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { VoyageDetailBidButton } from "../components/VoyageDetailBidButton";
import {
  IoPersonOutline,
  IoPeopleOutline,
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import {
  useAcceptBidMutation,
  useDeleteBidMutation,
} from "../slices/VoyageSlice";
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { parrotGreen, parrotTextDarkBlue } from "../styles/colors";
import { invokeHub } from "../signalr/signalRHub";

const apiUrl = process.env.REACT_APP_API_URL;
const baseUserImageUrl = ``;

export function VoyageDetailBidsNew({
  userId,
  voyageId,
  voyageData,
  ownVoyage,
  userBid,
  userBidAccepted,
  currentUserId,
  isSuccessVoyage,
  refetch,
  setOpacity,
}) {
  const [acceptBid] = useAcceptBidMutation();
  const [deleteBid] = useDeleteBidMutation();
  const username = localStorage.getItem("storedUserName");
  const [loadingBidId, setLoadingBidId] = React.useState(null);
  const [bidsData, setBidsData] = React.useState(voyageData.bids);

  // Synchronize bidsData with voyageData.bids
  useEffect(() => {
    setBidsData(voyageData.bids);
  }, [voyageData.bids]);

  const makeRefetch = useCallback(() => {
    refetch();
  }, [refetch]);


  // ACCEPT BID
  const handleAcceptBid = async ({ bidId, bidUserId }) => {
    setLoadingBidId(bidId);
    const text = `Hi there! 👋 Welcome on board to "${voyageData.name}" 🎉`;
    try {
      // 🔔 Send chat message
      await invokeHub("SendMessage", currentUserId, bidUserId, text);
      // 💾 Update backend
      await acceptBid(bidId).unwrap();
      // 🧠 Optimistic UI update
      setBidsData((prevBids) =>
        prevBids.map((bid) =>
          bid.id === bidId ? { ...bid, accepted: true } : bid
        )
      );
      makeRefetch();
    } catch (error) {
      console.error("Error accepting bid:", error);
    } finally {
      setLoadingBidId(null);
    }
  };

  // DELETE BID
  const handleDeleteBid = async ({ bidId, bidUserId }) => {
    setLoadingBidId(bidId);
    const text = `Hi there! 👋 Your bid was deleted by ${username}`;
    try {
      // 🔔 Send chat message
      await invokeHub("SendMessage", currentUserId, bidUserId, text);
      // 💾 Delete in backend
      await deleteBid(bidId).unwrap();
      // 🧠 Optimistic UI update
      setBidsData((prevBids) =>
        prevBids.filter((bid) => bid.id !== bidId)
      );
      makeRefetch();
    } catch (error) {
      console.error("Error deleting bid:", error);
    } finally {
      setLoadingBidId(null);
    }
  };



  return (
    <div style={cardContainerStyle} className="flex row">
      <div style={userVehicleInfoRow}>
        <span style={voyageName}>Current Bids</span>
      </div>
      <div
        style={{
          overflow: "auto",
          minHeight: "35vh",
          scrollbarColor: "#1e90ff50",
        }}
      >
        <div className="BidsList">
          <BidsList
            bidsData={bidsData}
            ownVoyage={ownVoyage}
            handleAcceptBid={handleAcceptBid}
            handleDeleteBid={handleDeleteBid}
            loadingBidId={loadingBidId}
          />
        </div>
      </div>
      <VoyageDetailBidButton
        ownVoyage={ownVoyage}
        userBid={userBid}
        userProfileImage={voyageData.user.profileImageUrl}
        userName={voyageData.user.userName}
        userBidAccepted={userBidAccepted}
        setOpacity={setOpacity}
        userId={userId}
        voyageId={voyageId}
        refetch={refetch}
      />
    </div>
  );
}

function BidsList({
  bidsData,
  ownVoyage,
  handleAcceptBid,
  handleDeleteBid,
  loadingBidId,
}) {
  return bidsData.map((bid, i) => {
    const bidId = `bid-${i}`; // Unique bid identifier
    return (
      <RenderBid
        key={bidId}
        username={bid.userName}
        userImage={baseUserImageUrl + bid.userProfileImage}
        message={bid.message}
        price={bid.offerPrice}
        accepted={bid.accepted}
        personCount={bid.personCount}
        ownVoyage={ownVoyage}
        handleAcceptBid={handleAcceptBid}
        bidId={bid.id}
        bidUserId={bid.userId}
        bidUserPublicId={bid.userPublicId}
        loadingBidId={loadingBidId}
        handleDeleteBid={handleDeleteBid}
      />
    );
  });
}

function RenderBid({
  username,
  userImage,
  message,
  price,
  accepted,
  personCount,
  ownVoyage,
  handleAcceptBid,
  bidId,
  bidUserId,
  bidUserPublicId,
  loadingBidId,
  handleDeleteBid,
}) {
  const [hoveredUserImgID, setHoveredUserImgID] = React.useState("");
  const navigate = useNavigate();
  const handleGoToUser = (bidUserId, username) => {
    // navigate(`/profile-public/${bidUserId}/${username}`);
    navigate(`/profile-public/${bidUserPublicId}/${username}`);
  };
  return (
    <div className={"flex"} style={dataRowItem}>
      <div style={userAndVehicleBox}>
        <img
          src={userImage}
          style={{
            ...userImageStyle,
            ...(hoveredUserImgID === bidUserId ? userImageStyleHover : {}),
          }}
          onMouseEnter={() => {
            setHoveredUserImgID(bidUserId);
          }}
          onMouseLeave={() => setHoveredUserImgID("")}
          alt="User"
          onClick={() => handleGoToUser(bidUserId, username)}
        />
        <span style={userNameStyle} title={username}>
          {username}
        </span>
        <span style={personCountStyle} title={personCount}>
          {personCount === 1 ? (
            <IoPersonOutline size="1rem" style={{ marginRight: "0.15rem" }} />
          ) : (
            <IoPeopleOutline size="1rem" style={{ marginRight: "0.15rem" }} />
          )}
          {personCount}
        </span>
        <span style={bidMessage}>{ownVoyage ? message || " " : " "}</span>
        <span style={bidAmount}>€{price}</span>
        <span
          onClick={() =>
            ownVoyage &&
            !accepted &&
            !loadingBidId &&
            handleAcceptBid({ bidId, bidUserId })
          }
          style={{
            ...(accepted ? acceptedBidStyle : acceptBidStyle),
            cursor: ownVoyage && !accepted ? "pointer" : "default",
          }}
        >
          {loadingBidId === bidId && !accepted ? (
            <AcceptBidSpinner />
          ) : accepted ? (
            "Accepted"
          ) : ownVoyage ? (
            "Accept"
          ) : (
            "Pending"
          )}
          { }
        </span>
        <span
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          onClick={() => handleDeleteBid({ bidId, bidUserId })}
        >
          {ownVoyage &&
            (accepted ? (
              <IoCheckmarkCircleOutline color={parrotGreen} />
            ) : (
              <IoCloseCircleOutline color="orangered" />
            ))}
        </span>
      </div>
    </div>
  );
}

const AcceptBidSpinner = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 119, 234,0.1)",
        borderRadius: "1.5rem",
        position: "relative",
        margin: "auto",
        height: "1.2rem",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="spinner"
        style={{
          height: "1rem",
          width: "1rem",
          border: "3px solid white",
          borderTop: "3px solid #1e90ff",
        }}
      ></div>
    </div>
  );
};

const userImageStyleHover = {
  transform: "scale(1.2)",
};

const userImageStyle = {
  height: "3rem",
  width: "3rem",
  borderRadius: "3rem",
  transition: "transform 0.3s ease-in-out",
  cursor: "pointer",
};

const voyageName = {
  color: "#2ac898",
  fontWeight: "800",
  fontSize: "1.5rem",
};

const userVehicleInfoRow = {
  display: "flex",
  flexDirection: "row",
  margin: "0.2rem",
  marginLeft: "1.3rem",
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  borderRadius: "1rem",
  width: "100%",
  backgroundColor: "#0d2b4e",
  margin: "0rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -8px 6px rgba(0,0,0,0.2)",
  color: "rgba(255,255,255,0.9)",
  padding: "1rem",
  fontSize: "1.15rem",
  maxHeight: "50vh",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const dataRowItem = {
  marginTop: ".3rem",
  backgroundColor: "rgba(255,255,255,0.07)",
  borderRadius: "1rem",
};

const userAndVehicleBox = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  borderRadius: "4rem",
  marginLeft: "0.5rem",
  width: "100%",
  justifyContent: "space-between",
};

const userNameStyle = {
  width: "20%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontWeight: "500",
  paddingLeft: "0.2rem",
  color: "rgba(255,255,255,0.9)",
};

const personCountStyle = {
  width: "10%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
};

const bidMessage = {
  wordWrap: "break-word",
  marginLeft: "1rem",
  width: "50%",
  backgroundColor: "rgba(255,255,255,0.08)",
  borderRadius: "1rem",
  padding: "0.2rem 0.5rem",
  fontSize: "0.8rem",
  color: "rgba(255,255,255,0.8)",
  fontWeight: "500",
};

const bidAmount = {
  alignSelf: "center",
  color: "#2ac898",

  fontWeight: "700",
  flexShrink: 0,
  width: "10%",
};

const acceptBidStyle = {
  fontWeight: "bold",
  color: "#ffffff",
  fontSize: "0.9rem",
  width: "12%",
  backgroundColor: "rgba(255,255,255,0.15)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "0.5rem",
};

const acceptedBidStyle = {
  fontWeight: "bold",
  color: "#2ac898",
  fontSize: "0.9rem",
  width: "12%",
  backgroundColor: "rgba(42,200,152,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "0.5rem",
};