import React from "react";
import scoutingLight from "../assets/images/scouting_lightmode.jpeg";
import scoutingDark from "../assets/images/scouting_darkmode.jpeg";

const pulseStyle = `
@keyframes scoutingPulse {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 0.5; transform: scale(1); }
}
`;

export const PulsatingParrotLogoWithText = ({ isDark = false }) => {
  return (
    <>
      <style>{pulseStyle}</style>
      <img
        src={isDark ? scoutingDark : scoutingLight}
        alt="Scouting"
        style={{
          height: "12rem", objectFit: "contain", display: "block", margin: "auto",
          animation: "scoutingPulse 2s ease-in-out infinite"
        }}
      />
    </>
  );
};
