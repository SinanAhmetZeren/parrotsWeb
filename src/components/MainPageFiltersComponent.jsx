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
  setCalendarOpen
}) => {
  return (
    <div // FILTER COMPONENT
      style={{
        backgroundColor: "rgba(5, 8, 58, 0.85)",
        height: "17vh",
        width: "95%",
        padding: "1vh",
        borderRadius: "1rem",
        alignSelf: "center",
      }}
    >
      <div
        style={{
          paddingTop: "0.2rem",
        }}
      >
        <MainPageDatePicker dates={dates} setDates={setDates}
                calendarOpen={calendarOpen} 
                setCalendarOpen={setCalendarOpen}
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
          />
        </div>
        <div style={{ width: "50%" }}>
          <MainPageVacancyPicker
            selectedVacancy={selectedVacancy}
            setSelectedVacancy={setSelectedVacancy}
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
