import { useSelector } from "react-redux";
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
  const dark = useSelector((state) => state.users.isDarkMode);
  const egg = eggConfig[cardData.placeType] || eggConfig[1];

  const handleLinkClick = () => {
    if (!cardData.brief) return;
    const url = cardData.brief.startsWith("http") ? cardData.brief : `https://${cardData.brief}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={cardContainerStyle(dark)}>
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
        <div style={cardTitleStyle(dark)}>{cardData.name}</div>
        <div style={cardDescriptionStyle(dark)}>{cardData.description}</div>

        {/* buttons */}
        <div style={buttonContainerStyle}>
          {cardData.brief && (
            <button onClick={handleLinkClick} style={{ ...buttonStyle, backgroundColor: dark ? "rgba(255,255,255,0.08)" : "#00336615", color: dark ? "rgba(255,255,255,0.85)" : parrotTextDarkBlue }}>
              Visit
            </button>
          )}
          {cardData.waypoints?.[0] && (
            <button
              onClick={() => panToLocation(cardData.waypoints[0].latitude, cardData.waypoints[0].longitude)}
              style={{ ...buttonStyle, backgroundColor: dark ? "rgba(255,255,255,0.08)" : "#00336615", color: dark ? "rgba(255,255,255,0.85)" : parrotTextDarkBlue }}
            >
              See on Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const cardContainerStyle = (dark) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "8px",
  overflow: "hidden",
  width: "24rem",
  maxWidth: "600px",
  maxHeight: "700px",
  backgroundColor: dark ? "#0d2b4e" : "#fffdf8",
  margin: "1rem",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -8px 6px rgba(0, 0, 0, 0.1)",
});

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

const cardTitleStyle = (dark) => ({
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: dark ? "#2ac898" : "rgba(10, 119, 234,1)",
  marginBottom: "0.3rem",
});

const cardDescriptionStyle = (dark) => ({
  fontSize: "1.05rem",
  fontFamily: "Nunito, sans-serif",
  fontWeight: "600",
  color: dark ? "rgba(255,255,255,0.8)" : parrotTextDarkBlue,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 5,
  textOverflow: "ellipsis",
  lineHeight: "1.55rem",
  flex: 1,
});

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
