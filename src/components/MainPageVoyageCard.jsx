import { useNavigate } from "react-router-dom";
import { parrotBlue, parrotDarkBlue, parrotGreen, parrotGreyTransparent, parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";
import { color } from "d3";
import whiteegg from "../assets/images/whiteegg.png";
import silveregg from "../assets/images/silveregg.png";
import goldenegg from "../assets/images/goldenegg.png";
import circleparrot1 from "../assets/images/circleparrot1.png";
import circleparrot2 from "../assets/images/circleparrot2.png";
import circleparrot3 from "../assets/images/circleparrot3.png";
import circleparrot4 from "../assets/images/circleparrot4.png";
import circleparrot5 from "../assets/images/circleparrot5.png";
import circleparrot6 from "../assets/images/circleparrot6.png";

const markerImages = [circleparrot1, circleparrot2, circleparrot3, circleparrot4, circleparrot5, circleparrot6];

const eggConfig = {
  1: { image: whiteegg, background: "#e8e8e8" },
  2: { image: silveregg, background: "#b0b7c3" },
  3: { image: goldenegg, background: "#FFD700" },
};

const apiUrl = process.env.REACT_APP_API_URL;
const voyageBaseUrl = ``;


export function MainPageVoyageCard({ cardData, panToLocation, cardIndex }) {

  const navigate = useNavigate();
  const handleCardClick = (voyageId) => {
    navigate(`/voyage-details/${voyageId}`);
  };

  const egg = cardData.placeType > 0 ? eggConfig[cardData.placeType] : null;
  const markerImage = markerImages[(cardIndex ?? 0) % markerImages.length];

  return (
    <div className="card" style={cardContainerStyle}>
      {egg && (
        <div style={{ ...eggBadgeClip, backgroundColor: egg.background }}>
          <img src={egg.image} alt="egg" style={eggBadgeImg} />
        </div>
      )}
      <div style={markerBadgeClip}>
        <img src={markerImage} alt="marker" style={markerBadgeImg} />
      </div>
      <div className="card-image" style={cardImageStyle}>
        <img src={voyageBaseUrl + (cardData.profileImageThumbnail || cardData.profileImage)} style={imageStyle} alt="Boat tour" />
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
            <span style={{ ...voyageDetailSpan, marginRight: "0.5rem", }}>
              <VehicleIcon vehicleType={cardData.vehicleType} />
              {" "}{cardData.vehicle?.name}
            </span>
            <span style={voyageDetailSpan}>
              👨‍👨‍👦‍👦
              {" "}{cardData.vacancy}
            </span>
          </div>
          <span style={voyageDetailSpan}>
            📅 {formatCustomDate(cardData.startDate)} - {" "}
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
          <button onClick={() => handleCardClick(cardData.id)}
            style={{ ...buttonStyle, backgroundColor: "#00336615", color: parrotDarkBlue, boxShadow: "none" }}>
            Trip Details
          </button>
          <button
            onClick={() =>
              panToLocation(
                cardData.waypoints[0].latitude,
                cardData.waypoints[0].longitude
              )
            }
            style={{ ...buttonStyle, backgroundColor: "#00336615", color: parrotDarkBlue, boxShadow: "none" }}>
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
  "🚐", // Caravan
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

const markerBadgeClip = {
  position: "absolute",
  top: "16rem",
  right: 8,
  zIndex: 10,
  backgroundColor: "rgba(0, 119, 234, 0.30)",
  borderRadius: 30,
  width: 35,
  height: 35
};

const markerBadgeImg = {
  marginTop: 2,
  marginLeft: 1,
  width: 34,
  height: 38,
};

const eggBadgeClip = {
  position: "absolute",
  top: "16rem",
  right: 8,
  width: 34,
  height: 34,
  borderRadius: "50%",
  zIndex: 10,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const eggBadgeImg = {
  width: 34,
  height: 38,
  objectFit: "contain",
};

const cardContainerStyle = {
  position: "relative",
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
  fontSize: "1.1rem",
  fontFamily: "Nunito, sans-serif",
  fontWeight: "600",
  color: parrotTextDarkBlue,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 4,
  textOverflow: "ellipsis",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  lineHeight: "1.65rem",
  letterSpacing: "0.015em",
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
  padding: "0.2rem",
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
  }).format(new Date(dateString));
}

