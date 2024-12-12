import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../assets/css/date-range-custom.css";
import parrotsLogo from "../assets/parrots-logo-mini.png";

export const TopLeftComponent = ({ userName }) => {
  return (
    <div
      className="flex mainpage_TopLeft"
      style={{
        height: "3rem",
        width: "33%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={parrotsLogo} alt="Logo" className="w-10 h-10 mr-4" />
      <div>
        <span
          className="text-xl font-bold"
          style={{ color: "rgba(10, 119, 234,1)", fontWeight: "900" }}
        >
          Welcome to Parrots
        </span>
        <span
          className="text-xl "
          style={{ color: "#2ac898", fontWeight: "900" }}
        >
          {" "}
          {userName.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
