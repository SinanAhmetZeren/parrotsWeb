import React, { useEffect, useState } from "react";

const BUCKET_URL = "https://parrotsstorage.nbg1.your-objectstorage.com/ParrotsProjectImages";

export function ParrotsImages() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BUCKET_URL}?list-type=2`)
      .then((res) => res.text())
      .then((xml) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "application/xml");
        const keys = [...doc.querySelectorAll("Key")].map((k) => k.textContent);
        setImages(keys.sort());
      })
      .catch(() => setError("Failed to load images."));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "white", marginBottom: "1.5rem" }}>Parrots Project Images</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {images.map((key) => (
          <img
            key={key}
            src={`${BUCKET_URL}/${key}`}
            alt={key}
            title={key}
            onClick={() => setSelected(`${BUCKET_URL}/${key}`)}
            style={{
              width: "280px",
              height: "160px",
              objectFit: "cover",
              borderRadius: "10px",
              cursor: "pointer",
              border: "2px solid rgba(255,255,255,0.1)",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        ))}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, cursor: "pointer",
          }}
        >
          <img
            src={selected}
            alt="preview"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "12px" }}
          />
        </div>
      )}
    </div>
  );
}
