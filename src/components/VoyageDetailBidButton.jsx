import React, { useState } from "react";
import Modal from "react-modal";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../assets/css/date-range-custom.css";

export const VoyageDetailBidButton = ({ ownVoyage, userBid, userBidAccepted, setOpacity }) => {
  console.log("userBid", userBid);
  const [isNewBidModalOpen, setIsNewBidModalOpen] = useState(false);
  const [personCount, setPersonCount] = useState(1);
  const [price, setPrice] = useState(0);
  const [explanation, setExplanation] = useState("");

  const openNewBidModal = () => {
    setIsNewBidModalOpen(true);
    setOpacity(0.5);
  }
  const closeNewBidModal = () => {
    setIsNewBidModalOpen(false);
    setOpacity(1);
  }

  const incrementPersonCount = () => setPersonCount(personCount + 1);
  const decrementPersonCount = () => setPersonCount(Math.max(1, personCount));

  const incrementPrice = () => setPrice(price + 1);
  const decrementPrice = () => setPrice(Math.max(0, price));

  const sendBid = () => {
    console.log("Bid Sent", { personCount, price, explanation });
    // closeNewBidModal();
  };

  return (
    <div
      style={{
        display: "flex",
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        cursor: "pointer",
        width: "100%",
        paddingTop: "0.5rem",
        justifyContent: "center"
      }}
    >
      <div>
        {
          ownVoyage ? null : (
            !userBid ? (
              <button
                onClick={openNewBidModal}
                style={{ ...buttonStyle, backgroundColor: "rgb(0, 123, 255)" }}
              >
                Enter Your Bid
              </button>
            ) : (
              <button
                onClick={() => console.log("Change Bid")}
                style={{ ...buttonStyle, backgroundColor: "rgb(0, 123, 255)" }}
              >
                Change Bid
              </button>
            )
          )
        }
      </div>

      <Modal
        isOpen={isNewBidModalOpen}
        onRequestClose={closeNewBidModal}
        style={{
          content: {
            top: "50%",
            left: "25%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "2rem",
            borderRadius: "1rem",
            width: "400px",
            zIndex: 1050, // Increased zIndex to ensure modal appears above other elements
          },
        }}
      >
        <h2 style={{ marginBottom: "1rem", backgroundColor: "lightgreen" }}>Enter Your Bid</h2>
        <div style={{ marginBottom: "1rem", backgroundColor: "lightgreen" }}>
          <label>Person Count:</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "lightgreen" }}>
            <button onClick={decrementPersonCount}>-</button>
            <span>{personCount}</span>
            <button onClick={incrementPersonCount}>+</button>
          </div>
        </div>
        <div style={{ marginBottom: "1rem", backgroundColor: "lightgreen" }}>
          <label>Price:</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "lightgreen" }}>
            <button onClick={decrementPrice}>-</button>
            <span>{price}</span>
            <button onClick={incrementPrice}>+</button>
          </div>
        </div>
        <div style={{ marginBottom: "1rem", backgroundColor: "lightgreen" }}>
          <label>Explanation:</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            style={{ width: "100%", height: "4rem", backgroundColor: "lightgreen" }}
          />
        </div>
        <button
          onClick={sendBid}
          style={{
            ...buttonStyle,
            backgroundColor: "rgb(40, 167, 69)",
            width: "100%",
          }}
        >
          Send Bid
        </button>
        <button
          onClick={closeNewBidModal}
          style={{
            ...buttonStyle,
            backgroundColor: "rgb(220, 53, 69)",
            width: "100%",
            marginTop: "1rem",
          }}
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
};

const buttonStyle = {
  padding: "0.5rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  marginBottom: "1rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
  border: "none",
  boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.3),
      inset 0 -4px 6px rgba(0, 0, 0, 0.3)
    `,
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  right: 0,
};
