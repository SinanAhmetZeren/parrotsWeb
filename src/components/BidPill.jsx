import React from "react";
import { useNavigate } from "react-router-dom";
import { parrotGreen, parrotBlue } from "../styles/colors";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
};

export function BidPill({ bid, onNavigate }) {
  const accepted = bid.accepted;
  return (
    <div style={cardWrapper} onClick={onNavigate}>
      <div style={contentRow}>
        <img src={bid.profileImageThumbnail} alt={bid.voyageName} style={thumbnail} />
        <div style={middleContent}>
          <div style={middleInfo}>
            <div style={voyageNameStyle}>{bid.voyageName}</div>
            <div style={datesStyle}>{formatDate(bid.startDate)} – {formatDate(bid.endDate)}</div>
            <div style={bidPlacedStyle}>Bid placed {timeAgo(bid.bidDateTime)}</div>
          </div>
        </div>
        <div style={separator()} />
        <div style={rightSection(accepted)}>
          <div style={priceStyle}>€{bid.offerPrice}</div>
          <div style={statusBadge(accepted)}>{accepted ? "ACCEPTED" : "PENDING"}</div>
        </div>
      </div>

    </div>
  );
}

export function BidPillList({ bids }) {
  const navigate = useNavigate();
  if (!bids || bids.length === 0) {
    return <div style={empty}>No bids yet</div>;
  }
  return (
    <div style={list}>
      {bids.map((bid) => (
        <BidPill key={bid.bidId} bid={bid} onNavigate={() => navigate(`/voyage-details/${bid.voyagePublicId}`)} />
      ))}
    </div>
  );
}

const list = {
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
  padding: "0.8rem 1rem",
  overflowY: "auto",
  height: "100%",
};

const cardWrapper = {
  display: "flex",
  flexDirection: "column",
  borderRadius: "1rem",
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  backgroundColor: "white",
  cursor: "pointer",
  border: "1px solid rgba(0,0,0,0.06)",
};

const contentRow = {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  padding: "0",
  overflow: "hidden",
  minHeight: "6rem",
};

const middleContent = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
  padding: "0.7rem 0.9rem",
  gap: "0.8rem",
};

const separator = () => ({
  width: "0",
  borderLeft: "1px dashed rgba(0,0,0,0.15)",
  flexShrink: 0,
  alignSelf: "stretch",
});

const rightSection = (accepted) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.35rem",
  flexShrink: 0,
  width: "6rem",
  backgroundColor: accepted ? "rgba(42,200,152,0.1)" : "rgba(245,158,11,0.1)",
  padding: "0.7rem 0.5rem",
});

const statusBadge = (accepted) => ({
  fontFamily: "Nunito, sans-serif",
  fontWeight: 800,
  fontSize: "0.68rem",
  letterSpacing: "0.04em",
  color: accepted ? parrotGreen : "#f59e0b",
  backgroundColor: accepted ? "rgba(42,200,152,0.18)" : "rgba(245,158,11,0.18)",
  borderRadius: "2rem",
  padding: "0.2rem 0.55rem",
});

const thumbnail = {
  width: "6rem",
  alignSelf: "stretch",
  objectFit: "cover",
  flexShrink: 0,
  display: "block",
};

const middleInfo = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
};

const voyageNameStyle = {
  fontFamily: "Nunito, sans-serif",
  fontWeight: 900,
  fontSize: "1.1rem",
  color: parrotBlue,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "left",
};

const bidPlacedStyle = {
  fontFamily: "Nunito, sans-serif",
  fontSize: "0.75rem",
  color: "rgba(0,0,0,0.35)",
  marginTop: "0.15rem",
  textAlign: "left",
};

const datesStyle = {
  fontFamily: "Nunito, sans-serif",
  fontWeight: 700,
  fontSize: "0.82rem",
  color: "rgba(0,0,0,0.45)",
  marginTop: "0.15rem",
  textAlign: "left",
};

const priceStyle = {
  fontFamily: "Nunito, sans-serif",
  fontWeight: 900,
  fontSize: "1.2rem",
  color: "#0d2b4e",
};

const empty = {
  fontFamily: "Nunito, sans-serif",
  fontWeight: 700,
  fontSize: "1rem",
  color: "rgba(0,119,234,0.5)",
  textAlign: "center",
  marginTop: "2rem",
};
