/* eslint-disable no-undef */
import { useState } from "react";
import { SomethingWentWrong } from "../SomethingWentWrong";
import { useHealthCheckQuery } from "../../slices/HealthSlice";
import { usePatchVoyageAdminMutation, useLazyGetVoyageByIdAdminQuery } from "../../slices/VoyageSlice";
import {
  adminPage, adminCard, adminTitle, adminRow, adminLabel, adminInput,
  adminTextarea, adminBtnPrimary, adminBtnSecondary, adminBoolBtn,
  adminSearchBar, adminIdInput, adminInputDisabled,
} from "../../styles/adminStyles";

export function VoyageEditor() {
  const [voyageId, setVoyageId] = useState("");
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [honeyPotValue, setHoneyPotValue] = useState("");

  const [patchVoyage] = usePatchVoyageAdminMutation();
  const [triggerGetVoyageByIdAdmin] = useLazyGetVoyageByIdAdminQuery();

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;

  const fetchVoyage = async () => {
    if (!voyageId) return;
    setLoading(true);
    try {
      const response = await triggerGetVoyageByIdAdmin(voyageId);
      setVoyage(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePatchVoyage = async () => {
    if (honeyPotValue) { console.warn("Bot detected"); return; }
    if (!voyageId) return;
    setSaving(true);
    const patchDoc = [
      { op: "replace", path: "/name", value: voyage.name },
      { op: "replace", path: "/brief", value: voyage.brief },
      { op: "replace", path: "/description", value: voyage.description },
      { op: "replace", path: "/vacancy", value: voyage.vacancy },
      { op: "replace", path: "/startDate", value: voyage.startDate },
      { op: "replace", path: "/endDate", value: voyage.endDate },
      { op: "replace", path: "/lastBidDate", value: voyage.lastBidDate },
      { op: "replace", path: "/minPrice", value: voyage.minPrice },
      { op: "replace", path: "/maxPrice", value: voyage.maxPrice },
      { op: "replace", path: "/currency", value: voyage.currency },
      { op: "replace", path: "/fixedPrice", value: voyage.fixedPrice },
      { op: "replace", path: "/auction", value: voyage.auction },
      { op: "replace", path: "/publicOnMap", value: voyage.publicOnMap },
      { op: "replace", path: "/isDeleted", value: voyage.isDeleted },
    ].filter(item => item.value !== undefined && (item.value !== null || Array.isArray(item.value)));

    try {
      const response = await patchVoyage({ patchDoc, voyageId: voyage.id });
      if (!response.data.success) alert("Failed to update voyage.");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => setVoyage({ ...voyage, [field]: value });

  const v = voyage || {};

  return (
    <div style={adminPage}>
      <input type="text" value={honeyPotValue} onChange={e => setHoneyPotValue(e.target.value)} style={{ display: "none" }} autoComplete="off" />

      <div style={adminCard}>
        <div style={adminTitle}>Voyage Editor</div>

        {/* Search bar */}
        <div style={adminSearchBar}>
          <input
            type="number"
            placeholder="Voyage ID"
            value={voyageId}
            onChange={e => setVoyageId(e.target.value)}
            style={adminIdInput}
          />
          <button onClick={fetchVoyage} style={adminBtnSecondary}>
            {loading ? "Loading..." : "Fetch"}
          </button>
          <button
            onClick={handlePatchVoyage}
            disabled={!voyage || saving}
            style={{ ...adminBtnPrimary, opacity: !voyage || saving ? 0.5 : 1, cursor: !voyage ? "not-allowed" : "pointer" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {voyage && (
          <>
            {/* Text fields */}
            {[
              { label: "Name", field: "name", type: "text" },
              { label: "Vacancy", field: "vacancy", type: "number" },
            ].map(({ label, field, type }) => (
              <div style={adminRow} key={field}>
                <div style={adminLabel}>{label}</div>
                <input type={type} value={v[field] ?? ""} onChange={e => handleChange(field, e.target.value)} style={adminInput} />
              </div>
            ))}

            <div style={adminRow}>
              <div style={adminLabel}>Brief</div>
              <textarea value={v.brief ?? ""} onChange={e => handleChange("brief", e.target.value)} style={adminTextarea} />
            </div>
            <div style={adminRow}>
              <div style={adminLabel}>Description</div>
              <textarea value={v.description ?? ""} onChange={e => handleChange("description", e.target.value)} style={{ ...adminTextarea, minHeight: "6rem" }} />
            </div>

            {/* Dates */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
              {[["Start Date", "startDate"], ["End Date", "endDate"], ["Last Bid", "lastBidDate"]].map(([label, field]) => (
                <div key={field} style={{ flex: 1, minWidth: "180px" }}>
                  <div style={adminLabel}>{label}</div>
                  <input
                    type="datetime-local"
                    value={v[field] ? new Date(v[field]).toISOString().slice(0, 16) : ""}
                    onChange={e => handleChange(field, e.target.value)}
                    style={adminInput}
                  />
                </div>
              ))}
            </div>

            {/* Prices */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
              {[["Min Price", "minPrice", "number"], ["Max Price", "maxPrice", "number"], ["Currency", "currency", "text"]].map(([label, field, type]) => (
                <div key={field} style={{ flex: 1, minWidth: "120px" }}>
                  <div style={adminLabel}>{label}</div>
                  <input type={type} value={v[field] ?? ""} onChange={e => handleChange(field, e.target.value)} style={adminInput} />
                </div>
              ))}
            </div>

            {/* Vehicle (read-only) */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem" }}>
              {[["Vehicle Name", v.vehicle?.name], ["Vehicle ID", v.vehicle?.id]].map(([label, val]) => (
                <div key={label} style={{ flex: 1 }}>
                  <div style={adminLabel}>{label}</div>
                  <input value={val ?? ""} disabled style={adminInputDisabled} />
                </div>
              ))}
            </div>

            {/* Booleans */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              {["fixedPrice", "auction", "publicOnMap", "confirmed", "isDeleted"].map(field => (
                <button key={field} onClick={() => handleChange(field, !v[field])} style={adminBoolBtn(v[field])}>
                  {field}: {v[field] ? "true" : "false"}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
