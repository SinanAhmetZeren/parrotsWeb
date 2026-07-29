import { useState } from "react";
import { useListDocsQuery, useLazyGetDocQuery, useSaveDocMutation } from "../../slices/DocsSlice";
import { adminBtnPrimary } from "../../styles/adminStyles";
import { parrotDarkerBlue } from "../../styles/colors";

function renderPreview(content, isTerms = false) {
  const lines = content.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const next = lines[i + 1] || "";
    if (next.match(/^={3,}$/)) {
      elements.push(<h1 key={i} style={{ color: "#f97316", fontSize: "2rem", fontWeight: 800, margin: "1.5rem 0 0.25rem", borderBottom: "2px solid rgba(255,165,0,0.3)", paddingBottom: "0.3rem", textAlign: "center" }}>{line}</h1>);
      i += 2; continue;
    }
    if (next.match(/^-{3,}$/)) {
      elements.push(<h2 key={i} style={{ color: "#FFB800", fontSize: "1.4rem", fontWeight: 700, margin: "1.2rem 0 0.2rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>{line}</h2>);
      i += 2; continue;
    }
    if (line.match(/^={3,}$/) || line.match(/^-{3,}$/)) {
      elements.push(<hr key={i} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.5rem 0" }} />);
      i++; continue;
    }
    if (line.match(/^\d+\.\s/)) {
      elements.push(<p key={i} style={{ color: "#f97316", margin: "1rem 0 0.2rem", fontSize: "1.2rem", fontWeight: 700, textAlign: "left" }}>{line}</p>);
      i++; continue;
    }
    if (line.match(/^[-*]\s/)) {
      elements.push(<p key={i} style={{ color: "#cbd5e1", margin: "0.2rem 0", paddingLeft: "1rem", fontSize: "1rem", textAlign: "left" }}>{"• " + line.slice(2)}</p>);
      i++; continue;
    }
    if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "0.5rem" }} />);
      i++; continue;
    }
    elements.push(<p key={i} style={{ color: "#e2e8f0", margin: "0.15rem 0", lineHeight: "1.7", fontSize: "1rem", textAlign: "left" }}>{line}</p>);
    i++;
  }
  return elements;
}

const GROUP_LABELS = {
  "docs": "Dev Notes",
  "docs/parrotsId": "Product",
  "docs/termsOfUse": "Terms of Use",
  "docs/socialMedia": "Social Media",
};

const GROUP_ORDER = ["docs", "docs/termsOfUse", "docs/parrotsId", "docs/socialMedia"];

const BASE_URL = "https://nbg1.your-objectstorage.com/parrotsstorage/docs/personas";

const PERSONA_IMAGES = [
  { file: "00-title-persona-journeys.jpg", label: "Title Slide" },
  { file: "boat-or-vehicle-owner-rent-out-vehicle.jpg", label: "Boat / Vehicle Owner" },
  { file: "boat-broker-rent-captains-boats-commissions.jpg", label: "Boat Broker" },
  { file: "car-enthusiast-showcase-car-to-friends.jpg", label: "Car Enthusiast" },
  { file: "visiting-tourist-find-nearby-tours.jpg", label: "Visiting Tourist" },
  { file: "group-of-friends-attend-tour-guide-event.jpg", label: "Group of Friends" },
  { file: "social-good-organizer-raise-money-fundraiser.jpg", label: "Social Good Organizer" },
  { file: "motorcycle-club-wild-west-tour.jpg", label: "Motorcycle Club" },
  { file: "restaurant-owner-advertise-to-tourists.jpg", label: "Restaurant Owner" },
];

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
  const [preview, setPreview] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelect = async (filePath) => {
    setSelectedFile(filePath);
    setSelectedImage(null);
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
        width: "15rem",
        minWidth: "15rem",
        padding: "0.75rem 0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        // backgroundColor: parrotDarkerBlue,
        backgroundColor: "#0d3d2b",
        height: "92vh",
        overflowY: "auto",
      }}>
        {filesLoading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", padding: "0.5rem" }}>Loading...</div>
        ) : (
          GROUP_ORDER.filter(dir => groups[dir]).map(dir => [dir, groups[dir]]).map(([dir, dirFiles]) => (
            <div key={dir}>
              <div style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: "rgba(255,255,255,1)",
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

        {/* Personas section */}
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,1)", padding: "0 0.5rem", marginBottom: "0.35rem" }}>
            Personas images
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {PERSONA_IMAGES.map(({ file, label }) => (
              <button
                key={file}
                onClick={() => { setSelectedImage(file); setSelectedFile(null); }}
                style={{
                  textAlign: "left",
                  padding: "0.35rem 0.6rem",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: selectedImage === file ? 700 : 500,
                  cursor: "pointer",
                  backgroundColor: selectedImage === file ? "rgba(255,255,255,0.15)" : "transparent",
                  color: selectedImage === file ? "white" : "rgba(255,255,255,0.7)",
                  transition: "background 0.1s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column" }}>
        {selectedImage ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a", borderRadius: "8px", padding: "1rem", overflowY: "auto" }}>
            <img src={`${BASE_URL}/${selectedImage}`} alt={selectedImage} key={selectedImage} style={{ maxWidth: "100%", maxHeight: "85vh", borderRadius: "8px", objectFit: "contain" }} />
          </div>
        ) : selectedFile ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{selectedFile}</span>
              <button
                onClick={() => setPreview(p => !p)}
                style={{ ...adminBtnPrimary, backgroundColor: preview ? "#334155" : "#1e40af" }}
              >
                {preview ? "Edit" : "Preview"}
              </button>
              {!preview && (
                <button onClick={handleSave} style={adminBtnPrimary} disabled={saving || docFetching}>
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
              {savedMsg && <span style={{ fontSize: "0.78rem", color: "#4ade80" }}>{savedMsg}</span>}
            </div>
            {preview ? (
              <div style={{
                flex: 1,
                minHeight: "80vh",
                backgroundColor: "#0f172a",
                borderRadius: "8px",
                padding: "1.25rem 1.5rem",
                overflowY: "auto",
                fontFamily: "system-ui, sans-serif",
                fontSize: "1rem",
              }}>
                <div style={{ width: selectedFile?.includes("termsOfUse") ? "70%" : "100%", margin: "0 auto" }}>
                  {renderPreview(content, selectedFile?.includes("termsOfUse"))}
                </div>
              </div>
            ) : (
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
            )}
          </>
        ) : (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", marginTop: "2rem" }}>
            Select a file or persona to view.
          </div>
        )}
      </div>

    </div>
  );
}
