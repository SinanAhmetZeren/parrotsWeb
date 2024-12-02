import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { useState, useRef, useEffect } from "react";
import { enUS } from "react-date-range/dist/locale"; // Import locale
import "../assets/css/date-range-custom.css";

export const MainPageDatePicker = () => {
  const [state, setState] = useState([
    {
      startDate: null, // Start date is null initially
      endDate: null, // End date is null initially
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false); // State to toggle the calendar visibility

  const calendarRef = useRef(null); // Ref for the calendar container

  // Update the date range when the calendar is used
  const handleDateChange = (item) => {
    setState([item.selection]);
  };

  // Format the date in a readable way
  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : "";
  };

  // Close the calendar if clicked outside
  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setOpen(false); // Close the calendar if click is outside
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
        onClick={() => setOpen(!open)} // Toggle the calendar on date field click
        style={{
          display: "flex", // Flexbox to place inputs side by side
          gap: ".5rem", // Gap between the two inputs
          paddingLeft: ".5rem",
          paddingRight: ".5rem",
          cursor: "pointer",
          width: "100%",
        }}
      >
        <input
          type="text"
          readOnly
          value={`${formatDate(state[0].startDate)}`}
          placeholder="Start Date" // Placeholder text
          style={{
            width: "50%",
            padding: ".1rem",
            border: "1px solid #ccc",
            borderRadius: "1.5rem",
            textAlign: "center",
            color: "black",
          }}
        />
        <input
          type="text"
          readOnly
          value={`${formatDate(state[0].endDate)}`}
          placeholder="End Date" // Placeholder text
          style={{
            width: "50%",
            // padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "1.5rem",
            textAlign: "center",
            color: "black",
          }}
        />
      </div>

      {open && (
        <div
          ref={calendarRef}
          style={{
            position: "absolute",
            zIndex: 1000,
            paddingTop: "1rem",
            width: "33%",
          }}
        >
          <DateRange
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={state}
            locale={enUS}
            style={{ width: "33rem" }}
          />
        </div>
      )}
    </div>
  );
};
