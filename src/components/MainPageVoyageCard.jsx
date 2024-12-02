export function MainPageVoyageCard({ cardData }) {
  return (
    <div className="card" style={cardContainerStyle}>
      <div className="card-image" style={cardImageStyle}>
        <img src={cardData.image} style={imageStyle} alt="Boat tour" />
      </div>
      <div className="card-content" style={cardContentStyle}>
        <h2 style={cardTitleStyle}>{cardData.name}</h2>
        <p style={cardSubtitleStyle}>{cardData.brief}</p>
        <p style={cardDescriptionStyle}>
          vehicle: {cardData.vehicle}
          <br />
          dates: {cardData.dates}
          <br />
          vacancy: {cardData.vacancy}
        </p>
        <div className="card-buttons" style={buttonContainerStyle}>
          <button style={buttonStyle}>Trip Details</button>
          <button style={buttonStyle}>See on Map</button>
        </div>
      </div>
    </div>
  );
}

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  width: "24rem",
  maxWidth: "600px",
  maxHeight: "700px",
  backgroundColor: "#fff",
  margin: "1rem",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.9),
  inset 0 -4px 6px rgba(0, 0, 0, 0.9)
`,
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
  backgroundColor: "white",
  flexDirection: "column",
  boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.4),
  inset 0 -6px 6px rgba(0, 0, 0, 0.4)
`,
};

const cardTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  color: "green",
};

const cardSubtitleStyle = {
  fontSize: "1rem",
  color: "black",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 5,
  textOverflow: "ellipsis",
  paddingLeft: "1rem",
  paddingRight: "1rem",
};

const cardDescriptionStyle = {
  fontSize: "1rem",
  color: "blue",
  fontWeight: "600",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  marginTop: "1rem",
  marginTop: "auto",
  paddingBottom: "0.6rem",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  fontSize: "16px",
  fontWeight: "800",
  borderRadius: "20px",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
  boxShadow: `
    0 4px 6px rgba(0, 0, 0, 0.3),
    inset 0 -4px 6px rgba(0, 0, 0, 0.3)
  `,
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

/* TODO:
1. Vehicle type emoji - case
2. Vacancy emoji
3. Calendar emoji



switch (vehicletype) {
  case 0:
    icon = (
      <FontAwesome6
        name="sailboat"
        size={16}
        color="rgba(10, 119, 234,1)"
        style={styles.icon}
      />
    );
    break;
  case 1:
    icon = (
      <AntDesign
        name="car"
        size={16}
        color="rgba(10, 119, 234,1)"
        style={styles.icon}
      />
    );
    break;
  case 2:
    icon = (
      <FontAwesome5
        name="caravan"
        size={16}
        color="rgba(10, 119, 234,1)"
        style={styles.icon}
      />
    );
    break;

  default:
    icon = "help-circle";
    break;
}


*/
