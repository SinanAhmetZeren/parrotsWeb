/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css";
import {
  useDeleteVehicleMutation,
  useGetVehicleByIdQuery,
  useAddVehicleToFavoritesMutation,
  useDeleteVehicleFromFavoritesMutation,
} from "../slices/VehicleSlice";
import {
  addVehicleToUserFavorites,
  removeVehicleFromUserFavorites,
  useGetFavoriteVehicleIdsByUserIdQuery,
  updateUserFavoriteVehicles,
} from "../slices/UserSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { VehicleDetailPlaceHolderComponent } from "../components/VehicleDetailPlaceHolderComponent";
import VehicleVoyages from "../components/VehicleVoyages";
import { IoHeartSharp } from "react-icons/io5";
import { ImageGallery } from "../components/ImageGallery";

const VehicleTypes = ["Boat", "Car", "Caravan", "Bus", "Walk", "Run", "Motorcycle", "Bicycle", "TinyHouse", "Airplane", "Train"];

function VehicleDetailsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { vehicleId } = useParams();
  console.log("entered VehicleDetailsPage");
  const userId = localStorage.getItem("storedUserId");

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ── Favorites ──────────────────────────────────────────────────────────────
  const favoriteVehicles = useSelector((state) => state.users.userFavoriteVehicles);
  const isInFavorites = favoriteVehicles?.includes(Number(vehicleId));
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: favoriteVehiclesData } = useGetFavoriteVehicleIdsByUserIdQuery(userId);
  const [addVehicleToFavorites] = useAddVehicleToFavoritesMutation();
  const [deleteVehicleFromFavorites] = useDeleteVehicleFromFavoritesMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();

  useEffect(() => {
    dispatch(updateUserFavoriteVehicles({ favoriteVehicles: favoriteVehiclesData }));
  }, [favoriteVehiclesData, dispatch]);

  useEffect(() => {
    setIsFavorited(isInFavorites);
  }, [isInFavorites]);

  const handleAddVehicleToFavorites = () => {
    const id = Number(vehicleId);
    addVehicleToFavorites({ userId, vehicleId: id });
    setIsFavorited(true);
    dispatch(addVehicleToUserFavorites({ favoriteVehicle: id }));
  };

  const handleDeleteVehicleFromFavorites = () => {
    const id = Number(vehicleId);
    deleteVehicleFromFavorites({ userId, vehicleId: id });
    setIsFavorited(false);
    dispatch(removeVehicleFromUserFavorites({ favoriteVehicle: id }));
  };

  const handleDeleteVehicle = async () => {
    setIsDeleting(true);
    try {
      await deleteVehicle(vehicleId).unwrap();
      navigate("/profile", { state: { refetch: true } });
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      toast.error("Failed to delete vehicle. Please try again.");
    }
    setIsDeleting(false);
  };

  // ── Vehicle data ───────────────────────────────────────────────────────────
  const { data: VehicleData, isSuccess: isSuccessVehicle, isLoading: isLoadingVehicle, isError: isErrorVehicle } =
    useGetVehicleByIdQuery(vehicleId, { refetchOnFocus: true, refetchOnReconnect: true });

  const { data: healthCheckData, isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;
  if (isErrorVehicle) return <SomethingWentWrong />;

  const isOwnVehicle = VehicleData?.user?.id === userId;
  const galleryImages = VehicleData?.vehicleImages || [];
  const allImages = [
    VehicleData?.profileImageUrl,
    ...galleryImages.map((img) => img.imageUrl),
  ].filter(Boolean);

  return isLoadingVehicle ? (
    <VehicleDetailPlaceHolderComponent />
  ) : isSuccessVehicle && VehicleData ? (
    <div className="App">
      <header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>

          <div style={s1Card}>
            <div style={s1Body}>
              {/* Left column: fields + description */}
              <div style={s1Left}>
                <div style={s1SectionHeader}>BASICS</div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                  {/* Name */}
                  <div style={{ flex: 2 }}>
                    <div style={s1FieldLabel}>Name</div>
                    <div style={s1DisplayField}>{VehicleData.name}</div>
                  </div>
                  {/* Capacity */}
                  <div style={{ flex: 1 }}>
                    <div style={s1FieldLabel}>Capacity</div>
                    <div style={s1DisplayField}>{VehicleData.capacity}</div>
                  </div>
                  {/* Type */}
                  <div style={{ flex: 1 }}>
                    <div style={s1FieldLabel}>Type</div>
                    <div style={s1DisplayField}>{VehicleTypes[VehicleData.type] ?? VehicleData.type}</div>
                  </div>
                </div>

                {/* Host */}
                <div style={{ marginTop: "1rem" }}>
                  <div style={s1FieldLabel}>Host</div>
                  <div
                    style={{ ...s1DisplayField, display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", width: "fit-content" }}
                    onClick={() => navigate(`/profile-public/${VehicleData?.user?.publicId}/${VehicleData?.user?.userName}`)}
                  >
                    <img src={VehicleData?.user?.profileImageUrl} alt="" style={{ width: "1.75rem", height: "1.75rem", borderRadius: "50%", objectFit: "cover" }} />
                    <span style={{ fontWeight: 700, color: "#1e3a5f" }}>{VehicleData?.user?.userName}</span>
                  </div>
                </div>

                <div style={{ ...s1SectionHeader, marginTop: "1.5rem" }}>DESCRIPTION</div>
                <div
                  style={{ flex: 1, fontSize: "0.95rem", color: "#111827", lineHeight: 1.6, overflowY: "auto", scrollbarWidth: "none" }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(VehicleData.description) }}
                />

                {/* Voyages */}
                {VehicleData.voyages?.length > 0 && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <div style={s1SectionHeader}>VOYAGES</div>
                    <VehicleVoyages voyages={VehicleData.voyages} isDarkMode={false} />
                  </div>
                )}
              </div>

              {/* Right column: image gallery with thumbnails */}
              <div style={{ ...s1Right, width: "24rem", height: "24rem", overflow: "hidden", borderRadius: "1rem", flexShrink: 0 }}>
                <ImageGallery images={allImages} width="24rem" height="24rem" />
              </div>
            </div>

            {/* Footer */}
            <div style={s1Footer}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                {!isOwnVehicle && (
                  <div
                    style={{ ...s1RegisterBtn, backgroundColor: isFavorited ? "#ef4444" : "#f97316", gap: "0.4rem" }}
                    onClick={isFavorited ? handleDeleteVehicleFromFavorites : handleAddVehicleToFavorites}
                  >
                    <IoHeartSharp size="1rem" />
                    {isFavorited ? "Remove favorite" : "Add to favorites"}
                  </div>
                )}
              </div>
              {isOwnVehicle && (
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <div style={{ ...s1RegisterBtn, backgroundColor: "#007bff" }} onClick={() => navigate(`/edit-vehicle/${vehicleId}`)}>
                    Edit vehicle
                  </div>
                  <div
                    style={{ ...s1RegisterBtn, backgroundColor: isDeleting ? "#9ca3af" : "#ef4444", position: "relative" }}
                    onClick={!isDeleting ? () => setIsDeleteModalOpen(true) : undefined}
                  >
                    <span style={{ opacity: isDeleting ? 0 : 1 }}>Delete vehicle</span>
                    {isDeleting && <DeleteSpinner />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Delete confirm modal */}
      {isDeleteModalOpen && (
        <div style={confirmModalOverlay}>
          <div style={confirmModalBox}>
            <div style={confirmModalTitle}>Delete this vehicle?</div>
            <div style={confirmModalDesc}>This will also remove all its voyages. This cannot be undone.</div>
            <div style={confirmModalButtonRow}>
              <div style={confirmModalCancelBtn} onClick={() => setIsDeleteModalOpen(false)}>Cancel</div>
              <div style={confirmModalConfirmBtn} onClick={() => { setIsDeleteModalOpen(false); handleDeleteVehicle(); }}>Delete vehicle</div>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
}

export default VehicleDetailsPage;

const DeleteSpinner = () => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "inherit" }}>
    <div className="spinner" style={{ height: "1rem", width: "1rem", border: "3px solid white", borderTop: "3px solid #fca5a5" }} />
  </div>
);

// ── Styles (mirroring CreateVehiclePage) ────────────────────────────────────

const s1Card = {
  backgroundColor: "white",
  borderRadius: "1.25rem",
  fontFamily: "Nunito",
  margin: "1rem auto",
  width: "75%",
  display: "flex",
  flexDirection: "column",
  height: "calc(100vh - 10rem)",
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
  width: "30rem",
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
const s1DisplayField = {
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "#f3f4f6",
  borderRadius: "0.625rem",
  padding: "0.6rem 0.75rem",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#1e3a5f",
  fontFamily: "Nunito",
};
const s1Footer = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1.25rem 2rem",
  borderTop: "1px solid #f3f4f6",
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

const confirmModalOverlay = {
  position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};
const confirmModalBox = {
  backgroundColor: "white", borderRadius: "1.25rem", padding: "1.75rem",
  width: "100%", maxWidth: "26rem", display: "flex", flexDirection: "column",
};
const confirmModalTitle = {
  fontFamily: "Nunito", fontWeight: 800, fontSize: "1.5rem", color: "#ef4444", marginBottom: "0.5rem",
};
const confirmModalDesc = {
  fontFamily: "Nunito", fontWeight: 600, fontSize: "0.95rem", color: "#6b7280", marginBottom: "1.5rem",
};
const confirmModalButtonRow = {
  display: "flex", flexDirection: "row", gap: "0.75rem", width: "100%", alignItems: "center",
};
const confirmModalCancelBtn = {
  flex: 1, textAlign: "center", fontWeight: 700, fontSize: "1rem",
  justifyContent: "center", display: "flex", alignItems: "center",
  color: "#6b7280", cursor: "pointer", border: "1.5px solid #e5e7eb",
  borderRadius: "1.875rem", padding: "0.75rem",
};
const confirmModalConfirmBtn = {
  flex: 1, backgroundColor: "#ef4444", border: "none", borderRadius: "1.875rem",
  padding: "0.75rem", fontWeight: 700, fontSize: "1rem", color: "white",
  cursor: "pointer", textAlign: "center",
};
