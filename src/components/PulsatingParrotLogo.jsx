import React from "react";
import parrotLogo from "../assets/images/parrotsiconpaddedtransparent.webp";

const pulseStyle = `
@keyframes parrotPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.5); }
}
`;

export const PulsatingParrotLogo = ({ size = 120, style = {} }) => {
  return (
    <>
      <style>{pulseStyle}</style>
      <img
        src={parrotLogo}
        alt="Loading"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          animation: "parrotPulse 1.8s ease-in-out infinite",
          ...style,
        }}
      />
    </>
  );
};
