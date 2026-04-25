import "../assets/css/App.css";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parrotGreen, parrotTextDarkBlue } from "../styles/colors";
import trainImage from "../assets/images/train.jpeg";
import walkImage from "../assets/images/walk1.jpeg";
import runImage from "../assets/images/run1.jpeg";
import { BsPeople, BsPerson, BsCalendar, BsCashStack, BsTag } from "react-icons/bs";
import { MdOutlineGavel, MdOutlineRocketLaunch } from "react-icons/md";

export function VoyageDetailPageDetailsLegacyLight({ voyageData }) {
  const baseUserImageUrl = ``;
  const baseVehicleImageUrl = ``;
  const [hoveredUser, setHoveredUser] = useState(false);
  const [hoveredVehicle, setHoveredVehicle] = useState(false);
  const [hoveredAuction, setHoveredAuction] = useState(false);
  const [hoveredFixedPrice, setHoveredFixedPrice] = useState(false);

  const navigate = useNavigate();

  const handleGoToVehicle = (voyageData) =>
    voyageData.vehicle?.name === "Run" ||
    voyageData.vehicle?.name === "Walk" ||
    voyageData.vehicle?.name === "Train"
      ? null
      : navigate(`/vehicle-details/${voyageData.vehicle.id}`);

  const handleGoToUser = (user) => {
    navigate(`/profile-public/${user.publicId}/${user.userName}`);
  };

  const specialVehicles = { Run: runImage, Walk: walkImage, Train: trainImage };
  const specialImage = specialVehicles[voyageData.vehicle?.name];

  return (
    <div style={cardContainerStyle}>
      <div style={titleStyle}>{voyageData.name}</div>
      <div style={divider} />

      {/* Row 1: Host + Vehicle */}
      <div style={row}>
        <BsPerson size={22} color={parrotTextDarkBlue} style={{ flexShrink: 0 }} />
        <div
          style={{ ...pill, cursor: "pointer" }}
          onClick={() => handleGoToUser(voyageData.user)}
          onMouseEnter={() => setHoveredUser(true)}
          onMouseLeave={() => setHoveredUser(false)}
        >
          <img
            src={baseUserImageUrl + (voyageData.user.profileImageThumbnailUrl || voyageData.user.profileImageUrl)}
            style={{ ...avatarImg, transform: hoveredUser ? "scale(1.15)" : "scale(1)" }}
            alt="host"
          />
          <span style={pillText}>{voyageData.user.userName}</span>
        </div>

        <MdOutlineRocketLaunch size={22} color={parrotTextDarkBlue} style={{ flexShrink: 0 }} />

        <div
          style={{ ...pill, cursor: voyageData.vehicle ? "pointer" : "default" }}
          onClick={() => voyageData.vehicle && handleGoToVehicle(voyageData)}
          onMouseEnter={() => setHoveredVehicle(true)}
          onMouseLeave={() => setHoveredVehicle(false)}
        >
          {(specialImage || voyageData.vehicle) && (
            <img
              src={specialImage || (baseVehicleImageUrl + voyageData.vehicle.profileImageUrl)}
              style={{ ...avatarImg, transform: hoveredVehicle ? "scale(1.15)" : "scale(1)" }}
              alt="vehicle"
            />
          )}
          <span style={pillText}>{voyageData.vehicle?.name}</span>
        </div>
      </div>

      {/* Row 2: Spots + Dates */}
      <div style={row}>
        <BsPeople size={22} color={parrotTextDarkBlue} style={{ flexShrink: 0 }} />
        <div style={{ ...pill, minWidth: "5rem", justifyContent: "center" }}>
          <span style={pillText}>{voyageData.vacancy} spots</span>
        </div>

        <BsCalendar size={20} color={parrotTextDarkBlue} style={{ flexShrink: 0 }} />
        <div style={{ ...pill, gap: "0.5rem", justifyContent: "center", paddingLeft: "1.2rem", paddingRight: "1.2rem" }}>
          <span style={pillText}>{formatCustomDate(voyageData.startDate)}</span>
          <span style={{ color: parrotGreen, fontWeight: "900", fontSize: "1.1rem" }}>→</span>
          <span style={pillText}>{formatCustomDate(voyageData.endDate)}</span>
        </div>
      </div>

      {/* Row 3: Price + Auction + Fixed Price */}
      <div style={row}>
        <BsCashStack size={22} color={parrotTextDarkBlue} style={{ flexShrink: 0 }} />
        <div style={{ ...pill, gap: "0.4rem", padding: "0 0.8rem" }}>
          <span style={pillText}>{voyageData.currency} {voyageData.minPrice}</span>
          <span style={{ color: parrotGreen, fontWeight: "900", fontSize: "1.1rem" }}>→</span>
          <span style={pillText}>{voyageData.currency} {voyageData.maxPrice}</span>
        </div>

        <MdOutlineGavel size={20} color={parrotTextDarkBlue} style={{ flexShrink: 0, opacity: voyageData.auction ? 1 : 0.35 }} />
        <div
          style={{ ...pill, cursor: "default", position: "relative", opacity: voyageData.auction ? 1 : 0.35 }}
          onMouseEnter={() => setHoveredAuction(true)}
          onMouseLeave={() => setHoveredAuction(false)}
        >
          <span style={pillText}>Auction</span>
          {hoveredAuction && (
            <div style={tooltipStyle}>
              {voyageData.auction ? "This is an auction where the host will select the most suitable bids" : "This is not an auction"}
            </div>
          )}
        </div>

        <BsTag size={18} color={parrotTextDarkBlue} style={{ flexShrink: 0, opacity: voyageData.fixedPrice ? 1 : 0.35 }} />
        <div
          style={{ ...pill, flexShrink: 0, position: "relative", opacity: voyageData.fixedPrice ? 1 : 0.35 }}
          onMouseEnter={() => setHoveredFixedPrice(true)}
          onMouseLeave={() => setHoveredFixedPrice(false)}
        >
          <span style={pillText}>Fixed Price</span>
          {hoveredFixedPrice && (
            <div style={tooltipStyle}>
              {voyageData.fixedPrice ? "This voyage has a fixed price" : "This voyage does not have a fixed price"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatCustomDate(dateString) {
  const date = new Date(dateString);
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month} ${day}, ${year}`;
}

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  borderRadius: "1rem",
  width: "100%",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  padding: "1rem 1.2rem 1.5rem",
  gap: "1.0rem",
};

const titleStyle = {
  textAlign: "center",
  fontSize: "1.6rem",
  fontWeight: "900",
  color: parrotGreen,
  fontStyle: "italic",
};

const divider = {
  height: "1px",
  backgroundColor: "rgba(0,0,0,0.1)",
  margin: "0.2rem 0",
};

const row = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.9rem",
  width: "100%",
};

const pill = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(0,119,234,0.08)",
  borderRadius: "4rem",
  padding: "0.2rem 0.8rem 0.2rem 0.3rem",
  gap: "0.3rem",
};

const tooltipStyle = {
  position: "absolute",
  bottom: "110%",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(0,0,0,0.75)",
  color: "white",
  borderRadius: "0.5rem",
  padding: "0.3rem 0.7rem",
  fontSize: "0.85rem",
  fontWeight: "500",
  whiteSpace: "nowrap",
  zIndex: 100,
  pointerEvents: "none",
};

const pillText = {
  color: parrotTextDarkBlue,
  fontWeight: "700",
  fontSize: "1rem",
  whiteSpace: "nowrap",
};

const avatarImg = {
  height: "2rem",
  width: "2rem",
  borderRadius: "50%",
  objectFit: "cover",
  transition: "transform 0.2s ease",
};
