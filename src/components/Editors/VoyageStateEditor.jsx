import React, { useState } from "react";
import { useLazyGetVoyageByIdAdminQuery, useSetVoyageStateMutation } from "../../slices/VoyageSlice";
import {
  adminPage, adminCard, adminTitle, adminLabel, adminSearchBar, adminIdInput,
  adminBtnPrimary, adminBtnDanger, adminBtnSuccess, adminBtnGhost, adminRow,
} from "../../styles/adminStyles";

const STATE_OPTIONS = ["Active", "BidsClosed", "Cancelled"];

const stateColor = {
  Active: "#16a34a",
  BidsClosed: "#C2410C",
  Cancelled: "#DC2626",
};

function Row({ label, value, color }) {
  return (
    <div style={adminRow}>
      <span style={adminLabel}>{label}</span>
      <span style={{ fontSize: "0.88rem", color: color ?? "#1e3a5f", fontWeight: 500 }}>{value ?? "—"}</span>
    </div>
  );
}

export function VoyageStateEditor() {
  const [voyageId, setVoyageId] = useState("");
  const [setVoyageState] = useSetVoyageStateMutation();
  const [loadingState, setLoadingState] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [trigger, { data, isLoading, isError }] = useLazyGetVoyageByIdAdminQuery();

  const handleSearch = (e) => {
    e.preventDefault();
    const id = parseInt(voyageId.trim(), 10);
    if (!isNaN(id)) { trigger(id); setFeedback(null); }
  };

  const handleSetState = async (state) => {
    setLoadingState(state);
    setFeedback(null);
    try {
      await setVoyageState({ voyageId: data.id, state }).unwrap();
      setFeedback({ ok: true, msg: `State set to ${state}` });
    } catch {
      setFeedback({ ok: false, msg: "Failed to update state." });
    } finally {
      setLoadingState(null);
    }
  };

  const stateBtn = (s) => {
    if (s === "Active") return adminBtnSuccess;
    if (s === "Cancelled") return adminBtnDanger;
    return { ...adminBtnGhost, color: "#C2410C", border: "1px solid #C2410C" };
  };

  return (
    <div style={adminPage}>
      <div style={adminCard}>
        <div style={adminTitle}>Voyage State</div>

        <form onSubmit={handleSearch} style={adminSearchBar}>
          <input
            type="number"
            placeholder="Voyage ID"
            value={voyageId}
            onChange={(e) => setVoyageId(e.target.value)}
            style={adminIdInput}
          />
          <button type="submit" style={adminBtnPrimary}>Load</button>
        </form>

        {isLoading && <p style={{ color: "#64748b", fontSize: "0.88rem" }}>Loading…</p>}
        {isError && <p style={{ color: "#DC2626", fontSize: "0.88rem" }}>Voyage not found.</p>}
      </div>

      {data && (
        <>
          {/* Header card with image */}
          <div style={{ ...adminCard, padding: 0, overflow: "hidden" }}>
            {data.profileImageThumbnail && (
              <img
                src={data.profileImageThumbnail}
                alt={data.name}
                style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
              />
            )}
            <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e3a5f" }}>{data.name}</div>
                <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 2 }}>
                  ID: {data.id} · {data.publicId}
                </div>
              </div>
              <span style={{
                backgroundColor: stateColor[data.voyageState] ?? "#6b7280",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "4px 14px",
                borderRadius: "999px",
              }}>
                {data.voyageState ?? "Active"}
              </span>
            </div>
          </div>

          {/* Details card */}
          <div style={adminCard}>
            <div style={{ ...adminTitle, fontSize: "0.85rem" }}>Details</div>
            <Row label="Owner" value={data.user?.userName} />
            <Row label="Owner ID" value={data.userId} />
            <Row label="Brief" value={data.brief} />
            <Row label="Vacancy" value={data.vacancy} />
            <Row label="Bids" value={`${data.bidCount} total · ${data.acceptedBidCount} accepted`} />
            <Row label="Start date" value={data.startDate ? new Date(data.startDate).toLocaleDateString() : null} />
            <Row label="End date" value={data.endDate ? new Date(data.endDate).toLocaleDateString() : null} />
            <Row label="Last bid date" value={data.lastBidDate ? new Date(data.lastBidDate).toLocaleDateString() : null} />
            <Row
              label="Price"
              value={
                data.fixedPrice
                  ? `${data.minPrice} ${data.currency} (fixed)`
                  : `${data.minPrice}–${data.maxPrice} ${data.currency}`
              }
            />
            <Row label="Vehicle" value={data.vehicle?.name ?? (data.vehicleId ? `ID ${data.vehicleId}` : null)} />
            <Row label="Confirmed" value={data.confirmed ? "Yes" : "No"} />
            <Row label="Public on map" value={data.publicOnMap ? "Yes" : "No"} />
            {data.isOwnerDeleted && <Row label="Owner deleted" value="Yes" color="#DC2626" />}
          </div>

          {/* State control card */}
          <div style={adminCard}>
            <div style={{ ...adminTitle, fontSize: "0.85rem" }}>Set State</div>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {STATE_OPTIONS.map((s) => {
                const isCurrent = (data.voyageState ?? "Active") === s;
                return (
                  <button
                    key={s}
                    disabled={isCurrent || loadingState !== null}
                    onClick={() => handleSetState(s)}
                    style={{
                      ...stateBtn(s),
                      opacity: isCurrent ? 0.45 : loadingState === s ? 0.6 : 1,
                      cursor: isCurrent ? "default" : "pointer",
                    }}
                  >
                    {loadingState === s ? "Saving…" : s}
                  </button>
                );
              })}
            </div>
            {feedback && (
              <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", fontWeight: 600, color: feedback.ok ? "#16a34a" : "#DC2626" }}>
                {feedback.msg}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
