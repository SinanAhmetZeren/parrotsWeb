import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { useRef, useEffect } from "react";
import { enUS } from "react-date-range/dist/locale"; // Import locale
import "../assets/css/date-range-custom.css";
import parrotCracker from "../assets/images/parrotCracker.png";
import { useSelector } from "react-redux";

export const CreateVoyageDatePicker = ({ dates, setDates, calendarOpen, setCalendarOpen, crackerBalance, isPublicOnMap }) => {
  const dark = useSelector((state) => state.users.isDarkMode);
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
        backgroundColor: dark ? "#011a32" : "#fff",
        borderRadius: "1.5rem",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "3rem",
        position: "relative",
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
          minDate={new Date()}
          style={{ width: "33rem" }}
          className="custom-date-range"
        />
        <style>
          {`
            .custom-date-range .rdrDateDisplayItem input {
              color: ${dark ? "rgba(255,255,255,0.9)" : "rgb(0, 123, 255)"};
            }
            ${dark ? `
            .custom-date-range .rdrCalendarWrapper {
              background-color: #011a32;
              color: rgba(255,255,255,0.85);
            }
            .custom-date-range .rdrDateDisplayWrapper {
              background-color: #0a2745;
            }
            .custom-date-range .rdrDateDisplayItem {
              background-color: #011a32;
              border-color: rgba(255,255,255,0.15);
            }
            .custom-date-range .rdrDateDisplayItem input {
              background-color: #011a32;
              color: rgba(255,255,255,0.9);
            }
            .custom-date-range .rdrMonthAndYearWrapper {
              background-color: #0a2745;
              color: rgba(255,255,255,0.85);
            }
            .custom-date-range .rdrMonthAndYearPickers select {
              background-color: #0a2745;
              color: rgba(255,255,255,0.85);
            }
            .custom-date-range .rdrMonth {
              background-color: #011a32;
            }
            .custom-date-range .rdrWeekDay {
              color: rgba(255,255,255,0.5);
            }
            .custom-date-range .rdrDayNumber span {
              color: rgba(255,255,255,0.85);
            }
            .custom-date-range .rdrDayPassive .rdrDayNumber span {
              color: rgba(255,255,255,0.2);
            }
            .custom-date-range .rdrDayDisabled {
              background-color: #011a32 !important;
            }
            .custom-date-range .rdrDayDisabled .rdrDayNumber span {
              color: rgba(255,255,255,0.2) !important;
            }
            .custom-date-range .rdrPprevButton, .custom-date-range .rdrNextButton {
              background-color: #0a2745;
            }
            .custom-date-range .rdrPprevButton i, .custom-date-range .rdrNextButton i {
              border-color: transparent rgba(255,255,255,0.7) transparent transparent;
            }
            ` : ``}
          `}
        </style>
      </div>
      {dates[0]?.endDate && (() => {
        const today = new Date(); today.setHours(23, 59, 0, 0);
        const end = new Date(dates[0].endDate); end.setHours(23, 59, 0, 0);
        const cost = isPublicOnMap ? Math.max(0, (end - today) / (1000 * 60 * 60 * 24) + 1) : 0;
        const notEnough = isPublicOnMap && crackerBalance != null && crackerBalance < cost;
        return (
          <div style={{
            position: "absolute",
            bottom: "-1.8rem",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: notEnough ? "rgba(200,50,50,0.9)" : "rgba(0,100,200,0.85)",
            color: "white",
            fontSize: "1.125rem",
            fontWeight: 600,
            padding: "0.3rem 1.2rem",
            borderRadius: "1rem",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}>
            <img src={parrotCracker} alt="cracker" style={{ width: "1.4rem", height: "1.4rem" }} />
            {isPublicOnMap ? `${cost} ParrotCrackers will be used` : "No ParrotCrackers will be used"}
            {isPublicOnMap && crackerBalance != null && (
              <span style={{ opacity: 0.75, fontSize: "0.95rem" }}>
                {notEnough ? `— you only have ${crackerBalance}` : `(balance: ${crackerBalance})`}
              </span>
            )}
          </div>
        );
      })()}
    </div >
  );
};
