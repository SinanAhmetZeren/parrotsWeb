import { hover } from "@testing-library/user-event/dist/hover";

const apiUrl = process.env.REACT_APP_API_URL;
const voyageBaseUrl = `${apiUrl}/Uploads/VoyageImages/`;


export function ProfilePageVoyageCard({ voyage, index }) {

  return (
    <div key={index} className="card" style={cardContainerStyle} onClick={() => console.log("voyage: ", voyage)}>
      <div className="card-image" style={cardImageContainerStyle}>
        <img src={voyageBaseUrl + voyage?.profileImage} style={cardImageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle}>
        <div style={cardTitleStyle}>{voyage?.name}</div>

        {/* DETAILS */}
        <div style={cardDescriptionStyle}>
          <div
            style={{
              marginTop: "0.2rem",
              marginBottom: "0.2rem",
            }}
          >
            <span style={{ ...voyageDetailSpan, marginRight: "0.5rem" }}>
              <VehicleIcon vehicleType={voyage?.vehicleType} />
              {voyage?.vehicleName}
            </span>
            <span style={voyageDetailSpan}>
              👨‍👨‍👦‍👦
              {voyage?.vacancy}
            </span>
          </div>
          <span style={voyageDetailSpan}>
            📅From {formatCustomDate(voyage?.startDate)} to To{" "}
            {formatCustomDate(voyage?.endDate)}
          </span>
        </div>

        {/* BRIEF */}
        <div style={cardBriefStyle}>{voyage?.brief}</div>
      </div>
    </div>
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
  flexDirection: "row",
  // border: "1px solid #ddd",
  borderRadius: "2rem",
  overflow: "hidden",
  width: "40rem",
  maxWidth: "600px",
  maxHeight: "700px",
  backgroundColor: "#fff",
  margin: "auto",
  marginBottom: ".2rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 -8px 6px rgba(0, 0, 0, 0.1)
`,
  cursor: "pointer",
};

const cardImageStyle = {
  width: "16rem",
  height: "101%",
  objectFit: "cover",
};

const cardImageContainerStyle = {
  height: "14rem",
  minWidth: "16rem",
  objectFit: "cover",
  borderBottom: "1px solid #ddd",
};

const cardContentStyle = {
  display: "flex",
  height: "14rem",
  minWidth: "24rem",
  width: "24rem",
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


function formatCustomDate(dateString) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
    .format(new Date(dateString))
    .replace(/^(\d{2}) (\w+) (\d{2})$/, "$2-$1, $3");
}




export default function VehicleIcon({ vehicleType }) {

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

  console.log("vehicleType", vehicleType);
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