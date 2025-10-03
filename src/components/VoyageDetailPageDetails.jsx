import "../assets/css/App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import { FaWalking, FaRunning, FaTrain } from "react-icons/fa";
import { parrotTextDarkBlue } from "../styles/colors";

export function VoyageDetailPageDetails({ voyageData }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const baseUserImageUrl = ``;
  const baseVehicleImageUrl = ``;
  const [hoveredUser, setHoveredUser] = React.useState(false);
  const [hoveredVehicle, setHoveredVehicle] = React.useState(false);

  const navigate = useNavigate();
  const handleGoToVehicle = (voyageData) =>
    voyageData.vehicle.name === "Run" ||
      voyageData.vehicle.name === "Walk" ||
      voyageData.vehicle.name === "Train"
      ? null
      : navigate(`/vehicle-details/${voyageData.vehicle.id}`);
  const handleGoToUser = (user) => {
    console.log("go to user: ", user.userName);
    navigate(`/profile-public/${user.id}/${user.userName}`);
  };
  return (
    <div style={cardContainerStyle} className="flex row">
      <div style={userVehicleInfoRow}>
        <span style={voyageName}>{voyageData.name}</span>
      </div>
      <div style={userVehicleInfoRow}>
        <div
          className={"flex"}
          style={{ ...dataRowItem, cursor: "pointer" }}
          onClick={() => handleGoToUser(voyageData.user)}
        >
          <span style={{ alignSelf: "center" }}>Hosted by</span>
          <div style={userAndVehicleBox}>
            <img
              src={baseUserImageUrl + voyageData.user.profileImageUrl}
              style={{
                ...userImage,
                ...(hoveredUser === true ? userprofileimgHover : {}),
              }}
              onMouseEnter={() => {
                setHoveredUser(true);
              }}
              onMouseLeave={() => setHoveredUser(false)}
              alt=" "
            />
            <span style={{ ...userAndVehicleText }}>
              {voyageData.user.userName}
            </span>
          </div>
        </div>
        <div
          className={"flex"}
          style={{ ...dataRowItem, cursor: "pointer" }}
          onClick={() => handleGoToVehicle(voyageData)}
        >
          <span style={{ alignSelf: "center" }}>On</span>
          <div style={userAndVehicleBox}>
            <span style={userAndVehicleText}>
              {(voyageData.vehicle.name === "Run" ||
                voyageData.vehicle.name === "Walk" ||
                voyageData.vehicle.name === "Train") && (
                  <div style={runningStyle}>
                    {voyageData.vehicle.name === "Run" ? (
                      <FaRunning size={"2rem"} />
                    ) : voyageData.vehicle.name === "Walk" ? (
                      <FaWalking size={"2rem"} />
                    ) : (
                      <FaTrain size={"2rem"} />
                    )}
                  </div>
                )}
            </span>
            {voyageData.vehicle.name !== "Run" &&
              voyageData.vehicle.name !== "Walk" &&
              voyageData.vehicle.name !== "Train" &&
              (
                <img
                  src={baseVehicleImageUrl + voyageData.vehicle.profileImageUrl}
                  style={{
                    ...userImage,
                    ...(hoveredVehicle ? userprofileimgHover : {}),
                  }}
                  onMouseEnter={() => setHoveredVehicle(true)}
                  onMouseLeave={() => setHoveredVehicle(false)}
                  alt="vehicle"
                />
              )}
            <span style={userAndVehicleText}>{voyageData.vehicle.name}</span>
          </div>
        </div>
        <div className={"flex"} style={dataRowItem}>
          <span style={{ alignSelf: "center" }}>Vacancy: </span>
          <div style={infoBox}>
            <span style={infoText}>{voyageData.vacancy}</span>
          </div>
        </div>
      </div>
      <div style={{ ...userVehicleInfoRow, marginBottom: ".5rem" }}>
        <div className={"flex"} style={dataRowItem}>
          <span style={{}}>Dates: </span>
          <div style={infoBox}>
            {/* <span style={infoText}>Nov 12, 30 - Nov 12, 30</span> */}
            <span style={infoText}>
              {formatCustomDate(voyageData.startDate)} -{" "}
              {formatCustomDate(voyageData.endDate)}
            </span>
          </div>
        </div>
        <div className={"flex"} style={dataRowItem}>
          <span style={{}}>Last Bid: </span>
          <div style={infoBox}>
            <span style={infoText}>
              {" "}
              {formatCustomDate(voyageData.lastBidDate)}
            </span>
          </div>
        </div>
        <div className={"flex"} style={dataRowItem}>
          <span style={{}}>Price: </span>
          <div style={infoBox}>
            <span style={infoText}>
              {voyageData.minPrice}-{voyageData.maxPrice}
            </span>
          </div>
        </div>
        <div className={"flex"} style={dataRowItem}>
          <div style={infoBox}>
            {voyageData.auction ? <span style={infoText}>Auction</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const userImage = {
  height: "3rem",
  width: "3rem",
  borderRadius: "3rem",
  transition: "transform 0.3s ease-in-out", // Smooth transition
};

const userprofileimgHover = {
  transform: "scale(1.2)", // Enlarge on hover
};

const voyageName = {
  color: "rgba(0, 119, 234,1)",
  fontWeight: "800",
  fontSize: "1.5rem",
};

const cardContainerStyle = {
  display: "flex", // Flex for horizontal layout
  flexDirection: "column", // Ensure content is side-by-side
  border: "1px solid #ddd",
  borderRadius: "1rem",
  overflow: "hidden",
  width: "100%",
  backgroundColor: "#fff",
  margin: "0rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 -8px 6px rgba(0, 0, 0, 0.2)
`,
  color: parrotTextDarkBlue,
  padding: "1rem",
  fontSize: "1rem",
  paddingBottom: "2rem",
};

const userVehicleInfoRow = {
  display: "flex",
  flexDirection: "row",
  margin: "0.2rem",
  justifyContent: "center",
  marginTop: "0.5rem",
};

const dataRowItem = {
  marginTop: ".3rem",
  marginRight: "0.8rem",
  marginLeft: "0.8rem",
  fontWeight: "400",
};

const userAndVehicleBox = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(0, 119, 234,0.06)",
  borderRadius: "4rem",
  marginLeft: "0.5rem",
  height: "2rem",
};

const infoBox = {
  backgroundColor: "rgba(0, 119, 234,0.06)",
  borderRadius: "4rem",
  marginLeft: "0.5rem",
  alignSelf: "center",
};

const userAndVehicleText = {
  paddingLeft: "1rem",
  paddingRight: "1rem",
};

const infoText = {
  paddingLeft: ".5rem",
  paddingRight: ".5rem",
};

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

const runningStyle = {
  color: "rgba(0, 119, 234,.7)",
  fontWeight: "bold",
  fontSize: "1.5rem",
  marginRight: "0.5rem",
  borderRadius: "2rem",
  padding: "0.5rem",
  backgroundColor: "white",
  boxShadow: "inset 0 0 5px rgba(0, 119, 234,.66)",
};
