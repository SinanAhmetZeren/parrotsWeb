import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import parrotMarker1 from "../../assets/images/parrotMarker1.png";
import uploadImage from "../../assets/images/ParrotsLogoPlus.png";
import { useAddPlaceMutation, useUpdateVoyageProfileImageMutation } from "../../slices/VoyageSlice";
import {
  adminPage, adminCard, adminTitle, adminRow, adminLabel,
  adminInput, adminTextarea, adminBtnPrimary,
} from "../../styles/adminStyles";

const maptilerKey = process.env.REACT_APP_MAPTILER_KEY;
const tileUrl = `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${maptilerKey}`;
const tileAttribution = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const clickMarkerIcon = L.icon({
  iconUrl: parrotMarker1,
  iconSize: [50, 60],
  iconAnchor: [25, 60],
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function PlaceEditor() {
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [initialLatitude, setInitialLatitude] = useState(null);
  const [initialLongitude, setInitialLongitude] = useState(null);
  const fileInputRef = useRef();

  const [addPlace] = useAddPlaceMutation();
  const [updateVoyageProfileImage] = useUpdateVoyageProfileImageMutation();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setInitialLatitude(pos.coords.latitude);
          setInitialLongitude(pos.coords.longitude);
        },
        () => {
          setInitialLatitude(37.7749);
          setInitialLongitude(-122.4194);
        }
      );
    } else {
      setInitialLatitude(37.7749);
      setInitialLongitude(-122.4194);
    }
  }, []);

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

  const handleReset = () => {
    setName("");
    setBrief("");
    setDescription("");
    setLatitude(null);
    setLongitude(null);
    handleCancelImage();
  };

  const canSubmit = name && brief && latitude && longitude;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      const result = await addPlace({ name, brief, description, latitude, longitude }).unwrap();
      const placeId = result.data?.id;

      if (imageFile && placeId) {
        await updateVoyageProfileImage({ voyageId: placeId, imageFile }).unwrap();
      }

      toast.success("Place created!");
      handleReset();
    } catch (err) {
      toast.error("Failed to create place.");
    }
    setSaving(false);
  };

  return (
    <div style={adminPage}>
      <div style={adminCard}>
        <div style={adminTitle}>Create Place</div>

        <div style={adminRow}>
          <span style={adminLabel}>Name</span>
          <input
            style={adminInput}
            placeholder="Place name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={adminRow}>
          <span style={adminLabel}>Website</span>
          <input
            style={adminInput}
            placeholder="https://www.instagram.com/..."
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
        </div>

        <div style={adminRow}>
          <span style={adminLabel}>Description</span>
          <textarea
            style={{ ...adminTextarea, minHeight: "7rem" }}
            placeholder="Full description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            ) : (
              <img
                src={uploadImage}
                alt="upload"
                style={{ ...imagePreviewStyle, cursor: "pointer", opacity: 0.7 }}
                onClick={() => fileInputRef.current.click()}
              />
            )}
          </div>
        </div>

        <div style={adminRow}>
          <span style={adminLabel}>Coordinates</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              style={{ ...adminInput, width: "180px" }}
              readOnly
              placeholder="Lat — click map"
              value={latitude ? latitude.toFixed(6) : ""}
            />
            <input
              style={{ ...adminInput, width: "180px" }}
              readOnly
              placeholder="Lng — click map"
              value={longitude ? longitude.toFixed(6) : ""}
            />
          </div>
        </div>
      </div>

      {/* MAP */}
      <div style={{ ...adminCard, padding: 0, overflow: "hidden", height: "420px" }}>
        {!initialLatitude || !initialLongitude ? (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
            Locating you...
          </div>
        ) : (
        <MapContainer
          center={[initialLatitude, initialLongitude]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer url={tileUrl} attribution={tileAttribution} />
          <MapClickHandler onMapClick={(lat, lng) => { setLatitude(lat); setLongitude(lng); }} />
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={clickMarkerIcon} />
          )}
        </MapContainer>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
        <button
          style={{ ...adminBtnPrimary, opacity: canSubmit ? 1 : 0.5 }}
          disabled={!canSubmit || saving}
          onClick={handleSubmit}
        >
          {saving ? "Saving..." : "Create Place"}
        </button>
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
