import parrot1 from "../assets/images/sailboat.jpg";

export function MainPageMapVoyageCard({ cardData }) {
  return (
    <div className="" style={cardContainerStyle}>
      <div className="" style={cardImageStyle}>
        <img src={parrot1} style={imageStyle} alt="Boat tour" />
      </div>
      <div className="" style={cardContentStyle}>
        <div style={cardTitleStyle}>{cardData.name}</div>

        {/* DETAILS */}
        <div style={cardDescriptionStyle}>
          <div
            style={{
              marginTop: "0.2rem",
              marginBottom: "0.2rem",
              backgroundColor: "pink",
              padding: "2rem",
            }}
          >
            <span
              style={{
                ...voyageDetailSpan,
                marginRight: "0.5rem",

                backgroundColor: "red",
              }}
            >
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
        <div style={cardBriefStyle}>{cardData.brief}</div>
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

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "rgba(10, 119, 234,1)",
  backgroundColor: "red",
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

const cardContainerStyle = {
  display: "flex", // Flex for horizontal layout
  flexDirection: "row", // Ensure content is side-by-side
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  width: "30rem",
  backgroundColor: "#fff",
  margin: "0rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 -8px 6px rgba(0, 0, 0, 0.1)
`,
};

const cardImageStyle = {
  width: "50%", // Image takes half the width
  height: "auto", // Maintain aspect ratio
  objectFit: "cover",
};

const cardContentStyle = {
  display: "flex",
  flexDirection: "column",
  width: "50%", // Text content takes half the width
  padding: "1rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.4),
  inset 0 -6px 6px rgba(0, 0, 0, 0.4)
`,
  backgroundColor: "#fff", // Neutral background
};

const cardBriefStyle = {
  fontSize: "1rem",
  color: "black",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 5,
  textOverflow: "ellipsis",
};

const cardDescriptionStyle = {
  fontSize: "1rem",
  color: "blue",
  fontWeight: "600",
  marginTop: "0.5rem",
};
