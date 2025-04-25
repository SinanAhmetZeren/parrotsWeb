import "../assets/css/App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { VoyageDetailBidButton } from "../components/VoyageDetailBidButton"
import { IoPersonOutline, IoPeopleOutline } from 'react-icons/io5';
import { useAcceptBidMutation } from "../slices/VoyageSlice";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;
const baseUserImageUrl = `${apiUrl}/Uploads/UserImages/`;

export function VoyageDetailBids({ voyageData, ownVoyage, userBid, userBidAccepted, currentUserId, isSuccessVoyage, refetch, setOpacity }) {
  const [loadingBidId, setLoadingBidId] = React.useState(null); // Track loading state for a specific bid
  const [bidsData, setBidsData] = React.useState(voyageData.bids); // Local state for bids
  const stateOfTheHub = () => {
    console.log("state of the hub: ", hubConnection.state);
  }
  const makeRefetch = useCallback(() => {
    refetch();
  }, [refetch]);
  const startTheHub = async () => {
    if (hubConnection.state === "Disconnected") {
      await hubConnection.start();
      console.log("state of the hub: ", hubConnection.state);

    } else {
      console.log("state of the hub is already: ", hubConnection.state);
    }
  }
  // const apiUrl = process.env.REACT_APP_API_URL;
  // const baseUserImageUrl = `${apiUrl}/Uploads/UserImages/`;
  const [acceptBid] = useAcceptBidMutation();
  const handleAcceptBid = async ({ bidId, bidUserId }) => {
    setLoadingBidId(bidId); // Set loading state
    const text = `Hi there! 👋 Welcome on board to "${voyageData.name}" 🎉`;
    console.log("state of the hub: ", hubConnection.state);

    try {
      if (hubConnection.state === "Disconnected") {
        await hubConnection.start();
      }
      await hubConnection.invoke("SendMessage", currentUserId, bidUserId, text);
      await acceptBid(bidId).unwrap(); // Ensure the mutation completes

      // Update the local bids state to mark the bid as accepted
      setBidsData((prevBids) =>
        prevBids.map((bid) =>
          bid.id === bidId ? { ...bid, accepted: true } : bid
        )
      );
      makeRefetch();
    } catch (error) {
      console.error("Error accepting bid:", error);
    } finally {
      setLoadingBidId(null); // Clear loading state
    }
  };

  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(`${apiUrl}/chathub/11?userId=${currentUserId}`, {
        withCredentials: false // TODO: is this correct? 
      })
      .build();
  }, [currentUserId, apiUrl]);


  useEffect(() => {
    console.log("hubconnect: ", hubConnection);

    const startHubConnection = async () => {
      try {
        if (hubConnection.state === "Disconnected") {
          await hubConnection.start();
          console.log("SignalR connection started successfully.");
        }
      } catch (error) {
        console.error("Failed to start SignalR connection:", error.message);
      }
    };

    hubConnection.onclose(() => {
      console.log("SignalR connection closed.");
    });

    hubConnection.onreconnecting(() => {
      console.log("SignalR connection reconnecting...");
    });

    hubConnection.onreconnected(() => {
      console.log("SignalR connection reconnected.");
    });

    if (isSuccessVoyage) {
      startHubConnection();
    }
    return () => {
      hubConnection.stop();
    };
  }, [hubConnection, isSuccessVoyage]);

  return (
    <div style={cardContainerStyle} className="flex row">
      <div style={userVehicleInfoRow}>
        <span style={voyageName}>Current Bids</span>
      </div>
      <div style={{
        overflow: "auto",
        minHeight: "35vh",
        scrollbarColor: "#1e90ff50",
      }}>

        <div className="BidsList">
          <BidsList
            bidsData={bidsData}
            ownVoyage={ownVoyage}
            handleAcceptBid={handleAcceptBid}
            loadingBidId={loadingBidId}
          />
        </div>
      </div>
      <VoyageDetailBidButton
        ownVoyage={ownVoyage}
        userBid={userBid}
        userBidAccepted={userBidAccepted}
        setOpacity={setOpacity}
      />
    </div>
  );
}

function BidsList({ bidsData, ownVoyage, handleAcceptBid, loadingBidId }) {
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
        loadingBidId={loadingBidId}
      />
    );
  });
}

function RenderBid({ username, userImage, message, price, accepted, personCount, ownVoyage, handleAcceptBid, bidId, bidUserId, loadingBidId }) {
  const [hoveredUserImgID, setHoveredUserImgID] = React.useState("")
  const navigate = useNavigate();
  const handleGoToUser = (bidUserId, username) => {
    navigate(`/profile-public/${bidUserId}/${username}`);
  }
  return (
    <div className={"flex"} style={dataRowItem}>
      <div style={userAndVehicleBox}>
        <img src={userImage}

          style={{ ...userImageStyle, ...((hoveredUserImgID === bidUserId) ? userImageStyleHover : {}) }}
          onMouseEnter={() => {
            setHoveredUserImgID(bidUserId)
          }}
          onMouseLeave={() => setHoveredUserImgID("")}
          alt="User" onClick={() => handleGoToUser(bidUserId, username)} />
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
          onClick={() => ownVoyage && !accepted && !loadingBidId && handleAcceptBid({ bidId, bidUserId })}
          style={{
            ...(accepted ? acceptedBidStyle : acceptBidStyle),
            cursor: (ownVoyage && !accepted) ? "pointer" : "default",
          }}
        >
          {loadingBidId === bidId && !accepted ? (
            <AcceptBidSpinner />
          ) : accepted ? "Accepted" : "Accept"}
        </span>
      </div>
    </div>
  );
}

const AcceptBidSpinner = () => {
  return (
    <div style={{
      backgroundColor: "rgba(0, 119, 234,0.1)",
      borderRadius: "1.5rem",
      position: "relative",
      margin: "auto",
      height: "1.2rem",
      display: "flex",
      alignItems: "center",
    }}>
      <div className="spinner"
        style={{
          height: "1rem",
          width: "1rem",
          border: "3px solid white",
          borderTop: "3px solid #1e90ff",
        }}></div>
    </div>)
}

const userImageStyleHover = {
  transform: "scale(1.2)",
};

const userImageStyle = {
  height: "3rem",
  width: "3rem",
  borderRadius: "3rem",
  transition: "transform 0.3s ease-in-out",
  cursor: "pointer"
};

const voyageName = {
  color: "#2ac898",
  fontWeight: "800",
  fontSize: "1.5rem"
}

const userVehicleInfoRow = {
  display: 'flex',
  flexDirection: 'row',
  margin: "0.2rem",
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
  // overflow: "scroll",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const dataRowItem = {
  marginTop: ".3rem",
  backgroundColor: "rgba(0, 119, 234,0.05)",
  borderRadius: "1rem"
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
  fontWeight: "700",
  paddingLeft: "0.2rem"
};

const personCountStyle = {
  width: "10%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: "center",
  fontWeight: "700"
};

const bidMessage = {
  wordWrap: "break-word",
  marginLeft: "1rem",
  width: "50%",
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
  color: "#0077EA",
  // cursor: "pointer",
  fontSize: "0.9rem",
  width: "12%",
  backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "0.5rem"
};

const acceptedBidStyle = {
  fontWeight: "bold",
  color: "#2ac898",
  // cursor: "pointer",
  fontSize: "0.9rem",
  width: "12%",
  backgroundColor: "rgba(42,200,152,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "0.5rem"

};
