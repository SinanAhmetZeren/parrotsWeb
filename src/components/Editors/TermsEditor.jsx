import { useState, useEffect } from "react";
import {
  useGetCurrentTermsAdminQuery,
  useUpdateTermsAdminMutation,
} from "../../slices/TermsSlice";
import { adminCard, adminTitle, adminLabel, adminInput, adminBtnPrimary } from "../../styles/adminStyles";

export function TermsEditor() {
  const [version, setVersion] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: current, isLoading } = useGetCurrentTermsAdminQuery();
  const [updateTerms, { isLoading: isUpdating, error }] = useUpdateTermsAdminMutation();

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
    } catch { }
  };

  const disabled = isUpdating || !version.trim() || !content.trim();

  return (
    <div style={{ padding: "1.5rem", maxWidth: 800, fontFamily: "sans-serif", margin: "0 auto", width: "100%" }}>
      <div style={adminCard}>
        <div style={adminTitle}>Terms of Use</div>

        {/* Warning */}
        <div style={{
          backgroundColor: "#fffbeb",
          border: "1px solid #fcd34d",
          borderRadius: "8px",
          padding: "0.65rem 1rem",
          fontSize: "0.95rem",
          color: "#92400e",
          marginBottom: "1.25rem",
        }}>
          ⚠ Saving creates a new terms version and immediately requires all users to re-accept on next login. The version name must be unique — reusing an existing name will be rejected.
        </div>

        {/* Current version info */}
        <div style={{ marginBottom: "1.25rem", fontSize: "0.88rem", color: "#475569" }}>
          {isLoading ? "Loading..." : current ? (
            <>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>Current version: </span>
              <span style={{ color: "#0a77ea", fontWeight: 600 }}>{current.version}</span>
              <span style={{ margin: "0 0.5rem", color: "#cbd5e1" }}>|</span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>Published: </span>
              {new Date(current.publishedAt).toLocaleDateString()}
            </>
          ) : "No version found in database."}
        </div>

        {/* Version input */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ ...adminLabel, display: "block", marginBottom: "0.3rem" }}>
            New Version Name
          </label>
          <input
            type="text"
            placeholder="e.g. 2026-08"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={{ ...adminInput, maxWidth: 240 }}
          />
        </div>

        {/* Content textarea */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ ...adminLabel, display: "block", marginBottom: "0.3rem" }}>
            Terms Content
          </label>
          <textarea
            placeholder="Paste the full terms of use text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            style={{
              ...adminInput,
              width: "100%",
              minHeight: "55vh",
              resize: "vertical",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              lineHeight: "1.6",
              boxSizing: "border-box",
            }}
          />
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.25rem", textAlign: "right" }}>
            {content.length.toLocaleString()} characters
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => setPreviewOpen(true)}
            disabled={!content.trim()}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "white",
              color: "#334155",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: !content.trim() ? "not-allowed" : "pointer",
              opacity: !content.trim() ? 0.45 : 1,
            }}
          >
            Preview Terms Of Use
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={disabled}
            style={{ ...adminBtnPrimary, opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
          >
            Publish Terms Of Use
          </button>
          {submitted && <span style={{ fontSize: "0.78rem", color: "#16a34a" }}>✓ Published successfully.</span>}
          {error && <span style={{ fontSize: "0.78rem", color: "#dc2626" }}>{error?.data || "Failed to update."}</span>}
        </div>
      </div>

      {/* Confirm Publish Modal */}
      {confirmOpen && (
        <div
          onClick={() => setConfirmOpen(false)}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "min(440px, 90vw)",
              padding: "2rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
              Publish Terms of Use?
            </div>
            <div style={{ fontSize: "0.88rem", color: "#475569", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              This will publish version <strong>{version}</strong> and immediately require all users to re-accept on next login.
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setConfirmOpen(false)}
                style={{ padding: "0.4rem 1rem", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "white", color: "#334155", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={async () => { setConfirmOpen(false); await handleSubmit(); }}
                style={{ ...adminBtnPrimary, cursor: "pointer" }}
              >
                {isUpdating ? "Publishing..." : "Yes, Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <div
          onClick={() => setPreviewOpen(false)}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "min(700px, 90vw)",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem" }}>Terms of Use</span>
                {version && (
                  <span style={{ marginLeft: "0.75rem", fontSize: "0.8rem", color: "#0a77ea", fontWeight: 600 }}>
                    v{version}
                  </span>
                )}
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#64748b", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <iframe
              srcDoc={content}
              title="Terms of Use Preview"
              style={{ flex: 1, border: "none", width: "100%", height: "70vh", minHeight: "50rem", paddingBottom: "8rem" }}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
}
