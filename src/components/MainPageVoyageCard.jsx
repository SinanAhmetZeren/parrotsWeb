import { useNavigate } from "react-router-dom";
import { parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";

const apiUrl = process.env.REACT_APP_API_URL;
const voyageBaseUrl = ``;


export function MainPageVoyageCard({ cardData, panToLocation }) {

  const navigate = useNavigate();
  const handleCardClick = (voyageId) => {
    navigate(`/voyage-details/${voyageId}`);
  };

  return (
    <div className="card" style={cardContainerStyle}>
      <div className="card-image" style={cardImageStyle}>
        <img src={voyageBaseUrl + cardData.profileImage} style={imageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle}>
        <div style={cardTitleStyle}>{cardData.name}</div>

        {/* DETAILS */}
        <div style={cardDescriptionStyle}>
          <div
            style={{
              marginTop: "0.2rem",
              marginBottom: "0.2rem",
            }}
          >
            <span style={{ ...voyageDetailSpan, marginRight: "0.5rem" }}>
              <VehicleIcon vehicleType={cardData.vehicleType} />
              {cardData.vehicle.name}
            </span>
            <span style={voyageDetailSpan}>
              👨‍👨‍👦‍👦
              {cardData.vacancy}
            </span>
          </div>
          <span style={voyageDetailSpan}>
            📅From {formatCustomDate(cardData.startDate)} to To{" "}
            {formatCustomDate(cardData.endDate)}
          </span>
        </div>

        {/* BRIEF */}

        <div
          style={cardBriefStyle}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(cardData.brief)
          }}
        />

        {/* BUTTONS */}
        <div className="card-buttons" style={buttonContainerStyle}>
          <button onClick={() => handleCardClick(cardData.id)} style={{ ...buttonStyle, backgroundColor: "#007bff" }}>
            Trip Details
          </button>
          <button
            onClick={() =>
              panToLocation(
                cardData.waypoints[0].latitude,
                cardData.waypoints[0].longitude
              )
            }
            style={{ ...buttonStyle, backgroundColor: "#007bff" }}
          >
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
  "🚄", // Train
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
  padding: "0.1rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
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
  color: parrotTextDarkBlue,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 5,
  textOverflow: "ellipsis",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  lineHeight: "1.2rem",
  marginTop: "0.5rem",
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
  fontSize: "1rem",
  border: "none",
  boxShadow: `
      0 4px 6px rgba(0, 0, 0, 0.3),
      inset 0 -4px 6px rgba(0, 0, 0, 0.3)
    `,
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

function formatCustomDate(dateString) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
    .format(new Date(dateString))
    .replace(/^(\d{2}) (\w+) (\d{2})$/, "$2-$1, $3");
}
