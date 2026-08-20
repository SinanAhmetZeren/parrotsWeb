import React, { useState, useEffect } from "react";
import { adminCard, adminTitle, adminBtnPrimary } from "../../styles/adminStyles";
import { useGetMinVersionQuery, useUpdateMinVersionMutation } from "../../slices/MetricsSlice";

const VERSION_RE = /^\d+\.\d+\.\d+$/;

export function MobileVersionEditor() {
  const { data, isLoading, refetch } = useGetMinVersionQuery();
  const [updateMinVersion, { isLoading: isSaving }] = useUpdateMinVersionMutation();
  const [value, setValue] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setValue(data.minVersion ?? "");
    }
  }, [data]);

  const isValid = VERSION_RE.test(value);
  const inputInvalid = value.length > 0 && !isValid;

  const handleSave = async () => {
    if (!isValid) return;
    await updateMinVersion({ version: value, forceUpdate });
    setSaved(true);
    refetch();
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) return <div style={{ padding: "2rem", color: "#64748b" }}>Loading…</div>;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: 560, textAlign: "left" }}>
      <div style={adminCard}>
        <div style={adminTitle}>Mobile Min Version</div>

        <div style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.6rem" }}>
            How to release a new version
          </p>
          <ol style={{ fontSize: "0.88rem", color: "#0f172a", paddingLeft: "1.2rem", lineHeight: 2, margin: 0 }}>
            <li>Bump <code>version</code> in <code>app.config.js</code></li>
            <li>Bump <code>versionCode</code> and <code>versionName</code> in <code>android/app/build.gradle</code></li>
            <li>EAS build → submit to Play Store / App Store</li>
            <li>When ready to force update — set the new version below and Save</li>
          </ol>
        </div>

        <p style={{ fontSize: "0.88rem", color: "#0f172a", marginBottom: "1rem" }}>
          Mobile app versions below the min version will be prompted to update.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.4rem" }}>
          <input
            value={value}
            onChange={e => { setValue(e.target.value); setSaved(false); }}
            placeholder="e.g. 1.0.25"
            style={{
              border: `1px solid ${inputInvalid ? "#ef4444" : "#e2e8f0"}`,
              borderRadius: 8, padding: "0 10px",
              fontSize: "0.85rem", color: "#0f172a", height: 32,
              boxSizing: "border-box", outline: "none", width: 140,
            }}
          />
          <select
            value={forceUpdate ? "true" : "false"}
            onChange={e => { setForceUpdate(e.target.value === "true"); setSaved(false); }}
            style={{
              border: "1px solid #e2e8f0", borderRadius: 8, padding: "0 10px",
              fontSize: "0.85rem", color: "#0f172a", height: 32,
              boxSizing: "border-box", outline: "none", width: 140,
              backgroundColor: "white", cursor: "pointer",
            }}
          >
            <option value="false">Soft update</option>
            <option value="true">Force update</option>
          </select>
          <button
            onClick={handleSave}
            disabled={isSaving || !isValid}
            style={{ ...adminBtnPrimary, height: 32, opacity: isSaving || !isValid ? 0.5 : 1 }}
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          {saved && <span style={{ fontSize: "0.8rem", color: "#10b981" }}>Saved</span>}
        </div>

        {inputInvalid && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginBottom: "0.3rem" }}>
            Must be X.Y.Z format with numeric segments only (e.g. 1.0.25)
          </p>
        )}

        <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1rem" }}>
          {forceUpdate ? 'Hides "Not now" — user must update to continue' : 'Shows "Not now" — user can dismiss'}
        </p>

      </div>
    </div>
  );
}
