import { useNavigate } from "react-router-dom";
import { parrotTextDarkBlue } from "../styles/colors";
import he from "he";
import DOMPurify from "dompurify";

export function ProfilePageVehicleCard({ vehicle, index, userFavoriteVehicles, isDarkMode = false }) {
  const vehicleBaseUrl = ``;
  const navigate = useNavigate();
  const handleCardClick = (vehicleId) => {
    navigate(`/vehicle-details/${vehicleId}`);
  };
  const isFavorited = userFavoriteVehicles?.includes(vehicle?.id);

  const dark = isDarkMode;

  return (
    <div key={index} className="card" style={cardContainer(dark)} onClick={() => handleCardClick(vehicle?.id)}>
      <div className="card-image" style={cardImageContainerStyle(dark)}>
        <img src={vehicleBaseUrl + (vehicle?.profileImageThumbnailUrl || vehicle?.profileImageUrl)} style={cardImageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle(dark)}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={vehicleNameStyle}>
            <span style={vehicleNameText(dark)} title={vehicle?.name}>
              {vehicle?.name?.length > 18 ? `${vehicle?.name.substring(0, 18)}...` : vehicle?.name}
            </span>
          </div>
          <div style={vehicleTypeStyle}>
            <span style={pillStyle(dark)} title={vehicle?.type}>
              <VehicleIcon vehicleType={vehicle?.type} />
            </span>
          </div>
          <div style={vehicleCapacityStyle}>
            <span style={pillStyle(dark)} title={"capacity is " + vehicle?.capacity + ((vehicle?.capacity > 1) ? " people" : " person")}>
              🧑‍🤝‍🧑{vehicle?.capacity}
            </span>
          </div>
        </div>

        <div style={cardBriefStyle(dark)}>
          {vehicle?.description?.length > 280 ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  he.decode(vehicle?.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).substring(0, 280) + "..."
                ),
              }}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  he.decode(vehicle?.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
                ),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const vehicleNameStyle = { flex: 1 };
const vehicleTypeStyle = {};
const vehicleCapacityStyle = { marginRight: "0.5rem" };

const cardContainer = (dark) => ({
  display: "flex",
  flexDirection: "row",
  borderRadius: "2rem",
  overflow: "hidden",
  width: "40rem",
  maxWidth: "600px",
  maxHeight: "700px",
  backgroundColor: dark ? "#0d2b4e" : "#fff",
  margin: "auto",
  marginBottom: ".5rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -8px 6px rgba(0,0,0,0.1)",
  cursor: "pointer",
});

const cardImageStyle = { width: "16rem", height: "101%", objectFit: "cover" };

const cardImageContainerStyle = (dark) => ({
  height: "14rem",
  minWidth: "16rem",
  objectFit: "cover",
  borderBottom: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #ddd",
});

const cardContentStyle = (dark) => ({
  display: "flex",
  height: "14rem",
  minWidth: "24rem",
  width: "24rem",
  flexDirection: "column",
  boxShadow: dark
    ? "0 4px 6px rgba(0,0,0,0.4), inset 0 -6px 6px rgba(0,0,0,0.3)"
    : "0 4px 6px rgba(0,0,0,0.4), inset 0 -6px 6px rgba(0,0,0,0.4)",
});

const vehicleNameText = (dark) => ({
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: dark ? "rgba(255,255,255,0.9)" : "rgba(10,119,234,1)",
  borderRadius: "1rem",
  padding: "0.1rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
});

const pillStyle = (dark) => ({
  backgroundColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,119,234,0.1)",
  borderRadius: "1rem",
  padding: "0.1rem",
  paddingLeft: ".5rem",
  paddingRight: ".5rem",
  fontSize: "1rem",
  fontWeight: "bold",
  color: dark ? "rgba(255,255,255,0.85)" : "rgba(10,119,234,1)",
});

const cardBriefStyle = (dark) => ({
  fontSize: "1.1rem",
  fontFamily: "Nunito, sans-serif",
  fontWeight: "600",
  color: dark ? "rgba(255,255,255,0.8)" : parrotTextDarkBlue,
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
  width: "90%",
  margin: "auto",
  marginTop: "0.6rem",
});

export default function VehicleIcon({ vehicleType }) {
  const vehicles = {
    Boat: "⛵", Car: "🚗", Caravan: "🚐", Bus: "🚌", Walk: "🚶",
    Run: "🏃", Motorcycle: "🏍️", Bicycle: "🚲", Tinyhouse: "🏠",
    Airplane: "✈️", Train: "🚄",
  };
  return <span style={{ textAlign: "center", fontSize: "1.5rem" }}>{vehicles[vehicleType] || "❓"}</span>;
}
