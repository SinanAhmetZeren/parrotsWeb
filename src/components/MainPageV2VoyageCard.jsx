import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiUsers } from "react-icons/fi";
import DOMPurify from "dompurify";

// Design tokens matching the reference HTML
const blue   = "#0A77EA";
const blueDk = "#0A5FBF";
const navy   = "#0A2540";
const dmid   = "#5C6B7A";
const faint  = "#8B98A5";
const tint   = "#F4F7FB";
const amber  = "#C2740A";

function fmtDate(d) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(d));
}

export function MainPageV2VoyageCard({ cardData, panToLocation }) {
  const navigate = useNavigate();
  const firstWaypoint = cardData.waypoints?.[0];
  const isPlace = cardData.placeType > 0;

  const handleCardClick = () => {
    if (isPlace) {
      if (!cardData.brief) return;
      const url = cardData.brief.startsWith("http") ? cardData.brief : `https://${cardData.brief}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/voyage-details/${cardData.publicId}`);
    }
  };

  const cur = cardData.currency || "€";
  const minP = cardData.minPrice ?? 0;
  const maxP = cardData.maxPrice ?? 0;
  const priceLabel = (minP === 0 && maxP === 0)
    ? null
    : minP === maxP
      ? `${cur}${minP}`
      : `${cur}${minP} – ${maxP}`;

  const startStr = fmtDate(cardData.startDate);
  const endStr   = fmtDate(cardData.endDate);
  const dateLabel = startStr === endStr ? startStr : `${startStr} – ${endStr}`;

  return (
    <div
      style={card}
      onClick={handleCardClick}
      onMouseEnter={e => { e.currentTarget.style.borderColor = blue; e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(10,119,234,.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = tint; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Image */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={imgWrap}>
          <img src={cardData.profileImageThumbnail || cardData.profileImage} alt="" style={imgStyle} />
        </div>
        {firstWaypoint && (
          <div
            style={seeOnMapBadge}
            onClick={e => { e.stopPropagation(); panToLocation(firstWaypoint.latitude, firstWaypoint.longitude); }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#C8DEFA"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#E4F0FE"; }}
          >
            See on Map
          </div>
        )}
      </div>

      {/* Content */}
      <div style={body}>
        {/* Title */}
        <div style={titleStyle}>{cardData.name}</div>

        {/* Host */}
        {!isPlace && cardData.user && (
          <div style={hostRow}>
            <img src={cardData.user.profileImageUrl} alt="" style={hostAvatar} />
            <span>Hosted by <b style={{ fontWeight: 800, color: navy }}>{cardData.user.userName}</b></span>
          </div>
        )}

        {/* Brief / Description */}
        <div
          style={{ ...briefStyle, WebkitLineClamp: isPlace ? 5 : 3 }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              (isPlace ? (cardData.description || "") : (cardData.brief || "")).replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, " ").trim()
            ),
          }}
        />

        {/* Meta row */}
        {!isPlace && <div style={metaRow}>
          {/* Auction tag */}
          {cardData.auction && <span style={tagAuction}>AUCTION</span>}

          {/* Price */}
          {priceLabel
            ? <span style={priceStyle}>{priceLabel}</span>
            : <span style={tagFree}>FREE</span>
          }

          {/* Date */}
          {dateLabel && (
            <span style={metaItem(navy)}>
              <FiCalendar size={11} color={faint} />
              {dateLabel}
            </span>
          )}

          {/* Vacancy */}
          {cardData.vacancy != null && (
            <span style={metaItem(navy)}>
              <FiUsers size={12} color={faint} />
              {cardData.vacancy}
            </span>
          )}
        </div>}
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const card = {
  display: "grid",
  gridTemplateColumns: "96px minmax(0,1fr)",
  gap: "11px",
  backgroundColor: tint,
  border: "1.5px solid transparent",
  borderRadius: "11px",
  padding: "9px",
  cursor: "pointer",
  transition: "border-color .15s, box-shadow .15s, background .15s",
  fontFamily: "Nunito, sans-serif",
};

const imgWrap = {
  width: "96px",
  height: "96px",
  borderRadius: "9px",
  overflow: "hidden",
  backgroundColor: "#DDE4EC",
  flexShrink: 0,
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const body = {
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const titleStyle = {
  fontSize: "14.5px",
  fontWeight: 800,
  color: blueDk,
  letterSpacing: "-.01em",
  textAlign: "left",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const hostRow = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "10.5px",
  fontWeight: 700,
  color: dmid,
  minWidth: 0,
};

const hostAvatar = {
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
};

const briefStyle = {
  fontSize: "11.5px",
  fontWeight: 600,
  color: dmid,
  lineHeight: 1.45,
  textAlign: "left",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 3,
};

const metaRow = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  marginTop: "auto",
  flexWrap: "wrap",
};

const metaItem = (color) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "11px",
  fontWeight: 800,
  color,
  whiteSpace: "nowrap",
});

const seeOnMapBadge = {
  fontSize: "9px",
  fontWeight: 800,
  letterSpacing: ".04em",
  textAlign: "center",
  padding: "3px 0",
  borderRadius: "6px",
  backgroundColor: "#E4F0FE",
  color: blueDk,
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const tagFree = {
  fontSize: "9px",
  fontWeight: 800,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  padding: "3px 8px",
  borderRadius: "99px",
  backgroundColor: "#D1FAE5",
  color: "#065F46",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const priceStyle = {
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: ".02em",
  padding: "1px 8px",
  borderRadius: "99px",
  backgroundColor: "#D1FAE5",
  color: "#065F46",
  fontFamily: "Nunito, sans-serif",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const tagFixed = {
  fontSize: "9px",
  fontWeight: 800,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  padding: "3px 8px",
  borderRadius: "99px",
  backgroundColor: "#E4F0FE",
  color: blueDk,
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const tagAuction = {
  ...tagFixed,
  backgroundColor: "#FDF0D5",
  color: amber,
};
