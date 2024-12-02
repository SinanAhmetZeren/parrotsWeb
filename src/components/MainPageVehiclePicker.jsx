import { useState, useRef, useEffect } from "react";

export const MainPageVehiclePicker = () => {
  const [selectedVehicle, setSelectedVehicle] = useState("");
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
        <input
          className="font-bold text-base "
          type="text"
          readOnly
          value={selectedVehicle}
          placeholder="Vehicle"
          style={{
            width: "100%",
            padding: ".3rem",
            border: "1px solid #ccc",
            borderRadius: "1.5rem",
            textAlign: "center",
            color: "black",
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
              width: "100%",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
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
                  color: "black",
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
