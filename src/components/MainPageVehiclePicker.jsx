import { useState, useRef, useEffect } from "react";

export const MainPageVehiclePicker = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(""); // State to track selected vehicle
  const [open, setOpen] = useState(false); // State to toggle the dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown container

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

  // Close the dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false); // Close the dropdown if click is outside
    }
  };

  // Set up event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Add event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, []);

  return (
    <div>
      <div
        onClick={() => setOpen(!open)} // Toggle the dropdown on click
        style={{
          display: "flex", // Flexbox styling to match input appearance
          cursor: "pointer",
          position: "relative", // Necessary for dropdown positioning
        }}
      >
        <input
          className="font-bold text-base "
          type="text"
          readOnly
          value={selectedVehicle} // Display the selected vehicle name
          placeholder="Vehicle"
          style={{
            width: "100%",
            padding: ".1rem",
            border: "1px solid #ccc",
            borderRadius: "1.5rem",
            textAlign: "center",
            color: "black",
            cursor: "pointer",
          }}
        />
      </div>

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
            marginTop: "0.5rem",
            width: "calc(33% - 1rem)", // Dropdown width
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            left: ".5rem", // Align dropdown to the center of the parent
          }}
        >
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedVehicle(vehicle); // Set the selected vehicle
                setOpen(false); // Close the dropdown
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
  );
};
