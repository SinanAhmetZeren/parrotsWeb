import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../assets/css/date-range-custom.css";
import { parrotDarkBlue } from "../styles/colors";
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
      <div>
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
            style={{ ...buttonStyle, backgroundColor: "rgb(0, 123, 255)" }}
          >
            Enter Your Bid
          </button>
        ) : (
          <button
            onClick={openChangeBidModal}
            style={{ ...buttonStyle, backgroundColor: "rgb(0, 123, 255)" }}
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
        <div style={titleWrapperStyle}>
          <span className="text-xl font-bold" style={titleTextStyle}>
            Enter Your Bid
          </span>
        </div>

        {/* Voyagers */}
        <div style={rowWrapperStyle}>
          <label style={rowLabelStyle}>Voyagers:</label>
          <div style={rowControlsWrapperStyle}>
            <div style={counterGroup}>
              <button style={counterButton} onClick={decrementPersonCount}>
                -
              </button>
              <input
                type="text"
                value={personCount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  setPersonCount(
                    value === "" ? "" : Math.max(0, parseInt(value, 10))
                  ); // Allow empty input or valid numbers
                }}
                style={{
                  ...counterValue,
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "5rem",
                }}
              />
              <button style={counterButton} onClick={incrementPersonCount}>
                +
              </button>
            </div>
          </div>
          <label style={{ ...rowLabelStyle, justifySelf: "end" }}>Price:</label>
          <div style={rowControlsWrapperStyle}>
            <div style={counterGroup}>
              <button style={counterButton} onClick={decrementPrice}>
                -
              </button>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  setPrice(Math.max(0, parseInt(value, 10) || 0));
                }}
                style={{
                  ...counterValue,
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "5rem",
                }}
              />
              <button style={counterButton} onClick={incrementPrice}>
                +
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        <div style={textareaWrapperStyle}>
          <label style={rowLabelStyle}>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={textareaStyle}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* Buttons */}
          <button
            onClick={closeNewBidModal}
            style={{
              ...buttonStyle,
              ...actionButtonStyle,
              backgroundColor: "rgba(220, 53, 69,1)",
              // border: "2px solid rgb(220,53,69)",
              // color: "rgb(220,53,69)",
              // boxShadow: "none",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleSendBid(userProfileImage, userName)}
            style={{
              ...buttonStyle,
              backgroundColor: "rgb(40, 167, 69)",
              ...actionButtonStyle,
            }}
          >
            {changingBidState ? <AcceptOrChangeBidSpinner /> : "Send Bid"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isChangeBidModalOpen}
        onRequestClose={closeChangeBidModal}
        style={modalStyle}
      >
        <div style={titleWrapperStyle}>
          <span className="text-xl font-bold" style={titleTextStyle}>
            Enter Your Bid
          </span>
        </div>

        {/* Voyagers */}
        <div style={rowWrapperStyle}>
          <label style={rowLabelStyle}>Voyagers:</label>
          <div style={rowControlsWrapperStyle}>
            <div style={counterGroup}>
              <button style={counterButton} onClick={decrementPersonCount}>
                -
              </button>
              <input
                type="text"
                value={personCount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  setPersonCount(
                    value === "" ? "" : Math.max(0, parseInt(value, 10))
                  ); // Allow empty input or valid numbers
                }}
                style={{
                  ...counterValue,
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "5rem",
                }}
              />
              <button style={counterButton} onClick={incrementPersonCount}>
                +
              </button>
            </div>
          </div>
          <label style={{ ...rowLabelStyle, justifySelf: "end" }}>Price:</label>
          <div style={rowControlsWrapperStyle}>
            <div style={counterGroup}>
              <button style={counterButton} onClick={decrementPrice}>
                -
              </button>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  setPrice(Math.max(0, parseInt(value, 10) || 0));
                }}
                style={{
                  ...counterValue,
                  textAlign: "center",
                  border: "1px solid #ccc",
                  width: "5rem",
                }}
              />
              <button style={counterButton} onClick={incrementPrice}>
                +
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        <div style={textareaWrapperStyle}>
          <label style={rowLabelStyle}>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={textareaStyle}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* Buttons */}
          <button
            onClick={closeChangeBidModal}
            style={{
              ...buttonStyle,
              ...actionButtonStyle,
              backgroundColor: "rgba(220, 53, 69,1)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleChangeBid(userProfileImage, userName)}
            style={{
              ...buttonStyle,
              backgroundColor: "rgb(40, 167, 69)",
              ...actionButtonStyle,
            }}
          >
            {changingBidState ? <AcceptOrChangeBidSpinner /> : "Change Bid"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

const actionButtonStyle = {
  width: "45%",
};
const rowWrapperStyle = {
  marginBottom: "1rem",
  overflow: "hidden",
  display: "grid", // Reverted back to grid layout
  gridTemplateColumns: "1fr 2fr 1fr 2fr", // Ensure proper grid structure
};

const rowLabelStyle = {
  padding: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  borderRadius: "1rem",
  fontWeight: "600",
};

const rowControlsWrapperStyle = {
  // width: "75%",
  padding: "0.5rem",
  display: "flex",
  justifyContent: "center",
};

const buttonStyle = {
  padding: "0.5rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  // marginBottom: "1rem",
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

const modalStyle = {
  content: {
    top: "50%",
    left: "25%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "2rem",
    borderRadius: "1rem",
    zIndex: 1050,
    backgroundColor: "#f8f9fa",
  },
};

const titleWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "1.5rem",
};

const titleTextStyle = {
  // color: "rgba(10, 119, 234,1)",
  color: "#163A5F",
  fontWeight: "900",
};

const textareaWrapperStyle = {
  marginBottom: "1rem",
  alignItems: "flex-start",
  display: "grid", // Reverted back to grid layout
  gridTemplateColumns: "1fr 5fr", // Ensure proper grid structure
};

const textareaStyle = {
  width: "95%",
  height: "4rem",
  padding: "0.5rem",
  border: "1px solid #ccc",
  justifySelf: "center",
  borderRadius: "0.5rem",
};

const counterGroup = {
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  borderRadius: "0.5rem",
  width: "fit-content",
  fontFamily: `'Inter', 'Segoe UI', sans-serif`,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const counterButton = {
  backgroundColor: parrotDarkBlue, // replaced hardcoded color
  color: "white",
  width: "2.5rem",
  height: "2.5rem",
  fontSize: "1.5rem",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const counterValue = {
  backgroundColor: "white",
  width: "2.5rem",
  height: "2.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.25rem",
  fontWeight: 600,
  borderTop: "1px solid #ccc",
  borderBottom: "1px solid #ccc",
  WebkitAppearance: "none", // Chrome, Safari, Edge, Opera
  MozAppearance: "textfield", // Firefox
  appearance: "textfield", // Ensure compatibility across all browsers
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
