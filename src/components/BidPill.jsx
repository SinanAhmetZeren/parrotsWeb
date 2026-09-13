import React from "react";
import { useNavigate } from "react-router-dom";

const blueDk = "#0A5FBF";
const mid = "#5C6B7A";
const tint = "#F4F7FB";

const formatDate = (d) => { if (!d) return ""; const [y, m, day] = String(d).split("T")[0].split("-"); return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(+y, +m - 1, +day)); };
const timeAgo = (d) => {
  if (!d) return "";
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  return days === 0 ? "today" : days === 1 ? "1d ago" : `${days}d ago`;
};

export function BidPill({ bid, onNavigate }) {
  const accepted = bid.accepted;
  return (
    <div style={bd} onClick={onNavigate}
      onMouseEnter={e => Object.assign(e.currentTarget.style, bdHov)}
      onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: "transparent", background: tint })}>
      <span style={bdIm}>
        <img src={bid.profileImageThumbnail} alt={bid.voyageName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </span>
      <span style={bb}>
        <span style={bt}>{bid.voyageName}</span>
        <span style={bs}>{formatDate(bid.startDate)} – {formatDate(bid.endDate)}</span>
        <span style={bs}>Bid placed {timeAgo(bid.bidDateTime)}</span>
      </span>
      <span style={br}>
        <span style={amt}>€{bid.offerPrice}</span>
        <span style={{ ...tagp, ...(accepted ? tagAcc : tagPend) }}>{accepted ? "Accepted" : "Pending"}</span>
      </span>
    </div>
  );
}

export function BidPillList({ bids, isDarkMode, filter = "All" }) {
  const navigate = useNavigate();
  if (!bids || bids.length === 0) return <p style={empty}>No bids yet</p>;
  const filtered = filter === "All" ? bids
    : filter === "Accepted" ? bids.filter(b => b.accepted)
      : bids.filter(b => !b.accepted);
  if (filtered.length === 0) return <p style={empty}>No {filter.toLowerCase()} bids</p>;
  return filtered.map(bid => (
    <BidPill key={bid.bidId} bid={bid} onNavigate={() => navigate(`/voyage-details/${bid.voyagePublicId}`)} />
  ));
}

const bd = {
  display: "flex", alignItems: "center", gap: 11,
  background: tint, border: "1.5px solid transparent",
  borderRadius: 11, padding: 9, cursor: "pointer",
  transition: "border-color 0.15s, background 0.15s",
};
const bdHov = { borderColor: "#C9DAF0", background: "#fff" };
const bdIm = {
  width: "3.25rem", height: "3.25rem", borderRadius: 9,
  overflow: "hidden", flexShrink: 0, display: "block",
};
const bb = { width: "11rem", flexShrink: 0, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 };
const bt = { fontSize: 14, fontWeight: 800, color: blueDk, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" };
const bs = { fontSize: 11.5, fontWeight: 700, color: mid, textAlign: "left" };
const br = { width: "5rem", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 };
const amt = { fontSize: 14.5, fontWeight: 900, color: "#0A2540" };
const tagp = { fontSize: 9.5, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 99, whiteSpace: "nowrap" };
const tagPend = { background: "#FDF0D5", color: "#96590A" };
const tagAcc = { background: "#DDF3E7", color: "#0B6B4E" };
const empty = { color: mid, fontSize: "0.85rem", fontWeight: 700, textAlign: "center", padding: "2rem 1rem" };
