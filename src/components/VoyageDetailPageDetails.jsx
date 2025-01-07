import img1 from "../assets/catamaran.jpeg";
import img2 from "../assets/parrot-looks.jpg";
import "../App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";



export function VoyageDetailPageDetails({ voyage }) {
  return (
    <div style={cardContainerStyle} className="flex row">

      <div style={userVehicleInfoRow}>
        <span style={voyageName}>Marco Polo Eastern Expedition</span>
      </div>
      <div style={userVehicleInfoRow}>
        <div className={"flex"} style={dataRowItem}>
          <span style={{ alignSelf: "center" }}>Hosted by</span>
          <div style={userAndVehicleBox}>
            <img src={img2} style={userImage} alt=" " />
            <span style={userAndVehicleText}>Peter Parker</span>
          </div>
        </div>
        <div className={"flex"} style={dataRowItem}>
          <span style={{ alignSelf: "center" }}>On</span>
          <div style={userAndVehicleBox}>
            <img src={img1} style={userImage} alt=" " />
            <span style={userAndVehicleText}>Marco Polo</span>
          </div>
        </div>
        <div className={"flex"} style={dataRowItem}>
          <span style={{}}>Vacancy: </span>
          <div style={infoBox}>
            <span style={infoText}>300</span>
          </div>
        </div>

      </div>

      <div style={userVehicleInfoRow}>

        <div className={"flex"} style={dataRowItem}>
          <span style={{}}>Dates: </span>
          <div style={infoBox}>
            <span style={infoText}>Nov 12, 30 - Nov 12, 30</span>
          </div>
        </div>

        <div className={"flex"} style={dataRowItem}>
          <span style={{}}>Last Bid: </span>
          <div style={infoBox}>
            <span style={infoText}>Nov 12, 30</span>
          </div>
        </div>
        <div className={"flex"} style={dataRowItem}>
          <span style={{}}>Price: </span>
          <div style={infoBox}>
            <span style={infoText}>15-50</span>
          </div>
        </div>
        <div className={"flex"} style={dataRowItem}>
          <div style={infoBox}>
            <span style={infoText}>Auction</span>
          </div>

        </div>
      </div>
    </div>
  );
}


const voyageName = {
  color: "#2ac898",
  fontWeight: "800",
  fontSize: "1.5rem"
}

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
  color: "rgba(0, 119, 234,1)",
  padding: "1rem",
  fontSize: "1rem",
  fontWeight: "500",
  paddingBottom: "2rem"
};

const userVehicleInfoRow = {
  display: 'flex',
  flexDirection: 'row',
  margin: "0.2rem",
  justifyContent: "center"
};

const dataRowItem = {
  marginTop: ".3rem",
  marginRight: "0.8rem",
  marginLeft: "0.8rem"
}

const userImage = {
  height: "3rem",
  width: "3rem",
  borderRadius: "3rem"
}


const userAndVehicleBox = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: "center",
  backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "4rem",
  marginLeft: "0.5rem",
  height: "2rem"
};

const infoBox = {
  backgroundColor: "rgba(0, 119, 234,0.1)",
  borderRadius: "4rem",
  marginLeft: "0.5rem",

};

const userAndVehicleText = {
  paddingLeft: "1rem",
  paddingRight: "1rem"
}

const infoText = {
  paddingLeft: ".75rem",
  paddingRight: ".75rem"
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



