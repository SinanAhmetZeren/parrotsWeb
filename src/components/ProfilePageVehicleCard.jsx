import { useNavigate } from "react-router-dom";

export function ProfilePageVehicleCard({ vehicle, index, userFavoriteVehicles }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const vehicleBaseUrl = `${apiUrl}/Uploads/VehicleImages/`;
  const navigate = useNavigate();
  const handleCardClick = (vehicleId) => {
    navigate(`/vehicle-details/${vehicleId}`);
  };
  const isFavorited = userFavoriteVehicles?.includes(vehicle?.id);


  return (
    <div key={index} className="card" style={cardContainerStyle} onClick={() => handleCardClick(vehicle?.id)}>
      <div className="card-image" style={cardImageContainerStyle}>
        <img src={vehicleBaseUrl + vehicle?.profileImageUrl} style={cardImageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle}>
        <div style={{
          display: "flex", flexDirection: "row"
        }}>
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
        {/* <div style={cardBriefStyle}>{vehicle?.description}</div> */}
        <div style={cardBriefStyle}>
          {vehicle?.description?.length > 280 ?
            // `${vehicle?.description.substring(0, 280)}...` :
            <div dangerouslySetInnerHTML={{ __html: vehicle?.description.substring(0, 200) + "..." }} /> :
            // vehicle?.description}
            <div dangerouslySetInnerHTML={{ __html: vehicle?.description }} />
          }
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
  color: "rgba(10, 119, 234,1)",
  borderRadius: "1rem",
  padding: "0.1rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
};

const vehicleTypeStyle_Text = {
  backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "1rem",
  padding: "0.1rem",
  paddingLeft: ".5rem",
  paddingRight: ".5rem",
  fontSize: "1rem",
  fontWeight: "bold",
  color: "rgba(10, 119, 234,1)",
};

const vehicleCapacityStyle_Text = {
  backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "1rem",
  paddingLeft: ".5rem",
  paddingRight: ".5rem",
  fontSize: "1rem",
  fontWeight: "bold",
  color: "rgba(10, 119, 234,1)",
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
  marginBottom: ".5rem",
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

const cardBriefStyle = {
  fontSize: "1rem",
  color: "black",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 7,
  textOverflow: "ellipsis",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  textAlign: "justify",  // Justifies the text
  lineHeight: "1.2rem",
  width: "90%",
  margin: "auto",
  marginTop: "0.6rem",
};


export default function VehicleIcon({ vehicleType }) {
  const vehicles = {
    Boat: "⛵",
    Car: "🚗",
    Caravan: "🏕️",
    Bus: "🚌",
    Walk: "🚶",
    Run: "🏃",
    Motorcycle: "🏍️",
    Bicycle: "🚲",
    Tinyhouse: "🏠",
    Airplane: "✈️",
  };

  const getVehicleEmoji = (type) => {
    return vehicles[type] || "❓";
  };

  return (
    <span style={{ textAlign: "center", fontSize: "1.5rem" }}>{getVehicleEmoji(vehicleType)}</span>
  );
}
