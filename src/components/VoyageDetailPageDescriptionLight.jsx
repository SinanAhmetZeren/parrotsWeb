import "../assets/css/App.css";
import * as React from "react";
import { parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";

export function VoyageDetailPageDescriptionLight({ voyageDescription, voyageName }) {
  return (
    <div style={cardContainerStyle} className="flex row desc-scrollbar">
      <style>{`
        .desc-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.15) transparent; }
        .desc-scrollbar::-webkit-scrollbar { width: 6px; border-radius: 1rem; }
        .desc-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 1rem; }
        .desc-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
      `}</style>
      <div style={userVehicleInfoRow}>
        <span style={voyageNameStyle}>{voyageName.name}</span>
      </div>
      <div className={"flex"} style={dataRowItem}>
        <div style={infoBox} className={"custom-scrollbar"}>
          <span
            style={descriptionTextStyle}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(voyageDescription) }}
          />
        </div>
      </div>
    </div>
  );
}

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  borderRadius: "1rem",
  overflowY: "auto",
  width: "100%",
  backgroundColor: "#ffffff",
  margin: "0rem",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  color: parrotTextDarkBlue,
  padding: "1rem",
  fontSize: "1.15rem",
};

const voyageNameStyle = {
  fontWeight: "900",
  fontSize: "1.5rem",
  fontStyle: "italic",
  color: "#2ac898",
};

const userVehicleInfoRow = {
  display: "flex",
  flexDirection: "row",
  margin: "0.2rem",
  justifyContent: "center",
  marginLeft: "1.3rem",
  color: parrotTextDarkBlue,
  fontSize: "1.2rem",
  fontWeight: "600",
};

const dataRowItem = {
  marginTop: ".3rem",
  marginRight: "0.8rem",
  marginLeft: "0.8rem",
};

const infoBox = {
  marginLeft: "0.5rem",
  marginBottom: "0.5rem",
  textAlign: "justify",
};

const descriptionTextStyle = {
  whiteSpace: "pre-wrap",
  textIndent: "0",
  lineHeight: "1.65rem",
  letterSpacing: "0.015em",
  margin: "auto",
  marginTop: "0.6rem",
  color: parrotTextDarkBlue,
};

const readMore = {
  height: "1.5rem",
  alignSelf: "end",
  color: "#2ac898",
  fontWeight: "bold",
  fontSize: "0.9rem",
  cursor: "pointer",
  backgroundColor: "rgba(42,200,152,0.1)",
  borderRadius: "1rem",
  marginLeft: "0.5rem",
  marginRight: "1rem",
  paddingLeft: "0.5rem",
  paddingRight: "0.5rem",
  position: "absolute",
  bottom: "0rem",
  right: 0,
};
