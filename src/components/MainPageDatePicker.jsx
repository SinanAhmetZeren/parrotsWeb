import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { useRef, useEffect } from "react";
import { enUS } from "react-date-range/dist/locale"; // Import locale
import "../assets/css/date-range-custom.css";

export const MainPageDatePicker = ({ dates, setDates, calendarOpen, setCalendarOpen }) => {

  const calendarRef = useRef(null);
  const handleDateChange = (item) => {
    setDates([item.selection]);
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : "";
  };

  const handleClickOutside = (event) => {
    // console.log('Clicked element:', event.target);
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target)
    ) {
      console.log('Closing calendar');
      setCalendarOpen(false);
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
        onClick={() => setCalendarOpen(!calendarOpen)} // Toggle the calendar on date field click
        style={{
          display: "flex", // Flexbox to place inputs side by side
          gap: ".5rem", // Gap between the two inputs
          paddingLeft: ".5rem",
          paddingRight: ".5rem",
          cursor: "pointer",
          width: "100%",
        }}
      >
        <div style={{ width: "50%" }}>
          <span
            className="text-lg font-bold"
            style={{
              width: "35%",
              display: "inline-block", // Make the width apply
              textAlign: "end", // Optional: Align the text inside the span
            }}
          >
            From&nbsp;
          </span>
          <input
            className="font-bold text-base "
            type="text"
            readOnly
            value={`${formatDate(dates[0].startDate)}`}
            placeholder="Start Date" // Placeholder text
            style={{
              width: "65%",
              padding: ".3rem",
              border: "1px solid #ccc",
              borderRadius: "1.5rem",
              textAlign: "center",
              color: "black",
              boxShadow: `
            0 4px 6px rgba(0, 0, 0, 0.3),
            inset 0 -4px 6px rgba(0, 0, 0, 0.3)
          `,
            }}
          />
        </div>

        <div style={{ width: "50%" }}>
          <span
            className="text-lg font-bold"
            style={{
              width: "35%",
              display: "inline-block", // Make the width apply
              textAlign: "end", // Optional: Align the text inside the span
            }}
          >
            Until&nbsp;
          </span>

          <input
            className="font-bold text-base "
            type="text"
            readOnly
            value={`${formatDate(dates[0].endDate)}`}
            placeholder="End Date" // Placeholder text
            style={{
              width: "65%",
              border: "1px solid #ccc",
              padding: ".3rem",

              borderRadius: "1.5rem",
              textAlign: "center",
              color: "black",
              boxShadow: `
            0 4px 6px rgba(0, 0, 0, 0.3),
            inset 0 -4px 6px rgba(0, 0, 0, 0.3)
          `,
            }}
          />
        </div>
      </div>

      {calendarOpen && (
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
            startDatePlaceholder="Start Date"
            endDatePlaceholder="End Date"
            ranges={dates}
            locale={enUS}
            style={{ width: "33rem" }}
          />
        </div>
      )}
    </div>
  );
};
