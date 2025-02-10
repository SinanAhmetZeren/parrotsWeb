import "../assets/css/date-range-custom.css";

export const DefaultSpinner = () => {
  return (
    <div style={{
      // backgroundColor: "rgba(255, 255, 255, 0.2)",
      height: "100%", width: "100%",
      borderRadius: "1.5rem",
      position: "relative"
    }}>
      <div className="spinner"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          height: "5rem",
          width: "5rem",
          border: "8px solid rgba(173, 216, 230, 0.3)",
          borderTop: "8px solid #1e90ff",
        }}></div>
    </div>
  );
};
