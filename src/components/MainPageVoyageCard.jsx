export function MainPageVoyageCard({ cardData }) {
  return (
    <div className="card" style={cardContainerStyle}>
      <div className="card-image" style={cardImageStyle}>
        <img src={cardData.image} style={imageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle}>
        <div style={cardTitleStyle}>{cardData.name}</div>

        {/* DETAILS */}
        <div style={cardDescriptionStyle}>
          <div style={{}}>
            <span style={voyageDetailSpan}>
              <VehicleIcon vehicleType={cardData.vehicleType} />
              {cardData.vehicle}
            </span>
            <span style={voyageDetailSpan}>
              👨‍👨‍👦‍👦
              {cardData.vacancy}
            </span>
          </div>
          <span style={voyageDetailSpan}>📅{cardData.dates}</span>
        </div>

        {/* BRIEF */}
        <div style={cardBriefStyle}>{cardData.brief}</div>

        {/* BUTTONS */}
        <div className="card-buttons" style={buttonContainerStyle}>
          <button style={{ ...buttonStyle, backgroundColor: "#007bff" }}>
            Trip Details
          </button>
          <button style={{ ...buttonStyle, backgroundColor: "#007bff" }}>
            See on Map
          </button>
        </div>
      </div>
    </div>
  );
}

const vehicles = [
  "⛵", // Boat
  "🚗", // Car
  "🏕️", // Caravan
  "🚌", // Bus
  "🚶", // Walk
  "🏃", // Run
  "🏍️", // Motorcycle
  "🚲", // Bicycle
  "🏠", // Tinyhouse
  "✈️", // Airplane
];

export default function VehicleIcon({ vehicleType }) {
  const getVehicleEmoji = (typeIndex) => {
    if (typeIndex >= 0 && typeIndex < vehicles.length) {
      return vehicles[typeIndex];
    }
    return "❓";
  };

  return (
    <span style={{ textAlign: "center" }}>{getVehicleEmoji(vehicleType)}</span>
  );
}

const voyageDetailSpan = {
  backgroundColor: "rgba(0, 119, 234,0.1)",
  color: "#007bff",
  borderRadius: "1rem",
  padding: "0.2rem",
  paddingLeft: "0.5rem",
  paddingRight: "0.5rem",
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  width: "24rem",
  maxWidth: "600px",
  maxHeight: "700px",
  backgroundColor: "#fff",
  margin: "1rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 -8px 6px rgba(0, 0, 0, 0.1)
`,
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardImageStyle = {
  width: "100%",
  height: "16rem",
  objectFit: "cover",
  borderBottom: "1px solid #ddd",
};

const cardContentStyle = {
  display: "flex",
  height: "16rem",
  // backgroundColor: "yellow",
  flexDirection: "column",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.4),
  inset 0 -6px 6px rgba(0, 0, 0, 0.4)
`,
};

const cardTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "rgba(10, 119, 234,1)",
};

const cardBriefStyle = {
  fontSize: "1rem",
  color: "black",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 5,
  textOverflow: "ellipsis",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  // backgroundColor: "pink",
};

const cardDescriptionStyle = {
  fontSize: "1rem",
  color: "blue",
  fontWeight: "600",
  // backgroundColor: "red",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  marginTop: "auto",
  paddingBottom: "1rem",
};

const buttonStyle = {
  width: "35%", // Match the input width
  padding: "0.3rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px",
  border: "none",
  boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.3),
      inset 0 -4px 6px rgba(0, 0, 0, 0.3)
    `,
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};
