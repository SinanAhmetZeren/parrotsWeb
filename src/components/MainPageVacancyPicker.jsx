import { useState, useRef, useEffect } from "react";

export const MainPageVacancyPicker = () => {
  const [selectedVacancy, setSelectedVacancy] = useState(""); // State to track selected vacancy
  const [open, setOpen] = useState(false); // State to toggle the dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown container

  const vacancies = Array.from({ length: 50 }, (_, index) => index + 1);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

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
          value={selectedVacancy} // Display the selected vacancy number
          placeholder="Select a Vacancy"
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
      </div>

      {open && (
        <div
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
            maxHeight: "53vh", // Optional: Limit height for large lists
            overflowY: "auto", // Enable scrolling if content exceeds height
            scrollbarWidth: "none", // For Firefox (hide scrollbar)
            msOverflowStyle: "none", // For IE/Edge (hide scrollbar)
          }}
        >
          <style>
            {`
              .custom-dropdown::-webkit-scrollbar {
                display: none; 
              }
            `}
          </style>

          {vacancies.map((vacancy, index) => (
            <div
              className="font-bold text-xl"
              key={index}
              onClick={() => {
                setSelectedVacancy(vacancy); // Set the selected vacancy
                setOpen(false); // Close the dropdown
              }}
              style={{
                padding: ".5rem 1rem",
                cursor: "pointer",
                color: "black",
                borderBottom:
                  index !== vacancies.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              {vacancy}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
