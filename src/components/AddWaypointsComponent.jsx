
/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback, useRef } from "react";
import "../assets/css/CreateVehicle.css"
import "react-quill/dist/quill.snow.css";
import { IoRemoveCircleOutline } from "react-icons/io5";
import uploadImage from "../assets/images/ParrotsLogoPlus.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import parrotMarker1 from "../assets/images/parrotMarker1.png";
import parrotsLogo from "../assets/images/ParrotsLogo.png";
import { useAddWaypointMutation, useAddWaypointNoImageMutation, useConfirmVoyageMutation, useDeleteWaypointMutation } from "../slices/VoyageSlice"
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { CreateVoyageWaypointsMarkers } from "./CreateVoyageWaypointsMarkers";
import { CreateVoyagePolyLineComponent } from "./CreateVoyagePolyLineComponent";
import { useNavigate } from "react-router-dom";

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

export const AddWaypointsPage = ({
    voyageId,
    setPageState,
    order,
    setOrder
}) => {
    const [waypointTitle, setWaypointTitle] = useState("")
    const [waypointLatitude, setWaypointLatitude] = useState(null)
    const [waypointLongitude, setWaypointLongitude] = useState(null)
    const [waypointImage, setWaypointImage] = useState("")
    const [waypointBrief, setWaypointBrief] = useState("")
    const [initialLatitude, setInitialLatitude] = useState();
    const [initialLongitude, setInitialLongitude] = useState();
    const [addedWaypoints, setAddedWaypoints] = useState([]);
    const [imagePreview, setImagePreview] = useState("")
    const [isUploadingWaypointImage, setIsUploadingWaypointImage] = useState(false);
    const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);
    const [addWaypoint] = useAddWaypointMutation();
    const [addWaypointNoImage] = useAddWaypointNoImageMutation();
    const [deleteWaypoint] = useDeleteWaypointMutation();
    const [confirmVoyage] = useConfirmVoyageMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setInitialLatitude(position.coords.latitude);
                    setInitialLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setInitialLatitude(37.7749);
                    setInitialLongitude(-122.4194);
                }
            );
        } else {
            setInitialLatitude(37.7749);
            setInitialLongitude(-122.4194);
        }
    }, []);

    const handleAddWaypoint = async () => {
        setIsAddingWaypoint(true)
        if (!waypointImage) {
            console.log("no image");
        }
        setIsUploadingWaypointImage(true);
        const hasImage = waypointImage instanceof File;

        try {
            const result = hasImage ? await addWaypoint({
                waypointImage,
                latitude: waypointLatitude,
                longitude: waypointLongitude,
                title: waypointTitle,
                description: waypointBrief,
                voyageId: voyageId,
                order,
            }) : await addWaypointNoImage({
                latitude: waypointLatitude,
                longitude: waypointLongitude,
                title: waypointTitle,
                description: waypointBrief,
                voyageId: voyageId,
                order,
            })

            const waypointId = result.data.data
            setOrder(order + 1);
            setAddedWaypoints((prevWaypoints) => [
                ...prevWaypoints,
                {
                    waypointId,
                    waypointImage,
                    latitude: waypointLatitude,
                    longitude: waypointLongitude,
                    title: waypointTitle,
                    description: waypointBrief,
                    voyageId,
                    order,
                },
            ]);
            setWaypointLongitude(null)
            setWaypointLatitude(null)
            setWaypointTitle("")
            setWaypointBrief("")
            setImagePreview("")
        } catch (error) {
            console.error("Error uploading image", error);
        }
        setIsUploadingWaypointImage(false);
        setIsAddingWaypoint(false);
    };

    const handleDeleteWaypoint = async (waypointId) => {
        try {
            await deleteWaypoint({ waypointId });
            setAddedWaypoints((prevWaypoints) =>
                prevWaypoints.filter((waypoint) => waypoint.waypointId !== waypointId)
            );
        } catch (error) {
            console.error("Error deleting waypoint", error);
        }
    }

    function handleGoToProfilePage() {
        confirmVoyage(voyageId);
        navigate(`/profile`);
    }

    return (
        <div style={{ height: "calc(100vh - 3rem)" }}>
            <div style={mainContainer}>
                <div style={{ width: "35%" }}>
                    <div style={newWaypointContainer}>
                        <div style={WaypointImageUploaderContainerBox}>
                            <div style={WaypointImageUploaderContainer}>
                                <WaypointImageUploader
                                    waypointImage={waypointImage}
                                    setWaypointImage={setWaypointImage}
                                    imagePreview={imagePreview}
                                    setImagePreview={setImagePreview}
                                />
                            </div>
                            <div style={WaypointDetailsContainer}>
                                <div style={waypointDetailRow}>
                                    <span style={titleStyle}>Lat:</span>
                                    <input
                                        type="text"
                                        placeholder="Click on map"
                                        value={waypointLatitude && waypointLatitude !== 0 ? Number(waypointLatitude.toFixed(6)) : ""}
                                        style={titleInputStyle}
                                        readOnly
                                    />
                                </div>
                                <div style={waypointDetailRow}>
                                    <span style={titleStyle}>Lng:</span>
                                    <input
                                        type="text"
                                        placeholder="Click on map"
                                        value={waypointLongitude && waypointLongitude !== 0 ? Number(waypointLongitude.toFixed(6)) : ""}
                                        style={titleInputStyle}
                                        readOnly
                                    />
                                </div>
                                <div style={waypointDetailRow}>
                                    <span style={titleStyle}>Title:</span>
                                    <input
                                        type="text"
                                        placeholder="Waypoint title"
                                        value={waypointTitle}
                                        onChange={(e) => setWaypointTitle(e.target.value)}
                                        style={titleInputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={WaypointDescriptionContainerBox}>
                            <div style={waypointDesctriptionContainer}>
                                <WaypointBriefInput
                                    waypointBrief={waypointBrief}
                                    setWaypointBrief={setWaypointBrief} />
                            </div>
                        </div>

                        {isAddingWaypoint ? (
                            <div style={addWaypointButton}>
                                <div style={spinnerContainer}>
                                    <div className="spinner" style={spinnerInner}></div>
                                </div>
                                <text style={{ opacity: 0 }}> A</text>
                            </div>
                        ) : (
                            <div
                                style={{
                                    ...addWaypointButton,
                                    opacity: (!(waypointTitle && waypointLatitude && waypointLongitude && waypointBrief)) ? 0.5 : 1,
                                    pointerEvents: !(waypointTitle && waypointLatitude && waypointLongitude && waypointBrief) ? 'none' : 'auto'
                                }}
                                onClick={() => {
                                    if (waypointTitle && waypointLatitude && waypointLongitude && waypointBrief) {
                                        handleAddWaypoint();
                                    }
                                }}
                            >
                                Add Waypoint
                            </div>
                        )}
                    </div>

                    <div style={{
                        height: "19rem",
                        margin: "auto",
                        marginTop: "1.5rem",
                        marginBottom: "1rem",
                        width: "95%",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: "1.5rem"
                    }}>
                        <AddedWaypointsSlider
                            addedWaypoints={addedWaypoints}
                            setAddedWaypoints={setAddedWaypoints}
                            handleDeleteWaypoint={handleDeleteWaypoint}
                        />
                    </div>

                    <div
                        style={{
                            ...addWaypointButton,
                            opacity: addedWaypoints?.length > 0 ? 1 : 0.5,
                            pointerEvents: addedWaypoints?.length > 0 ? 'auto' : 'none'
                        }}
                        onClick={() => { if (addedWaypoints?.length > 0) handleGoToProfilePage(); }}
                    >Complete</div>
                </div>

                <div style={mapContainerBox}>
                    <div style={mapContainer}>
                        {!initialLatitude || !initialLongitude ? (
                            <div className="cardSwiperSpinner">
                                <p>Locating you...</p>
                            </div>
                        ) : (
                            <MapContainer
                                center={[initialLatitude, initialLongitude]}
                                zoom={10}
                                style={{ height: "100%", width: "100%" }}
                                zoomControl={false}
                                scrollWheelZoom={true}
                            >
                                <TileLayer url={tileUrl} attribution={tileAttribution} />
                                <MapClickHandler onMapClick={(lat, lng) => {
                                    setWaypointLatitude(lat);
                                    setWaypointLongitude(lng);
                                }} />
                                {waypointLatitude !== null && waypointLongitude !== null && (
                                    <Marker
                                        position={[waypointLatitude, waypointLongitude]}
                                        icon={clickMarkerIcon}
                                    />
                                )}
                                <CreateVoyageWaypointsMarkers waypoints={addedWaypoints} />
                                <CreateVoyagePolyLineComponent waypoints={addedWaypoints} />
                            </MapContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const WaypointImageUploader = ({ waypointImage, setWaypointImage, imagePreview, setImagePreview }) => {
    const fileInputRef = React.createRef();
    const [hoveredUserImg, setHoveredUserImg] = useState(false)

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setWaypointImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCancelUpload = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setWaypointImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div style={{ borderRadius: "1.5rem" }}>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                ref={fileInputRef}
            />
            <div style={{ position: "relative" }}>
                {imagePreview ? (
                    <img src={imagePreview} alt="Uploaded preview" style={imageStyle} />
                ) : (
                    <img
                        src={uploadImage}
                        alt="Upload Icon"
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            ...imageStyle,
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1), inset 0 -4px 6px rgba(0,0,0,0.31)",
                        }}
                    />
                )}
                {imagePreview && (
                    <div
                        onClick={handleCancelUpload}
                        style={{ ...deleteImageIcon, ...(hoveredUserImg ? deleteImageIconHover : {}) }}
                        onMouseEnter={() => setHoveredUserImg(true)}
                        onMouseLeave={() => setHoveredUserImg(false)}
                    >
                        <IoRemoveCircleOutline size={"2.5rem"} />
                    </div>
                )}
            </div>
        </div>
    );
}

const WaypointBriefInput = ({ waypointBrief, setWaypointBrief }) => (
    <textarea
        placeholder="Waypoint brief"
        value={waypointBrief}
        onChange={(e) => setWaypointBrief(e.target.value)}
        style={{
            ...titleInputStyle,
            height: "7rem",
            maxHeight: "7rem",
            resize: "none",
            padding: "1rem",
            backgroundColor: "white",
            width: "95%",
            marginTop: "0.5rem",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
        }}
    />
);

const AddedWaypointsSlider = ({ addedWaypoints, handleDeleteWaypoint }) => {
    const swiperRef = useRef(null);

    useEffect(() => {
        if (swiperRef.current && addedWaypoints.length > 0) {
            swiperRef.current.slideTo(addedWaypoints.length - 1);
        }
    }, [addedWaypoints]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            overflow: "scroll",
            width: "34rem",
            margin: "auto",
            paddingLeft: "2rem",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            height: "100%"
        }}>
            {addedWaypoints?.length > 0 ? (
                <Swiper
                    slidesPerView={1}
                    centeredSlides={true}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="mySwiper"
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {addedWaypoints.map((waypoint, index) => (
                        <SwiperSlide key={index}>
                            <div style={{ marginTop: "1rem" }}>
                                <WaypointComponent
                                    waypointId={waypoint.waypointId}
                                    description={waypoint.description}
                                    latitude={waypoint.latitude}
                                    longitude={waypoint.longitude}
                                    profileImage={waypoint.waypointImage}
                                    title={waypoint.title}
                                    handleDeleteWaypoint={handleDeleteWaypoint}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <span style={{
                        color: "white",
                        padding: "1vh",
                        fontSize: "1.6rem",
                        fontWeight: 800,
                        textShadow: "2px 2px 4px rgba(0,0,0,0.6), -2px -2px 4px rgba(255,255,255,0.2)",
                        opacity: "0.7"
                    }}>
                        Add Waypoints
                    </span>
                </div>
            )}
        </div>
    );
}

const WaypointComponent = ({ description, profileImage, title, waypointId, handleDeleteWaypoint }) => {
    const [hoveredUserImg2, setHoveredUserImg2] = useState(false);
    return (
        <div style={{
            backgroundColor: "rgba(255,255,255,1)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
            height: "17rem", width: "30rem",
            display: "flex", flexDirection: "row",
            borderRadius: "1.5rem", overflow: "hidden"
        }}>
            <img
                src={profileImage instanceof File ? URL.createObjectURL(profileImage) : parrotsLogo}
                alt="Uploaded preview"
                style={{ height: "100%", width: "15rem", objectFit: "cover" }}
            />
            <div style={{ backgroundColor: "rgba(155,255,255,0)", width: "calc(15rem - .8rem)", margin: ".4rem" }}>
                <div style={{ height: "3rem" }}>
                    <span style={{ color: "#007bff", fontWeight: "700", fontSize: "1.3rem" }}>{title}</span>
                </div>
                <div style={{ height: "calc(100% - 3rem)", width: "100%", lineHeight: "1.2rem" }}>
                    <span style={{ color: "#007bff", fontWeight: "400", fontSize: "1.1rem" }}>{description} {waypointId}</span>
                </div>
            </div>
            <div
                onClick={() => handleDeleteWaypoint(waypointId)}
                style={{ ...deleteImageIcon2, ...(hoveredUserImg2 ? deleteImageIconHover2 : {}) }}
                onMouseEnter={() => setHoveredUserImg2(true)}
                onMouseLeave={() => setHoveredUserImg2(false)}
            >
                <IoRemoveCircleOutline size={"2.5rem"} />
            </div>
        </div>
    );
}

const titleStyle = {
    borderRadius: "1rem", width: "100%", padding: "0.3rem",
    fontSize: "1.2rem", color: "#757575", fontWeight: 700,
}

const titleInputStyle = {
    borderRadius: "1rem", backgroundColor: "white",
    border: "1px solid rgba(4,4,4,0.2)", width: "100%",
    padding: "0.3rem", fontSize: "1.2rem", fontWeight: 700, color: "#007bff",
}

const waypointDetailRow = {
    height: "3rem", width: "100%", margin: "auto",
    alignContent: "center", display: "grid",
    gridTemplateColumns: "1.5fr 5fr", paddingRight: "1rem",
    marginRight: "0", borderRadius: "1rem"
}

const mainContainer = {
    display: "flex", flexGrow: "1", width: "100%", height: "100%",
}

const newWaypointContainer = {
    display: "flex", flexDirection: "column",
    height: "calc(50vh - 1.5rem)", backgroundColor: "white",
    padding: ".5rem", margin: "3rem", marginBottom: "0", marginTop: "0.5rem",
    borderRadius: "1.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)",
}

const WaypointDescriptionContainerBox = { width: "100%" }

const waypointDesctriptionContainer = {
    height: "90%", width: "100%", backgroundColor: "white", margin: "auto"
}

const mapContainerBox = {
    display: "flex", flexDirection: "column",
    width: "64%", height: "calc(100vh - 3rem)", marginTop: "0rem"
}

const mapContainer = {
    display: "flex", height: "100%",
    width: "calc(100% - 0rem)", backgroundColor: "rgba(155,225,115,0.05)",
}

const WaypointDetailsContainer = {
    height: "100%", width: "55%",
    display: "flex", flexDirection: "column", fontSize: "1.5rem"
}

const WaypointImageUploaderContainer = {
    height: "100%", width: "45%", display: "flex", justifyContent: "center"
}

const WaypointImageUploaderContainerBox = {
    height: "50%", width: "100%", display: "flex", flexDirection: "row",
}

const spinnerContainer = {
    height: "100%", width: "100%", borderRadius: "1.5rem", position: "relative"
}

const spinnerInner = {
    position: "absolute", left: "40%", height: "2rem", width: "2rem",
    border: "6px solid rgba(173,216,230,.5)", borderTop: "6px solid #1e90ff",
}

const addWaypointButton = {
    backgroundColor: "#007bff", bottom: "-0.5rem", borderRadius: "2rem",
    alignContent: "center", justifyItems: "center", cursor: "pointer",
    transition: "transform 0.3s ease-in-out", fontSize: "1.3rem", fontWeight: "800",
    width: "40%", marginLeft: "50%", transform: "translateX(-50%)",
    padding: "0.3rem", paddingRight: "1rem", paddingLeft: "1rem",
}

const imageStyle = {
    objectFit: "cover", borderRadius: "1.5rem",
    border: "2px solid transparent", height: "12rem", width: "12rem"
}

const deleteImageIcon = {
    backgroundColor: "rgba(211,1,1,0.4)", width: "3rem", height: "3rem",
    position: "absolute", top: "-0.5rem", right: "-0.5rem",
    borderRadius: "2rem", alignContent: "center", justifyItems: "center",
    cursor: "pointer", transition: "transform 0.3s ease-in-out",
}

const deleteImageIconHover = { transform: "scale(1.2)" }

const deleteImageIcon2 = {
    backgroundColor: "#3e99", width: "3rem", height: "3rem",
    position: "absolute", top: ".5rem", right: "1.5rem",
    borderRadius: "2rem", alignContent: "center", justifyItems: "center",
    cursor: "pointer", transition: "transform 0.3s ease-in-out", zIndex: "200"
}

const deleteImageIconHover2 = { transform: "scale(1.2)" }
