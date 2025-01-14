import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../assets/css/date-range-custom.css";

export const VoyageDetailBidButton = ({ ownVoyage, userBid }) => {
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

  return (
    <div
      style={{
        display: "flex", // Flexbox to place inputs side by side
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        cursor: "pointer",
        width: "100%",
        paddingTop: "0.5rem",
        justifyContent: "center"
      }}
    >
      <div
      >
        {
          ownVoyage ? null :
            userBid === null ? (
              <button
                onClick={() => {
                  console.log("Create Bid");
                }}
                style={{ ...buttonStyle, backgroundColor: "#007bff" }}
              >
                Create Bid
              </button>
            ) : (
              <button
                onClick={() => {
                  console.log("Change Bid");
                }}
                style={{ ...buttonStyle, backgroundColor: "#28a745" }}
              >
                Change Bid
              </button>
            )
        }
      </div>
    </div>
  );
};