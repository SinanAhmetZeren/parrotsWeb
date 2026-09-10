/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "swiper/css";
import "swiper/css/pagination";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import parrotCracker from "../assets/images/parrotCracker.png";
import uploadImage from "../assets/images/ParrotsLogoPlus.jpg";
import placeHolder from "../assets/images/placeholder1.png";
import {
  useGetVehiclesByUserByIdQuery,
} from "../slices/VehicleSlice";
import {
  useAddVoyageImageMutation,
  useCreateVoyageMutation,
  useDeleteVoyageImageMutation,
  usePatchVoyageOwnerMutation,
} from "../slices/VoyageSlice";
import { VoyageImageUploaderComponent } from "../components/VoyageImageUploaderComponent";
import { VoyageProfileImageUploader } from "../components/VoyageProfileImageUploader";
import { AddWaypointsPage } from "../components/AddWaypointsComponent";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  useAcknowledgePublicProfileMutation,
  setAcknowledgedPublicProfile,
  useGetParrotCrackerBalanceQuery,
} from "../slices/UserSlice";

export default function CreateVoyagePage() {
  const userId = localStorage.getItem("storedUserId");
  const dispatch = useDispatch();
  const hasAcknowledgedPublicProfile = useSelector((s) => s.users.hasAcknowledgedPublicProfile);
  const { data: crackerBalance } = useGetParrotCrackerBalanceQuery(userId);

  const [showPublicProfileModal, setShowPublicProfileModal] = useState(false);
  const [acknowledgePublicProfile] = useAcknowledgePublicProfileMutation();

  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pageState, setPageState] = useState(1);
  const [waypointsUnlocked, setWaypointsUnlocked] = useState(false);
  const [voyageBrief, setVoyageBrief] = useState("");
  const [voyageDescription, setVoyageDescription] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [voyageName, setVoyageName] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [currency, setCurrency] = useState("€");
  const [isAuction, setIsAuction] = useState(true);
  const [isFixedPrice, setIsFixedPrice] = useState(false);
  const [hoveredAuction, setHoveredAuction] = useState(false);
  const [hoveredFixedPrice, setHoveredFixedPrice] = useState(false);
  const [isPublicOnMap, setIsPublicOnMap] = useState(true);
  const [lastBidDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]);
  const [voyageId, setVoyageId] = useState("");
  const [order, setOrder] = useState(1);
  const [isCreatingVoyage, setIsCreatingVoyage] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // react-day-picker range state
  const [range, setRange] = useState({ from: undefined, to: undefined });

  const galleryInputRef = useRef(null);

  const handleGalleryImageChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const { resizeImage } = await import("../utils/resizeImage");
    const resized = await resizeImage(files[0]);
    setIsUploadingImage(true);
    try {
      const res = await addVoyageImage({ voyageImage: resized, voyageId }).unwrap();
      setAddedVoyageImages((prev) => [...prev, { addedvoyageImageId: res.imagePath, voyageImage: resized }]);
    } catch {
      toast.error("Failed to upload image.");
    }
    setIsUploadingImage(false);
    e.target.value = null;
  };

  const handleDeleteGalleryImage = async (imageId) => {
    try {
      await deleteVoyageImage(imageId).unwrap();
      setAddedVoyageImages((prev) => prev.filter((img) => img.addedvoyageImageId !== imageId));
    } catch {
      toast.error("Failed to delete image.");
    }
  };

  const walkDBId = process.env.REACT_APP_WALK_ID;
  const runDBId = process.env.REACT_APP_RUN_ID;
  const trainDBId = process.env.REACT_APP_TRAIN_ID;

  const [vehiclesList, setVehiclesList] = useState([
    { label: "Walk", value: walkDBId },
    { label: "Run", value: runDBId },
    { label: "Train", value: trainDBId },
  ]);

  useEffect(() => {
    if (!hasAcknowledgedPublicProfile) setShowPublicProfileModal(true);
  }, [hasAcknowledgedPublicProfile]);

  const handleAcknowledge = async () => {
    setShowPublicProfileModal(false);
    try {
      await acknowledgePublicProfile().unwrap();
      dispatch(setAcknowledgedPublicProfile());
    } catch (e) { }
  };

  const [addVoyageImage] = useAddVoyageImageMutation();
  const [deleteVoyageImage] = useDeleteVoyageImageMutation();
  const [createVoyage] = useCreateVoyageMutation();
  const [patchVoyageOwner] = usePatchVoyageOwnerMutation();

  const {
    data: usersVehiclesData,
    isLoading,
    isError,
    isSuccess: usersVehiclesSuccess,
  } = useGetVehiclesByUserByIdQuery(userId);

  useEffect(() => {
    const dropdownData =
      usersVehiclesSuccess &&
      [
        { label: "Walk", value: walkDBId },
        { label: "Run", value: runDBId },
        { label: "Train", value: trainDBId },
      ].concat(
        usersVehiclesData?.map((v) => ({ label: v.name, value: v.id }))
      );
    if (dropdownData) setVehiclesList(dropdownData);
  }, [usersVehiclesSuccess, usersVehiclesData]);

  function convertDateFormat(inputDate) {
    const d = new Date(inputDate);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}.${String(d.getUTCMilliseconds()).padStart(3, "0")}Z`;
  }

  const hasChanges = savedSnapshot && (
    voyageName !== savedSnapshot.voyageName ||
    voyageBrief !== savedSnapshot.voyageBrief ||
    voyageDescription !== savedSnapshot.voyageDescription ||
    String(selectedVacancy) !== String(savedSnapshot.selectedVacancy) ||
    String(vehicleId) !== String(savedSnapshot.vehicleId) ||
    String(minPrice) !== String(savedSnapshot.minPrice) ||
    String(maxPrice) !== String(savedSnapshot.maxPrice) ||
    currency !== savedSnapshot.currency ||
    isAuction !== savedSnapshot.isAuction ||
    isFixedPrice !== savedSnapshot.isFixedPrice ||
    isPublicOnMap !== savedSnapshot.isPublicOnMap ||
    String(range?.from) !== String(savedSnapshot.from) ||
    String(range?.to) !== String(savedSnapshot.to)
  );

  const isFormValid = !!(
    voyageName.trim() && vehicleId && selectedVacancy &&
    voyageBrief && voyageBrief !== "<p><br></p>" &&
    voyageDescription && voyageDescription !== "<p><br></p>" &&
    minPrice != null && maxPrice != null && maxPrice >= minPrice &&
    currency && range?.from && voyageImage
  );

  const buildPayload = () => {
    const startDate = range?.from;
    const endDate = range?.to || range?.from;
    const formattedStartDate = convertDateFormat(startDate);
    const formattedEndDate = convertDateFormat(endDate);
    const lastBidDateObj = new Date(endDate);
    lastBidDateObj.setHours(23, 59, 59, 999);
    const formattedLastBidDate = convertDateFormat(lastBidDateObj);
    return { formattedStartDate, formattedEndDate, formattedLastBidDate };
  };

  const handleSaveDraft = async () => {
    if (!voyageImage || !range?.from) return;
    setIsCreatingVoyage(true);
    try {
      const { formattedStartDate, formattedEndDate, formattedLastBidDate } = buildPayload();
      const response = await createVoyage({
        voyageImage, name: voyageName, brief: voyageBrief, description: voyageDescription,
        vacancy: selectedVacancy, formattedStartDate, formattedEndDate, formattedLastBidDate,
        minPrice, maxPrice, currency, isAuction, isFixedPrice, isPublicOnMap, userId, vehicleId,
      }).unwrap();
      if (!response.success) {
        toast("Not enough ParrotCrackers to create this voyage.", { autoClose: 6000 });
        setIsCreatingVoyage(false);
        return;
      }
      setVoyageId(response.data.id);
      setSavedSnapshot({ voyageName, voyageBrief, voyageDescription, selectedVacancy, vehicleId, minPrice, maxPrice, currency, isAuction, isFixedPrice, isPublicOnMap, lastBidDate, from: range?.from, to: range?.to });
    } catch {
      toast.error("Failed to create voyage. Please check your connection and try again.");
    }
    setIsCreatingVoyage(false);
  };

  const handleCreateVoyage = async () => {
    if (!voyageImage || !range?.from) return;
    setIsCreatingVoyage(true);
    try {
      const { formattedStartDate, formattedEndDate, formattedLastBidDate } = buildPayload();
      const response = await createVoyage({
        voyageImage, name: voyageName, brief: voyageBrief, description: voyageDescription,
        vacancy: selectedVacancy, formattedStartDate, formattedEndDate, formattedLastBidDate,
        minPrice, maxPrice, currency, isAuction, isFixedPrice, isPublicOnMap, userId, vehicleId,
      }).unwrap();
      if (!response.success) {
        toast(({ closeToast }) => (
          <div><strong className="text-xl">Not enough ParrotCrackers</strong><p className="text-lg">You need more crackers to create this voyage.</p></div>
        ), { autoClose: 6000 });
        setIsCreatingVoyage(false);
        return;
      }
      setVoyageId(response.data.id);
      setSavedSnapshot({ voyageName, voyageBrief, voyageDescription, selectedVacancy, vehicleId, minPrice, maxPrice, currency, isAuction, isFixedPrice, isPublicOnMap, lastBidDate, from: range?.from, to: range?.to });
      setIsCreatingVoyage(false);
      setPageState(2);
    } catch {
      toast.error("Failed to create voyage. Please check your connection and try again.");
    }
    setIsCreatingVoyage(false);
  };

  const handleUpdateDetails = async () => {
    setIsUpdatingDetails(true);
    try {
      const { formattedStartDate, formattedEndDate } = buildPayload();
      const patchDoc = [
        { op: "replace", path: "/name", value: voyageName },
        { op: "replace", path: "/brief", value: voyageBrief },
        { op: "replace", path: "/description", value: voyageDescription },
        { op: "replace", path: "/vacancy", value: Number(selectedVacancy) },
        { op: "replace", path: "/vehicleId", value: Number(vehicleId) },
        { op: "replace", path: "/minPrice", value: Number(minPrice) },
        { op: "replace", path: "/maxPrice", value: Number(maxPrice) },
        { op: "replace", path: "/currency", value: currency },
        { op: "replace", path: "/auction", value: isAuction },
        { op: "replace", path: "/fixedPrice", value: isFixedPrice },
        { op: "replace", path: "/publicOnMap", value: isPublicOnMap },
        { op: "replace", path: "/startDate", value: formattedStartDate },
        { op: "replace", path: "/endDate", value: formattedEndDate },
        { op: "replace", path: "/lastBidDate", value: formattedStartDate },
      ];
      await patchVoyageOwner({ voyageId, patchDoc }).unwrap();
      setSavedSnapshot({ voyageName, voyageBrief, voyageDescription, selectedVacancy, vehicleId, minPrice, maxPrice, currency, isAuction, isFixedPrice, isPublicOnMap, lastBidDate, from: range?.from, to: range?.to });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 5000);
    } catch {
      toast.error("Failed to update voyage details.");
    }
    setIsUpdatingDetails(false);
  };

  const { isError: isHealthCheckError } = useHealthCheckQuery();

  if (isHealthCheckError || isError) return <SomethingWentWrong />;

  if (isLoading) {
    return (
      <div style={{ height: "100vh", fontSize: "2rem" }}>
        <div className="App"><header className="App-header">
          <div className="flex mainpage_Container">
            <div className="flex mainpage_TopRow">
              <TopLeftComponent />
              <div className="flex mainpage_TopRight"><TopBarMenu /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
              <div className="spinner" style={{ height: "3rem", width: "3rem", border: "4px solid white", borderTop: "4px solid #1e90ff" }} />
            </div>
          </div>
        </header></div>
      </div>
    );
  }

  const formatDay = (d) => d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" }) : "—";

  return (
    <div style={{ height: "100vh", fontSize: "2rem" }}>
      {showPublicProfileModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={modalTitle}>ℹ️ Public Visibility</div>
            <p style={modalText}>Your voyage and profile are publicly visible — anyone can view them even if you choose not to show them on the map.</p>
            <button style={modalBtn} onClick={handleAcknowledge}>Got it</button>
          </div>
        </div>
      )}
      <div className="App"><header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight"><TopBarMenu /></div>
          </div>

          {pageState === 1 && (
            <div style={sheet}>
              {/* Step bar — inside the card header */}
              <div style={stepBarContainer}>
                {[["Voyage Details", 1], ["Voyage Images", 2], ["Waypoints", 3]].map(([label, step], i) => {
                  const active = pageState === step;
                  const done = pageState > step;
                  return (
                    <React.Fragment key={label}>
                      {i > 0 && <div style={stepConnector(done)} />}
                      <div style={stepItem}>
                        <div style={stepCircle(active, done)}>{step}</div>
                        <span style={stepLabel(active, done)}>{label}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              <style>{`
                .cv-input { font-family: Nunito, sans-serif; }
                .cv-input:focus { border-color: #0A77EA !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(10,119,234,0.14) !important; outline: none; }
                .cv-input::placeholder { color: #5C6B7A; font-weight: 600; }
                .rdp-root {
                  --rdp-accent-color: #0A77EA;
                  --rdp-accent-background-color: #dce9fb;
                  --rdp-day-height: 41px;
                  --rdp-day-width: 41px;
                  --rdp-day_button-height: 38px;
                  --rdp-day_button-width: 38px;
                  --rdp-day_button-border-radius: 0px;
                  --rdp-day_button-border: 2px solid transparent;
                  --rdp-range_middle-background-color: transparent;
                  --rdp-range_start-background: none;
                  --rdp-range_end-background: none;
                  --rdp-range_start-date-background-color: #0A77EA;
                  --rdp-range_end-date-background-color: #0A77EA;
                  --rdp-range_start-color: #fff;
                  --rdp-range_end-color: #fff;
                  --rdp-selected-border: 2px solid transparent;
                  font-family: Nunito, sans-serif;
                }
                .rdp-caption_label { font-size: 13px; font-weight: 800; color: #0A2540; }
                .rdp-weekday { font-size: 10px; font-weight: 700; color: #5C6B7A; opacity: 1; }
                .rdp-day_button { font-size: 11px; font-weight: 600; color: #0A2540; }
                .rdp-selected .rdp-day_button { border-color: transparent; }
                .rdp-today:not(.rdp-outside) { color: #0A77EA; }
                .rdp-chevron { fill: #5C6B7A; width: 12px; height: 12px; }
                .rdp-button_previous, .rdp-button_next { background: #F0F2F5; border-radius: 8px; width: 2rem; height: 2rem; }
                .rdp-button_previous:hover, .rdp-button_next:hover { background: #E3E9F0; }
                .rdp-month_caption { justify-content: center; font-size: 13px; font-weight: 800; color: #0A2540; }
                .rdp-range_start.rdp-range_end { background: none; }
                .rdp-range_middle .rdp-day_button { background-color: #dce9fb; border-radius: 0 !important; color: #0A5FBF !important; }
                .rdp-range_start .rdp-day_button { border-radius: 8px 0 0 8px !important; }
                .rdp-range_end .rdp-day_button { border-radius: 0 8px 8px 0 !important; }
                .rdp-range_start.rdp-range_end .rdp-day_button { border-radius: 8px !important; }
                .brief-editor-wrap .ql-editor { height: calc(3 * 2 * 13px); max-height: calc(3 * 2 * 13px); overflow-y: auto; font-size: 13px; font-family: Nunito, sans-serif; }
                .desc-editor-wrap .ql-editor { height: calc(7 * 2.1 * 13px); max-height: calc(7 * 2.1 * 13px); overflow-y: auto; font-size: 13px; font-family: Nunito, sans-serif; }
                .brief-editor-wrap .ql-toolbar, .desc-editor-wrap .ql-toolbar { border-color: #E3E9F0; background: #FAFCFE; }
                .brief-editor-wrap .ql-container, .desc-editor-wrap .ql-container { border-color: #E3E9F0; }
              `}</style>

              <div style={{ ...grid }}>
                {/* LEFT COLUMN */}
                <div style={{ ...col, backgroundColor: "transparent" }}>
                  {/* BASICS + PRICING */}
                  <div style={{ border: "2px solid #eeeeee", padding: "1rem", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <div style={sec}>Basics</div>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
                        <div style={field}>
                          <label style={lbl}>Voyage name</label>
                          <input className="cv-input" style={ctl} type="text" placeholder="Voyage name (max 30)" value={voyageName} maxLength={30} onChange={(e) => setVoyageName(e.target.value)} />

                        </div>
                        <div style={field}>
                          <label style={lbl}>Vehicle</label>
                          <select className="cv-input" style={{ ...ctl, ...selectArrow, color: vehicleId ? "#0A2540" : "#5C6B7A" }} value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
                            <option value="" disabled>Select</option>
                            {vehiclesList?.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                          </select>
                        </div>
                        <div style={field}>
                          <label style={lbl}>Vacancy</label>
                          <input className="cv-input" style={ctl} type="number" min={1} placeholder="0" value={selectedVacancy} onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") { setSelectedVacancy(""); return; }
                            setSelectedVacancy(Math.min(1000000, Math.max(1, parseInt(raw) || 1)));
                          }} />
                        </div>
                      </div>
                    </div>

                    {/* PRICING */}
                    <div>
                      <div style={sec}>Pricing</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr .75fr", gap: "10px", alignItems: "end" }}>
                        <div style={field}>
                          <label style={lbl}>Type</label>
                          <div style={pmode}>
                            <button style={{ ...(isAuction ? pmodeOn : pmodeOff), position: "relative" }} onClick={() => setIsAuction(!isAuction)} onMouseEnter={() => setHoveredAuction(true)} onMouseLeave={() => setHoveredAuction(false)}>
                              Auction
                              {hoveredAuction && <div style={cvTooltip}>{isAuction ? "This is an auction where the host will select the most suitable bids" : "This is not an auction where the host will select the most suitable bids"}</div>}
                            </button>
                            <button style={{ ...(isFixedPrice ? pmodeOn : pmodeOff), position: "relative" }} onClick={() => setIsFixedPrice(!isFixedPrice)} onMouseEnter={() => setHoveredFixedPrice(true)} onMouseLeave={() => setHoveredFixedPrice(false)}>
                              Fixed price
                              {hoveredFixedPrice && <div style={cvTooltip}>{isFixedPrice ? "This voyage has a fixed price set by the host" : "This voyage does not have a fixed price set by the host"}</div>}
                            </button>
                          </div>
                        </div>
                        <div style={field}>
                          <label style={lbl}>Min price</label>
                          <input className="cv-input" style={ctl} type="number" placeholder="0" value={minPrice ?? ""} onChange={(e) => {
                            const v = e.target.value === "" ? 0 : Number(e.target.value);
                            if (isFixedPrice) { setMinPrice(v); setMaxPrice(v); } else setMinPrice(v);
                          }} />
                        </div>
                        <div style={field}>
                          <label style={lbl}>Max price {maxPrice != null && minPrice != null && maxPrice < minPrice && <span style={{ color: "#ef4444", fontWeight: 700, fontSize: "11px" }}>must be ≥ min</span>}</label>
                          <input className="cv-input" style={ctl} type="number" placeholder="0" value={maxPrice ?? ""} onChange={(e) => {
                            const v = e.target.value === "" ? 0 : Number(e.target.value);
                            if (isFixedPrice) { setMinPrice(v); setMaxPrice(v); } else setMaxPrice(v);
                          }} />
                        </div>
                        <div style={field}>
                          <label style={lbl}>Currency</label>
                          <select className="cv-input" style={{ ...ctl, ...selectArrow }} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            {["€", "$", "£"].map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>{/* end BASICS+PRICING wrapper */}

                  {/* BRIEF */}
                  <div>
                    <div style={sec}>Brief</div>
                    <div className="brief-editor-wrap" style={editorWrap}>
                      <ReactQuill
                        value={voyageBrief}
                        onChange={(val) => { const t = val.replace(/<[^>]+>/g, ""); if (t.length <= 300) setVoyageBrief(val); }}
                        placeholder="Brief (max 300 characters)"
                        modules={{ toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }]] }}
                      />
                    </div>
                    <div style={charCount}>{voyageBrief.replace(/<[^>]+>/g, "").length} / 300</div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <div style={sec}>Description</div>
                    <div className="desc-editor-wrap" style={editorWrap}>
                      <ReactQuill
                        value={voyageDescription}
                        onChange={(val) => { const t = val.replace(/<[^>]+>/g, ""); if (t.length <= 10000) setVoyageDescription(val); }}
                        placeholder="Description (max 10,000 characters)"
                        modules={{ toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }]] }}
                      />
                    </div>
                    <div style={charCount}>{voyageDescription.replace(/<[^>]+>/g, "").length} / 10,000</div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ ...col }}>
                  {/* Profile image */}
                  <div style={{ border: "2px solid #eeeeee", padding: "1rem", borderRadius: "1rem" }}>
                    <div style={sec}>Profile image</div>
                    <VoyageProfileImageUploader voyageImage={voyageImage} setVoyageImage={setVoyageImage} />
                    <div style={cap}>Square works best. You can add more photos on the next page.</div>
                  </div>


                  {/* Dates */}
                  <div style={calBox}><div style={{ ...sec, width: "100%", textAlign: "left" }}>Dates</div>
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      disabled={{ before: new Date() }}
                      formatters={{ formatWeekdayName: (day) => "SMTWTFS"[day.getDay()] }}
                      navLayout="around"
                    />
                    <div style={rangeRow}>
                      <div style={{ ...rangeChip, ...rangeChipSet, color: range?.from ? "#0A5FBF" : "transparent" }}>{formatDay(range?.from || new Date())}</div>
                      <span style={{ color: "#5C6B7A", fontWeight: 700, fontSize: "13px" }}>→</span>
                      <div style={{ ...rangeChip, ...rangeChipSet, color: range?.to ? "#0A5FBF" : "transparent" }}>{formatDay(range?.to || new Date())}</div>
                    </div>
                    {(() => {
                      const today = new Date(); today.setHours(0, 0, 0, 0);
                      const end = range?.to || range?.from;
                      const cost = isPublicOnMap && end ? Math.max(0, Math.round((end - today) / (1000 * 60 * 60 * 24)) + 1) : 0;
                      const balance = crackerBalance?.balance ?? null;
                      const notEnough = isPublicOnMap && balance != null && cost > 0 && balance < cost;
                      const visible = !!range?.from;
                      return (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", fontSize: "12px", fontWeight: 700, color: notEnough ? "#dc2626" : "#0A2540", fontFamily: "Nunito", opacity: visible ? 1 : 0, pointerEvents: "none" }}>
                          <img src={parrotCracker} alt="" style={{ width: "18px", height: "18px" }} />
                          {isPublicOnMap && cost > 0
                            ? notEnough
                              ? <span><strong>{cost} ParrotCrackers</strong> are needed, you have {balance ?? "?"}</span>
                              : <span><strong>{cost}</strong> of your <strong>{balance ?? "?"}</strong> ParrotCrackers will be used</span>
                            : <span>No ParrotCrackers will be used</span>
                          }
                        </div>
                      );
                    })()}
                  </div>

                  {/* Visibility */}
                  <div>
                    <div style={sec}>Visibility</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer" }} onClick={() => setIsPublicOnMap(!isPublicOnMap)}>
                      <div style={track(isPublicOnMap)}><div style={knob(isPublicOnMap)} /></div>
                      <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#0A2540", fontFamily: "Nunito" }}>Public on the map</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={footer}>
                <span style={crackerPill}>✓ 1 cracker per day live</span>
                <button
                  style={{ ...goBtn, position: "relative", ...(isCreatingVoyage || (!voyageId && !isFormValid) ? { opacity: 0.6, cursor: "not-allowed" } : {}) }}
                  onClick={voyageId ? () => setPageState(2) : (isFormValid && !isCreatingVoyage ? handleCreateVoyage : undefined)}
                >
                  <span style={{ opacity: isCreatingVoyage ? 0 : 1 }}>Next: Images ›</span>
                  {isCreatingVoyage && <CvSpinner />}
                </button>
              </div>
            </div>
          )}

          {pageState === 2 && (
            <div style={{ backgroundColor: "white", borderRadius: "1.25rem", fontFamily: "Nunito", margin: "1rem auto", width: "75%", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 8rem)", overflow: "hidden", boxShadow: "0 16px 40px rgba(0,14,30,0.2)" }}>
              {/* Step bar */}
              <div style={stepBarContainer}>
                {[["Voyage Details", 1], ["Voyage Images", 2], ["Waypoints", 3]].map(([label, step], i) => {
                  const active = pageState === step;
                  const done = pageState > step;
                  return (
                    <React.Fragment key={label}>
                      {i > 0 && <div style={stepConnector(done)} />}
                      <div style={stepItem}>
                        <div style={stepCircle(active, done)}>{step}</div>
                        <span style={stepLabel(active, done)}>{label}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div style={{ marginLeft: "auto", fontFamily: "Nunito", fontWeight: 700, fontSize: "0.9rem", color: "#9ca3af" }}>{addedVoyageImages.length} / 8</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.75rem", padding: "0 2rem 1rem", overflowY: "auto" }}>
                <input type="file" accept="image/*" ref={galleryInputRef} onChange={handleGalleryImageChange} style={{ display: "none" }} />
                <div style={{ backgroundColor: "#f3f4f6ca", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", aspectRatio: "1", overflow: "hidden" }}
                  onClick={!isUploadingImage ? () => galleryInputRef.current.click() : undefined}>
                  {isUploadingImage
                    ? <div className="spinner" style={{ height: "2rem", width: "2rem", border: "3px solid #3b82f6", borderTop: "3px solid transparent" }} />
                    : <div style={{ backgroundColor: "white", height: "85%", width: "85%", borderRadius: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={uploadImage} alt="Upload" style={{ width: "70%", height: "70%", objectFit: "cover", opacity: 0.45, borderRadius: "0.75rem" }} />
                    </div>
                  }
                </div>

                {addedVoyageImages.map((item, index) => (
                  <div style={{ position: "relative", borderRadius: "1rem", overflow: "hidden", aspectRatio: "1" }} key={item.addedvoyageImageId}>
                    <img src={URL.createObjectURL(item.voyageImage)} alt={`Uploaded ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", backgroundColor: "rgba(30,30,30,0.6)", color: "white", width: "1.5rem", height: "1.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}
                      onClick={() => handleDeleteGalleryImage(item.addedvoyageImageId)}>✕</div>
                  </div>
                ))}

                {Array.from({ length: Math.max(0, 11 - addedVoyageImages.length) }).map((_, i) => (
                  <div style={{ backgroundColor: "#f9fafb", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1", overflow: "hidden" }} key={`ph_${i}`}>
                    <img src={placeHolder} alt="" style={{ width: "40%", height: "40%", objectFit: "contain", opacity: 0.3 }} />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2rem", borderTop: "1px solid #f3f4f6" }}>
                <div style={{ backgroundColor: "rgba(0,180,100,0.1)", color: "#16a34a", fontWeight: 600, fontSize: "0.85rem", padding: "0.4rem 0.9rem", borderRadius: "2rem" }}>✓ Free — no ParrotCrackers used</div>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ padding: "0.6rem 1.2rem", borderRadius: "2rem", border: "1.5px solid #e5e7eb", fontWeight: 700, fontSize: "0.95rem", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", fontFamily: "Nunito" }}
                    onClick={() => setPageState(1)}>‹ Back</div>
                  <div style={{ padding: "0.6rem 1.5rem", borderRadius: "2rem", backgroundColor: "#007bff", fontWeight: 700, fontSize: "0.95rem", color: "white", cursor: "pointer", display: "flex", alignItems: "center", fontFamily: "Nunito" }}
                    onClick={() => { setWaypointsUnlocked(true); setPageState(3); }}>
                    {addedVoyageImages.length === 0 ? "Skip for now" : "Next: Waypoints ›"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {pageState === 3 && (
            <AddWaypointsPage
              voyageId={voyageId}
              setPageState={setPageState}
              order={order}
              setOrder={setOrder}
              voyageName={voyageName}
              startDate={range?.from}
              endDate={range?.to}
              isPublicOnMap={isPublicOnMap}
              crackerBalance={crackerBalance}
            />
          )}
        </div>
      </header></div>
    </div>
  );
}

const CvSpinner = () => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "inherit" }}>
    <div className="spinner" style={{ height: "1rem", width: "1rem", border: "3px solid white", borderTop: "3px solid #1e90ff" }} />
  </div>
);

// ─── Design tokens ────────────────────────────────────────────────────────────

const stepBarContainer = {
  display: "flex", alignItems: "center", gap: 0,
  padding: "11px 20px", borderBottom: "1px solid #E3E9F0",
  background: "#FAFCFE",
};
const stepItem = {
  display: "inline-flex", alignItems: "center", gap: "8px",
};
const stepCircle = (active, done) => ({
  width: "21px", height: "21px", borderRadius: "50%", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "Nunito", fontWeight: 900, fontSize: "11.5px",
  backgroundColor: active || done ? "#0A77EA" : "#E3E9F0",
  color: active || done ? "#fff" : "#5C6B7A",
});
const stepLabel = (active, done) => ({
  fontFamily: "Nunito", fontWeight: 800, fontSize: "13px",
  color: active || done ? "#0A5FBF" : "#5C6B7A",
  whiteSpace: "nowrap",
});
const stepConnector = () => ({
  width: "34px", height: "2px", margin: "0 12px",
  backgroundColor: "#E3E9F0", borderRadius: "2px", flexShrink: 0,
});

const sheet = {
  backgroundColor: "#fff", borderRadius: "14px", overflow: "hidden",
  boxShadow: "0 16px 40px rgba(0,14,30,0.2)", width: "90%", margin: "0 auto",
  display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 9rem)",
};
const grid = {
  display: "grid", gridTemplateColumns: "5fr 2fr", gap: 30,
  padding: "18px 20px 16px 20px", flex: 1, overflowY: "auto",
};
const col = { minWidth: 0, display: "flex", flexDirection: "column", gap: "16px", alignSelf: "start" };
const sec = {
  fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
  color: "#5C6B7A", marginBottom: "8px", fontFamily: "Nunito", textAlign: "left",
};
const field = { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 };
const lbl = { fontSize: "13px", fontWeight: 800, color: "#5C6B7A", fontFamily: "Nunito", textAlign: "left" };
const ctl = {
  fontFamily: "Nunito", fontSize: "13.5px", fontWeight: 700, color: "#0A2540",
  backgroundColor: "#F8FAFD", border: "1.5px solid transparent", borderRadius: "8px",
  padding: "9px 10px", width: "100%", boxSizing: "border-box", outline: "none",
};
const selectArrow = {
  appearance: "none",
  backgroundImage: "linear-gradient(45deg,transparent 50%,#5C6B7A 50%),linear-gradient(135deg,#5C6B7A 50%,transparent 50%)",
  backgroundPosition: "calc(100% - 15px) 52%, calc(100% - 11px) 52%",
  backgroundSize: "4px 4px, 4px 4px", backgroundRepeat: "no-repeat", paddingRight: "28px", cursor: "pointer",
};
const hint = { fontSize: "10.5px", fontWeight: 700, color: "#5C6B7A" };
const pmode = {
  display: "inline-flex", justifyContent: "space-around", backgroundColor: "#F8FAFD", borderRadius: "8px",
  padding: "3px 0.5rem", gap: "2px",
};
const pmodeOn = {
  fontFamily: "Nunito", border: "none", cursor: "pointer", padding: "6px calc(14px + 0.5rem)",
  borderRadius: "6px", fontSize: "12.5px", fontWeight: 800, color: "#0A2540",
  backgroundColor: "white", boxShadow: "0 1px 3px rgba(10,37,64,0.16)",
};
const pmodeOff = {
  fontFamily: "Nunito", border: "none", cursor: "pointer", padding: "6px calc(14px + 0.5rem)",
  borderRadius: "6px", fontSize: "12.5px", fontWeight: 800, color: "#5C6B7A",
};
const editorWrap = {
  border: "0.5px solid #E3E9F0", borderRadius: "9px", overflow: "hidden",
};
const charCount = {
  display: "flex", justifyContent: "flex-end", fontSize: "10.5px", fontWeight: 700, color: "#5C6B7A",
};
const cap = { fontSize: "12px", fontWeight: 700, color: "#5C6B7A", lineHeight: 1.4, marginTop: "7px" };
const calBox = {
  border: "2px solid #E3E9F0", borderRadius: "11px", padding: "10px",
  display: "flex", flexDirection: "column", alignItems: "center",
};
const rangeRow = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
  marginTop: "9px", paddingTop: "9px", borderTop: "1px solid #E3E9F0",
};
const rangeChip = {
  backgroundColor: "#F8FAFD", borderRadius: "7px", padding: "7px 28px",
  textAlign: "center", fontSize: "12px", fontWeight: 800, color: "#5C6B7A", fontFamily: "Nunito", whiteSpace: "nowrap",
};
const rangeChipSet = { backgroundColor: "#E4F0FE", color: "#0A5FBF" };
const track = (on) => ({
  width: "36px", height: "21px", borderRadius: "99px",
  backgroundColor: on ? "#2AC898" : "#CFD7DE", position: "relative", flexShrink: 0, transition: "background 0.2s",
});
const knob = (on) => ({
  position: "absolute", top: "3px", left: on ? "18px" : "3px",
  width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "white",
  boxShadow: "0 1px 2px rgba(0,0,0,0.22)", transition: "left 0.2s",
});
const footer = {
  display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FAFCFE",
  borderTop: "1px solid #E3E9F0", padding: "12px 20px",
};
const crackerPill = {
  display: "inline-flex", alignItems: "center", gap: "5px", backgroundColor: "#E1F5EA",
  color: "#0B6B4E", fontSize: "11px", fontWeight: 800, padding: "5px 10px",
  borderRadius: "99px", fontFamily: "Nunito",
};
const ghostBtn = {
  fontFamily: "Nunito", border: "1.5px solid #E3E9F0", fontSize: "13.5px", fontWeight: 800,
  padding: "10px 20px", borderRadius: "99px", cursor: "pointer", backgroundColor: "white",
  color: "#5C6B7A", whiteSpace: "nowrap",
};
const goBtn = {
  fontFamily: "Nunito", border: "none", fontSize: "13.5px", fontWeight: 800,
  padding: "10px 20px", borderRadius: "99px", cursor: "pointer",
  backgroundColor: "#0A77EA", color: "white", whiteSpace: "nowrap",
  display: "inline-flex", alignItems: "center", minWidth: "9rem", justifyContent: "center",
};

// ─── Public profile modal ─────────────────────────────────────────────────────
const modalOverlay = { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 };
const cvTooltip = {
  position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-2rem)",
  backgroundColor: "rgba(0,0,0,0.75)", color: "white", borderRadius: "0.5rem",
  padding: "0.3rem 0.7rem", fontSize: "0.85rem", fontWeight: 500,
  whiteSpace: "nowrap", zIndex: 100, pointerEvents: "none",
};
const modalBox = { backgroundColor: "#fff", borderRadius: "12px", padding: "2rem", maxWidth: "480px", width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", textAlign: "center" };
const modalTitle = { fontSize: "1.3rem", fontWeight: 700, color: "#0A2540", marginBottom: "1rem" };
const modalText = { fontSize: "1rem", color: "#374151", lineHeight: 1.6, marginBottom: "1.5rem" };
const modalBtn = { backgroundColor: "#0A77EA", color: "white", border: "none", borderRadius: "8px", padding: "0.65rem 2rem", fontSize: "1rem", fontWeight: 600, cursor: "pointer" };
