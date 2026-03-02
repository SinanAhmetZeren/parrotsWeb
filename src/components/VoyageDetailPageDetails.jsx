import "../assets/css/App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import { FaWalking, FaRunning, FaTrain } from "react-icons/fa";
import { parrotBlue, parrotGreen, parrotTextDarkBlue } from "../styles/colors";
import trainImage from "../assets/images/train.jpeg";
import walkImage from "../assets/images/walk1.jpeg";
import runImage from "../assets/images/run1.jpeg";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";


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
    navigate(`/profile-public/${user.publicId}/${user.userName}`);
  };

  const specialVehicles = {
    Run: runImage,
    Walk: walkImage,
    Train: trainImage,
  };

  const specialImage = specialVehicles[voyageData.vehicle.name];

  return (
    /*
    host, vehicle, vacancy, stars, ends, max price, min price, auction
    */

    <div style={cardContainerStyle} className="flex row">


      <div style={detailRow}> {/* host div  */}
        <div>
          <span style={detailName}>Host: </span>
        </div>
        <div style={{ ...detailInfo, cursor: "pointer" }}
          onClick={() => handleGoToUser(voyageData.user)}>
          <div
            style={userAndVehicleBox}
            onMouseEnter={() => setHoveredUser(true)}
            onMouseLeave={() => setHoveredUser(false)}
          >
            <img
              src={baseUserImageUrl + voyageData.user.profileImageUrl}
              style={{
                ...userImage,
                ...(hoveredUser === true ? userprofileimgHover : {}),
              }}
              // onMouseEnter={() => setHoveredUser(true)}
              // onMouseLeave={() => setHoveredUser(false)}
              alt="profile"
            />
            <span style={userAndVehicleText}>
              {voyageData.user.userName}
            </span>
          </div>
        </div>
      </div>


      <div style={detailRow}>  {/* vehicle div */}
        <div>
          <span style={detailName}>Vehicle: </span>
        </div>
        <div style={{ ...detailInfo, cursor: "pointer" }}
          onClick={() => handleGoToVehicle(voyageData)}
        >
          <div style={userAndVehicleBox}
            onMouseEnter={() => setHoveredVehicle(true)}
            onMouseLeave={() => setHoveredVehicle(false)}

          >
            {specialImage && (
              <span
              // style={userAndVehicleText}
              >
                <img src={specialImage} style={userImage} alt={voyageData.vehicle.name} />
              </span>
            )}

            {!specialImage && (
              <img
                src={baseVehicleImageUrl + voyageData.vehicle.profileImageUrl}
                style={{
                  ...userImage,
                  ...(hoveredVehicle ? userprofileimgHover : {}),
                }}
                // onMouseEnter={() => setHoveredVehicle(true)}
                // onMouseLeave={() => setHoveredVehicle(false)}
                alt="vehicle"
              />
            )}
            <span style={userAndVehicleText}>{voyageData.vehicle.name}</span>
          </div>

        </div>
      </div>


      <div style={detailRow}>
        <div>
          <span style={detailName}>Vacancy: </span>
        </div>
        <div style={detailInfo}>
          <span>{voyageData.vacancy}</span>
        </div>
      </div>

      <div style={detailRowDivided}>
        <div style={detailRowDividedChild}>
          <div style={detailRowDividedChildName}>
            Starts:
          </div>
          <div style={detailRowDividedChildInfo}>
            {formatCustomDate(voyageData.startDate)}
          </div>
        </div>
        <div style={detailRowDividedChild}>
          <div style={detailRowDividedChildName}>
            Ends:
          </div>
          <div style={detailRowDividedChildInfo}>
            {formatCustomDate(voyageData.endDate)}
          </div>
        </div>
      </div>

      <div style={detailRowDivided}>
        <div style={detailRowDividedChild}>
          <div style={detailRowDividedChildName}>
            Min Price:
          </div>
          <div style={detailRowDividedChildInfo}>
            {voyageData.currency} {voyageData.minPrice}
          </div>
        </div>
        <div style={detailRowDividedChild}>
          <div style={detailRowDividedChildName}>
            Max Price:
          </div>
          <div style={detailRowDividedChildInfo}>
            {voyageData.currency} {voyageData.maxPrice}
          </div>
        </div>
      </div>


      <div style={detailRowDivided}>
        <div style={detailRowDividedChild}>
          <div style={detailRowDividedChildName}>
            Auction:
          </div>
          <div style={detailRowDividedChildInfo}>
            {voyageData.auction ?
              <IoCheckmarkCircleOutline color={parrotGreen} size={20} />
              :
              <IoCloseCircleOutline color={parrotGreen} size={20} />
            }
          </div>
        </div>
        <div style={detailRowDividedChild}>
          <div style={detailRowDividedChildName}>
            Fixed Price:
          </div>
          <div style={detailRowDividedChildInfo}>
            {voyageData.auction ?
              <IoCheckmarkCircleOutline color={parrotGreen} size={20} />
              :
              <IoCloseCircleOutline color={parrotGreen} size={20} />

            }
          </div>
        </div>
      </div>

    </div>

  );
}

const detailName = {
  color: parrotTextDarkBlue,
  fontWeight: "900",
  fontSize: "1rem",
  // backgroundColor: "yellow",
  width: "100%",
  display: "flex",

};

const detailRowDividedChild = {
  color: parrotTextDarkBlue,
  fontWeight: "900",
  fontSize: "1rem",
  // backgroundColor: "green",
  width: "100%",
  display: "flex",
};

const detailInfo = {
  // backgroundColor: "orange",
  fontSize: "1rem",
  width: "100%",
  display: "flex",
  color: parrotBlue,
  fontWeight: "800",
};

const detailRowDividedChildName = {
  color: parrotTextDarkBlue,
  fontWeight: "800",
  fontSize: "1rem",
  // backgroundColor: "pink",
  width: "100%",
  display: "flex",
  // backgroundColor: "rgba(0, 119, 234,0.1)",

}

const detailRowDividedChildInfo = {
  fontSize: "1rem",
  width: "100%",
  display: "flex",
  // backgroundColor: "rgba(0, 119, 234,0.048)",
  color: parrotBlue,
  fontWeight: "800",

}

const detailRow = {
  height: "2rem",
  width: "94%",
  margin: "auto",
  borderRadius: "0.3rem",
  // marginBottom: "0.5rem",
  display: "grid",
  gridTemplateColumns: "1fr 3fr",
  alignItems: "center",
};

const detailRowDivided = {
  height: "2rem",
  width: "94%",
  margin: "auto",
  borderRadius: "0.3rem",
  // marginBottom: "0.5rem",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  gap: ".5rem"
};

const userImage = {
  height: "2rem",
  width: "2rem",
  borderRadius: "3rem",
  transition: "transform 0.3s ease-in-out", // Smooth transition
};

const userprofileimgHover = {
  transform: "scale(1.2)", // Enlarge on hover
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



const userAndVehicleBox = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(0, 119, 234,0.06)",
  borderRadius: "4rem",
  // marginLeft: "0.5rem",
  height: "2rem",
  transition: "transform 0.3s ease-in-out", // Smooth transition

};


const userAndVehicleText = {
  paddingLeft: "1rem",
  paddingRight: "1rem",
};

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

function formatCustomDate2(dateString) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  })
    .format(new Date(dateString))
    .replace(/^(\d{2}) (\w+) (\d{2})$/, "$2-$1, $3");
}

function formatCustomDate(dateString) {
  const date = new Date(dateString);

  const options = { month: "short" }; // "Jan", "Feb", ...
  const month = new Intl.DateTimeFormat("en-US", options).format(date);
  const day = String(date.getDate()).padStart(2, "0"); // "01", "25"
  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  return `${month} ${day}, ${year}`;
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




