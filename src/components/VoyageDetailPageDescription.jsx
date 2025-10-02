import "../assets/css/App.css";
import * as React from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import { parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";

export function VoyageDetailPageDescription({ voyageDescription }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = React.useState(false);
  const descriptionRef = React.useRef(null);

  React.useEffect(() => {
    const el = descriptionRef.current;
    if (el) {
      // Temporarily force clamp to 7 lines to check if it overflows
      el.style.WebkitLineClamp = 7;
      el.style.display = "-webkit-box";
      el.style.WebkitBoxOrient = "vertical";
      el.style.overflow = "hidden";

      // Let the browser render the clamped version and check scroll height
      requestAnimationFrame(() => {
        if (el.scrollHeight > el.clientHeight + 1) {
          setIsDescriptionLong(true);
        }
      });
    }
  }, [voyageDescription]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={cardContainerStyle} className="flex row">
      <div style={userVehicleInfoRow}>
        <span style={voyageName}>Voyage Details</span>
      </div>
      <div style={{ position: "relative" }}>
        <div className={"flex"} style={dataRowItem}>
          <div style={infoBox}>
            <span
              ref={descriptionRef}
              style={{
                ...descriptionTextStyle,
                WebkitLineClamp: isExpanded ? "unset" : 7,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(voyageDescription) }}
            >
              {/* {voyageDescription} */}
            </span>
          </div>
        </div>
        {isDescriptionLong && (
          <span onClick={toggleExpand} style={readMore}>
            {isExpanded ? "Read Less" : "Read More"}
          </span>
        )}
      </div>
    </div>
  );
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
  color: parrotTextDarkBlue,
  padding: "1rem",
  fontSize: "1.15rem",
};

const voyageName = {
  color: "#2ac898",
  color: "rgba(0, 119, 234,1)",

  fontWeight: "800",
  fontSize: "1.5rem",
};

const userVehicleInfoRow = {
  display: "flex",
  flexDirection: "row",
  margin: "0.2rem",
  // justifyContent: "center"
  marginLeft: "1.3rem",
};

const dataRowItem = {
  marginTop: ".3rem",
  marginRight: "0.8rem",
  marginLeft: "0.8rem",
};

const infoBox = {
  marginLeft: "0.5rem",
  marginBottom: "2rem",
  textAlign: "justify",
};

const descriptionTextStyle = {
  whiteSpace: "pre-wrap", // Respects line breaks and wraps text
  textIndent: "0", // Remove any indentation at the start of the first line
  // fontWeight: "500",
  lineHeight: "1.3rem",
  margin: "auto",
  marginTop: "0.6rem",
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

const readMore = {
  height: "1.5rem",
  alignSelf: "end",
  color: "#2ac898",
  fontWeight: "bold",
  fontSize: "0.9rem",
  cursor: "pointer",
  backgroundColor: "rgba(42,200,152,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "1rem",
  paddingLeft: "0.5rem",
  paddingRight: "0.5rem",
  position: "absolute",
  bottom: "0rem",
  right: 0,
};
