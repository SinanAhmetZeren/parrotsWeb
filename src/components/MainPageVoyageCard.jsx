import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px", // Optional max width for larger screens
  maxHeight: "700px",
  backgroundColor: "#fff",
  margin: "1rem",
  width: "21rem",
};

const cardImageStyle = {
  width: "100%",
  height: "13rem",
  objectFit: "cover",
  borderBottom: "1px solid #ddd",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardContentStyle = {
  height: "13rem",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const cardTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  margin: "0.5rem 0",
  color: "green",
};

const cardSubtitleStyle = {
  fontSize: "1.2rem",
  fontWeight: "400",
  margin: "0.25rem 0",
  color: "purple",
};

const cardDescriptionStyle = {
  fontSize: "1rem",
  color: "#555",
  margin: "0.5rem 0",
};

const cardDatesStyle = {
  marginTop: "0.5rem",
  fontSize: "0.9rem",
  color: "#777",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  marginTop: "1rem",
};

const buttonStyle = {
  fontFamily: "'Roboto', sans-serif",
  backgroundColor: "#007bff",
  color: "white",
  fontSize: "16px",
  fontWeight: "800",
  borderRadius: "20px",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
  boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.3),
      inset 0 -4px 6px rgba(0, 0, 0, 0.3)
    `,
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  textShadow: `
    -1px -1px 0 #000d5a, /* Top-left shadow */
    1px -1px 0 #000d5a,  /* Top-right shadow */
    -1px 1px 0 #000d5a,  /* Bottom-left shadow */
    1px 1px 0 #000d5a    /* Bottom-right shadow */
  `,
};

export function MainPageVoyageCard({ cardData }) {
  return (
    <div className="card" style={cardContainerStyle}>
      <div className="card-image" style={cardImageStyle}>
        <img src={cardData.image} style={imageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle}>
        <h2 style={cardTitleStyle}>{cardData.title}</h2>
        <h3 style={cardSubtitleStyle}>{cardData.subtitle}</h3>
        <p style={cardDescriptionStyle}>{cardData.description}</p>
        <div style={cardDatesStyle}>
          <p>{cardData.dates}</p>
          <p>{cardData.lastDate}</p>
        </div>
        <div className="card-buttons" style={buttonContainerStyle}>
          <button style={buttonStyle}>Trip Details</button>
          <button style={buttonStyle}>See on Map</button>
        </div>
      </div>
    </div>
  );
}
