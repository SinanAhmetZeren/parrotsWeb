import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../assets/css/date-range-custom.css";
import { parrotBlue, parrotDarkBlue, parrotCream } from "../styles/colors";
import {
  useSendBidMutation,
  useChangeBidMutation,
} from "../slices/VoyageSlice";

Modal.setAppElement("#root"); // Replace '#root' with the ID of your app's root element

export const VoyageDetailBidButton = ({
  userId,
  userName,
  userProfileImage,
  voyageId,
  ownVoyage,
  userBid,
  userBidAccepted,
  setOpacity,
  refetch,
}) => {
  // console.log("userBid", userBid);

  const [isNewBidModalOpen, setIsNewBidModalOpen] = useState(false);
  const [isChangeBidModalOpen, setIsChangeBidModalOpen] = useState(false);
  const [personCount, setPersonCount] = useState(1);
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");

  const [changingBidState, setChangingBidState] = useState(false);

  const openNewBidModal = () => {
    setIsNewBidModalOpen(true);
    setOpacity(0.5);
  };
  const closeNewBidModal = () => {
    setIsNewBidModalOpen(false);
    setOpacity(1);
    setPersonCount(1);
    setPrice(0);
    setMessage("");
  };

  const openChangeBidModal = () => {
    if (userBid) {
      setPersonCount(userBid.personCount || 1);
      setPrice(userBid.offerPrice || 0);
      setMessage(userBid.message || "");
    }
    setIsChangeBidModalOpen(true);
    setOpacity(0.5);
  };

  const closeChangeBidModal = () => {
    setIsChangeBidModalOpen(false);
    setOpacity(1);
    setPersonCount(1);
    setPrice(0);
    setMessage("");
  };

  const incrementPersonCount = () => setPersonCount(personCount + 1);
  const decrementPersonCount = () =>
    setPersonCount(Math.max(1, personCount - 1));

  const incrementPrice = () => setPrice(price + 1);
  const decrementPrice = () => setPrice(Math.max(0, price - 1));

  const [sendBid] = useSendBidMutation();
  const [changeBid] = useChangeBidMutation();

  const handleSendBid = async (userProfileImage, userName) => {
    let bidData = {
      personCount: personCount,
      message: message,
      offerPrice: price,
      currency: "",
      voyageId,
      userId,
      userProfileImage,
      userName,
    };
    setChangingBidState(true);
    await sendBid(bidData);
    closeNewBidModal();
    await refetch();
    setChangingBidState(false);
  };

  const handleChangeBid = async () => {
    let bidData = {
      personCount: personCount,
      message: message,
      offerPrice: price,
      voyageId,
      userId,
      bidId: userBid.id,
    };
    setChangingBidState(true);
    await changeBid(bidData);
    closeChangeBidModal(); //-iğü-
    await refetch();
    setChangingBidState(false);
  };

  useEffect(() => {
    if (personCount === 0) {
      setPersonCount(1);
    }
  }, [personCount]);

  return (
    <div
      style={{
        display: "flex",
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        cursor: "pointer",
        width: "100%",
        paddingTop: "0.5rem",
        justifyContent: "center",
      }}
    >
      <div style={{ marginTop: "1.5rem" }}>
        {userBidAccepted && !ownVoyage ? (
          <button
            disabled={true}
            style={{ ...buttonStyle, backgroundColor: "green" }}
          >
            Bid Accepted
          </button>
        ) : ownVoyage ? null : !userBid ? (
          <button
            onClick={openNewBidModal}
            style={{ ...buttonStyle, backgroundColor: parrotBlue }}
          >
            Enter Your Bid
          </button>
        ) : (
          <button
            onClick={openChangeBidModal}
            style={{ ...buttonStyle, backgroundColor: parrotBlue }}
          >
            Change Bid
          </button>
        )}
      </div>

      <Modal
        isOpen={isNewBidModalOpen}
        onRequestClose={closeNewBidModal}
        style={modalStyle}
      >
        <div style={titleStyle}>Enter Your Bid</div>
        <div style={subtitleStyle}>Set your offer price and number of guests</div>

        <div style={fieldBlockStyle}>
          <div style={fieldLabelStyle}>OFFER PRICE</div>
          <div style={counterRowStyle}>
            <button style={counterBtnStyle} onClick={decrementPrice}>-</button>
            <input
              type="text"
              value={price}
              onFocus={(e) => { if (e.target.value === "0") setPrice(""); }}
              onBlur={(e) => { if (e.target.value === "") setPrice(0); }}
              onChange={(e) => {
                const n = e.target.value.replace(/\D/g, "");
                setPrice(n === "" ? "" : parseInt(n, 10));
              }}
              style={counterInputStyle}
            />
            <button style={counterBtnStyle} onClick={incrementPrice}>+</button>
          </div>
        </div>

        <div style={fieldBlockStyle}>
          <div style={fieldLabelStyle}>GUESTS</div>
          <div style={counterRowStyle}>
            <button style={counterBtnStyle} onClick={decrementPersonCount}>-</button>
            <input
              type="text"
              value={personCount}
              onFocus={(e) => { if (e.target.value === "0") setPersonCount(""); }}
              onBlur={(e) => { if (e.target.value === "") setPersonCount(1); }}
              onChange={(e) => {
                const n = e.target.value.replace(/\D/g, "");
                setPersonCount(n === "" ? "" : parseInt(n, 10));
              }}
              style={counterInputStyle}
            />
            <button style={counterBtnStyle} onClick={incrementPersonCount}>+</button>
          </div>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message (optional)"
          style={messageInputStyle}
        />

        <div style={bottomButtonsStyle}>
          <button onClick={closeNewBidModal} style={cancelBtnStyle}>Cancel</button>
          <button onClick={() => handleSendBid(userProfileImage, userName)} style={sendBtnStyle}>
            {changingBidState ? <AcceptOrChangeBidSpinner /> : "Send Bid"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isChangeBidModalOpen}
        onRequestClose={closeChangeBidModal}
        style={modalStyle}
      >
        <div style={titleStyle}>Change Your Bid</div>
        <div style={subtitleStyle}>Update your offer price and number of guests</div>

        <div style={fieldBlockStyle}>
          <div style={fieldLabelStyle}>OFFER PRICE</div>
          <div style={counterRowStyle}>
            <button style={counterBtnStyle} onClick={decrementPrice}>-</button>
            <input
              type="text"
              value={price}
              onFocus={(e) => { if (e.target.value === "0") setPrice(""); }}
              onBlur={(e) => { if (e.target.value === "") setPrice(0); }}
              onChange={(e) => {
                const n = e.target.value.replace(/\D/g, "");
                setPrice(n === "" ? "" : parseInt(n, 10));
              }}
              style={counterInputStyle}
            />
            <button style={counterBtnStyle} onClick={incrementPrice}>+</button>
          </div>
        </div>

        <div style={fieldBlockStyle}>
          <div style={fieldLabelStyle}>GUESTS</div>
          <div style={counterRowStyle}>
            <button style={counterBtnStyle} onClick={decrementPersonCount}>-</button>
            <input
              type="text"
              value={personCount}
              onFocus={(e) => { if (e.target.value === "0") setPersonCount(""); }}
              onBlur={(e) => { if (e.target.value === "") setPersonCount(1); }}
              onChange={(e) => {
                const n = e.target.value.replace(/\D/g, "");
                setPersonCount(n === "" ? "" : parseInt(n, 10));
              }}
              style={counterInputStyle}
            />
            <button style={counterBtnStyle} onClick={incrementPersonCount}>+</button>
          </div>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message (optional)"
          style={messageInputStyle}
        />

        <div style={bottomButtonsStyle}>
          <button onClick={closeChangeBidModal} style={cancelBtnStyle}>Cancel</button>
          <button onClick={() => handleChangeBid(userProfileImage, userName)} style={sendBtnStyle}>
            {changingBidState ? <AcceptOrChangeBidSpinner /> : "Change Bid"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
  border: "none",
};

const modalStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "18rem",
    right: "auto",
    bottom: "auto",
    transform: "translateY(-50%)",
    padding: "1.75rem",
    borderRadius: "1.5rem",
    zIndex: 1050,
    backgroundColor: "#ffffff",
    width: "28rem",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    border: "none",
    overflowX: "hidden",
  },
};

const titleStyle = {
  fontSize: "1.25rem",
  fontWeight: "800",
  color: "#163A5F",
  marginBottom: "0.25rem",
};

const subtitleStyle = {
  fontSize: "0.8rem",
  color: "#9aa0aa",
  marginBottom: "1.25rem",
};

const fieldBlockStyle = {
  marginBottom: "1rem",
};

const fieldLabelStyle = {
  fontSize: "0.7rem",
  color: "#9aa0aa",
  fontWeight: "600",
  letterSpacing: "0.05em",
  marginBottom: "0.5rem",
};

const counterRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.25rem",
};

const counterBtnStyle = {
  backgroundColor: "#ffffff",
  color: "#2ecc71",
  width: "5rem",
  height: "2.75rem",
  fontSize: "1.5rem",
  fontWeight: "700",
  border: "none",
  borderRadius: "0.75rem",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const counterInputStyle = {
  width: "4rem",
  textAlign: "center",
  fontSize: "1.75rem",
  fontWeight: "800",
  color: "#2ecc71",
  border: "none",
  outline: "none",
  background: "transparent",
  WebkitAppearance: "none",
  MozAppearance: "textfield",
};

const messageInputStyle = {
  width: "100%",
  minHeight: "4rem",
  padding: "0.75rem",
  backgroundColor: "#f2f4f7",
  border: "none",
  borderRadius: "0.75rem",
  fontSize: "0.9rem",
  color: "#163A5F",
  resize: "none",
  marginBottom: "1.25rem",
  boxSizing: "border-box",
  outline: "none",
};

const bottomButtonsStyle = {
  display: "flex",
  gap: "0.75rem",
};

const cancelBtnStyle = {
  flex: 1,
  flexShrink: 1,
  padding: "0.75rem",
  borderRadius: "2rem",
  border: "none",
  backgroundColor: "#f2f4f7",
  color: "#9aa0aa",
  fontWeight: "700",
  fontSize: "0.95rem",
  cursor: "pointer",
};

const sendBtnStyle = {
  flex: 2,
  padding: "0.75rem",
  borderRadius: "2rem",
  border: "none",
  backgroundColor: parrotBlue,
  color: "white",
  fontWeight: "700",
  fontSize: "0.95rem",
  cursor: "pointer",
};

const AcceptOrChangeBidSpinner = () => {
  return (
    <div
      style={{
        // backgroundColor: "rgba(0, 119, 234,0.1)",
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
