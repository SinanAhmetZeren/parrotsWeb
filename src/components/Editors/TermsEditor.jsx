import { useState, useEffect } from "react";
import { parrotBlue, parrotDarkBlue } from "../../styles/colors";
import {
  useGetCurrentTermsAdminQuery,
  useUpdateTermsAdminMutation,
} from "../../slices/TermsSlice";

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
      setVersion("");
      setContent("");
    } catch {}
  };

  return (
    <div style={{ maxWidth: "860px", padding: "1rem" }}>
      <h2 style={{ color: parrotDarkBlue, marginBottom: "1.5rem" }}>
        Terms of Use Editor
      </h2>

      {/* Admin notice */}
      <div style={{
        backgroundColor: "#fffbeb",
        border: "1px solid #f59e0b",
        borderRadius: "8px",
        padding: "0.75rem 1rem",
        marginBottom: "1.25rem",
        fontSize: "0.85rem",
        color: "#92400e",
      }}>
        ⚠ <strong>Note:</strong> This editor updates the database version record only. The terms text displayed to users in the app is hardcoded in the frontend and is not affected by changes made here. Use this to keep the version identifier in sync with any frontend updates you deploy. Publishing a new version name will prompt all users to read and accept the updated terms before continuing.
      </div>

      {/* Current version info */}
      <div
        style={{
          backgroundColor: parrotBlue,
          color: "white",
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          marginBottom: "2rem",
          fontSize: "0.9rem",
        }}
      >
        {isLoading ? (
          "Loading current version..."
        ) : current ? (
          <>
            <strong>Current version:</strong> {current.version} &nbsp;|&nbsp;
            <strong>Published:</strong>{" "}
            {new Date(current.publishedAt).toLocaleDateString()}
          </>
        ) : (
          "No terms version found in database."
        )}
      </div>

      {/* Version name */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: parrotDarkBlue,
            fontWeight: 700,
            marginBottom: "0.4rem",
          }}
        >
          New Version Name
        </label>
        <input
          type="text"
          placeholder="e.g. 2026-04"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            color: parrotDarkBlue,
            fontWeight: 600,
          }}
        />
      </div>

      {/* Content textarea */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            color: parrotDarkBlue,
            fontWeight: 700,
            marginBottom: "0.4rem",
          }}
        >
          Terms Content
        </label>
        <textarea
          placeholder="Paste the full terms of use text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "0.95rem",
            color: parrotDarkBlue,
            fontWeight: 500,
            resize: "vertical",
            fontFamily: "inherit",
            lineHeight: "1.5",
          }}
        />
        <div
          style={{
            fontSize: "0.8rem",
            color: "#888",
            marginTop: "0.3rem",
            textAlign: "right",
          }}
        >
          {content.length.toLocaleString()} characters
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            color: "#c62828",
            fontWeight: 600,
            marginBottom: "0.75rem",
          }}
        >
          {error?.data || "Failed to update terms."}
        </div>
      )}

      {/* Success */}
      {submitted && (
        <div
          style={{
            color: "#2e7d32",
            fontWeight: 600,
            marginBottom: "0.75rem",
          }}
        >
          ✓ Terms updated successfully.
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isUpdating || !version.trim() || !content.trim()}
        style={{
          backgroundColor:
            isUpdating || !version.trim() || !content.trim()
              ? "#aaa"
              : parrotBlue,
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "0.6rem 2rem",
          fontSize: "1rem",
          fontWeight: 700,
          cursor:
            isUpdating || !version.trim() || !content.trim()
              ? "not-allowed"
              : "pointer",
        }}
      >
        {isUpdating ? "Saving..." : "Publish New Terms Version"}
      </button>
    </div>
  );
}
