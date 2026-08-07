import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../assets/css/date-range-custom.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { parrotDarkBlue, parrotWalkTurquoise } from "../styles/colors";

export const MainPageNewVoyageButton = () => {
  const navigate = useNavigate();
  const bgImageVariant = useSelector((state) => state.users.bgImageVariant);
  // const btnColor = bgImageVariant !== "new" ? parrotWalkTurquoise : parrotDarkBlue;
  const btnColor = parrotDarkBlue;

  const buttonStyle = {
    width: "36%",
    backgroundColor: "#007bff",
    padding: "0.6rem",
    borderRadius: "1.5rem",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    border: "none",
    boxShadow:
      "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
    transition: "box-shadow 0.2s ease",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.6rem",
        marginTop: "3.5rem",
        width: "100%",
      }}
    >
      <button
        onClick={() => navigate("/NewVoyage")}
        style={{ ...buttonStyle, backgroundColor: btnColor }}
      >
        New Voyage
      </button>
      <button
        onClick={() => navigate("/AskParrots")}
        style={{ ...buttonStyle, backgroundColor: btnColor }}
      >
        Ask Parrots
      </button>
    </div>
  );
};
