import { useState, useRef } from "react";
import whiteegg from "../../assets/images/whiteegg.png";
import silveregg from "../../assets/images/silveregg.png";
import goldenegg from "../../assets/images/goldenegg.png";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import uploadImage from "../../assets/images/ParrotsLogoPlus.png";
import {
  useLazyGetVoyageByIdAdminQuery,
  usePatchVoyageAdminMutation,
  useUpdateVoyageProfileImageMutation,
} from "../../slices/VoyageSlice";
import {
  adminPage, adminCard, adminTitle, adminRow, adminLabel,
  adminInput, adminTextarea, adminBtnPrimary, adminBtnSecondary,
  adminSearchBar, adminIdInput, adminBoolBtn,
} from "../../styles/adminStyles";


export function PlaceEditorEdit() {
  const [placeId, setPlaceId] = useState("");
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  const [triggerGetVoyageByIdAdmin] = useLazyGetVoyageByIdAdminQuery();
  const [patchVoyageAdmin] = usePatchVoyageAdminMutation();
  const [updateVoyageProfileImage] = useUpdateVoyageProfileImageMutation();

  const fetchPlace = async () => {
    if (!placeId) return;
    setLoading(true);
    try {
      const response = await triggerGetVoyageByIdAdmin(placeId);
      const data = response.data;
      if (!data) {
        toast.error("Place not found.");
        setPlace(null);
      } else if (data.placeType === 0) {
        toast.error("This ID does not belong to a place.");
        setPlace(null);
      } else {
        setPlace(data);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      toast.error("Failed to fetch place.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => setPlace({ ...place, [field]: value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCancelImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!place?.id) return;
    setSaving(true);
    try {
      const patchDoc = [
        { op: "replace", path: "/name", value: place.name },
        { op: "replace", path: "/brief", value: place.brief },
        { op: "replace", path: "/description", value: place.description },
        { op: "replace", path: "/isDeleted", value: place.isDeleted },
        { op: "replace", path: "/publicOnMap", value: place.publicOnMap },
        { op: "replace", path: "/placeType", value: place.placeType },
        { op: "replace", path: "/startDate", value: place.startDate },
        { op: "replace", path: "/endDate", value: place.endDate },
      ].filter(item => item.value !== undefined);
      await patchVoyageAdmin({ voyageId: place.id, patchDoc }).unwrap();

      if (imageFile) {
        await updateVoyageProfileImage({ voyageId: place.id, imageFile }).unwrap();
      }

      toast.success("Place saved!");
    } catch (err) {
      toast.error("Failed to save place.");
    } finally {
      setSaving(false);
    }
  };

  const p = place || {};
  const currentImage = p.profileImageThumbnail || p.profileImage;

  return (
    <div style={adminPage}>
      <div style={adminCard}>
        <div style={adminTitle}>Edit Place</div>

        <div style={adminSearchBar}>
          <input
            type="number"
            placeholder="Place ID"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            style={adminIdInput}
          />
          <button onClick={fetchPlace} style={adminBtnSecondary}>
            {loading ? "Loading..." : "Fetch"}
          </button>
          <button
            onClick={handleSave}
            disabled={!place || saving}
            style={{ ...adminBtnPrimary, opacity: !place || saving ? 0.5 : 1, cursor: !place ? "not-allowed" : "pointer" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {place && (
          <>
            <div style={adminRow}>
              <span style={adminLabel}>Name</span>
              <input
                style={adminInput}
                value={p.name ?? ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div style={adminRow}>
              <span style={adminLabel}>Website</span>
              <input
                style={adminInput}
                placeholder="https://www.instagram.com/..."
                value={p.brief ?? ""}
                onChange={(e) => handleChange("brief", e.target.value)}
              />
            </div>

            <div style={adminRow}>
              <span style={adminLabel}>Description</span>
              <textarea
                style={{ ...adminTextarea, minHeight: "7rem" }}
                value={p.description ?? ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div style={adminRow}>
              <span style={adminLabel}>Level</span>
              <div style={eggSelectorRow}>
                {[
                  { value: 1, img: whiteegg, label: "White" },
                  { value: 2, img: silveregg, label: "Silver" },
                  { value: 3, img: goldenegg, label: "Golden" },
                ].map(({ value, img, label }) => (
                  <div
                    key={value}
                    onClick={() => handleChange("placeType", value)}
                    style={eggSelectorItem(p.placeType === value)}
                  >
                    <img src={img} alt={label} style={eggSelectorImg} />
                    <span style={eggSelectorLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={adminRow}>
              <span style={adminLabel}>Start Date</span>
              <input
                type="date"
                style={adminInput}
                value={p.startDate ? p.startDate.slice(0, 10) : ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>

            <div style={adminRow}>
              <span style={adminLabel}>End Date</span>
              <input
                type="date"
                style={adminInput}
                value={p.endDate ? p.endDate.slice(0, 10) : ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>

            <div style={adminRow}>
              <span style={adminLabel}>Image</span>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img src={imagePreview} alt="preview" style={imagePreviewStyle} />
                    <div style={cancelImageBtn} onClick={handleCancelImage}>
                      <IoRemoveCircleOutline size="1.8rem" />
                    </div>
                  </div>
                ) : currentImage ? (
                  <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }} onClick={() => fileInputRef.current.click()}>
                    <img src={currentImage} alt="current" style={imagePreviewStyle} />
                  </div>
                ) : (
                  <img
                    src={uploadImage}
                    alt="upload"
                    style={{ ...imagePreviewStyle, cursor: "pointer", opacity: 0.7 }}
                    onClick={() => fileInputRef.current.click()}
                  />
                )}
                {(imagePreview || currentImage) && (
                  <button style={adminBtnSecondary} onClick={() => fileInputRef.current.click()}>
                    Change Image
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <button onClick={() => handleChange("isDeleted", !p.isDeleted)} style={adminBoolBtn(!p.isDeleted)}>
                isDeleted: {p.isDeleted ? "true" : "false"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const imagePreviewStyle = {
  width: "8rem",
  height: "8rem",
  objectFit: "cover",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};

const eggSelectorRow = {
  display: "flex",
  gap: "1rem",
};

const eggSelectorItem = (selected) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.3rem",
  cursor: "pointer",
  padding: "0.5rem 0.75rem",
  borderRadius: "10px",
  border: selected ? "2px solid #0077ea" : "2px solid transparent",
  backgroundColor: selected ? "rgba(0,119,234,0.08)" : "transparent",
  transition: "all 0.15s",
});

const eggSelectorImg = {
  width: "2.8rem",
  height: "3.2rem",
  objectFit: "contain",
};

const eggSelectorLabel = {
  fontSize: "0.75rem",
  fontWeight: "600",
  color: "#475569",
};

const cancelImageBtn = {
  position: "absolute",
  top: "-0.5rem",
  right: "-0.5rem",
  backgroundColor: "rgba(220,38,38,0.8)",
  borderRadius: "50%",
  cursor: "pointer",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
