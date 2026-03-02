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
import { parrotBlueSemiTransparent, parrotBlueTransparent, parrotGreen, parrotTextDarkBlue } from "../styles/colors";
import { CustomToolTip } from "./CustomToolTip";
import { CustomToolTipBidMessage } from "./CustomToolTipBidMessage";

const apiUrl = process.env.REACT_APP_API_URL;
const baseUserImageUrl = ``;

export function VoyageDetailBids({
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


  const handleAcceptBid = async ({ bidId, bidUserId }) => {
    setLoadingBidId(bidId); // Set loading state
    const text = `Hi there! 👋 Welcome on board to "${voyageData.name}" 🎉`;
    console.log("state of the hub: ", hubConnection.state);

    try {
      if (hubConnection.state === "Disconnected") {
        await hubConnection.start();

        if (!chatReadyRef.current) {
          console.log("Waiting for ParrotsChatHubInitialized...");
          // simple polling until ready
          await new Promise((resolve) => {
            const interval = setInterval(() => {
              if (chatReadyRef.current) {
                clearInterval(interval);
                resolve(true);
              }
            }, 100); // check every 100ms
          });
        }

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





  const handleDeleteBid = async ({ bidId, bidUserId }) => {
    setLoadingBidId(bidId);
    const text = `Hi there! 👋 Your bid was deleted by ${username}`;

    try {
      if (hubConnection.state === "Disconnected") {
        await hubConnection.start();

        if (!chatReadyRef.current) {
          console.log("Waiting for ParrotsChatHubInitialized...");
          await new Promise((resolve) => {
            const interval = setInterval(() => {
              if (chatReadyRef.current) {
                clearInterval(interval);
                resolve(true);
              }
            }, 100); // check every 100ms
          });
        }


      }
      await hubConnection.invoke("SendMessage", currentUserId, bidUserId, text);

      await deleteBid(bidId).unwrap();
      setBidsData((prevBids) => prevBids.filter((bid) => bid.id !== bidId));
      makeRefetch();
    } catch (error) {
      console.error("Error deleting bid:", error);
    } finally {
      setLoadingBidId(null);
    }
  };

  const hubConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl(`${apiUrl}/chathub/11?userId=${currentUserId}`, {
        withCredentials: false, // TODO: is this correct?
      })
      .build();
  }, [currentUserId]);


  const chatReadyRef = React.useRef(false);
  useEffect(() => {
    const startHubConnection = async () => {
      try {
        if (hubConnection.state === HubConnectionState.Disconnected) {
          chatReadyRef.current = false; // important: reset ready state
          await hubConnection.start();
          console.log("SignalR connection started successfully.");
        }
      } catch (error) {
        console.error("Failed to start SignalR connection:", error.message);
        chatReadyRef.current = false; // reset on failure
      }
    };

    // ✅ Track hub ready state
    hubConnection.on("ParrotsChatHubInitialized", () => {
      chatReadyRef.current = true; // hub is fully ready
      console.log("✅ ParrotsChatHubInitialized received, chat ready");
    });

    hubConnection.onclose(() => {
      console.log("SignalR connection closed.");
      chatReadyRef.current = false; // hub not ready
    });

    hubConnection.onreconnecting(() => {
      console.log("SignalR connection reconnecting...");
      chatReadyRef.current = false; // hub temporarily not ready
    });

    hubConnection.onreconnected(() => {
      console.log("SignalR connection reconnected.");
    });

    if (isSuccessVoyage) {
      startHubConnection();
    }

    return () => {
      hubConnection.off("ParrotsChatHubInitialized");
      hubConnection.stop();
    };
  }, [hubConnection, isSuccessVoyage]);



  return (
    <div style={cardContainerStyle} className=" ">
      {/* <div style={userVehicleInfoRow}>
        <span style={voyageName}>Current Bids</span>
      </div> */}
      <div
        style={{
          overflow: "auto",
          minHeight: "50vh",
          scrollbarColor: "#1e90ff50",
          scrollbarWidth: "none",
          msOverflowStyle: "none",

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

  if (bidsData.length === 0 && false) {

    return (
      <div
        style={{
          // backgroundColor: "rgba(255, 255, 255, 0.05)",
          height: "100%",
          width: "92%",
          padding: "1vh",
          borderRadius: "1.5rem",
          position: "relative",
          margin: "auto",
          marginTop: "15rem",
          display: "flex", // Use flexbox
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          textAlign: "center", // Ensure text alignment
        }}
      >
        <span
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.1rem",
            fontWeight: 800,
            textShadow: `
          2px 2px 4px rgba(0, 0, 0, 0.6),  
          -2px -2px 4px rgba(255, 255, 255, 0.2)
        `,
            filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))",
          }}
        >
          No Bids Yet
        </span>
      </div>
    )
  }



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
  const [isHoveredBid, setIsHoveredBid] = React.useState(false)

  const navigate = useNavigate();
  const handleGoToUser = (bidUserId, username) => {
    // navigate(`/profile-public/${bidUserId}/${username}`);
    navigate(`/profile-public/${bidUserPublicId}/${username}`);
  };


  return (

    <div style={{
      ...dataRowItem,
      height: ownVoyage ? "4.5rem" : "4rem",
      position: "relative"
    }}>
      <div style={leftItem}>
        <div style={imgWrapper}>
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
        </div>
      </div>
      <div style={{
        ...middleTopItem,
        gridRow: ownVoyage ? "1" : "1 / span 2"
      }}>
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
        <span style={bidAmount}>€{price}</span>
      </div>
      <div style={middleBottomItem}
        onMouseEnter={() => setIsHoveredBid(true)}
        onMouseLeave={() => setIsHoveredBid(false)}
      >
        {ownVoyage ? <span style={bidMessage} title={message}>{message}</span> : " "}
        {ownVoyage && <CustomToolTipBidMessage isHovered={isHoveredBid} message={message} />}
      </div>
      <div style={rightItem}>
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
            <AcceptBidSpinner />) : accepted ? ("Accepted") : ownVoyage ? ("Accept") : ("Pending")}
          { }
        </span>
        <span
          onClick={() => handleDeleteBid({ bidId, bidUserId })}
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem", cursor: ownVoyage && accepted ? "" : "pointer" }}
        >
          {ownVoyage &&
            (accepted ? (
              <IoCheckmarkCircleOutline color={parrotGreen} size={20} />
            ) : (
              <IoCloseCircleOutline color="orangered" size={20} />
            ))}
        </span>

      </div>
    </div>);


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



const messageButton = {
  backgroundColor: "rgba(0, 119, 234,0.05)",
  borderRadius: "1rem",
  fontSize: "0.8rem",
  color: "#0077EA",
  fontWeight: "500",
  cursor: "pointer",
  width: "100%",
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

const imgWrapper = {
  // height: "3rem",
  // width: "7rem",
  transition: "transform 0.3s ease-in-out",
  cursor: "pointer",
  // backgroundColor: "lightblue"
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  // border: "1px solid #ddd",
  borderRadius: "1rem",
  width: "100%",
  // backgroundColor: "#fff",
  margin: "0rem",
  color: parrotTextDarkBlue,
  // padding: "1rem",
  fontSize: "1.15rem",
  maxHeight: "55vh",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  // backgroundColor: "yellow"
};


const dataRowItem = {
  display: "grid",
  gridTemplateRows: "1fr 1fr",
  gridTemplateColumns: "1.5fr 6fr 3fr",
  gap: "0.2rem", // space between grid items
  marginTop: "0.3rem",
  borderRadius: "1rem",
  padding: "0.5rem", // optional padding inside the grid
  height: "5rem",
  width: "25rem",
  backgroundColor: "white",
  width: "100%",
  boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 6px, rgba(0, 0, 0, 0.2) 0px -8px 6px inset",

};

const leftItem = {
  gridRow: "1 / span 2",
  gridColumn: "1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // backgroundColor: "orange"
};

const middleTopItem = {
  // gridRow: "1",
  gridColumn: "2",
  justifyContent: "center",
  alignItems: "center",
  // backgroundColor: "lightgreen",
  display: "grid",
  // gridTemplateColumns: "4fr 1fr 1fr", // 4 : 1 : 1 ratio
  gridTemplateColumns: "minmax(0,1fr) 5rem 5rem"
};

const middleBottomItem = {
  // position: "relative",
  gridRow: "2",
  gridColumn: "2",
  display: "flex",
  justifyContent: "center",
  // alignItems: "center",
  // backgroundColor: "lightyellow",
  width: "100%",
};

const rightItem = {
  gridRow: "1 / span 2",
  gridColumn: "3",
  justifyContent: "center",
  alignItems: "center",
  display: "grid",
  gridTemplateColumns: "2fr 1fr",


};

const userNameStyle = {
  width: "100%",
  whiteSpace: "nowrap",
  // overflow: "hidden",
  // textOverflow: "ellipsis",
  fontWeight: "500",
  paddingLeft: "0.2rem",
  // backgroundColor: "yellow"
};

const personCountStyle = {
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  // backgroundColor: "cyan"
};

const bidMessage = {
  whiteSpace: "nowrap",        // prevent wrapping to a new line
  overflow: "hidden",          // hide overflow
  textOverflow: "ellipsis",    // show "..." if text is too long
  // display: "flex",             // keep it as flex to align vertically
  alignItems: "center",        // center vertically
  backgroundColor: parrotBlueTransparent,
  borderRadius: "1rem",
  padding: "0.2rem",
  paddingLeft: "0.5rem",
  width: "15rem",
  fontSize: "0.8rem",
  color: "#0077EA",
  fontWeight: "500",
  cursor: "pointer",
};

const bidAmount = {
  alignSelf: "center",
  color: "#2ac898",
  fontWeight: "700",
  // flexShrink: 0,
  width: "100%",
  // backgroundColor: "orange"
};

const acceptBidStyle = {
  fontWeight: "bold",
  color: "#0077EA",
  fontSize: "0.9rem",
  // width: "12%",
  backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "0.5rem",
  paddingLeft: "0.3rem",
  paddingRight: "0.3rem",
  // backgroundColor: "pink"
};

const acceptedBidStyle = {
  fontWeight: "bold",
  color: "#2ac898",
  fontSize: "0.9rem",
  // width: "12%",
  backgroundColor: "rgba(42,200,152,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "0.5rem",
};
