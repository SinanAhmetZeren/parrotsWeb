import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const overlay = {
  position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
};
const box = {
  backgroundColor: "#fff", borderRadius: "1.25rem", padding: "1.75rem",
  maxWidth: "480px", width: "90vw", boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
};
const title = { fontSize: "1.2rem", fontWeight: 700, color: "#0A77EA", marginBottom: "1.25rem" };
const btnRow = { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" };
const cancelBtn = { cursor: "pointer", color: "#5C6B7A", fontWeight: 600, fontSize: "0.95rem", padding: "0 0.5rem" };
const confirmBtn = {
  cursor: "pointer", backgroundColor: "#0A77EA", color: "#fff",
  borderRadius: "2rem", padding: "0.6rem 1.5rem", fontWeight: 700, fontSize: "0.95rem",
};

export const CropModal = ({ src, aspect = 1, onConfirm, onCancel }) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);

  const onImageLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, w, h), w, h));
  };

  const handleConfirm = () => {
    const image = imgRef.current;
    if (!image || !completedCrop) return;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0, canvas.width, canvas.height
    );
    canvas.toBlob((blob) => { if (blob) onConfirm(blob); }, "image/jpeg", 0.85);
  };

  if (!src) return null;

  return (
    <div style={overlay}>
      <div style={box}>
        <div style={title}>Crop image</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={aspect}>
            <img ref={imgRef} src={src} onLoad={onImageLoad} alt="crop" style={{ maxHeight: "55vh", maxWidth: "100%" }} />
          </ReactCrop>
        </div>
        <div style={btnRow}>
          <div style={cancelBtn} onClick={onCancel}>Cancel</div>
          <div style={confirmBtn} onClick={handleConfirm}>Use this crop</div>
        </div>
      </div>
    </div>
  );
};
