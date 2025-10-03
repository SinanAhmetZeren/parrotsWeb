import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../assets/css/date-range-custom.css";
import { useNavigate } from "react-router-dom";

export const MainPageNewVoyageButton = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    width: "40%",
    backgroundColor: "#007bff",
    padding: "0.6rem",
    marginTop: "3.5rem",
    borderRadius: "1.5rem",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.2rem",
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
      }}
    >
      <button
        onClick={() => {
          navigate("/NewVoyage");
        }}
        style={buttonStyle}
      >
        New Voyage
      </button>
    </div>
  );
};
