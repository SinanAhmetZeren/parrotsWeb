import { useState, useEffect } from "react";
import {
  useGetCurrentTermsAdminQuery,
  useUpdateTermsAdminMutation,
} from "../../slices/TermsSlice";
import { adminBtnPrimary } from "../../styles/adminStyles";

export function TermsEditor() {
  const [version, setVersion] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: current, isLoading } = useGetCurrentTermsAdminQuery();
  const [updateTerms, { isLoading: isUpdating, error }] =
    useUpdateTermsAdminMutation();

  useEffect(() => {
    if (current) {
      setVersion(current.version);
      setContent(current.content);
    }
  }, [current]);

  const handleSubmit = async () => {
    if (!version.trim() || !content.trim()) return;
    try {
      await updateTerms({ version: version.trim(), content: content.trim() }).unwrap();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    } catch {}
  };

  const disabled = isUpdating || !version.trim() || !content.trim();

  return (
    <div style={{ padding: "1rem", height: "100%", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      {/* Notice */}
      <div style={{
        backgroundColor: "rgba(245,158,11,0.1)",
        border: "1px solid rgba(245,158,11,0.3)",
        borderRadius: "8px",
        padding: "0.65rem 1rem",
        fontSize: "0.8rem",
        color: "#fbbf24",
      }}>
        ⚠ Updates the database version record only. Changing the version name will prompt all users to re-accept terms.
      </div>

      {/* Current version */}
      <div style={{
        backgroundColor: "#0f172a",
        borderRadius: "8px",
        padding: "0.65rem 1rem",
        fontSize: "0.85rem",
        color: "#94a3b8",
      }}>
        {isLoading ? "Loading..." : current ? (
          <>
            <span style={{ color: "#e2e8f0", fontWeight: 700 }}>Current version:</span>{" "}
            <span style={{ color: "#f97316" }}>{current.version}</span>
            <span style={{ color: "#475569", margin: "0 0.5rem" }}>|</span>
            <span style={{ color: "#e2e8f0", fontWeight: 700 }}>Published:</span>{" "}
            {new Date(current.publishedAt).toLocaleDateString()}
          </>
        ) : "No version found in database."}
      </div>

      {/* Version input */}
      <div>
        <label style={{ display: "block", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
          New Version Name
        </label>
        <input
          type="text"
          placeholder="e.g. 2026-07"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "#0f172a",
            color: "#e2e8f0",
            fontSize: "0.9rem",
            fontWeight: 600,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Content textarea */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <label style={{ display: "block", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>
          Terms Content
        </label>
        <textarea
          placeholder="Paste the full terms of use text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          style={{
            flex: 1,
            minHeight: "60vh",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#0f172a",
            color: "#e2e8f0",
            fontSize: "0.85rem",
            fontWeight: 400,
            resize: "none",
            fontFamily: "monospace",
            lineHeight: "1.6",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.25rem", textAlign: "right" }}>
          {content.length.toLocaleString()} characters
        </div>
      </div>

      {/* Actions row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={handleSubmit}
          disabled={disabled}
          style={{ ...adminBtnPrimary, opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
        >
          {isUpdating ? "Saving..." : "Update Database"}
        </button>
        {submitted && <span style={{ fontSize: "0.78rem", color: "#4ade80" }}>✓ Updated successfully.</span>}
        {error && <span style={{ fontSize: "0.78rem", color: "#f87171" }}>{error?.data || "Failed to update."}</span>}
      </div>
    </div>
  );
}
