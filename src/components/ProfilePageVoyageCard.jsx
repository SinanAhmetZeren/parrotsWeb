import { useNavigate } from "react-router-dom";
import { parrotBlue, parrotBlueDarkTransparent, parrotBlueSemiTransparent, parrotBlueTransparent, parrotPlaceholderGrey, parrotTextDarkBlue } from "../styles/colors";
import he from "he";
import DOMPurify from "dompurify";
import { MdPublic } from "react-icons/md";

const apiUrl = process.env.REACT_APP_API_URL;
const voyageBaseUrl = ``;



export function ProfilePageVoyageCard({ voyage, index }) {
  const navigate = useNavigate();
  const handleCardClick = (voyageId) => {
    navigate(`/voyage-details/${voyageId}`);
  };

  console.log("voyage from card:", voyage.publicOnMap);

  const publicIconPublic = {
    position: "absolute",
    // backgroundColor: "white",
    backgroundColor: parrotBlueTransparent,
    right: "1.5rem",
    top: "0.5rem",
    borderRadius: "3rem",
    padding: "0.2rem",
    zIndex: 1000,
    // border: "2px red solid",
    // borderWidth: "2px",
    // borderColor: parrotBlue,
  };

  const publicIconPrivate = {
    position: "absolute",
    backgroundColor: "white",
    right: "1.5rem",
    top: "0.5rem",
    borderRadius: "3rem",
    padding: "0.2rem",
    zIndex: 1000,
    // border: "2px red solid",
    // borderWidth: "2px",
    // borderColor: parrotPlaceholderGrey,
    display: "none"


  };

  return (
    <div key={index} className="card" style={cardContainerStyle} onClick={() => handleCardClick(voyage?.id)}>

      {voyage.publicOnMap ? (
        <div
          style={publicIconPublic}
          title="Is public on map, visible to everyone on their Home page">
          <MdPublic size="1.8rem" color={parrotBlue} />
        </div>
      ) : (
        <div
          style={publicIconPrivate}
          title=" Is not public on map, not visible to everyone on their Home page">
          <MdPublic size="1.8rem" color={parrotBlueDarkTransparent} />
        </div>
      )}

      <div className="card-image" style={cardImageContainerStyle}>
        <img src={voyageBaseUrl + (voyage?.profileImageThumbnail || voyage?.profileImage)} style={cardImageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle}>
        <div style={cardTitleStyle} title={voyage?.name}>{voyage?.name}</div>

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
              {" "}

              {voyage?.vehicleName}
            </span>
            <span style={voyageDetailSpan}>
              👨‍👨‍👦‍👦 {" "}
              {voyage?.vacancy}
            </span>
          </div>
          <span style={voyageDetailSpan}>
            📅 From {formatCustomDate(voyage?.startDate)} to To{" "}
            {formatCustomDate(voyage?.endDate)}
          </span>
        </div>
        {/* BRIEF */}



        <div style={cardBriefStyle}>
          {voyage?.description?.length > 280 ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  he
                    .decode(
                      voyage?.description
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
                      voyage?.description
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
};

const cardTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "rgba(10, 119, 234,1)",
  marginTop: "0.5rem",
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
  textAlign: "justify",  // Justifies the text
  lineHeight: "1.2rem",
  width: "94%",
  margin: "auto",
  marginTop: "0.6rem",
};

const cardDescriptionStyle = {
  fontSize: "1rem",
  color: "blue",
  fontWeight: "600",
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