import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../assets/css/date-range-custom.css";
import { MainPageVehiclePicker } from "./MainPageVehiclePicker";
import { MainPageVacancyPicker } from "./MainPageVacancyPicker";
import { MainPageDatePicker } from "./MainPageDatePicker";
import { MainPageApplyClearButtons } from "./MainPageApplyClearButtons";

export const MainPageFiltersComponent = ({
  dates,
  setDates,
  selectedVehicle,
  setSelectedVehicle,
  selectedVacancy,
  setSelectedVacancy,
  applyFilter,
  calendarOpen,
  setCalendarOpen,
  isDarkMode = false,
}) => {
  const dark = isDarkMode;
  return (
    <div
      style={{
        backgroundColor: dark ? "rgba(13,43,78,0.85)" : "rgba(255, 255, 255, 0.3)",
        height: "17vh",
        width: "92%",
        padding: "1vh",
        borderRadius: "1rem",
        alignSelf: "center",
        margin: "auto"
      }}
    >
      <div style={{ paddingTop: "0.2rem" }}>
        <MainPageDatePicker dates={dates} setDates={setDates}
          calendarOpen={calendarOpen}
          setCalendarOpen={setCalendarOpen}
          isDarkMode={isDarkMode}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: ".5rem",
          paddingLeft: ".5rem",
          paddingRight: ".5rem",
          cursor: "pointer",
          width: "100%",
          paddingTop: "0.2rem",
        }}
      >
        <div style={{ width: "50%" }}>
          <MainPageVehiclePicker
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            isDarkMode={isDarkMode}
          />
        </div>
        <div style={{ width: "50%" }}>
          <MainPageVacancyPicker
            selectedVacancy={selectedVacancy}
            setSelectedVacancy={setSelectedVacancy}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
      <div>
        <MainPageApplyClearButtons applyFilter={applyFilter} setDates={setDates}
          setSelectedVacancy={setSelectedVacancy}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>
    </div>
  );
};
