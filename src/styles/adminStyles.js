export const adminPage = {
  padding: "1.5rem",
  maxWidth: "960px",
  fontFamily: "inherit",
};

export const adminCard = {
  backgroundColor: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "1.25rem 1.5rem",
  marginBottom: "1rem",
};

export const adminTitle = {
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#1e3a5f",
  marginBottom: "1rem",
  paddingBottom: "0.5rem",
  borderBottom: "2px solid #e2e8f0",
};

export const adminRow = {
  display: "grid",
  gridTemplateColumns: "140px 1fr",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.6rem",
};

export const adminLabel = {
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

export const adminInput = {
  width: "100%",
  padding: "0.4rem 0.65rem",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  fontSize: "0.9rem",
  color: "#1e3a5f",
  backgroundColor: "white",
  boxSizing: "border-box",
};

export const adminInputDisabled = {
  ...adminInput,
  backgroundColor: "#f1f5f9",
  color: "#94a3b8",
};

export const adminTextarea = {
  ...adminInput,
  resize: "vertical",
  minHeight: "4rem",
};

export const adminBtn = {
  padding: "0.4rem 1rem",
  borderRadius: "6px",
  border: "none",
  fontSize: "0.85rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "opacity 0.15s",
};

export const adminBtnPrimary = {
  ...adminBtn,
  backgroundColor: "rgb(10, 119, 234)",
  color: "white",
};

export const adminBtnSecondary = {
  ...adminBtn,
  backgroundColor: "#7c3aed",
  color: "white",
};

export const adminBtnSuccess = {
  ...adminBtn,
  backgroundColor: "#16a34a",
  color: "white",
};

export const adminBtnDanger = {
  ...adminBtn,
  backgroundColor: "#dc2626",
  color: "white",
};

export const adminBtnGhost = {
  ...adminBtn,
  backgroundColor: "#f1f5f9",
  color: "#334155",
  border: "1px solid #cbd5e1",
};

export const adminSearchBar = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
  marginBottom: "1rem",
};

export const adminIdInput = {
  padding: "0.4rem 0.65rem",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  fontSize: "0.9rem",
  color: "#1e3a5f",
  width: "160px",
};

export const adminBoolBtn = (active) => ({
  ...adminBtn,
  backgroundColor: active ? "#16a34a" : "#dc2626",
  color: "white",
  minWidth: "130px",
});

export const adminTable = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.85rem",
};

export const adminTh = {
  padding: "0.5rem 0.75rem",
  backgroundColor: "#f1f5f9",
  color: "#475569",
  fontWeight: 700,
  textAlign: "left",
  borderBottom: "2px solid #e2e8f0",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

export const adminTd = {
  padding: "0.45rem 0.75rem",
  borderBottom: "1px solid #f1f5f9",
  color: "#1e3a5f",
  verticalAlign: "middle",
};

export const adminTdInput = {
  padding: "0.25rem 0.4rem",
  border: "1px solid #cbd5e1",
  borderRadius: "4px",
  fontSize: "0.82rem",
  color: "#1e3a5f",
  width: "100%",
  boxSizing: "border-box",
};

export const adminSectionLabel = {
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "0.3rem",
};
