import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../assets/css/date-range-custom.css";

export const MainPageApplyClearButtons = ({
  applyFilter,
  setDates,
  setSelectedVehicle,
  setSelectedVacancy,
}) => {
  const buttonStyle = {
    width: "65%", // Match the input width
    padding: "0.3rem",
    borderRadius: "1.5rem",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    border: "none",
    boxShadow: `
        0 4px 6px rgba(0, 0, 0, 0.3),
        inset 0 -4px 6px rgba(0, 0, 0, 0.3)
      `,
    transition: "box-shadow 0.2s ease",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  const clearFilters = () => {
    setDates([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);
    setSelectedVehicle("");
    setSelectedVacancy("");
  };

  return (
    <div
      style={{
        display: "flex", // Flexbox to place inputs side by side
        gap: ".5rem", // Gap between the two inputs
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        cursor: "pointer",
        width: "100%",
        paddingTop: "0.5rem",
      }}
    >
      <div
        style={{
          width: "50%",
          display: "flex", // Enable flexbox
          justifyContent: "flex-end", // Align items to the right
        }}
      >
        <button
          onClick={() => {
            console.log("clear");
            clearFilters();
          }}
          style={{ ...buttonStyle, backgroundColor: "green" }}
        >
          Clear
        </button>
      </div>

      <div
        style={{
          width: "50%",
          display: "flex", // Enable flexbox
          justifyContent: "flex-end", // Align items to the right
        }}
      >
        <button
          onClick={() => {
            applyFilter();
          }}
          style={{ ...buttonStyle, backgroundColor: "#007bff" }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};