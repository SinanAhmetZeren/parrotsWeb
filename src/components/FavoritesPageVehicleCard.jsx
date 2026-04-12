import { useNavigate } from "react-router-dom";
import { parrotBlue, parrotBlueSemiTransparent, parrotTextDarkBlue } from "../styles/colors";
import he from "he";
import DOMPurify from "dompurify";

export function FavoritesPageVehicleCard({ vehicle, index }) {
  const vehicleBaseUrl = ``;
  const navigate = useNavigate();
  const handleCardClick = (vehicleId) => {
    navigate(`/vehicle-details/${vehicleId}`);
  };



  // console.log("vehcie: ...", vehicle.type);

  return (
    <div key={index} className="card" style={cardContainerStyle} onClick={() => handleCardClick(vehicle?.id)}>
      <div className="card-image" style={cardImageContainerStyle}>
        <img src={vehicleBaseUrl + (vehicle?.profileImageThumbnailUrl || vehicle?.profileImageUrl)} style={cardImageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={vehicleNameStyle} >
            <span style={vehicleNameStyle_Text} title={vehicle?.name}>
              {vehicle?.name?.length > 18 ? `${vehicle?.name.substring(0, 18)}...` : vehicle?.name}
            </span>
          </div>
          <div style={vehicleTypeStyle}>
            <span style={vehicleTypeStyle_Text} title={vehicle?.type}>
              <VehicleIcon vehicleType={vehicle?.type} />
            </span>
          </div>
          <div style={vehicleCapacityStyle}>
            <span style={vehicleCapacityStyle_Text} title={"capacity is " + vehicle?.capacity + ((vehicle?.capacity > 1) ? " people" : " person")}>🧑‍🤝‍🧑{vehicle?.capacity}
            </span>
          </div>
        </div>




        <div style={cardBriefStyle}>
          {vehicle?.description?.length > 280 ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  he
                    .decode(
                      vehicle?.description
                        .replace(/<[^>]+>/g, " ") // strip all HTML tags
                        .replace(/\s+/g, " ")     // normalize spaces
                        .trim()
                    )
                    .substring(0, 280) + "..."
                ),
              }}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  he
                    .decode(
                      vehicle?.description
                        .replace(/<[^>]+>/g, " ") // strip all HTML tags
                        .replace(/\s+/g, " ")     // normalize spaces
                        .trim()
                    )
                ),
              }}
            />
          )}
        </div>

      </div>
    </div >
  );
}


const vehicleNameStyle = {
  flex: 1,
};

const vehicleTypeStyle = {
  // flex: 1,
}

const vehicleCapacityStyle = {
  // flex: 1,
  marginRight: "0.5rem"
};

const vehicleNameStyle_Text = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: parrotBlue,
  borderRadius: "1rem",
  padding: "0.1rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
};

const vehicleTypeStyle_Text = {
  backgroundColor: parrotBlueSemiTransparent,
  borderRadius: "1rem",
  padding: "0.1rem",
  paddingLeft: ".5rem",
  paddingRight: ".5rem",
  fontSize: "1rem",
  fontWeight: "bold",
  color: parrotBlue,
};

const vehicleCapacityStyle_Text = {
  backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "1rem",
  paddingLeft: ".5rem",
  paddingRight: ".5rem",
  fontSize: "1rem",
  fontWeight: "bold",
  color: parrotBlue,
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "row",
  borderRadius: "2rem",
  overflow: "hidden",
  width: "40rem",
  maxWidth: "600px",
  maxHeight: "700px",
  backgroundColor: "#fff",
  margin: "auto",
  marginBottom: ".5rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.1),
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
  0 4px 6px rgba(0, 0, 0, 0.1),
  inset 0 -6px 6px rgba(0, 0, 0, 0.1)
`,
  overflow: "hidden",

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
  textAlign: "justify",
  lineHeight: "1.65rem",
  letterSpacing: "0.015em",
  width: "94%",
  margin: "auto",
  marginTop: "0.6rem",
};

function VehicleIcon({ vehicleType }) {
  const vehicles = [
    "⛵", // 0 -> Boat
    "🚗", // 1 -> Car
    "🚐", // 2 -> Caravan
    "🚌", // 3 -> Bus
    "🚶", // 4 -> Walk
    "🏃", // 5 -> Run
    "🏍️", // 6 -> Motorcycle
    "🚲", // 7 -> Bicycle
    "🏠", // 8 -> Tinyhouse
    "✈️", // 9 -> Airplane
    "🚄", // 10 -> Train
  ];

  const getVehicleEmoji = (type) => {
    if (typeof type === "number" && type >= 0 && type < vehicles.length) {
      return vehicles[type];
    }
    return vehicles[type] || "❓"; // Handle both numbers and strings
  };

  return (
    <span style={{ textAlign: "center", fontSize: "1.5rem" }}>{getVehicleEmoji(vehicleType)}</span>
  );
}

