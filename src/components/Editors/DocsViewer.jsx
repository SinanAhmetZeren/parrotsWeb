import { useState } from "react";
import { useListDocsQuery, useLazyGetDocQuery, useSaveDocMutation } from "../../slices/DocsSlice";
import { adminBtnPrimary } from "../../styles/adminStyles";

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

const fileLabel = (path) => path.split("/").pop().replace(/\.txt$/i, "");

const sidebarPill = {
  display: "block",
  width: "calc(100% - 1rem)",
  margin: "0 0.5rem 2px",
  textAlign: "left",
  padding: "0.3rem 0.75rem",
  border: "none",
  borderRadius: "999px",
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "background 0.1s, color 0.1s",
};

export function DocsViewer() {
  const { data: files, isLoading: filesLoading } = useListDocsQuery();
  const [triggerGet, { isFetching: docFetching }] = useLazyGetDocQuery();
  const [saveDoc, { isLoading: saving }] = useSaveDocMutation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelect = async (filePath) => {
    setSelectedFile(filePath);
    setSelectedImage(null);
    setSavedMsg("");
    const result = await triggerGet(filePath);
    if (result.data) {
      setContent(result.data.content);
      setOriginalContent(result.data.content);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    await saveDoc({ filePath: selectedFile, content });
    setOriginalContent(content);
    setSavedMsg("Saved.");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const groups = groupFiles(files || []);
  const totalCount = (files || []).length;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 100px)", gap: 0, margin: "-1.5rem" }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{
        width: "240px",
        minWidth: "240px",
        backgroundColor: "#0f1f35",
        overflowY: "auto",
        padding: "1rem 0",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}>
        {filesLoading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", padding: "0 1rem" }}>Loading...</div>
        ) : (
          <>
            {GROUP_ORDER.filter(dir => groups[dir]).map(dir => (
              <div key={dir}>
                <div style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "white",
                  padding: "0 1rem",
                  marginBottom: "0.4rem",
                }}>
                  {GROUP_LABELS[dir] || dir}
                  {dir === "docs" && (
                    <span style={{ marginLeft: "0.4rem", color: "rgba(255,255,255,0.3)" }}>· {totalCount}</span>
                  )}
                </div>
                {groups[dir].map(f => (
                  <button
                    key={f}
                    onClick={() => handleSelect(f)}
                    style={{
                      ...sidebarPill,
                      background: selectedFile === f ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                      color: selectedFile === f ? "white" : "rgba(255,255,255,0.65)",
                      fontWeight: selectedFile === f ? 600 : 400,
                    }}
                  >
                    {fileLabel(f)}
                  </button>
                ))}
              </div>
            ))}

            {/* Personas */}
            <div>
              <div style={{
                fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "white",
                padding: "0 1rem", marginBottom: "0.4rem",
              }}>
                Personas
              </div>
              {PERSONA_IMAGES.map(({ file, label }) => (
                <button
                  key={file}
                  onClick={() => { setSelectedImage(file); setSelectedFile(null); }}
                  style={{
                    ...sidebarPill,
                    background: selectedImage === file ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                    color: selectedImage === file ? "white" : "rgba(255,255,255,0.65)",
                    fontWeight: selectedImage === file ? 600 : 400,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── RIGHT CONTENT ── */}
      <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", backgroundColor: "#f0ece6" }}>
        {selectedImage ? (
          <div style={{
            backgroundColor: "white",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            padding: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <img
              src={`${BASE_URL}/${selectedImage}`}
              alt={selectedImage}
              style={{ maxWidth: "100%", borderRadius: "8px", objectFit: "contain" }}
            />
          </div>
        ) : selectedFile ? (
          <div style={{
            backgroundColor: "white",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            padding: "1.25rem 1.5rem",
          }}>
            {/* Card header */}
            <div style={{
              fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.07em", color: "#94a3b8", marginBottom: "0.4rem",
            }}>
              Project · Docs
            </div>
            <div style={{
              fontSize: "1.2rem", fontWeight: 700, color: "#0f172a",
              marginBottom: "1.25rem", paddingBottom: "0.75rem",
              borderBottom: "1px solid #e2e8f0",
            }}>
              {fileLabel(selectedFile)}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
              <button
                onClick={handleSave}
                disabled={saving || docFetching || content === originalContent}
                style={{ ...adminBtnPrimary, opacity: (saving || docFetching || content === originalContent) ? 0.45 : 1, cursor: content === originalContent ? "not-allowed" : "pointer" }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              {savedMsg && <span style={{ fontSize: "0.78rem", color: "#16a34a" }}>{savedMsg}</span>}
            </div>

            {/* Content */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={docFetching}
              spellCheck={false}
              style={{
                width: "100%",
                minHeight: "65vh",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                lineHeight: "1.6",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "0.75rem 1rem",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
                color: "#1e3a5f",
                backgroundColor: "#f8fafc",
              }}
            />
          </div>
        ) : (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "60%", gap: "0.5rem",
          }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>No note selected</div>
            <div style={{ fontSize: "0.88rem", color: "#94a3b8" }}>
              Pick one of the {totalCount} dev notes on the left.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
