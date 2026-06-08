import "../assets/css/App.css";
import * as React from "react";
import { parrotTextDarkBlue } from "../styles/colors";
import DOMPurify from "dompurify";
import { MdOutlineOpenInFull, MdOutlineZoomOutMap } from "react-icons/md";

export function VoyageDetailPageDescriptionLight({ voyageDescription, voyageName }) {
  const [isLong, setIsLong] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const contentRef = React.useRef(null);
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    const card = cardRef.current;
    if (card) {
      requestAnimationFrame(() => {
        setIsLong(card.scrollHeight > card.clientHeight + 4);
      });
    }
  }, [voyageDescription]);

  return (
    <>
      <div ref={cardRef} style={cardContainerStyle} className="flex row desc-scrollbar">
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
          <div ref={contentRef} style={infoBox} className={"custom-scrollbar"}>
            <span
              style={descriptionTextStyle}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(voyageDescription) }}
            />
          </div>
        </div>
        {isLong && (
          <div style={eyeIconContainer} onClick={() => setModalOpen(true)} title="Expand">
            <MdOutlineZoomOutMap size="1rem" color={parrotTextDarkBlue} />
          </div>
        )}
      </div>

      {modalOpen && (
        <div style={modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={modalCard} onClick={e => e.stopPropagation()} className="desc-scrollbar">
            <div style={modalHeader}>
              <div style={modalTitle}>{voyageName.name}</div>
              <div style={closeButton} onClick={() => setModalOpen(false)}>✕</div>
            </div>
            <span
              style={modalText}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(voyageDescription) }}
            />
          </div>
        </div>
      )}
    </>
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
  position: "relative",
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

const eyeIconContainer = {
  position: "sticky",
  bottom: 0,
  alignSelf: "flex-end",
  cursor: "pointer",
  padding: "0.2rem 0.4rem",
  borderRadius: "0.5rem",
  backgroundColor: "rgba(0,0,0,0.05)",
  marginRight: "0.3rem",
  marginBottom: "0.1rem",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalCard = {
  backgroundColor: "#ffffff",
  borderRadius: "1.2rem",
  padding: "2rem",
  width: "50vw",
  maxHeight: "75vh",
  overflowY: "auto",
  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
};

const modalHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  marginBottom: "0.8rem",
};

const closeButton = {
  position: "absolute",
  right: 0,
  top: 0,
  cursor: "pointer",
  fontSize: "1.1rem",
  color: parrotTextDarkBlue,
  padding: "0.2rem 0.5rem",
  borderRadius: "0.5rem",
  backgroundColor: "rgba(0,0,0,0.06)",
};

const modalTitle = {
  textAlign: "center",
  fontWeight: "900",
  fontSize: "1.6rem",
  fontStyle: "italic",
  color: "#2ac898",
};


const modalText = {
  whiteSpace: "pre-wrap",
  lineHeight: "1.7rem",
  letterSpacing: "0.015em",
  color: parrotTextDarkBlue,
  fontSize: "1.1rem",
  textAlign: "justify",
  display: "block",
};
