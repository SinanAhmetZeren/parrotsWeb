import { useState } from "react";
import { useListDocsQuery, useLazyGetDocQuery, useSaveDocMutation } from "../../slices/DocsSlice";
import { adminBtnPrimary } from "../../styles/adminStyles";
import { parrotDarkerBlue } from "../../styles/colors";

const GROUP_LABELS = {
  "docs": "Docs",
  "docs/parrotsId": "Parrots ID",
  "docs/termsOfUse": "Terms of Use",
};

function groupFiles(files) {
  const groups = {};
  for (const f of files) {
    const parts = f.split("/");
    const dir = parts.slice(0, -1).join("/");
    if (!groups[dir]) groups[dir] = [];
    groups[dir].push(f);
  }
  return groups;
}

export function DocsViewer() {
  const { data: files, isLoading: filesLoading } = useListDocsQuery();
  const [triggerGet, { isFetching: docFetching }] = useLazyGetDocQuery();
  const [saveDoc, { isLoading: saving }] = useSaveDocMutation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const handleSelect = async (filePath) => {
    setSelectedFile(filePath);
    setSavedMsg("");
    const result = await triggerGet(filePath);
    if (result.data) setContent(result.data.content);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    await saveDoc({ filePath: selectedFile, content });
    setSavedMsg("Saved.");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const label = (path) => path.split("/").pop().replace(/\.txt$/i, "");

  const groups = groupFiles(files || []);

  return (
    <div style={{ display: "flex", height: "100%", gap: 0 }}>

      {/* Left sidebar */}
      <div style={{
        width: "13rem",
        minWidth: "13rem",
        padding: "0.75rem 0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        borderRight: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: parrotDarkerBlue,
        height: "88vh",
        overflowY: "auto",
      }}>
        {filesLoading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", padding: "0.5rem" }}>Loading...</div>
        ) : (
          Object.entries(groups).map(([dir, dirFiles]) => (
            <div key={dir}>
              <div style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "rgba(255,255,255,0.5)",
                padding: "0 0.5rem",
                marginBottom: "0.35rem",
              }}>
                {GROUP_LABELS[dir] || dir}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {dirFiles.map((f) => (
                  <button
                    key={f}
                    onClick={() => handleSelect(f)}
                    style={{
                      textAlign: "left",
                      padding: "0.35rem 0.6rem",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: selectedFile === f ? 700 : 500,
                      cursor: "pointer",
                      backgroundColor: selectedFile === f ? "rgba(255,255,255,0.15)" : "transparent",
                      color: selectedFile === f ? "white" : "rgba(255,255,255,0.7)",
                      transition: "background 0.1s",
                    }}
                  >
                    {label(f)}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column" }}>
        {selectedFile ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{selectedFile}</span>
              <button onClick={handleSave} style={adminBtnPrimary} disabled={saving || docFetching}>
                {saving ? "Saving..." : "Save"}
              </button>
              {savedMsg && <span style={{ fontSize: "0.78rem", color: "#4ade80" }}>{savedMsg}</span>}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={docFetching}
              spellCheck={false}
              style={{
                flex: 1,
                minHeight: "80vh",
                backgroundColor: "#0f172a",
                color: "#e2e8f0",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                lineHeight: "1.6",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </>
        ) : (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", marginTop: "2rem" }}>
            Select a file to view or edit.
          </div>
        )}
      </div>

    </div>
  );
}
