import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState, useRef, useEffect } from "react";
import { BsCalendar3 } from "react-icons/bs";
import { FaSailboat } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi2";

const blue = "#0A77EA";
const blueDk = "#0A5FBF";
const navy = "#0A2540";

const vehicleOptions = ["Boat", "Car", "Caravan", "Bus", "Walk", "Run", "Motorcycle", "Bicycle", "Tinyhouse", "Airplane", "Train"];
const vacancyOptions = Array.from({ length: 50 }, (_, i) => i + 1);

function fmtDate(d) {
  return d ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d) : "";
}

export const MainPageFiltersComponent = ({
  dates, setDates,
  selectedVehicle, setSelectedVehicle,
  selectedVacancy, setSelectedVacancy,
  applyFilter, calendarOpen, setCalendarOpen,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [vacancyOpen, setVacancyOpen] = useState(false);

  // track last-applied values to detect dirty (changed) state
  const [appliedDates, setAppliedDates] = useState(null);
  const [appliedVehicle, setAppliedVehicle] = useState(undefined);
  const [appliedVacancy, setAppliedVacancy] = useState(undefined);

  const calRef = useRef(null);
  const vehRef = useRef(null);
  const vacRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) setCalendarOpen(false);
      if (vehRef.current && !vehRef.current.contains(e.target)) setVehicleOpen(false);
      if (vacRef.current && !vacRef.current.contains(e.target)) setVacancyOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setCalendarOpen]);

  const handleApply = () => {
    applyFilter();
    setAppliedDates(dates?.from ? { from: dates.from, to: dates.to } : null);
    setAppliedVehicle(selectedVehicle);
    setAppliedVacancy(selectedVacancy);
  };

  const handleClear = () => {
    setDates({ from: undefined, to: undefined });
    setSelectedVehicle(undefined);
    setSelectedVacancy(undefined);
    setAppliedDates(null);
    setAppliedVehicle(undefined);
    setAppliedVacancy(undefined);
  };

  const hasDate = !!dates?.from;
  const hasVehicle = !!selectedVehicle;
  const hasVacancy = !!selectedVacancy;

  // "applied" means current value matches last-applied value
  const dateApplied = hasDate && appliedDates?.from?.getTime() === dates?.from?.getTime() && appliedDates?.to?.getTime() === dates?.to?.getTime();
  const vehicleApplied = hasVehicle && appliedVehicle === selectedVehicle;
  const vacancyApplied = hasVacancy && appliedVacancy === selectedVacancy;

  // chip status: "initial" | "changed" | "applied"
  const dateStatus = !hasDate ? "initial" : dateApplied ? "applied" : "changed";
  const vehicleStatus = !hasVehicle ? "initial" : vehicleApplied ? "applied" : "changed";
  const vacancyStatus = !hasVacancy ? "initial" : vacancyApplied ? "applied" : "changed";

  const startStr = fmtDate(dates?.from);
  const endStr = fmtDate(dates?.to);

  const activeCount = (hasDate ? 1 : 0) + (hasVehicle ? 1 : 0) + (hasVacancy ? 1 : 0);

  return (
    <div style={{ ...bar, borderRadius: "99px", padding: collapsed ? "0" : "6px 10px", width: collapsed ? "3.4rem" : undefined, justifyContent: collapsed ? "center" : undefined }}
      onClick={collapsed ? () => setCollapsed(false) : undefined}
    >

      {/* Collapse toggle */}
      <button style={{ ...collapseBtn, position: "relative" }} onClick={(e) => { e.stopPropagation(); setCollapsed(!collapsed); setCalendarOpen(false); setVehicleOpen(false); setVacancyOpen(false); }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="20" height="20">
          <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
        </svg>
        {collapsed && activeCount > 0 && <span style={badge}>{activeCount}</span>}
      </button>

      {!collapsed && (<>{/* Date chip */}
        <div ref={calRef} style={{ position: "relative" }}>
          <button
            style={chip(dateStatus, "12.5rem")}
            onClick={() => { setCalendarOpen(!calendarOpen); setVehicleOpen(false); setVacancyOpen(false); }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: hasDate ? "5px" : "9px" }}>
              <BsCalendar3 size={13} style={{ opacity: .7 }} />
              {hasDate ? (
                <>
                  <span>{startStr}</span>
                  <span style={{ opacity: 0.35, fontSize: "11px" }}>│</span>
                  <span>{endStr || startStr}</span>
                </>
              ) : "Dates"}
            </span>
            {hasDate && (
              <span style={xBtn} onClick={e => { e.stopPropagation(); setDates({ from: undefined, to: undefined }); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" width="8" height="8">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </span>
            )}
          </button>
          {calendarOpen && (
            <div style={dropdown}>
              <style>{`
                .rdp-root {
                  --rdp-accent-color: #0A77EA;
                  --rdp-accent-background-color: #dce9fb;
                  --rdp-day-height: 38px;
                  --rdp-day-width: 38px;
                  --rdp-day_button-height: 35px;
                  --rdp-day_button-width: 35px;
                  --rdp-day_button-border-radius: 0px;
                  --rdp-day_button-border: 2px solid transparent;
                  --rdp-range_middle-background-color: transparent;
                  --rdp-range_start-background: none;
                  --rdp-range_end-background: none;
                  --rdp-range_start-date-background-color: #0A77EA;
                  --rdp-range_end-date-background-color: #0A77EA;
                  --rdp-range_start-color: #fff;
                  --rdp-range_end-color: #fff;
                  --rdp-selected-border: 2px solid transparent;
                  font-family: Nunito, sans-serif;
                }
                .rdp-caption_label { font-size: 13px; font-weight: 800; color: #0A2540; }
                .rdp-weekday { font-size: 10px; font-weight: 700; color: #5C6B7A; opacity: 1; }
                .rdp-day_button { font-size: 11px; font-weight: 600; color: #0A2540; }
                .rdp-selected .rdp-day_button { border-color: transparent; }
                .rdp-today:not(.rdp-outside) { color: #0A77EA; }
                .rdp-chevron { fill: #5C6B7A; width: 12px; height: 12px; }
                .rdp-button_previous, .rdp-button_next { background: #F0F2F5; border-radius: 8px; width: 2rem; height: 2rem; }
                .rdp-button_previous:hover, .rdp-button_next:hover { background: #E3E9F0; }
                .rdp-month_caption { justify-content: center; font-size: 13px; font-weight: 800; color: #0A2540; }
                .rdp-range_start.rdp-range_end { background: none; }
                .rdp-range_middle .rdp-day_button { background-color: #dce9fb; border-radius: 0 !important; color: #0A5FBF !important; }
                .rdp-range_start .rdp-day_button { border-radius: 8px 0 0 8px !important; }
                .rdp-range_end .rdp-day_button { border-radius: 0 8px 8px 0 !important; }
                .rdp-range_start.rdp-range_end .rdp-day_button { border-radius: 8px !important; }
              `}</style>
              <DayPicker
                mode="range"
                selected={dates}
                onSelect={setDates}
                formatters={{ formatWeekdayName: (day) => "SMTWTFS"[day.getDay()] }}
                navLayout="around"
                style={{ padding: "12px" }}
              />
            </div>
          )}
        </div>

        {/* Vehicle chip */}
        <div ref={vehRef} style={{ position: "relative" }}>
          <button
            style={chip(vehicleStatus, "9rem")}
            onClick={() => { setVehicleOpen(!vehicleOpen); setCalendarOpen(false); setVacancyOpen(false); }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FaSailboat size={13} style={{ opacity: .7 }} />
              {selectedVehicle || "Vehicle"}
            </span>
            {hasVehicle && (
              <span style={xBtn} onClick={e => { e.stopPropagation(); setSelectedVehicle(undefined); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" width="8" height="8">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </span>
            )}
          </button>
          {vehicleOpen && (
            <div style={{ ...dropdown, minWidth: "11rem" }}>
              {vehicleOptions.map((v, i) => (
                <div key={i} style={dropItem} onClick={() => { setSelectedVehicle(v); setVehicleOpen(false); }}>
                  {v}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vacancy chip */}
        <div ref={vacRef} style={{ position: "relative" }}>
          <button
            style={chip(vacancyStatus, "7rem")}
            onClick={() => { setVacancyOpen(!vacancyOpen); setCalendarOpen(false); setVehicleOpen(false); }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", flex: 1 }}>
              <HiUsers size={14} style={{ opacity: .7 }} />
              {hasVacancy ? `${selectedVacancy}` : "Vacancy"}
            </span>
            {hasVacancy && (
              <span style={xBtn} onClick={e => { e.stopPropagation(); setSelectedVacancy(undefined); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" width="8" height="8">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </span>
            )}
          </button>
          {vacancyOpen && (
            <div style={{ ...dropdown, minWidth: "8rem", maxHeight: "14rem", overflowY: "auto", scrollbarWidth: "none" }}>
              {vacancyOptions.map((v, i) => (
                <div key={i} style={dropItem} onClick={() => { setSelectedVacancy(v); setVacancyOpen(false); }}>
                  {v}
                </div>
              ))}
            </div>
          )}
        </div>

        <span style={{ flex: 1, minWidth: "6px" }} />

        <button style={clearBtn} onClick={handleClear}>Clear</button>
        <button style={applyBtn} onClick={handleApply}>Apply</button>
      </>)}
    </div>
  );
};

// ── Styles ──────────────────────────────────────────────────────────────────

const bar = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#0A2540",
  border: "1px solid rgba(255,255,255,.13)",
  borderRadius: "14rem",
  padding: "6px 10px",
  flexWrap: "nowrap",
  flexShrink: 0,
  height: "3.4rem",
  boxSizing: "border-box",
  position: "relative",
  zIndex: 500,
  fontFamily: "Nunito, sans-serif",
};

const filterLabel = {
  fontSize: "9.5px",
  fontWeight: 800,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,.5)",
  marginRight: "2px",
};

const chip = (status, width = "7.5rem") => ({
  fontFamily: "Nunito, sans-serif",
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  backgroundColor:
    status === "applied" ? "rgb(10,119,234)" :
      status === "changed" ? "#F5A623" :
        "rgba(195,195,195,0.07)",
  border:
    status === "applied" ? "1.5px solid rgba(10,119,234,0.6)" :
      status === "changed" ? "1.5px solid rgba(245,166,35,0.6)" :
        "1.5px solid rgba(195,195,195,0.33)",
  color:
    status === "applied" ? "#fff" :
      status === "changed" ? "#fff" :
        "rgba(195,195,195,0.88)",
  fontSize: "12px",
  fontWeight: status !== "initial" ? 800 : 700,
  padding: "5px 8px 5px 11px",
  borderRadius: "99px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  width,
  justifyContent: status === "initial" ? "center" : "space-between",
});

const xBtn = {
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  backgroundColor: "rgba(10,95,191,.16)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const dropdown = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 16px rgba(0,20,30,.18)",
  zIndex: 1000,
  overflow: "hidden",
};

const dropItem = {
  fontFamily: "Nunito, sans-serif",
  fontWeight: 600,
  fontSize: "13px",
  padding: "9px 14px",
  cursor: "pointer",
  color: navy,
  borderBottom: "1px solid #f3f4f6",
};

const clearBtn = {
  fontFamily: "Nunito, sans-serif",
  background: "none",
  border: "none",
  color: "rgba(255,255,255,.66)",
  fontSize: "12.5px",
  fontWeight: 800,
  cursor: "pointer",
  padding: "8px 10px",
  borderRadius: "8px",
};

const applyBtn = {
  fontFamily: "Nunito, sans-serif",
  backgroundColor: blue,
  border: "none",
  color: "#fff",
  fontSize: "13px",
  fontWeight: 800,
  padding: "5px 14px",
  borderRadius: "99px",
  cursor: "pointer",
};

const pillBtn = {
  display: "inline-flex", alignItems: "center", gap: "6px",
  backgroundColor: navy, border: "1px solid rgba(255,255,255,.13)",
  borderRadius: "99px", padding: "7px 12px",
  cursor: "pointer", color: "#fff", position: "relative",
};

const badge = {
  backgroundColor: blue, color: "#fff",
  fontSize: "10px", fontWeight: 900, fontFamily: "Nunito, sans-serif",
  borderRadius: "99px", minWidth: "16px", height: "16px",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "0 4px",
};

const collapseBtn = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  background: "none", border: "none", cursor: "pointer",
  color: "#fff", padding: "2px 4px", borderRadius: "6px",
  flexShrink: 0,
};
