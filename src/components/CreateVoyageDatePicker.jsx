import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { useRef, useEffect } from "react";
import { enUS } from "react-date-range/dist/locale"; // Import locale
import "../assets/css/date-range-custom.css";

export const CreateVoyageDatePicker = ({ dates, setDates, calendarOpen, setCalendarOpen }) => {
  // .rdrDateDisplayItemActive input  -> i want to change this color with inline code
  const calendarRef = useRef(null);
  const handleDateChange = (item) => {
    setDates([item.selection]);
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : "";
  };

  const handleClickOutside = (event) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target)
    ) {
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
    <div
      style={{
        backgroundColor: "#fff", borderRadius: "1.5rem",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "3rem",
      }}
    >

      <div
        ref={calendarRef}
        style={{
          zIndex: 1000,
          height: "27rem"
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
          className="custom-date-range"
        />
        <style>
          {`
            .custom-date-range .rdrDateDisplayItem input {
              color: rgb(0, 123, 255); 
            }
          `}
        </style>
      </div>
    </div >
  );
};
