import React from "react";
import { CiCircleCheck, CiClock2 } from "react-icons/ci";
import { MdLocationPin } from "react-icons/md";
import { parrotBlue, parrotGreen, parrotLightBlue } from "../styles/colors";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export function BidPill({ bid }) {
  return (
    <div style={pillWrapper}>
      <img src={bid.profileImageThumbnail} alt={bid.voyageName} style={thumbnail} />
      <div style={info}>
        <div style={voyageName}>{bid.voyageName}</div>
        <div style={detailRow}>
          <div style={badge(bid.accepted)}>
            {bid.accepted
              ? <CiCircleCheck size="1.1rem" color="white" />
              : <CiClock2 size="1.1rem" color="white" />}
          </div>
          <span style={dates}>{formatDate(bid.startDate)} – {formatDate(bid.endDate)}</span>
          <span style={price}>${bid.offerPrice}</span>
        </div>
      </div>
      <div style={mapPinBtn}>
        <MdLocationPin size="1.3rem" color={parrotBlue} />
      </div>
    </div>
  );
}

export function BidPillList({ bids }) {
  if (!bids || bids.length === 0) {
    return <div style={empty}>No bids yet</div>;
  }
  return (
    <div style={list}>
      {bids.map((bid) => <BidPill key={bid.bidId} bid={bid} />)}
    </div>
  );
}

const list = {
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem",
  padding: "0.8rem 1rem",
  overflowY: "auto",
  height: "100%",
};

const pillWrapper = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(0, 119, 234, 0.03)",
  borderRadius: "2rem",
  padding: "0.5rem 0.8rem",
  gap: "0.8rem",
  cursor: "pointer",
};

const thumbnail = {
  width: "3.8rem",
  height: "3.8rem",
  borderRadius: "0.6rem",
  objectFit: "cover",
  flexShrink: 0,
};

const info = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
};

const voyageName = {
  fontFamily: "Nunito, sans-serif",
  fontWeight: 800,
  fontSize: "1.1rem",
  color: parrotLightBlue,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "left",
};

const detailRow = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.5rem",
  marginTop: "0.25rem",
};

const badge = (accepted) => ({
  backgroundColor: accepted ? parrotGreen : parrotBlue,
  borderRadius: "50%",
  width: "1.5rem",
  height: "1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const dates = {
  fontFamily: "Nunito, sans-serif",
  fontSize: "0.82rem",
  color: "rgba(0,0,0,0.45)",
  width: "8rem",
  flexShrink: 0,
};

const price = {
  fontFamily: "Nunito, sans-serif",
  fontWeight: 700,
  fontSize: "0.82rem",
  color: "rgba(0,0,0,0.55)",
};

const mapPinBtn = {
  backgroundColor: "rgba(0, 119, 234, 0.08)",
  borderRadius: "50%",
  width: "2.4rem",
  height: "2.4rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const empty = {
  fontFamily: "Nunito, sans-serif",
  fontWeight: 700,
  fontSize: "1rem",
  color: parrotBlue,
  opacity: 0.5,
  textAlign: "center",
  marginTop: "2rem",
};
