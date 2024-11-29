import React from "react";

export const MainpageFilter = () => {
  const containerStyle = {
    backgroundColor: "#131d47",
    padding: "1rem",
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
  };

  const columnStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.625rem",
    width: "48%",
  };

  const labelStyle = {
    color: "white",
    fontSize: "0.875rem",
    fontWeight: "bold",
  };

  const inputStyle = {
    padding: "0.5rem",
    borderRadius: "0.3125rem",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "100%",
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "white",
    color: "black",
    appearance: "none",
  };

  const buttonStyle = (backgroundColor) => ({
    backgroundColor,
    color: "white",
    border: "none",
    padding: "0.5rem 1.25rem",
    borderRadius: "0.3125rem",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 0.25rem 0.375rem rgba(0, 0, 0, 0.3)",
    fontSize: "0.875rem",
  });

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <div
          style={{
            ...columnStyle,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={labelStyle}>Vehicle</label>
            <select style={selectStyle}>
              <option>Vehicle 1</option>
              <option>Vehicle 2</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={labelStyle}>Starts</label>
            <input style={inputStyle} placeholder="gg.aa.yyyy" type="date" />
          </div>
        </div>
        <div
          style={{
            ...columnStyle,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={labelStyle}>Vacancy</label>
            <select style={selectStyle}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={labelStyle}>Ends</label>
            <input style={inputStyle} placeholder="gg.aa.yyyy" type="date" />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button style={buttonStyle("#007bff")}>Clear</button>
        <button style={buttonStyle("#28a745")}>Apply</button>
      </div>
    </div>
  );
};
