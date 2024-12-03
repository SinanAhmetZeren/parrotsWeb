export function MainPageVoyageCard({ cardData }) {
  return (
    <div className="card" style={cardContainerStyle}>
      <div className="card-image" style={cardImageStyle}>
        <img src={cardData.image} style={imageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle}>
        <h2 style={cardTitleStyle}>{cardData.name}</h2>
        <p style={cardSubtitleStyle}>{cardData.brief}</p>
        <p style={cardDescriptionStyle}>
          <div>
            <span style={{ backgroundColor: "lightblue" }}>
              <VehicleIcon vehicleType={cardData.vehicleType} />
              {cardData.vehicle}
            </span>
            <span style={{ backgroundColor: "lightgreen" }}>
              👨‍👨‍👦‍👦
              {cardData.vacancy}
            </span>
          </div>
          <span style={{ backgroundColor: "yellow" }}>📅{cardData.dates}</span>
        </p>
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
    return "❓"; // Fallback for invalid index
  };

  return (
    <span style={{ fontSize: "2rem", textAlign: "center" }}>
      {getVehicleEmoji(vehicleType)}
    </span>
  );
}

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  width: "24rem",
  maxWidth: "600px",
  maxHeight: "700px",
  backgroundColor: "#fff",
  margin: "1rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.9),
  inset 0 -4px 6px rgba(0, 0, 0, 0.9)
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
  backgroundColor: "white",
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

const cardSubtitleStyle = {
  fontSize: "1rem",
  color: "black",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 5,
  textOverflow: "ellipsis",
  paddingLeft: "1rem",
  paddingRight: "1rem",
};

const cardDescriptionStyle = {
  fontSize: "1rem",
  color: "blue",
  fontWeight: "600",
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

/* TODO:
1. Vehicle type emoji - case
2. Vacancy emoji
3. Calendar emoji



switch (vehicletype) {
  case 0:
    icon = (
      <FontAwesome6
        name="sailboat"
        size={16}
        color="rgba(10, 119, 234,1)"
        style={styles.icon}
      />
    );
    break;
  case 1:
    icon = (
      <AntDesign
        name="car"
        size={16}
        color="rgba(10, 119, 234,1)"
        style={styles.icon}
      />
    );
    break;
  case 2:
    icon = (
      <FontAwesome5
        name="caravan"
        size={16}
        color="rgba(10, 119, 234,1)"
        style={styles.icon}
      />
    );
    break;

  default:
    icon = "help-circle";
    break;
}


*/
