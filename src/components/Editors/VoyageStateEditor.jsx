import React, { useState } from "react";
import { useGetVoyageByIdQuery, useSetVoyageStateMutation } from "../../slices/VoyageSlice";

const STATE_OPTIONS = ["Active", "BidsClosed", "Cancelled"];

const stateColor = {
  Active: "#16a34a",
  BidsClosed: "#C2410C",
  Cancelled: "#DC2626",
};

export function VoyageStateEditor() {
  const [voyageId, setVoyageId] = useState("");
  const [submittedId, setSubmittedId] = useState(null);
  const [setVoyageState] = useSetVoyageStateMutation();
  const [loadingState, setLoadingState] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data, isLoading, isError } = useGetVoyageByIdQuery(submittedId, { skip: !submittedId });

  const handleSearch = (e) => {
    e.preventDefault();
    const id = parseInt(voyageId.trim(), 10);
    if (!isNaN(id)) { setSubmittedId(id); setFeedback(null); }
  };

  const handleSetState = async (state) => {
    setLoadingState(state);
    setFeedback(null);
    try {
      await setVoyageState({ voyageId: submittedId, state }).unwrap();
      setFeedback({ ok: true, msg: `State set to ${state}` });
    } catch {
      setFeedback({ ok: false, msg: "Failed to update state." });
    } finally {
      setLoadingState(null);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>Voyage State</h2>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <input
          type="number"
          placeholder="Voyage ID"
          value={voyageId}
          onChange={(e) => setVoyageId(e.target.value)}
          style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.9rem" }}
        />
        <button
          type="submit"
          style={{ padding: "0.5rem 1.2rem", borderRadius: "6px", backgroundColor: "#0f1f35", color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}
        >
          Load
        </button>
      </form>

      {isLoading && <p>Loading…</p>}
      {isError && <p style={{ color: "red" }}>Voyage not found.</p>}

      {data && (
        <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111" }}>{data.name}</div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: 2 }}>ID: {data.id} · {data.user?.userName}</div>
            </div>
            <span style={{ backgroundColor: stateColor[data.voyageState] ?? "#6b7280", color: "white", fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "999px" }}>
              {data.voyageState ?? "Active"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {STATE_OPTIONS.map((s) => {
              const isCurrent = (data.voyageState ?? "Active") === s;
              return (
                <button
                  key={s}
                  disabled={isCurrent || loadingState !== null}
                  onClick={() => handleSetState(s)}
                  style={{
                    padding: "0.45rem 1.1rem",
                    borderRadius: "999px",
                    border: `1.5px solid ${stateColor[s]}`,
                    backgroundColor: isCurrent ? stateColor[s] : "white",
                    color: isCurrent ? "white" : stateColor[s],
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    cursor: isCurrent ? "default" : "pointer",
                    opacity: loadingState === s ? 0.6 : 1,
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
      )}
    </div>
  );
}
