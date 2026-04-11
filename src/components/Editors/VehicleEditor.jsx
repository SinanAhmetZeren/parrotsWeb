/* eslint-disable no-undef */
import { useState } from "react";
import { SomethingWentWrong } from "../SomethingWentWrong";
import { useHealthCheckQuery } from "../../slices/HealthSlice";
import { useLazyGetVehicleByIdAdminQuery, usePatchVehicleAdminMutation } from "../../slices/VehicleSlice";
import {
  adminPage, adminCard, adminTitle, adminRow, adminLabel, adminInput,
  adminTextarea, adminBtnPrimary, adminBtnSecondary, adminBoolBtn,
  adminSearchBar, adminIdInput,
} from "../../styles/adminStyles";

export function VehicleEditor() {
  const [vehicleId, setVehicleId] = useState(0);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [honeyPotValue, setHoneyPotValue] = useState("");

  const [patchVehicleAdmin] = usePatchVehicleAdminMutation();
  const [triggerGetVehicleById] = useLazyGetVehicleByIdAdminQuery();

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
  };

  const fetchVehicle = async () => {
    if (!vehicleId) return;
    setLoading(true);
    try {
      const response = await triggerGetVehicleById(vehicleId);
      setVehicle(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePatchVehicle = async () => {
    if (honeyPotValue) { console.warn("Bot detected"); return; }
    if (!vehicle?.id) return;
    setSaving(true);
    const patchDoc = [
      { op: "replace", path: "/name", value: vehicle.name },
      { op: "replace", path: "/capacity", value: vehicle.capacity },
      { op: "replace", path: "/description", value: vehicle.description },
      { op: "replace", path: "/userId", value: vehicle.userId },
      { op: "replace", path: "/createdAt", value: vehicle.createdAt },
      { op: "replace", path: "/confirmed", value: vehicle.confirmed },
      { op: "replace", path: "/isDeleted", value: vehicle.isDeleted },
    ].filter(item => item.value !== undefined && (item.value !== null || Array.isArray(item.value)));

    try {
      const response = await patchVehicleAdmin({ patchDoc, vehicleId: vehicle.id });
      if (!response.data.success) alert("Vehicle update failed");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => setVehicle({ ...vehicle, [field]: value });
  const v = vehicle || {};

  return (
    <div style={adminPage}>
      <input type="text" value={honeyPotValue} onChange={e => setHoneyPotValue(e.target.value)} style={{ display: "none" }} />

      <div style={adminCard}>
        <div style={adminTitle}>Vehicle Editor</div>

        <div style={adminSearchBar}>
          <input
            type="number"
            placeholder="Vehicle ID"
            value={vehicleId}
            onChange={e => setVehicleId(e.target.value)}
            style={adminIdInput}
          />
          <button onClick={fetchVehicle} style={adminBtnSecondary}>
            {loading ? "Loading..." : "Fetch"}
          </button>
          <button
            onClick={handlePatchVehicle}
            disabled={!vehicle || saving}
            style={{ ...adminBtnPrimary, opacity: !vehicle || saving ? 0.5 : 1, cursor: !vehicle ? "not-allowed" : "pointer" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {vehicle && (
          <>
            {[
              { label: "Name", field: "name", type: "text" },
              { label: "Capacity", field: "capacity", type: "number" },
              { label: "User ID", field: "userId", type: "text" },
            ].map(({ label, field, type }) => (
              <div style={adminRow} key={field}>
                <div style={adminLabel}>{label}</div>
                <input type={type} value={v[field] ?? ""} onChange={e => handleChange(field, e.target.value)} style={adminInput} />
              </div>
            ))}

            <div style={adminRow}>
              <div style={adminLabel}>Description</div>
              <textarea value={v.description ?? ""} onChange={e => handleChange("description", e.target.value)} style={adminTextarea} />
            </div>

            <div style={adminRow}>
              <div style={adminLabel}>Created At</div>
              <input
                type="text"
                value={v.createdAt ? new Date(v.createdAt).toLocaleString() : ""}
                disabled
                style={{ ...adminInput, backgroundColor: "#f1f5f9", color: "#64748b" }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <button onClick={() => handleChange("confirmed", !v.confirmed)} style={adminBoolBtn(v.confirmed)}>
                confirmed: {v.confirmed ? "true" : "false"}
              </button>
              <button onClick={() => handleChange("isDeleted", !v.isDeleted)} style={adminBoolBtn(!v.isDeleted)}>
                isDeleted: {v.isDeleted ? "true" : "false"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
