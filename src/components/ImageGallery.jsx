import React, { useState } from "react";

const THUMB_STEP = 39; // 34px thumb + 5px gap
const VISIBLE = 5;

export function ImageGallery({ images, width = "250px", height = "100%" }) {
  const [idx, setIdx] = useState(0);
  const [first, setFirst] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const nav = (n) => {
    n = ((n % images.length) + images.length) % images.length;
    let f = first;
    if (n < f) f = n;
    if (n > f + VISIBLE - 1) f = n - VISIBLE + 1;
    f = Math.max(0, Math.min(f, Math.max(0, images.length - VISIBLE)));
    setIdx(n);
    setFirst(f);
  };

  const showL = first > 0;
  const showR = first + VISIBLE < images.length;

  if (!images || images.length === 0) return null;

  return (
    <>
      <div style={{ width, height, position: "relative", overflow: "hidden" }}>
        {/* Main image */}
        <img src={images[idx]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

        {/* Counter */}
        {images.length > 1 && (
          <div style={{ position: "absolute", left: 8, top: 8, zIndex: 3, background: "rgba(4,16,30,0.6)", border: "1px solid rgba(255,255,255,0.24)", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "3px 8px", borderRadius: "99px", fontVariantNumeric: "tabular-nums" }}>
            <b>{idx + 1}</b> / {images.length}
          </div>
        )}

        {/* Expand button */}
        <button onClick={() => setLightbox(true)} title="Enlarge" style={{ position: "absolute", right: 8, top: 8, zIndex: 3, width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.55)", backdropFilter: "blur(5px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
            <path d="M14 4h6v6" /><path d="M20 4l-7 7" /><path d="M10 20H4v-6" /><path d="M4 20l7-7" />
          </svg>
        </button>

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 7px", pointerEvents: "none" }}>
            {[{ dir: -1, path: "M15 5l-7 7 7 7" }, { dir: 1, path: "M9 5l7 7-7 7" }].map(({ dir, path }) => (
              <button key={dir} onClick={() => nav(idx + dir)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.55)", backdropFilter: "blur(5px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, pointerEvents: "auto" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><path d={path} /></svg>
              </button>
            ))}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2, padding: "22px 8px 8px", background: "linear-gradient(180deg, rgba(4,16,30,0), rgba(4,16,30,0.78) 58%)", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", overflow: "hidden", width: `${Math.min(images.length, VISIBLE) * THUMB_STEP - 5}px` }}>
            {showL && <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 26, zIndex: 3, background: "linear-gradient(90deg, rgba(4,16,30,0.72), transparent)", pointerEvents: "none" }} />}
            {showR && <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 26, zIndex: 3, background: "linear-gradient(270deg, rgba(4,16,30,0.72), transparent)", pointerEvents: "none" }} />}
            <div style={{ display: "flex", gap: 5, transition: "transform 0.2s ease", transform: `translateX(-${first * THUMB_STEP}px)` }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => nav(i)} style={{ flex: "0 0 34px", height: 34, borderRadius: 6, overflow: "hidden", border: i === idx ? "2px solid white" : "2px solid rgba(255,255,255,0.42)", cursor: "pointer", boxShadow: i === idx ? "0 0 0 2px rgba(255,255,255,0.28)" : "none", flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={images[idx]} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 12 }} />
          <button onClick={(e) => { e.stopPropagation(); nav(idx - 1); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.7)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); nav(idx + 1); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.7)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => setLightbox(false)} style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(4,16,30,0.7)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, padding: 0 }}>✕</button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 800 }}>{idx + 1} / {images.length}</div>
        </div>
      )}
    </>
  );
}
