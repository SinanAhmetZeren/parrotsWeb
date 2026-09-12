/* eslint-disable no-undef */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoRemoveCircleOutline, IoCameraReverseOutline } from "react-icons/io5";
import uploadImage from "../assets/images/ParrotsLogoPlus.jpg";
import placeHolder from "../assets/images/placeholder.png";
import {
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
  useGetVehicleByIdQuery,
  useUpdateVehicleProfileImageMutation,
  usePatchVehicleMutation,
} from "../slices/VehicleSlice";
import { useNavigate, useParams } from "react-router-dom";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { toast } from "react-toastify";

const vehicles = {
  Boat: "⛵",
  Car: "🚗",
  Caravan: "🚐",
  Bus: "🚌",
  Walk: "🚶",
  Run: "🏃",
  Motorcycle: "🏍️",
  Bicycle: "🚲",
  Tinyhouse: "🏠",
  Airplane: "✈️",
  Train: "🚄",
};

function EditVehiclePage() {
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const [updateVehicleProfileImage] = useUpdateVehicleProfileImageMutation();
  const [patchVehicle] = usePatchVehicleMutation();
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const {
    data: VehicleData,
    isSuccess: isSuccessVehicles,
    isLoading: isLoadingVehicles,
    isError: isErrorVehicles,
    refetch,
  } = useGetVehicleByIdQuery(vehicleId);

  const [vehicleName, setVehicleName] = useState("");
  const [vehicleDescription, setVehicleDescription] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [newProfileImageSelected, setNewProfileImageSelected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef();
  const galleryImageInputRef = useRef();
  const [isProfileImageDeleteHovered, setIsProfileImageDeleteHovered] = useState(false);
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);
  const [pageState, setPageState] = useState("s1");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUpdatingVehicle, setIsUpdatingVehicle] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [honeyPotValue, setHoneyPotValue] = useState("");

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!VehicleData) return;
    setVehicleName(VehicleData.name ?? "");
    setVehicleDescription(VehicleData.description ?? "");
    setVehicleCapacity(VehicleData.capacity ?? null);
    setSelectedVehicleType(Object.entries(vehicles)?.[VehicleData.type]?.[0] ?? "");
    setImagePreview(VehicleData.profileImageUrl ?? null);
    setProfileImageFile(VehicleData.profileImageUrl ?? null);
    if (!initializedRef.current) {
      setAddedVehicleImages(VehicleData.vehicleImages ?? []);
      initializedRef.current = true;
    }
  }, [VehicleData]);

  const isFormValid = useMemo(() => {
    return (
      vehicleName?.trim() &&
      vehicleDescription?.trim().length > 0 &&
      vehicleDescription !== "<p><br></p>" &&
      vehicleCapacity &&
      selectedVehicleType &&
      profileImageFile
    );
  }, [vehicleName, vehicleDescription, vehicleCapacity, selectedVehicleType, profileImageFile]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) { toast.error("File size must be 5MB or less."); return; }
    setProfileImageFile(file);
    setNewProfileImageSelected(true);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRevertImage = () => {
    setProfileImageFile(VehicleData?.profileImageUrl ?? null);
    setImagePreview(VehicleData?.profileImageUrl ?? null);
    setNewProfileImageSelected(false);
  };

  const handleImageChange2 = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) { toast.error("File size must be 5MB or less."); return; }
    if (addedVehicleImages.length >= 8) return;
    setIsUploadingImage(true);
    try {
      const response = await addVehicleImage({ vehicleImage: file, vehicleId }).unwrap();
      const addedvehicleImageId = response.imagePath;
      setAddedVehicleImages((prev) => [...prev, { addedvehicleImageId, vehicleImage: file }]);
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Failed to upload image. Please check your connection and try again.");
    }
    setIsUploadingImage(false);
  };


  const handleDeleteImage = async (imageId) => {
    const previousImages = [...addedVehicleImages];
    setAddedVehicleImages(previousImages.filter(
      (item) => item.addedvehicleImageId !== imageId && item.id !== imageId
    ));
    try {
      const imageToDelete = previousImages.find(
        (item) => item.addedvehicleImageId === imageId || item.id === imageId
      );
      if (imageToDelete?.addedvehicleImageId) {
        await deleteVehicleImage(imageToDelete.addedvehicleImageId).unwrap();
      } else if (imageToDelete?.id) {
        await deleteVehicleImage(imageToDelete.id).unwrap();
      }
    } catch (error) {
      console.error("Error deleting image", error);
      setAddedVehicleImages(previousImages);
      toast.error("Failed to delete image. Please check your connection and try again.");
    }
  };

  const handleUpdateButtonClick = async () => {
    if (honeyPotValue) { console.warn("Bot detected – update blocked"); return; }
    setIsUpdatingVehicle(true);
    const patchDoc = [
      { op: "replace", path: "/name", value: vehicleName },
      { op: "replace", path: "/description", value: vehicleDescription },
      { op: "replace", path: "/capacity", value: vehicleCapacity },
    ];
    try {
      await patchVehicle({ patchDoc, currentVehicleId: vehicleId }).unwrap();
      if (newProfileImageSelected) {
        try {
          await updateVehicleProfileImage({ vehicleImage: profileImageFile, vehicleId }).unwrap();
        } catch (imgError) {
          console.error("Error updating profile image", imgError);
          toast.error("Details saved but profile image failed to update.");
        }
      }
      refetch();
      setPageState("s2");
    } catch (error) {
      console.error("Error updating vehicle", error);
      toast.error("Failed to update vehicle. Please check your connection and try again.");
    }
    setIsUpdatingVehicle(false);
  };

  const completeEdit = () => {
    setIsCompleting(true);
    navigate("/profile");
  };

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;
  if (isErrorVehicles) return <SomethingWentWrong />;

  if (isLoadingVehicles || !isSuccessVehicles) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="flex mainpage_Container">
            <div className="flex mainpage_TopRow">
              <TopLeftComponent />
              <div className="flex mainpage_TopRight"><TopBarMenu /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
              <div className="spinner" style={{ height: "3rem", width: "3rem", border: "4px solid white", borderTop: "4px solid #1e90ff" }} />
            </div>
          </div>
        </header>
      </div>
    );
  }

  const existingImages = addedVehicleImages.filter((item) => item.id);
  const newImages = addedVehicleImages.filter((item) => item.addedvehicleImageId);
  const totalImages = addedVehicleImages.length;

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight"><TopBarMenu /></div>
          </div>

          {/* Step bar */}
          <div style={vehicleStepBarContainer}>
            <span
              style={{ ...vehicleStepTitle, ...(pageState === "s1" ? vehicleStepActive : vehicleStepInactive), cursor: "pointer" }}
              onClick={() => setPageState("s1")}
            >Vehicle Details</span>
            <span
              style={{ ...vehicleStepTitle, ...(pageState === "s2" ? vehicleStepActive : vehicleStepInactive), cursor: "pointer" }}
              onClick={() => setPageState("s2")}
            >Vehicle Images</span>
          </div>

          {/* ── Page 1: Details ── */}
          {pageState === "s1" && (
            <div style={s1Card}>
              <div style={s1Body}>
                {/* Left: fields + description */}
                <div style={s1Left}>
                  <div style={s1SectionHeader}>BASICS</div>

                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                    <div style={{ flex: 3 }}>
                      <div style={s1FieldLabel}>Name</div>
                      <input
                        type="text"
                        placeholder="Vehicle name"
                        value={vehicleName}
                        maxLength={20}
                        onChange={(e) => setVehicleName(e.target.value)}
                        className="vehicle-name-input"
                        style={s1TextInput}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={s1FieldLabel}>Capacity</div>
                      <select
                        value={vehicleCapacity ?? ""}
                        onChange={(e) => setVehicleCapacity(e.target.value)}
                        className="capacity-input"
                        style={{ ...s1TextInput, width: "100%", color: vehicleCapacity ? "#00008b" : "#96989c" }}
                      >
                        <option value="" disabled>Select</option>
                        {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={s1FieldLabel}>Type</div>
                      <select
                        disabled
                        value={selectedVehicleType}
                        className="type-input"
                        style={{ ...s1TextInput, width: "100%", color: selectedVehicleType ? "#00008b66" : "#96989c" }}
                        onChange={() => {}}
                      >
                        <option value="" disabled>Select</option>
                        {Object.keys(vehicles).map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={s1FieldHint}>Max 20 characters</div>

                  <div style={{ ...s1SectionHeader, marginTop: "1.5rem" }}>DESCRIPTION</div>
                  <div className="editor-container" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                    <ReactQuill
                      value={vehicleDescription}
                      onChange={setVehicleDescription}
                      placeholder="Tell us about your vehicle (max 600 characters)"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          ["bold", "italic", "underline"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["emoji"],
                        ],
                      }}
                    />
                  </div>
                  <div style={s1CharCount}>
                    {(vehicleDescription === "<p><br></p>" ? 0 : vehicleDescription.replace(/<[^>]*>/g, "").length)} / 600
                  </div>
                </div>

                {/* Right: profile image */}
                <div style={s1Right}>
                  <div style={s1SectionHeader}>PROFILE IMAGE</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                  />
                  <div style={{ position: "relative" }}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt=""
                        style={{ ...s1ImagePreview, cursor: "pointer" }}
                        onClick={() => fileInputRef.current.click()}
                      />
                    ) : (
                      <div style={s1ImagePlaceholder} onClick={() => fileInputRef.current.click()}>
                        <div style={{ backgroundColor: "white", borderRadius: "1.25rem" }}>
                          <img src={uploadImage} alt="Upload Icon" style={s1ImagePlaceholderInner} />
                        </div>
                      </div>
                    )}

                    {/* Revert to original */}
                    {newProfileImageSelected && (
                      <div
                        onClick={handleRevertImage}
                        style={{ ...deleteImageIcon, ...(isProfileImageDeleteHovered ? deleteImageIconHover : {}) }}
                        onMouseEnter={() => setIsProfileImageDeleteHovered(true)}
                        onMouseLeave={() => setIsProfileImageDeleteHovered(false)}
                      >
                        <IoCameraReverseOutline size="2.5rem" />
                      </div>
                    )}
                  </div>
                  <div style={s1ImageCaption}>Click image to change</div>
                  <div style={s1ImageSubCaption}>Square works best. Add gallery images on the next page.</div>
                </div>
              </div>

              {/* Footer */}
              <div style={s1Footer}>
                <input
                  type="text"
                  value={honeyPotValue}
                  onChange={(e) => setHoneyPotValue(e.target.value)}
                  style={{ display: "none" }}
                  autoComplete="off"
                />
                <div />
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <div
                    style={{
                      ...s1RegisterBtn,
                      ...(!isFormValid || isUpdatingVehicle ? { opacity: 0.6, cursor: "not-allowed" } : {}),
                      position: "relative",
                    }}
                    onClick={!isUpdatingVehicle && isFormValid ? handleUpdateButtonClick : undefined}
                  >
                    <span style={{ opacity: isUpdatingVehicle ? 0 : 1 }}>Save & Next →</span>
                    {isUpdatingVehicle && <RegisterSpinner />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Page 2: Images ── */}
          {pageState === "s2" && (
            <div style={s1Card}>
              <div style={s2HeaderRow}>
                <div style={s2Title}>Vehicle Images</div>
                <div style={s2Counter}>{totalImages} / 8</div>
              </div>

              <div style={s2Grid}>
                {/* Uploader cell */}
                <div style={s2UploaderCell} onClick={!isUploadingImage ? () => galleryImageInputRef.current.click() : undefined}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange2}
                    onClick={(e) => (e.target.value = null)}
                    style={{ display: "none" }}
                    ref={galleryImageInputRef}
                  />
                  {isUploadingImage ? (
                    <div className="spinner" style={{ height: "2rem", width: "2rem", border: "3px solid #3b82f6", borderTop: "3px solid transparent" }} />
                  ) : (
                    <div style={{ backgroundColor: "white", height: "85%", width: "85%", borderRadius: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={uploadImage} alt="Upload" style={{ width: "70%", height: "70%", objectFit: "cover", opacity: 0.45, borderRadius: "0.75rem" }} />
                    </div>
                  )}
                </div>

                {/* Existing images (from server) */}
                {existingImages.map((item) => (
                  <div style={s2ImageCell} key={`ex_${item.id}`}>
                    <img
                      src={item.imageUrl || item.vehicleImagePath}
                      alt=""
                      style={s2GridImage}
                    />
                    <div style={s2DeleteBtn} onClick={() => handleDeleteImage(item.id)}>✕</div>
                  </div>
                ))}

                {/* Newly uploaded images (blob) */}
                {newImages.map((item) => (
                  <div style={s2ImageCell} key={`new_${item.addedvehicleImageId}`}>
                    <img
                      src={URL.createObjectURL(item.vehicleImage)}
                      alt=""
                      style={s2GridImage}
                    />
                    <div style={s2DeleteBtn} onClick={() => handleDeleteImage(item.addedvehicleImageId)}>✕</div>
                  </div>
                ))}

                {/* Placeholders */}
                {Array.from({ length: Math.max(0, 11 - totalImages) }).map((_, i) => (
                  <div style={s2PlaceholderCell} key={`ph_${i}`}>
                    <img src={placeHolder} alt="" style={s2PlaceholderImg} />
                  </div>
                ))}
              </div>

              <div style={s1Footer}>
                <div />
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={s2BackBtn} onClick={() => setPageState("s1")}>‹ Back</div>
                  <div
                    style={{ ...s1RegisterBtn, backgroundColor: "#16a34a", position: "relative" }}
                    onClick={!isCompleting ? completeEdit : undefined}
                  >
                    <span style={{ opacity: isCompleting ? 0 : 1 }}>Done</span>
                    {isCompleting && <RegisterSpinner />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <style>
        {`
          .editor-container .ql-editor {
            min-height: 120px;
            max-height: 220px;
            overflow-y: auto;
            color: #111827;
            background-color: #f3f4f6;
          }
        `}
      </style>
    </div>
  );
}

export default EditVehiclePage;

const RegisterSpinner = () => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "inherit" }}>
    <div className="spinner" style={{ height: "1rem", width: "1rem", border: "3px solid white", borderTop: "3px solid #1e90ff" }} />
  </div>
);

const deleteImageIcon = {
  backgroundColor: "#3c9dee99",
  width: "3rem", height: "3rem",
  position: "absolute", top: "-0.5rem", right: "-0.5rem",
  borderRadius: "2rem", display: "flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
};
const deleteImageIconHover = { transform: "scale(1.2)" };

const vehicleStepBarContainer = {
  display: "flex", flexDirection: "row", width: "fit-content",
  margin: "auto", marginTop: "1rem", marginBottom: "0.5rem",
  backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "2rem", padding: "0.3rem", gap: "0.2rem",
};
const vehicleStepTitle = {
  fontSize: "1.15rem", fontWeight: 800, padding: "0.4rem 1.2rem",
  borderRadius: "1.5rem", cursor: "pointer", transition: "background 0.2s",
};
const vehicleStepActive = { color: "white", backgroundColor: "#3b82f6" };
const vehicleStepInactive = { color: "rgba(255,255,255,0.45)", opacity: 0.4 };

const s1Card = {
  backgroundColor: "white", borderRadius: "1.25rem", fontFamily: "Nunito",
  margin: "1rem auto", width: "75%", display: "flex", flexDirection: "column",
  maxHeight: "calc(100vh - 8rem)", overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
};
const s1Body = {
  display: "flex", flexDirection: "row", padding: "2rem", gap: "2rem",
  flex: 1, overflowY: "auto", alignItems: "stretch",
};
const s1Left = { flex: 1, display: "flex", flexDirection: "column", textAlign: "left", alignItems: "stretch" };
const s1Right = { width: "24rem", flexShrink: 0, display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start" };
const s1SectionHeader = { fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: "0.75rem" };
const s1FieldLabel = { fontSize: "1.0625rem", fontWeight: 700, color: "#1e3a5f", marginBottom: "0.35rem" };
const s1TextInput = {
  width: "100%", boxSizing: "border-box", backgroundColor: "#f3f4f6",
  border: "none", borderRadius: "0.625rem", padding: "0.6rem 0.75rem",
  fontSize: "0.95rem", color: "#1e3a5f", outline: "none",
};
const s1FieldHint = { fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.3rem" };
const s1CharCount = { fontSize: "0.78rem", color: "#9ca3af", textAlign: "right", marginTop: "0.3rem" };
const s1ImagePlaceholder = {
  backgroundColor: "#f3f4f6ca", width: "24rem", height: "24rem",
  borderRadius: "1.25rem", display: "flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer", overflow: "hidden",
};
const s1ImagePlaceholderInner = { width: "19rem", height: "19rem", objectFit: "cover", opacity: 0.4, borderRadius: "1rem" };
const s1ImagePreview = { width: "24rem", height: "24rem", objectFit: "cover", borderRadius: "1.25rem", border: "2px solid transparent" };
const s1ImageCaption = { fontWeight: 700, fontSize: "1.125rem", color: "#1e3a5f", marginTop: "0.75rem" };
const s1ImageSubCaption = { fontSize: "1rem", color: "#6b7280", marginTop: "0.25rem", lineHeight: 1.4 };
const s1Footer = {
  display: "flex", flexDirection: "row", alignItems: "center",
  justifyContent: "space-between", padding: "1.25rem 2rem",
  borderTop: "1px solid #f3f4f6",
};
const s1RegisterBtn = {
  padding: "0.6rem 1.5rem", borderRadius: "2rem", backgroundColor: "#007bff",
  fontWeight: 700, fontSize: "0.95rem", color: "white", cursor: "pointer",
  display: "flex", alignItems: "center", minWidth: "9rem", justifyContent: "center",
};

const s2HeaderRow = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1.5rem 2rem 1rem" };
const s2Title = { fontFamily: "Nunito", fontWeight: 800, fontSize: "1.4rem", color: "#1e3a5f" };
const s2Counter = { fontFamily: "Nunito", fontWeight: 700, fontSize: "1rem", color: "#9ca3af" };
const s2Grid = { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.75rem", padding: "0 2rem 1rem" };
const s2UploaderCell = {
  backgroundColor: "#f3f4f6ca", borderRadius: "1rem",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", aspectRatio: "1", overflow: "hidden",
};
const s2ImageCell = { position: "relative", borderRadius: "1rem", overflow: "hidden", aspectRatio: "1" };
const s2GridImage = { width: "100%", height: "100%", objectFit: "cover" };
const s2DeleteBtn = {
  position: "absolute", top: "0.5rem", right: "0.5rem",
  backgroundColor: "rgba(30,30,30,0.6)", color: "white",
  width: "1.5rem", height: "1.5rem", borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", fontSize: "0.75rem", fontWeight: 700,
};
const s2PlaceholderCell = { backgroundColor: "#f9fafb", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1", overflow: "hidden" };
const s2PlaceholderImg = { width: "40%", height: "40%", objectFit: "contain", opacity: 0.3 };
const s2BackBtn = {
  padding: "0.6rem 1.2rem", borderRadius: "2rem", border: "1.5px solid #e5e7eb",
  fontWeight: 700, fontSize: "0.95rem", color: "#374151", cursor: "pointer",
  display: "flex", alignItems: "center", fontFamily: "Nunito",
};
