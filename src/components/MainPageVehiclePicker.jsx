import { useState, useRef, useEffect } from "react";
import { parrotTextDarkBlue } from "../styles/colors";

export const MainPageVehiclePicker = ({
  selectedVehicle,
  setSelectedVehicle,
}) => {
  // const [selectedVehicle, setSelectedVehicle] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const vehicles = [
    "Boat",
    "Car",
    "Caravan",
    "Bus",
    "Walk",
    "Run",
    "Motorcycle",
    "Bicycle",
    "Tinyhouse",
    "Airplane",
    "Train",
  ];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <span
          className="text-lg font-bold"
          style={{
            width: "35%",
            display: "inline-block", // Make the width apply
            textAlign: "end", // Optional: Align the text inside the span
          }}
        >
          Vehicle&nbsp;
        </span>
        <input
          className="font-bold text-base "
          type="text"
          readOnly
          value={selectedVehicle}
          placeholder="Vehicle"
          style={{
            width: "65%",
            padding: ".3rem",
            border: "1px solid #ccc",
            borderRadius: "1.5rem",
            textAlign: "center",
            color: parrotTextDarkBlue,
            cursor: "pointer",
            boxShadow: `
            0 4px 6px rgba(0, 0, 0, 0.3),
            inset 0 -4px 6px rgba(0, 0, 0, 0.3)
          `,
          }}
        />

        {open && (
          <div
            className="font-bold text-xl "
            ref={dropdownRef}
            style={{
              position: "absolute",
              zIndex: 1000,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "1.5rem",
              marginTop: "2.5rem",
              width: "65%",
              right: "0rem",
              boxShadow: `
              0 4px 6px rgba(0, 0, 0, 0.3),
              inset 0 -4px 6px rgba(0, 0, 0, 0.3)
            `,
            }}
          >
            {vehicles.map((vehicle, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedVehicle(vehicle);
                  setOpen(false);
                }}
                style={{
                  padding: ".5rem 1rem",
                  cursor: "pointer",
                  color: parrotTextDarkBlue,
                  boxShadow: `
                  inset 0 -3px 8px rgba(0, 0, 0, 0.05)
                `,
                  borderBottom:
                    index !== vehicles.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                {vehicle}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
