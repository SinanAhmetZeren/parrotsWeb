import { IoLocationOutline } from "react-icons/io5";

const PLACE_INK = "#6F6455";
const PLACE_BG = "#F5F2EC";
const PLACE_BORDER = "rgba(150,131,94,0.26)";

export function MainPagePlaceCard({ cardData, panToLocation }) {
const parts = (cardData.brief || "").split("|");
  const category = parts[0] || "";
  const location = parts[1] || "";
  const url = parts[2] || "";

  const handleLinkClick = () => {
    if (!url) return;
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={cardContainerStyle} onClick={handleLinkClick}>

      {/* image */}
      <div style={cardImageStyle}>
        <img
          src={cardData.profileImageThumbnail || cardData.profileImage}
          alt={cardData.name}
          style={imageStyle}
        />
      </div>

      {/* content */}
      <div style={cardContentStyle}>
        <div style={cardTitleStyle}>{cardData.name}</div>

        {cardData.description && (
          <div style={cardDescriptionStyle}>{cardData.description}</div>
        )}

        <div style={pillRowStyle}>
          {category && (
            <span style={{ ...pillStyle, backgroundColor: PLACE_BG, color: PLACE_INK }}>
              {category}
            </span>
          )}
          {location && (
            <span style={pillStyle}>
              <IoLocationOutline size={11} style={{ flexShrink: 0 }} />
              {location}
            </span>
          )}
        </div>

        <div style={buttonContainerStyle}>
          {url && (
            <button onClick={handleLinkClick} style={visitButtonStyle}>
              Visit
            </button>
          )}
          {cardData.waypoints?.[0] && (
            <button
              onClick={(e) => { e.stopPropagation(); panToLocation(cardData.waypoints[0].latitude, cardData.waypoints[0].longitude); }}
              style={mapButtonStyle}
            >
              View on map
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const cardContainerStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "1rem",
  overflow: "hidden",
  width: "24rem",
  maxWidth: "600px",
  backgroundColor: "white",
  border: `1.5px solid ${PLACE_BORDER}`,
  margin: "1rem",
  cursor: "pointer",
  boxShadow: "0 2px 10px rgba(12,30,48,0.06)",
};

const cardImageStyle = {
  width: "100%",
  height: "16rem",
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardContentStyle = {
  display: "flex",
  flexDirection: "column",
  padding: "0.75rem 1rem 0.75rem",
  gap: "0.4rem",
};

const placeLabelStyle = {
  fontSize: "9px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#5C6B7A",
  fontFamily: "Nunito, sans-serif",
};

const cardTitleStyle = {
  fontSize: "1rem",
  fontWeight: 800,
  color: "#0A2540",
  letterSpacing: "-0.015em",
  lineHeight: 1.22,
  fontFamily: "Nunito, sans-serif",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const pillRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "5px",
  marginTop: "2px",
};

const pillStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  borderRadius: "999px",
  padding: "4px 9px",
  fontSize: "11px",
  fontWeight: 800,
  fontFamily: "Nunito, sans-serif",
  backgroundColor: "#F4F7FB",
  color: "#4A5A6A",
  whiteSpace: "nowrap",
};

const cardDescriptionStyle = {
  fontSize: "0.75rem",
  fontFamily: "Nunito, sans-serif",
  fontWeight: 600,
  color: "#4A5A6A",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 3,
  lineHeight: 1.45,
  marginTop: "2px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "0.75rem",
  marginTop: "0.4rem",
};

const visitButtonStyle = {
  padding: "4px 14px",
  borderRadius: "999px",
  fontWeight: 800,
  fontFamily: "Nunito, sans-serif",
  fontSize: "11.5px",
  cursor: "pointer",
  border: `1.5px solid ${PLACE_BORDER}`,
  backgroundColor: PLACE_BG,
  color: PLACE_INK,
};

const mapButtonStyle = {
  padding: "4px 0",
  fontWeight: 700,
  fontFamily: "Nunito, sans-serif",
  fontSize: "11.5px",
  cursor: "pointer",
  border: "none",
  background: "none",
  color: "#5C6B7A",
};
