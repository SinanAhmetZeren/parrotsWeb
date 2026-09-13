import React, { useState } from "react";
import ReactDOM from "react-dom";
import { parrotBlue, parrotDarkBlue } from "../styles/colors";
import { TermsContent } from "./TermsContent";

const TermsOfUseComponent = ({ open: controlledOpen, onClose, onAccept, isDarkMode = false, asMenuItem = false } = {}) => {
    const [isOpen, setIsOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const modalOpen = isControlled ? controlledOpen : isOpen;

    const toggleModal = () => {
        if (isControlled) {
            onClose?.();
        } else {
            setIsOpen(prev => !prev);
        }
    };

    const modal = modalOpen ? ReactDOM.createPortal(
        <div style={modalOverlay} onClick={toggleModal}>
            <div style={modalContent} className="scrollable-modal" onClick={(e) => e.stopPropagation()}>
                <style>{`
                    .scrollable-modal::-webkit-scrollbar { width: 10px; }
                    .scrollable-modal::-webkit-scrollbar-track { background: ${parrotDarkBlue}; border-radius: 5px; }
                    .scrollable-modal::-webkit-scrollbar-thumb { background: ${parrotBlue}; border-radius: 5px; }
                `}</style>

                <button style={closeButton} onClick={toggleModal}>&times;</button>

                {onAccept && (
                    <div style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", textAlign: "center" }}>
                        <strong style={{ color: "#856404" }}>⚠ Our Terms of Use have been updated.</strong>
                        <span style={{ color: "#856404" }}> Please scroll down, read and accept the updated terms to continue.</span>
                    </div>
                )}

                <TermsContent onAccept={onAccept} onDecline={onAccept ? undefined : toggleModal} />
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            {!isControlled && (
                <button style={asMenuItem ? menuItemBtn : navigationButton} onClick={toggleModal}>
                    {asMenuItem && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flexShrink: 0 }}><path d="M7 3h7l4 4v14H7z"/><path d="M10 12h6M10 16h6"/></svg>
                    )}
                    <span>Terms of Use</span>
                </button>
            )}
            {modal}
        </>
    );
};

export default TermsOfUseComponent;

const menuItemBtn = {
    fontFamily: "Nunito, sans-serif",
    width: "100%", textAlign: "left",
    border: "none", background: "none",
    fontSize: 13.5, fontWeight: 700, color: "#0A5FBF",
    padding: "9px 11px", borderRadius: 7,
    cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
};

const navigationButton = {
    borderRadius: "1.5rem",
    backgroundColor: "white",
    color: "#007bff",
    padding: "0.2rem 0.8rem",
    textAlign: "center",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.1rem",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
    transition: "box-shadow 0.2s ease",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
};

const modalOverlay = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center",
    alignItems: "center", zIndex: 1000, overflow: "hidden",
};

const modalContent = {
    position: "relative", backgroundColor: "#fff", maxWidth: "900px", width: "100%",
    height: "90vh", overflowY: "auto", borderRadius: "1rem", padding: "2rem",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
};

const closeButton = {
    position: "absolute", top: "1rem", right: "0.3rem",
    fontSize: "2rem", background: "none", border: "none", cursor: "pointer", color: "#333",
};
