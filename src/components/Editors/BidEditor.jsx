/* eslint-disable no-undef */
import { useState } from "react";
import { SomethingWentWrong } from "../SomethingWentWrong";
import { useHealthCheckQuery } from "../../slices/HealthSlice";
import { useLazyGetBidsByUserIdQuery, useLazyGetBidsByVoyageIdQuery, usePatchBidMutation } from "../../slices/VoyageSlice";
import {
  adminPage, adminCard, adminTitle, adminBtnPrimary, adminBtnSecondary,
  adminSearchBar, adminIdInput, adminTable, adminTh, adminTd, adminTdInput,
} from "../../styles/adminStyles";

export function BidEditor() {
  const [voyageId, setVoyageId] = useState("");
  const [bidUserId, setBidUserId] = useState("");
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null);
  const [honeyPotValue, setHoneyPotValue] = useState("");

  const [patchBid] = usePatchBidMutation();
  const [triggerGetBidsByUserId] = useLazyGetBidsByUserIdQuery();
  const [triggerGetBidsByVoyageId] = useLazyGetBidsByVoyageIdQuery();

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;

  const updateBidField = (bidId, field, value) => {
    setBids(prev => prev.map(b =>
      b.id === bidId
        ? { ...b, [field]: field === "offerPrice" || field === "personCount" ? Number(value) : value }
        : b
    ));
  };

  const handleFetchByVoyage = async () => {
    if (!voyageId) return;
    setLoading(true);
    try { const r = await triggerGetBidsByVoyageId(voyageId); console.log("bids:", r.data); setBids(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleFetchByUser = async () => {
    if (!bidUserId) return;
    setLoading(true);
    try { const r = await triggerGetBidsByUserId(bidUserId); console.log("bids:", r.data); setBids(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handlePatchBid = async (bidId) => {
    if (honeyPotValue) { console.warn("Bot detected"); return; }
    if (!bidId) return;
    const bid = bids.find(b => b.id === bidId);
    setSaving(bidId);
    const patchDoc = [
      { op: "replace", path: "/personCount", value: bid.personCount },
      { op: "replace", path: "/message", value: bid.message },
      { op: "replace", path: "/offerPrice", value: bid.offerPrice },
      { op: "replace", path: "/accepted", value: bid.accepted },
    ].filter(item => item.value !== undefined && (item.value !== null || Array.isArray(item.value)));

    try {
      const response = await patchBid({ patchDoc, bidId: bid.id });
      if (!response.data.success) alert("Failed to update bid.");
    } catch (e) { console.error(e); }
    finally { setSaving(null); }
  };

  return (
    <div style={adminPage}>
      <input type="text" value={honeyPotValue} onChange={e => setHoneyPotValue(e.target.value)} style={{ display: "none" }} autoComplete="off" />

      <div style={adminCard}>
        <div style={adminTitle}>Bid Editor</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          <div style={adminSearchBar}>
            <input type="number" placeholder="Voyage ID" value={voyageId} onChange={e => setVoyageId(e.target.value)} style={adminIdInput} />
            <button onClick={handleFetchByVoyage} style={adminBtnSecondary}>
              {loading ? "Loading..." : "Fetch by Voyage"}
            </button>
          </div>
          <div style={adminSearchBar}>
            <input type="text" placeholder="User ID" value={bidUserId} onChange={e => setBidUserId(e.target.value)} style={adminIdInput} />
            <button onClick={handleFetchByUser} style={adminBtnSecondary}>
              {loading ? "Loading..." : "Fetch by User"}
            </button>
          </div>
        </div>

        {bids && bids.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={adminTable}>
              <thead>
                <tr>
                  {["ID", "Accepted", "Offer Price", "Persons", "Message", "User ID", "Username", "Voyage ID", ""].map(h => (
                    <th key={h} style={adminTh}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bids.map(bid => (
                  <tr key={bid.id}>
                    <td style={adminTd}><span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{bid.id}</span></td>
                    <td style={adminTd}>
                      <button
                        onClick={() => updateBidField(bid.id, "accepted", !bid.accepted)}
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: bid.accepted ? "#16a34a" : "#dc2626",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        {bid.accepted ? "✔" : "✖"}
                      </button>
                    </td>
                    <td style={adminTd}>
                      <input type="number" value={bid.offerPrice} onChange={e => updateBidField(bid.id, "offerPrice", e.target.value)} style={{ ...adminTdInput, width: "80px" }} />
                    </td>
                    <td style={adminTd}>
                      <input type="number" value={bid.personCount} onChange={e => updateBidField(bid.id, "personCount", e.target.value)} style={{ ...adminTdInput, width: "60px" }} />
                    </td>
                    <td style={adminTd}>
                      <input type="text" value={bid.message} onChange={e => updateBidField(bid.id, "message", e.target.value)} style={adminTdInput} />
                    </td>
                    <td style={adminTd}><input value={bid.userId ?? ""} disabled style={{ ...adminTdInput, backgroundColor: "#f1f5f9", color: "#94a3b8" }} /></td>
                    <td style={adminTd}><input value={bid.userName ?? ""} disabled style={{ ...adminTdInput, backgroundColor: "#f1f5f9", color: "#94a3b8" }} /></td>
                    <td style={adminTd}><input value={bid.voyageId ?? ""} disabled style={{ ...adminTdInput, backgroundColor: "#f1f5f9", color: "#94a3b8" }} /></td>
                    <td style={adminTd}>
                      <button onClick={() => handlePatchBid(bid.id)} style={adminBtnPrimary}>
                        {saving === bid.id ? "..." : "Save"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No bids loaded.</p>
        )}
      </div>
    </div>
  );
}
