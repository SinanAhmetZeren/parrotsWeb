import { parrotBlue, parrotTextDarkBlue } from "../styles/colors";
import whiteegg from "../assets/images/whiteegg.png";
import silveregg from "../assets/images/silveregg.png";
import goldenegg from "../assets/images/goldenegg.png";

const eggConfig = {
  1: { image: whiteegg, background: "#e8e8e8" },
  2: { image: silveregg, background: "#b0b7c3" },
  3: { image: goldenegg, background: "#FFD700" },
};

export function MainPagePlaceCard({ cardData, panToLocation }) {
  const egg = eggConfig[cardData.placeType] || eggConfig[1];

  const handleLinkClick = () => {
    if (!cardData.brief) return;
    const url = cardData.brief.startsWith("http") ? cardData.brief : `https://${cardData.brief}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={cardContainerStyle}>
      {/* egg badge */}
      <div style={{ ...eggBadgeClip, backgroundColor: egg.background }}>
        <img src={egg.image} alt="egg" style={eggBadgeImg} />
      </div>

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
        <div style={cardDescriptionStyle}>{cardData.description}</div>

        {/* buttons */}
        <div style={buttonContainerStyle}>
          {cardData.brief && (
            <button onClick={handleLinkClick} style={{ ...buttonStyle, backgroundColor: "#00336615", color: parrotTextDarkBlue }}>
              Visit
            </button>
          )}
          {cardData.waypoints?.[0] && (
            <button
              onClick={() => panToLocation(cardData.waypoints[0].latitude, cardData.waypoints[0].longitude)}
              style={{ ...buttonStyle, backgroundColor: "#00336615", color: parrotTextDarkBlue }}
            >
              See on Map
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
  borderRadius: "8px",
  overflow: "hidden",
  width: "24rem",
  maxWidth: "600px",
  maxHeight: "700px",
  backgroundColor: "#fffdf8",
  margin: "1rem",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -8px 6px rgba(0, 0, 0, 0.1)",
};

const eggBadgeClip = {
  position: "absolute",
  top: "16rem",
  right: 8,
  width: 34,
  height: 34,
  borderRadius: "50%",
  zIndex: 10,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const eggBadgeImg = {
  width: 34,
  height: 38,
  objectFit: "contain",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardImageStyle = {
  width: "100%",
  height: "16rem",
  objectFit: "cover",
  borderBottom: "1px solid #ddd",
};

const cardContentStyle = {
  display: "flex",
  height: "16rem",
  flexDirection: "column",
  padding: "0.5rem 1rem",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.4), inset 0 -6px 6px rgba(0, 0, 0, 0.4)",
};

const cardTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "rgba(10, 119, 234,1)",
  marginBottom: "0.3rem",
};

const cardDescriptionStyle = {
  fontSize: "1.05rem",
  fontFamily: "Nunito, sans-serif",
  fontWeight: "600",
  color: parrotTextDarkBlue,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 5,
  textOverflow: "ellipsis",
  lineHeight: "1.55rem",
  flex: 1,
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  marginTop: "auto",
  paddingBottom: "1rem",
};

const buttonStyle = {
  width: "35%",
  padding: "0.2rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
  border: "none",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
};
