import { useNavigate } from "react-router-dom";
import { parrotBlue, parrotBlueDarkTransparent, parrotBlueTransparent, parrotTextDarkBlue, parrotBananaLeafGreen } from "../styles/colors";
import he from "he";
import DOMPurify from "dompurify";
import { MdPublic } from "react-icons/md";
import { FaCheck, FaPencil } from "react-icons/fa6";
import { useGetBidsByVoyageIdQuery } from "../slices/VoyageSlice";

const voyageBaseUrl = ``;

export function ProfilePageVoyageCard({ voyage, index, isDarkMode = false }) {
  const navigate = useNavigate();
  const dark = isDarkMode;
  const { data: bids } = useGetBidsByVoyageIdQuery(voyage?.id, { skip: !voyage?.id });
  const bidCount = bids?.length ?? 0;
  const acceptedBidCount = bids?.filter(b => b.accepted).length ?? 0;

  const handleCardClick = (voyageId) => {
    navigate(`/voyage-details/${voyageId}`);
  };

  return (
    <div key={index} className="card" style={cardContainer(dark)} onClick={() => handleCardClick(voyage?.id)}>

      {voyage.publicOnMap && (
        <div style={publicIconStyle(dark)} title="Visible on map">
          <MdPublic size="1.8rem" color={dark ? "rgba(255,255,255,0.7)" : parrotBlue} />
        </div>
      )}

      <div className="card-image" style={{ ...cardImageContainerStyle(dark), position: "relative" }}>
        <img src={voyageBaseUrl + (voyage?.profileImageThumbnail || voyage?.profileImage)} style={cardImageStyle} alt="" />
        {bidCount > 0 && (
          <div style={bidPillStyle}>
            <div style={bidCircleStyle(parrotBananaLeafGreen)}>
              <FaCheck size="0.55rem" color="white" />
              <span style={bidPillTextStyle}>{acceptedBidCount}</span>
            </div>
            <div style={bidCircleStyle(parrotBlue)}>
              <FaPencil size="0.55rem" color="white" />
              <span style={bidPillTextStyle}>{bidCount}</span>
            </div>
          </div>
        )}
      </div>
      <div className="card-content" style={cardContentStyle(dark)}>
        <div style={cardTitleStyle(dark)} title={voyage?.name}>{voyage?.name}</div>

        <div style={cardDescriptionStyle}>
          <div style={{ marginTop: "0.2rem", marginBottom: "0.2rem" }}>
            <span style={{ ...pillStyle(dark), marginRight: "0.5rem" }}>
              <VehicleIcon vehicleType={voyage?.vehicleType} /> {voyage?.vehicleName}
            </span>
            <span style={pillStyle(dark)}>
              👨‍👨‍👦‍👦 {voyage?.vacancy}
            </span>
          </div>
          <span style={pillStyle(dark)}>
            📅 From {formatCustomDate(voyage?.startDate)} to {formatCustomDate(voyage?.endDate)}
          </span>
        </div>

        <div style={cardBriefStyle(dark)}>
          {voyage?.description?.length > 300 ? (
            <div dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                he.decode(voyage?.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).substring(0, 300) + "..."
              ),
            }} />
          ) : (
            <div dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                he.decode(voyage?.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
              ),
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

const bidPillStyle = {
  position: "absolute",
  bottom: "0.5rem",
  left: "0.5rem",
  backgroundColor: "rgba(222,222,222,0.85)",
  borderRadius: "2rem",
  paddingLeft: "0.3rem",
  paddingRight: "0.3rem",
  paddingTop: "0.2rem",
  paddingBottom: "0.2rem",
  display: "flex",
  flexDirection: "row",
  gap: "0.2rem",
};

const bidCircleStyle = (color) => ({
  backgroundColor: color,
  borderRadius: "1rem",
  paddingLeft: "0.4rem",
  paddingRight: "0.4rem",
  paddingTop: "0.15rem",
  paddingBottom: "0.15rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.25rem",
});

const bidPillTextStyle = {
  fontFamily: "Nunito, sans-serif",
  fontWeight: 700,
  fontSize: "0.7rem",
  color: "white",
};

const publicIconStyle = (dark) => ({
  position: "absolute",
  backgroundColor: dark ? "rgba(255,255,255,0.1)" : parrotBlueTransparent,
  right: "1.5rem",
  top: "0.5rem",
  borderRadius: "3rem",
  padding: "0.2rem",
  zIndex: 1000,
});

const cardContainer = (dark) => ({
  display: "flex",
  flexDirection: "row",
  borderRadius: "2rem",
  overflow: "hidden",
  width: "40rem",
  maxWidth: "600px",
  maxHeight: "700px",
  backgroundColor: dark ? "#011a32" : "#fff",
  margin: "auto",
  marginBottom: ".5rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1), inset 0 -8px 6px rgba(0,0,0,0.1)",
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
    ? "inset 0 0 20px rgba(100,180,255,0.08), inset 0 -6px 6px rgba(0,0,0,0.2)"
    : "0 4px 6px rgba(0,0,0,0.1), inset 0 -6px 6px rgba(0,0,0,0.1)",
});

const cardTitleStyle = (dark) => ({
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: dark ? "#2ac898" : "rgba(10,119,234,1)",
  marginTop: "0.5rem",
});

const pillStyle = (dark) => ({
  backgroundColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,119,234,0.1)",
  color: dark ? "rgba(255,255,255,0.85)" : "#007bff",
  borderRadius: "1rem",
  padding: "0.1rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
});

const cardDescriptionStyle = { fontSize: "1rem", fontWeight: "600" };

const cardBriefStyle = (dark) => ({
  fontSize: "1.1rem",
  fontFamily: "Nunito, sans-serif",
  fontWeight: "600",
  color: dark ? "rgba(255,255,255,0.8)" : parrotTextDarkBlue,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 4,
  textOverflow: "ellipsis",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  textAlign: "justify",
  lineHeight: "1.65rem",
  letterSpacing: "0.015em",
  width: "94%",
  margin: "auto",
  marginTop: "0.6rem",
});

function formatCustomDate(dateString) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
    .format(new Date(dateString))
    .replace(/^(\d{2}) (\w+) (\d{2})$/, "$2-$1, $3");
}

export default function VehicleIcon({ vehicleType }) {
  const vehicles = ["⛵", "🚗", "🚐", "🚌", "🚶", "🏃", "🏍️", "🚲", "🏠", "✈️", "🚄"];
  return <span style={{ textAlign: "center" }}>{vehicles[vehicleType] || "❓"}</span>;
}
