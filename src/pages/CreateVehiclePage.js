/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { IoRemoveCircleOutline } from "react-icons/io5";
// import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png";
import uploadImage from "../assets/images/ParrotsLogoPlus.jpg";
import placeHolder from "../assets/images/placeholder1.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
// import '../assets/css/VehicleImagesSwiper.css';
import { Pagination, FreeMode } from "swiper/modules";
import {
  useCreateVehicleMutation,
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
  useCheckAndDeleteVehicleMutation,
  useConfirmVehicleMutation,
  usePatchVehicleMutation,
} from "../slices/VehicleSlice";
import { useNavigate } from "react-router-dom";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { toast } from "react-toastify";
import { resizeImage } from "../utils/resizeImage";
import { useSelector } from "react-redux";

function CreateVehiclePage() {
  const dark = useSelector((state) => state.users.isDarkMode);
  const [createVehicle] = useCreateVehicleMutation();
  const [confirmVehicle] = useConfirmVehicleMutation();
  const [patchVehicle] = usePatchVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const [checkAndDeleteVehicle] = useCheckAndDeleteVehicleMutation();
  const userId = localStorage.getItem("storedUserId");
  const userName = localStorage.getItem("storedUserName");
  const navigate = useNavigate();

  const [vehicleName, setVehicleName] = useState("");
  const [vehicleDescription, setVehicleDescription] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryImagePreview, setGalleryImagePreview] = useState(null);
  const fileInputRef = React.createRef();
  const galleryImageInputRef = React.createRef();
  const [isProfileImageDeleteHovered, setIsProfileImageDeleteHovered] = useState(false);
  const [isGalleryImageDeleteHovered, setIsGalleryImageDeleteHovered] = useState(false);
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);
  const [pageState, setPageState] = useState("s1");
  const [vehicleId, setVehicleId] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isRegisteringVehicle, setIsRegisteringVehicle] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      vehicleName.trim() &&
      vehicleDescription.trim().length > 0 &&
      vehicleDescription !== "<p><br></p>" &&
      vehicleCapacity &&
      selectedVehicleType &&
      profileImageFile
    );
  }, [
    vehicleName,
    vehicleDescription,
    vehicleCapacity,
    selectedVehicleType,
    profileImageFile,
  ]);

  const hasChanges = useMemo(() => {
    if (!savedSnapshot) return false;
    return (
      vehicleName !== savedSnapshot.vehicleName ||
      vehicleDescription !== savedSnapshot.vehicleDescription ||
      String(vehicleCapacity) !== String(savedSnapshot.vehicleCapacity)
    );
  }, [savedSnapshot, vehicleName, vehicleDescription, vehicleCapacity]);

  useEffect(() => {
    console.log("useffect added images: ", addedVehicleImages);
  }, [addedVehicleImages]);

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const resized = await resizeImage(files[0]);
      setProfileImageFile(resized);
      setImagePreview(URL.createObjectURL(resized));
    }
  };

  const handleImageChange2 = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (addedVehicleImages.length >= 8) return;
    const resized = await resizeImage(files[0]);
    setIsUploadingImage(true);
    try {
      const response = await addVehicleImage({ vehicleImage: resized, vehicleId }).unwrap();
      const addedvehicleImageId = response.imagePath;
      setAddedVehicleImages((prev) => [...prev, { addedvehicleImageId, vehicleImage: resized }]);
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Failed to upload image. Please check your connection and try again.");
    }
    setIsUploadingImage(false);
  };

  const handleCancelUpload = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setProfileImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelUpload2 = () => {
    if (galleryImagePreview) {
      URL.revokeObjectURL(galleryImagePreview);
    }
    setVehicleImage(null);
    setGalleryImagePreview(null);
    if (galleryImageInputRef.current) {
      galleryImageInputRef.current.value = "";
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageClick2 = () => {
    galleryImageInputRef.current.click();
  };

  const handleCreateVehicle = async () => {
    console.log("1.  Creating vehicle...  ");
    if (!profileImageFile) {
      return;
    }
    setIsRegisteringVehicle(true);
    try {
      console.log("2.  Sending request...  ");

      const response = await createVehicle({
        vehicleImage: profileImageFile,
        name: vehicleName,
        description: vehicleDescription,
        userId,
        vehicleType: selectedVehicleType,
        capacity: vehicleCapacity,
      }).unwrap();
      console.log("-->>> response: ", response);
      const createdVehicleId = response.data.id;
      console.log("3. Vehicle created with ID:", createdVehicleId, "...");
      setVehicleId(createdVehicleId);
      setSavedSnapshot({ vehicleName, vehicleDescription, vehicleCapacity, selectedVehicleType });
      setAddedVehicleImages([]);
      setPageState("s2");
    } catch (error) {
      console.error("Error creating vehicle:", error);
      toast.error("Failed to create vehicle. Please check your connection and try again.");
    } finally {
      setIsRegisteringVehicle(false);
    }
  };

  const handleUpdateVehicle = async () => {
    setIsSavingChanges(true);
    try {
      const patch = [
        { op: "replace", path: "/name", value: vehicleName },
        { op: "replace", path: "/description", value: vehicleDescription },
        { op: "replace", path: "/capacity", value: Number(vehicleCapacity) },
      ];
      console.log("handleUpdateVehicle vehicleId:", vehicleId, "patch:", JSON.stringify(patch));
      const result = await patchVehicle({ currentVehicleId: vehicleId, patchDoc: patch }).unwrap();
      console.log("patchVehicle result:", result);
      setSavedSnapshot({ vehicleName, vehicleDescription, vehicleCapacity, selectedVehicleType });
    } catch (error) {
      console.error("Error updating vehicle - full error:", JSON.stringify(error));
      toast.error("Failed to save changes. Please check your connection and try again.");
    }
    setIsSavingChanges(false);
  };

  const completeVehicleCreate = async () => {
    setIsCompleting(true);
    console.log("confirming vehicle: ", vehicleId);
    var confirmResult = await confirmVehicle(vehicleId);
    console.log("confirmResult: ", confirmResult);
    navigate(`/profile`);
  };

  const handleDeleteImage = async (imageId) => {
    const previousImages = [...addedVehicleImages];
    setAddedVehicleImages(
      previousImages.filter((item) => item.addedvehicleImageId !== imageId)
    );

    try {
      await deleteVehicleImage(imageId).unwrap();
    } catch (error) {
      console.error("Error deleting image", error);
      setAddedVehicleImages(previousImages);
      toast.error("Failed to delete image. Please check your connection and try again.");
    }
  };

  const maxItems = 10;
  const placeholders = Array.from({ length: maxItems }, (_, index) => ({
    key: `placeholder_${index + 1}`,
  }));

  const data = useMemo(
    () =>
      addedVehicleImages.length < maxItems
        ? [
          ...addedVehicleImages,
          ...placeholders.slice(addedVehicleImages.length),
        ]
        : addedVehicleImages.map((item) => ({
          ...item,
          key: item.addedvehicleImageId,
        })),
    [addedVehicleImages, maxItems, placeholders]
  );

  const handleUploadImage = useCallback(async () => {
    if (!vehicleImage) {
      return;
    }
    setIsUploadingImage(true);
    try {
      const addedVehicleImageResponse = await addVehicleImage({
        vehicleImage,
        vehicleId,
      }).unwrap();

      console.log("vehicleImage", vehicleImage);

      const addedvehicleImageId = addedVehicleImageResponse.imagePath;
      const newItem = {
        addedvehicleImageId,
        vehicleImage,
      };
      setAddedVehicleImages((prevImages) => [...prevImages, newItem]);
      setVehicleImage(null);
      setGalleryImagePreview(null);
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Failed to upload image. Please check your connection and try again.");
    }
    setIsUploadingImage(false);
  }, [vehicleImage, vehicleId, addVehicleImage]);

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>

          {pageState === "s1" && (
            <div style={s1Card}>
              <div style={cvStepBarContainer}>
                <div style={cvStepItem}>
                  <div style={cvStepCircle(true, false)}>1</div>
                  <span style={cvStepLabel(true, false)}>Vehicle Details</span>
                </div>
                <div style={cvStepConnector} />
                <div style={cvStepItem}>
                  <div style={cvStepCircle(false, false)}>2</div>
                  <span style={cvStepLabel(false, false)}>Vehicle Images</span>
                </div>
              </div>
              <div style={s1Body}>
                {/* Left column */}
                <div style={s1Left}>
                  <div style={s1SectionHeader}>BASICS</div>

                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                    <div style={{ flex: 3 }}>
                      <div style={s1FieldLabel}>Name
                      </div>
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
                        id="capacity"
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
                      <div style={s1FieldLabel}>Type
                      </div>
                      <select
                        id="vehicle-type"
                        value={selectedVehicleType}
                        onChange={(e) => setSelectedVehicleType(e.target.value)}
                        className="type-input"
                        style={{ ...s1TextInput, width: "100%", color: selectedVehicleType ? "#00008b" : "#96989c" }}
                      >
                        <option value="" disabled className="placeholderOption">Select</option>
                        {Object.keys(vehicles)
                          .filter((v) => v !== "Walk" && v !== "Run" && v !== "Train")
                          .map((v) => (
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

                {/* Right column */}
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
                        style={s1ImagePreview}
                      />
                    ) : (
                      <div style={s1ImagePlaceholder} onClick={handleImageClick}>
                        <div style={{ backgroundColor: "white", borderRadius: "1.25rem" }}>
                          <img
                            src={uploadImage}
                            alt="Upload Icon"
                            style={s1ImagePlaceholderInner}
                          />
                        </div>
                      </div>
                    )}
                    {profileImageFile && (
                      <div
                        onClick={handleCancelUpload}
                        style={{
                          ...deleteImageIcon,
                          ...(isProfileImageDeleteHovered ? deleteImageIconHover : {}),
                        }}
                        onMouseEnter={() => setIsProfileImageDeleteHovered(true)}
                        onMouseLeave={() => setIsProfileImageDeleteHovered(false)}
                      >
                        <IoRemoveCircleOutline size={"2.5rem"} />
                      </div>
                    )}
                  </div>
                  <div style={s1ImageCaption}>Add a profile image</div>
                  <div style={s1ImageSubCaption}>Square works best. You can add more photos go on the next page.</div>
                </div>
              </div>

              {/* Footer */}
              <div style={s1Footer}>
                <div style={s1FreePill}>✓ Free to register, no ParrotCrackers used</div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {vehicleId ? (
                    <>
                      {hasChanges && (
                        <div
                          style={{ ...s1RegisterBtn, backgroundColor: "#16a34a", position: "relative", ...(isSavingChanges ? { opacity: 0.7, cursor: "not-allowed" } : {}) }}
                          onClick={!isSavingChanges ? handleUpdateVehicle : undefined}
                        >
                          <span style={{ opacity: isSavingChanges ? 0 : 1 }}>Save changes</span>
                          {isSavingChanges && <RegisterSpinner />}
                        </div>
                      )}
                      <div style={s1RegisterBtn} onClick={() => setPageState("s2")}>
                        Next →
                      </div>
                    </>
                  ) : (
                    <div
                      style={{ ...s1RegisterBtn, ...(!isFormValid && !isRegisteringVehicle ? { opacity: 0.6, cursor: "not-allowed" } : {}), position: "relative" }}
                      onClick={!isRegisteringVehicle && isFormValid ? () => { console.log("--->> creating vehicle"); handleCreateVehicle(); } : undefined}
                    >
                      <span style={{ opacity: isRegisteringVehicle ? 0 : 1 }}>Register vehicle</span>
                      {isRegisteringVehicle && <RegisterSpinner style={{ position: "absolute" }} />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {pageState === "s2" && (
            <div style={s1Card}>
              <div style={cvStepBarContainer}>
                <div style={cvStepItem}>
                  <div style={cvStepCircle(false, true)}>1</div>
                  <span style={cvStepLabel(false, true)}>Vehicle Details</span>
                </div>
                <div style={cvStepConnector} />
                <div style={cvStepItem}>
                  <div style={cvStepCircle(true, false)}>2</div>
                  <span style={cvStepLabel(true, false)}>Vehicle Images</span>
                </div>
              </div>
              <div style={s2HeaderRow}>
                <div>
                  <div style={s2Title}>Vehicle images</div>
                </div>
                <div style={s2Counter}>{addedVehicleImages.length} / 8</div>
              </div>

              <div style={s2Grid}>
                {/* Uploader cell */}
                <div style={s2UploaderCell} onClick={!isUploadingImage ? handleImageClick2 : undefined}>

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

                {/* Added images */}
                {addedVehicleImages.map((item, index) => (
                  <div style={s2ImageCell} key={item.addedvehicleImageId}>
                    <img src={URL.createObjectURL(item.vehicleImage)} alt={`Uploaded ${index + 1}`} style={s2GridImage} />

                    <div style={s2DeleteBtn} onClick={() => handleDeleteImage(item.addedvehicleImageId)}>✕</div>
                  </div>
                ))}

                {/* Placeholder cells */}
                {Array.from({ length: Math.max(0, 11 - addedVehicleImages.length) }).map((_, i) => (
                  <div style={s2PlaceholderCell} key={`ph_${i}`}>
                    <img src={placeHolder} alt="" style={s2PlaceholderImg} />
                  </div>
                ))}
              </div>

              <div style={s1Footer}>
                <div style={s1FreePill}>✓ Free to register, no ParrotCrackers used</div>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={s2BackBtn} onClick={() => setPageState("s1")}>‹ Back</div>
                  <div
                    style={{ ...s1RegisterBtn, position: "relative" }}
                    onClick={!isCompleting ? () => setShowConfirmModal(true) : undefined}
                  >
                    <span style={{ opacity: isCompleting ? 0 : 1 }}>
                      {addedVehicleImages.length === 0 ? "Skip for now" : "Register vehicle"}
                    </span>
                    {isCompleting && <CompleteSpinner />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {showConfirmModal && (
        <div style={confirmModalOverlay}>
          <div style={confirmModalBox}>
            <div style={confirmModalTitle}>Register this vehicle?</div>
            <div style={confirmModalHeadline}>It goes on your public profile.</div>
            <div style={confirmModalDesc}>Anyone viewing your profile can see it.</div>
            <div style={confirmModalPill}>
              <span style={{ fontSize: "1rem", marginRight: "0.5rem" }}>✏️</span>
              <span style={confirmModalPillText}>Nothing locks, you can edit or remove it any time.</span>
            </div>
            <div style={{ ...confirmModalPill, backgroundColor: "rgba(0,150,100,0.1)", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "1rem", marginRight: "0.5rem", color: "#16a34a" }}>✓</span>
              <span style={{ ...confirmModalPillText, color: "#16a34a" }}>Free to register, no ParrotCrackers used</span>
            </div>
            <div style={confirmModalButtonRow}>
              <div style={confirmModalCancelBtn} onClick={() => setShowConfirmModal(false)}>Cancel</div>
              <div style={confirmModalConfirmBtn} onClick={() => { setShowConfirmModal(false); completeVehicleCreate(); }}>Register vehicle</div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          #app {
            height: 100%;
          }

          .editor-container .ql-editor {
            min-height: 120px;
            max-height: 220px;
            overflow-y: auto;
          }

          html, body {
            position: relative;
            height: 100%;
          }

          body {
            background: #eee;
            font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: #000;
            margin: 0;
            padding: 0;
          }

          .swiper {
            width: 100%;
            height: 100%;
            background-color: ${dark ? "#011a32" : "rgba(255, 255, 255, 0.3)"};
            border-radius: 1.5rem;
          }

          .swiper-slide {
            text-align: center;
            font-size: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${dark ? "#0a2745" : "rgba(255, 255, 255, 0.3)"};
            border-radius: 1.5rem;
            filter: none !important;
            opacity: 1 !important;
            padding: 1rem !important;
            width: 23rem !important;
          }

          .swiper-slide img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          ${dark ? `
          .vehiclePage_vehicleContainer { background-color: #011a32; }
          .vehiclePage_dataContainer { background-color: #011a32; }
          .vehiclePage_detailsContainer { background-color: #02213d; color: rgba(255,255,255,0.85); box-shadow: none; }
          .vehiclePage_descriptionContainer { background-color: #0a2745; box-shadow: none; }
          .createvehiclePage_descriptionContainer_inner { background-color: #011a32; }
          .vehiclePage_descriptionContainer_descriptionTitle { color: rgba(255,255,255,0.85); }
          .vehiclePage_descriptionContainer_descriptionContent { color: rgba(255,255,255,0.85); }
          .vehiclePage_nameContainer,
          .vehiclePage_typeContainer,
          .vehiclePage_hostContainer,
          .vehiclePage_vacancyContainer { background-color: #011a32; border-radius: 0.4rem; }
          .vehiclePage_nameContainer> :first-child,
          .vehiclePage_typeContainer> :first-child,
          .vehiclePage_hostContainer> :first-child,
          .vehiclePage_vacancyContainer> :first-child {
            color: rgba(255,255,255,0.85);
            background-color: #0a2745;
            font-weight: 700;
            margin-bottom: 0.3rem;
            border-radius: 0.4rem;
            text-align: start;
            padding-left: 0.3rem;
          }
          .vehiclePage_nameContainer> :nth-child(2),
          .vehiclePage_typeContainer> :nth-child(2),
          .vehiclePage_hostContainer> :nth-child(2),
          .vehiclePage_vacancyContainer> :nth-child(2) {
            background-color: #0a2745;
            color: rgba(255,255,255,0.9);
            border-radius: 0.4rem;
            text-align: start;
            padding-left: 0.3rem;
            border: none;
            outline: none;
          }
          .vehicle_imageContainer { background-color: #011a32; }
          .vehicle-name-input { background-color: #0a2745; color: rgba(255,255,255,0.9); border: none; outline: none; }
          .capacity-input { background-color: #0a2745; color: rgba(255,255,255,0.9); border: none; outline: none; }
          .type-input { background-color: #0a2745; color: rgba(255,255,255,0.9); border: none; outline: none; }
          .editor-container .ql-editor { background-color: #011a32; color: rgba(255,255,255,0.9); }
          .editor-container .ql-toolbar { background-color: #0a2745; border-color: rgba(255,255,255,0.15); }
          .editor-container .ql-toolbar .ql-stroke { stroke: rgba(255,255,255,0.7); }
          .editor-container .ql-toolbar .ql-fill { fill: rgba(255,255,255,0.7); }
          .editor-container .ql-toolbar .ql-picker { color: rgba(255,255,255,0.7); }
          .editor-container .ql-container { border-color: rgba(255,255,255,0.15); }
          .editor-container .ql-editor.ql-blank::before { color: rgba(255,255,255,0.35); font-style: italic; }
          ` : ``}
        `}
      </style>
    </div>
  );
}

export default CreateVehiclePage;

const AddImageSpinner = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 119, 234,0.1)",
        borderRadius: "1.5rem",
        position: "relative",
        margin: "auto",
        display: "flex",
        alignItems: "center",
        height: "2.5rem",
      }}
    >
      <div
        className="spinner"
        style={{
          height: "1rem",
          width: "1rem",
          border: "3px solid white",
          borderTop: "3px solid #1e90ff",
        }}
      ></div>
    </div>
  );
};

const RegisterSpinner = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "inherit",
      }}
    >
      <div
        className="spinner"
        style={{
          height: "1rem",
          width: "1rem",
          border: "3px solid white",
          borderTop: "3px solid #1e90ff",
        }}
      ></div>
    </div>
  );
};

const CompleteSpinner = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 119, 234,0.1)",
        borderRadius: "1.5rem",
        position: "relative",
        margin: "auto",
        display: "flex",
        alignItems: "center",
        height: "2.5rem",
      }}
    >
      <div
        className="spinner"
        style={{
          height: "1rem",
          width: "1rem",
          border: "3px solid white",
          borderTop: "3px solid #1e90ff",
        }}
      ></div>
    </div>
  );
};

const addImageButton = {
  backgroundColor: "#007bff",
  position: "absolute",
  bottom: "-0.5rem",
  borderRadius: "2rem",
  alignContent: "center",
  justifyItems: "center",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
  fontSize: "1.5rem",
  fontWeight: "800",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  left: "50%",
  transform: "translateX(-50%)", // Centers it horizontally
  width: "15rem",
  height: "2.5rem",
};

const placeHolderImage = {
  width: "20rem",
  height: "20rem",
  maxWidth: "20rem",
  margin: "0.5rem",
  borderRadius: "1rem",
  overflow: "hidden",
  objectFit: "cover",
};

const userUploadedImage = {
  width: "20rem",
  height: "20rem",
  objectFit: "cover",
  maxWidth: "20rem",
  borderRadius: "1rem",
  margin: "0.5rem",
};

const galleryImageUploadStyle = {
  width: "25rem",
  height: "25rem",
  objectFit: "cover",
  borderRadius: "1.5rem",
  border: "2px solid transparent",
};

const uploadedImagesContainer = {
  display: "flex",
  flexDirection: "row",
  overflow: "scroll",
  flex: 1,
  margin: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

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

const deleteImageIcon = {
  backgroundColor: " #3c9dee99",
  width: "3rem",
  height: "3rem",
  position: "absolute",
  top: "-0.5rem",
  right: "-0.5rem",
  borderRadius: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
};

const deleteImageIconHover = {
  transform: "scale(1.2)",
};

const galleryImageDeleteIcon = {
  backgroundColor: " #3c9dee99",
  width: "3rem",
  height: "3rem",
  position: "absolute",
  top: "-0.5rem",
  right: "-0.5rem",
  borderRadius: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
};

const uploadedImageDeleteIcon = {
  backgroundColor: " #3e99",
  width: "3rem",
  height: "3rem",
  position: "absolute",
  top: "0",
  right: "0",
  borderRadius: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
};

const galleryImageDeleteIconHover = {
  transform: "scale(1.2)",
};


const registerVehicleButton = {
  // position: "absolute",
  fontSize: "1.4rem",
  fontWeight: 800,
  color: "white",
  borderRadius: "1.5rem",
  paddingRight: "2rem",
  paddingLeft: "2rem",
  marginTop: "0.3rem",
  backgroundColor: "#007bff",
  cursor: "pointer",
  border: "none",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  padding: "0.2rem",
  width: "20rem",
};

const completeVehicleButton = {
  fontSize: "1.6rem",
  fontWeight: 800,
  color: "white",
  borderRadius: "1.5rem",
  paddingRight: "2rem",
  paddingLeft: "2rem",
  marginTop: "0.3rem",
  backgroundColor: "#007bff",
  cursor: "pointer",
  border: "none",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  padding: "0.2rem",
  width: "20rem",
};

const confirmModalOverlay = {
  position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1.5rem",
};
const confirmModalBox = {
  backgroundColor: "white", borderRadius: "1.25rem", padding: "1.75rem",
  width: "100%", maxWidth: "26rem", display: "flex", flexDirection: "column",
};
const confirmModalTitle = {
  fontFamily: "Nunito", fontWeight: 800, fontSize: "1.5rem", color: "#007bff", marginBottom: "0.75rem", textAlign: "left",
};
const confirmModalHeadline = {
  fontFamily: "Nunito", fontWeight: 800, fontSize: "1.25rem", color: "#1a2e4a", marginBottom: "0.25rem", textAlign: "left",
};
const confirmModalDesc = {
  fontFamily: "Nunito", fontWeight: 800, fontSize: "1rem", color: "#6b7280", marginBottom: "1rem", textAlign: "left",
};
const confirmModalPill = {
  display: "flex", alignItems: "center",
  backgroundColor: "#f3f4f6", borderRadius: "1rem",
  padding: "0.75rem 1rem", marginBottom: "0.5rem", width: "100%",
};
const confirmModalPillText = {
  fontWeight: 600, fontSize: "0.9rem", color: "#374151", textAlign: "left",
};
const confirmModalButtonRow = {
  display: "flex", flexDirection: "row", gap: "0.75rem",
  marginTop: "1.25rem", width: "100%", alignItems: "center",
};
const confirmModalCancelBtn = {
  flex: 1, textAlign: "center", fontWeight: 700, fontSize: "1rem", justifyContent: "center", display: "flex", alignItems: "center",
  color: "#6b7280", cursor: "pointer", border: "1.5px solid #e5e7eb",
  borderRadius: "1.875rem", padding: "0.75rem",
};
const confirmModalConfirmBtn = {
  flex: 1, backgroundColor: "#007bff", border: "none", borderRadius: "1.875rem",
  padding: "0.75rem", fontWeight: 700, fontSize: "1rem", color: "white",
  cursor: "pointer", textAlign: "center",
};

// Page 1 new card design
const s1Card = {
  backgroundColor: "white",
  borderRadius: "1.25rem",
  fontFamily: "Nunito",
  margin: "1rem auto",
  width: "75%",
  display: "flex",
  flexDirection: "column",
  maxHeight: "calc(100vh - 8rem)",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
};
const s1Body = {
  display: "flex",
  flexDirection: "row",
  padding: "2rem",
  gap: "2rem",
  flex: 1,
  overflowY: "auto",
  alignItems: "stretch",
};
const s1Left = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  textAlign: "left",
  alignItems: "stretch",
};
const s1Right = {
  width: "24rem",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  textAlign: "left",
  alignItems: "flex-start",
};
const s1SectionHeader = {
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "#9ca3af",
  letterSpacing: "0.08em",
  marginBottom: "0.75rem",
};
const s1FieldLabel = {
  fontSize: "1.0625rem",
  fontWeight: 700,
  color: "#1e3a5f",
  marginBottom: "0.35rem",
};
const s1TextInput = {
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "#f3f4f6",
  border: "none",
  borderRadius: "0.625rem",
  padding: "0.6rem 0.75rem",
  fontSize: "0.95rem",
  color: "#1e3a5f",
  outline: "none",
};
const s1FieldHint = {
  fontSize: "0.75rem",
  color: "#9ca3af",
  marginTop: "0.3rem",
};
const s1CharCount = {
  fontSize: "0.78rem",
  color: "#9ca3af",
  textAlign: "right",
  marginTop: "0.3rem",
};
const s1ImagePlaceholder = {
  backgroundColor: "#f3f4f6ca",
  width: "24rem",
  height: "24rem",
  borderRadius: "1.25rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  overflow: "hidden",
};
const s1ImagePlaceholderInner = {
  width: "19rem",
  height: "19rem",
  objectFit: "cover",
  opacity: 0.4,
  borderRadius: "1rem",
};
const s1ImagePreview = {
  width: "24rem",
  height: "24rem",
  objectFit: "cover",
  borderRadius: "1.25rem",
  border: "2px solid transparent",
};
const s1ImageCaption = {
  fontWeight: 700,
  fontSize: "1.125rem",
  color: "#1e3a5f",
  marginTop: "0.75rem",
};
const s1ImageSubCaption = {
  fontSize: "1rem",
  color: "#6b7280",
  marginTop: "0.25rem",
  lineHeight: 1.4,
};
const s1Footer = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1.25rem 2rem",
  borderTop: "1px solid #f3f4f6",
};
const s1FreePill = {
  backgroundColor: "rgba(0,180,100,0.1)",
  color: "#16a34a",
  fontWeight: 600,
  fontSize: "0.85rem",
  padding: "0.4rem 0.9rem",
  borderRadius: "2rem",
};
const s1RegisterBtn = {
  padding: "0.6rem 1.5rem",
  borderRadius: "2rem",
  backgroundColor: "#007bff",
  fontWeight: 700,
  fontSize: "0.95rem",
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  minWidth: "9rem",
  justifyContent: "center",
};

// Page 2 styles
const s2HeaderRow = {
  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
  padding: "1.5rem 2rem 1rem",
};
const s2Title = {
  fontFamily: "Nunito", fontWeight: 800, fontSize: "1.4rem", color: "#1e3a5f",
};
const s2Subtitle = {
  fontFamily: "Nunito", fontSize: "0.9rem", color: "#6b7280", marginTop: "0.25rem",
};
const s2Counter = {
  fontFamily: "Nunito", fontWeight: 700, fontSize: "1rem", color: "#9ca3af",
};
const s2Grid = {
  display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
  gap: "0.75rem", padding: "0 2rem 1rem",
};
const s2UploaderCell = {
  backgroundColor: "#f3f4f6ca", borderRadius: "1rem",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", aspectRatio: "1", overflow: "hidden",
};
const s2ImageCell = {
  position: "relative", borderRadius: "1rem", overflow: "hidden", aspectRatio: "1",
};
const s2GridImage = {
  width: "100%", height: "100%", objectFit: "cover",
};
const s2CoverBadge = {
  position: "absolute", top: "0.5rem", left: "0.5rem",
  backgroundColor: "#1e3a5f", color: "white",
  fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.07em",
  padding: "0.2rem 0.5rem", borderRadius: "0.35rem",
  fontFamily: "Nunito",
};
const s2DeleteBtn = {
  position: "absolute", top: "0.5rem", right: "0.5rem",
  backgroundColor: "rgba(30,30,30,0.6)", color: "white",
  width: "1.5rem", height: "1.5rem", borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", fontSize: "0.75rem", fontWeight: 700,
};
const s2PlaceholderCell = {
  backgroundColor: "#f9fafb", borderRadius: "1rem",
  display: "flex", alignItems: "center", justifyContent: "center",
  aspectRatio: "1", overflow: "hidden",
};
const s2PlaceholderImg = {
  width: "40%", height: "40%", objectFit: "contain", opacity: 0.3,
};
const s2SkipText = {
  fontFamily: "Nunito", fontWeight: 700, fontSize: "1rem",
  color: "#6b7280", cursor: "pointer",
};
const s2BackBtn = {
  padding: "0.6rem 1.2rem", borderRadius: "2rem",
  border: "1.5px solid #e5e7eb", fontWeight: 700, fontSize: "0.95rem",
  color: "#374151", cursor: "pointer", display: "flex", alignItems: "center",
  fontFamily: "Nunito",
};

const cvStepBarContainer = {
  display: "flex", alignItems: "center", gap: 0,
  padding: "11px 20px", borderBottom: "1px solid #E3E9F0", background: "#FAFCFE",
};
const cvStepItem = { display: "inline-flex", alignItems: "center", gap: "8px" };
const cvStepCircle = (active, done) => ({
  width: "21px", height: "21px", borderRadius: "50%", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "Nunito", fontWeight: 900, fontSize: "11.5px",
  backgroundColor: active || done ? "#0A77EA" : "#E3E9F0",
  color: active || done ? "#fff" : "#5C6B7A",
});
const cvStepLabel = (active, done) => ({
  fontFamily: "Nunito", fontWeight: 800, fontSize: "13px",
  color: active || done ? "#0A5FBF" : "#5C6B7A", whiteSpace: "nowrap",
});
const cvStepConnector = {
  width: "34px", height: "2px", margin: "0 12px",
  backgroundColor: "#E3E9F0", borderRadius: "2px", flexShrink: 0,
};
