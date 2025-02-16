
/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "../assets/css/CreateVehicle.css"
import "react-quill/dist/quill.snow.css"; // Import styles
import { IoRemoveCircleOutline } from "react-icons/io5";
import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png"
import placeHolder from "../assets/images/placeholder.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
// import '../assets/css/VehicleImagesSwiper.css';
import { FreeMode } from 'swiper/modules';
import { MainPageCardSwiper } from "../components/MainPageCardSwiper";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

import parrotMarker1 from "../assets/images/parrotMarker1.png";
import parrotMarker2 from "../assets/images/parrotMarker2.png";
import parrotMarker3 from "../assets/images/parrotMarker3.png";
import parrotMarker4 from "../assets/images/parrotMarker4.png";
import parrotMarker5 from "../assets/images/parrotMarker5.png";
import parrotMarker6 from "../assets/images/parrotMarker6.png";

import ReactQuill, { displayName } from "react-quill";
import { useAddWaypointMutation } from "../slices/VoyageSlice"

import { useNavigation } from "react-router-dom";

export const AddWaypointsComponent = ({
    voyageImage,
    setVoyageImage,
    addedVoyageImages,
    setAddedVoyageImages,
    voyageId,
    addVoyageImage,
    isUploadingImage,
    setIsUploadingImage,
    setPageState
}) => {
    const [initialVoyages, setInitialVoyages] = useState([]);
    const [targetLocation, setTargetLocation] = useState({});
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [waypointTitle, setWaypointTitle] = useState("")
    const [waypointLatitude, setWaypointLatitude] = useState(0)
    const [waypointLongitude, setWaypointLongitude] = useState(0)
    const [waypointBrief, setWaypointBrief] = useState("")
    const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";

    const [initialLatitude, setInitialLatitude] = useState();
    const [initialLongitude, setInitialLongitude] = useState();
    const [addedWaypoints, setAddedWaypoints] = useState([]);

    const handlePanToLocation = (lat, lng) => {
        setTargetLocation({ lat, lng });
    };
    const deleteImageIconHover2 = {
        transform: "scale(1.2)",
    };

    const handleUploadImage = useCallback(async () => {
        if (!voyageImage) {
            return;
        }
        setIsUploadingImage(true);
        try {
            const addedVoyageImageResponse = await addVoyageImage({
                voyageImage,
                voyageId,
            });

            const addedvoyageImageId = addedVoyageImageResponse.data.imagePath;
            const newItem = {
                addedvoyageImageId,
                voyageImage,
            };
            setAddedVoyageImages((prevImages) => [...prevImages, newItem]);
            setVoyageImage(null);
            setImagePreview2(null);

        } catch (error) {
            console.error("Error uploading image", error);
            alert(
                "Failed to upload image. Please check your connection and try again."
            );
        }
        setIsUploadingImage(false);
    }, [voyageImage, voyageId, addVoyageImage]);

    const addWaypointButton = {
        backgroundColor: "#007bff",
        bottom: "-0.5rem",
        borderRadius: "2rem",
        alignContent: "center",
        justifyItems: "center",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
        fontSize: "1.3rem",
        fontWeight: "800",
        width: "40%",
        marginLeft: "50%",
        transform: "translateX(-50%)", // Centers it horizontally
        padding: "0.3rem",
        paddingRight: "1rem",
        paddingLeft: "1rem",
        marginTop: "1rem"

    }

    const uploadedImagesContainer = {
        display: "flex",
        flexDirection: "row",
        overflow: "scroll",
        width: "calc(100vw - 26rem)",
        margin: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
    }

    const deleteImageIcon2 = {
        backgroundColor: " #3c9dee99",
        width: "3rem",
        height: "3rem",
        position: "absolute",
        top: "-0.5rem",
        right: "-0.5rem",
        borderRadius: "2rem",
        alignContent: "center",
        justifyItems: "center",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
    }


    const placeHolderImage = {
        width: "20rem",
        height: "20rem",
        maxWidth: "20rem",
        margin: "0.5rem",
        borderRadius: "1rem",
        overflow: "hidden",
        objectFit: "cover",

    }

    const uploadImage2 = {
        width: "25rem",
        height: "25rem",
        objectFit: "cover",
        borderRadius: "1.5rem",
        border: "2px solid transparent",

    }

    const userUploadedImage = {
        width: "20rem",
        height: "20rem",
        objectFit: "cover",
        maxWidth: "20rem",
        borderRadius: "1rem",
        margin: "0.5rem",

    }


    const deleteImageIcon3 = {
        backgroundColor: " #3e99",
        width: "3rem",
        height: "3rem",
        position: "absolute",
        top: "0",
        right: "0",
        borderRadius: "2rem",
        alignContent: "center",
        justifyItems: "center",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
    }


    const maxItems = 10;
    const placeholders = Array.from({ length: maxItems }, (_, index) => ({
        key: `placeholder_${index + 1}`,
    }));

    const data = useMemo(() =>
        addedVoyageImages.length < maxItems
            ? [
                ...addedVoyageImages,
                ...placeholders.slice(addedVoyageImages.length),
            ]
            : addedVoyageImages.map((item) => ({
                ...item,
                key: item.addedvehicleImageId,
            })), [addedVoyageImages, maxItems, placeholders]);

    const fileInputRef2 = React.createRef();
    const [imagePreview2, setImagePreview2] = useState(null);
    const [hoveredUserImg2, setHoveredUserImg2] = useState(false)



    const handleImageChange2 = (e) => {
        const files2 = e.target.files;
        if (files2 && files2.length > 0) {
            const file2 = files2[0];
            setVoyageImage(file2);
            const previewUrl2 = URL.createObjectURL(file2);
            setImagePreview2(previewUrl2);
        }
    };

    const handleImageClick2 = () => {
        fileInputRef2.current.click();
    };

    const handleCancelUpload2 = () => {
        if (imagePreview2) {
            URL.revokeObjectURL(imagePreview2);
        }
        setVoyageImage(null);
        setImagePreview2(null);
        if (fileInputRef2.current) {
            fileInputRef2.current.value = "";
        }
    };

    const goToWaypoints = () => {
        console.log("hello");
        setPageState(3)
    }


    return (
        <div style={{
            // backgroundColor: "rgba(25,255,255,0.3)",
            height: "calc(100vh - 3rem)"
        }} >
            <div
                style={mainContainer}
            >
                <div style={{ width: "35%" }}>

                    <div style={newWaypointContainer}>
                        <div style={WaypointImageUploaderContainerBox}>
                            <div style={WaypointImageUploaderContainer}>
                                <WaypointImageUploader />
                            </div>
                            <div style={WaypointDetailsContainer}>
                                <div style={waypointDetailRow}>
                                    <span style={{ backgroundColor: " " }}>lat:</span>
                                    <span style={{ backgroundColor: " " }}>
                                        <input
                                            type="text"
                                            placeholder="Click on map"
                                            value={Number(waypointLatitude?.toFixed(6))}
                                            style={titleInputStyle}
                                            readOnly
                                        />
                                    </span>
                                </div>

                                <div style={waypointDetailRow}>
                                    <span style={{ backgroundColor: " " }}>lng:</span>
                                    <span style={{ backgroundColor: " " }}>
                                        <input
                                            type="text"
                                            placeholder="Click on map"
                                            value={Number(waypointLongitude?.toFixed(6))}
                                            style={titleInputStyle}
                                            readOnly
                                        />
                                    </span>
                                </div>

                                <div style={waypointDetailRow}>
                                    <span style={{ backgroundColor: " " }}>Title</span>
                                    <span style={{ backgroundColor: " " }}>
                                        <input
                                            type="text"
                                            placeholder="Waypoint title"
                                            value={waypointTitle}
                                            onChange={(e) => setWaypointTitle(e.target.value)}
                                            style={titleInputStyle}
                                        />
                                    </span>
                                </div>

                            </div>
                        </div>
                        <div style={WaypointDescriptionContainerBox}>
                            <div style={waypointDesctriptionContainer}>
                                <WaypointBriefInput waypointBrief={waypointBrief} setWaypointBrief={setWaypointBrief} />
                            </div>
                        </div>

                        <div style={addWaypointButton}
                            onClick={() => console.log("hello")}
                        >Add Waypoint</div>
                    </div>
                    <div style={{
                        backgroundColor: "red",
                        height: "22rem",
                        marginTop: "1rem",
                        paddingTop: "2rem"
                    }}>
                        <AddedWaypointsSlider />
                    </div>
                </div>



                <div style={mapContainerBox}>
                    <div style={mapContainer}>

                        <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                            {!initialLatitude && <div className="cardSwiperSpinner"></div>}

                            <Map
                                mapId="mainpageMap"
                                defaultZoom={10}
                                defaultCenter={{
                                    lat: initialLatitude || 37.7749,
                                    lng: initialLongitude || -122.4194,
                                }}
                                gestureHandling="greedy"
                                disableDefaultUI
                                onCameraChanged={() => {
                                    setWaypointLatitude(null);
                                    setWaypointLongitude(null);
                                }}
                                onClick={(event) => {
                                    const lat = event.detail.latLng.lat;
                                    const lng = event.detail.latLng.lng;
                                    console.log("Clicked at:", lat, lng);
                                    setWaypointLatitude(lat);
                                    setWaypointLongitude(lng);
                                }}
                            >
                                {waypointLatitude !== null && waypointLongitude !== null && (
                                    <Marker
                                        position={{ lat: waypointLatitude, lng: waypointLongitude }}
                                        icon={{
                                            url:
                                                // index 
                                                6 % 6 === 0
                                                    ? parrotMarker1
                                                    : index % 6 === 1
                                                        ? parrotMarker2
                                                        : index % 6 === 2
                                                            ? parrotMarker3
                                                            : index % 6 === 3
                                                                ? parrotMarker4
                                                                : index % 6 === 4
                                                                    ? parrotMarker5
                                                                    : parrotMarker6,
                                            scaledSize: { width: 50, height: 60 },
                                        }}
                                    />
                                )}
                            </Map>
                        </APIProvider>

                        {/* 
                        <APIProvider apiKey={myApiKey} libraries={["marker"]}>
                            {
                                !initialLatitude && (
                                    <div className={"cardSwiperSpinner"}>
                                    </div>
                                )
                            }

                            {
                                true && (
                                    <Map
                                        mapId={"mainpageMap"}
                                        defaultZoom={10}
                                        defaultCenter={{
                                            lat: initialLatitude || 37.7749,
                                            lng: initialLongitude || -122.4194,
                                        }}
                                        gestureHandling={"greedy"}
                                        disableDefaultUI
                                        onCameraChanged={() => setTargetLocation(null)}
                                        onClick={(event) => {
                                            const lat = event.detail.latLng.lat;
                                            const lng = event.detail.latLng.lng;
                                            console.log("Clicked at:", lat, lng);
                                            setWaypointLatitude(lat);
                                            setWaypointLongitude(lng);
                                        }}

                                    >
                                    </Map>
                                )
                            }
                        </APIProvider> */}
                    </div>
                </div>
            </div>
        </div>
    )
}


const WaypointImageUploader = () => {

    const imageStyle = {
        objectFit: "cover",
        borderRadius: "1.5rem",
        border: "2px solid transparent",
        height: "12rem",
        width: "12rem"
    }

    const deleteImageIcon = {
        backgroundColor: "rgba(211,1,1,0.4)",
        width: "3rem",
        height: "3rem",
        position: "absolute",
        top: "-0.5rem",
        right: "-0.5rem",
        borderRadius: "2rem",
        alignContent: "center",
        justifyItems: "center",
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
    }

    const deleteImageIconHover = {
        transform: "scale(1.2)",
    };

    const fileInputRef = React.createRef();
    const [imagePreview, setImagePreview] = useState(null);
    const [image1, setImage1] = useState(null);
    const [hoveredUserImg, setHoveredUserImg] = useState(false)

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setImage1(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleCancelUpload = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImage1(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div style={{
            borderRadius: "1.5rem",
        }}>
            <div>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                        ref={fileInputRef}
                    />
                    <div
                        style={{
                            position: "relative",
                        }}
                    >
                        {imagePreview ? (
                            <div>
                                <img src={imagePreview} alt="Uploaded preview"
                                    style={imageStyle}
                                />
                            </div>
                        ) :
                            <div >
                                <img
                                    src={uploadImage}
                                    alt="Upload Icon"
                                    onClick={handleImageClick}
                                    style={{
                                        ...imageStyle,
                                        boxShadow: `
                                         0 4px 6px rgba(0, 0, 0, 0.1),
                                         inset 0 -4px 6px rgba(0, 0, 0, 0.31)
                                         `,
                                    }}
                                />
                            </div>
                        }
                        {image1 && (
                            <div onClick={handleCancelUpload}
                                style={{ ...deleteImageIcon, ...((hoveredUserImg) ? deleteImageIconHover : {}) }}
                                onMouseEnter={() => {
                                    setHoveredUserImg(true)
                                }}
                                onMouseLeave={() => setHoveredUserImg(false)}
                            >
                                <IoRemoveCircleOutline size={"2.5rem"} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

}

const WaypointBriefInput = ({ waypointBrief, setWaypointBrief }) => {
    return (
        <div style={{ backgroundColor: "grey", marginTop: "1rem" }}>
            <textarea
                placeholder="Waypoint brief"
                value={waypointBrief}
                onChange={(e) => setWaypointBrief(e.target.value)}
                style={{
                    ...titleInputStyle,
                    height: "7rem",
                    resize: "vertical",
                    padding: "1rem",
                    backgroundColor: "white"
                }}
            />
        </div>
    )
}

const AddedWaypointsSlider = ({ addedWaypoints, setAddedWaypoints }) => {


    const [addedWayPoints, setAddedWayPoints] = useState([]);
    const [markerCoords, setMarkerCoords] = useState(null);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [title, setTitle] = useState("Amsterdamda gezinti");
    const [description, setDescription] = useState(
        "Amsterdam'da geziyoruz, ot içiyoruz.  Ot kafelerde takiliyoruz"
    );
    const [imageUri, setImageUri] = useState(null);
    const [order, setOrder] = useState(1);
    const [addWaypoint] = useAddWaypointMutation();
    const [isUploadingWaypointImage, setIsUploadingWaypointImage] =
        useState(false);

    const uploadedWaypointsContainer = {
        display: "flex",
        flexDirection: "row",
        overflow: "scroll",
        width: "36rem",
        margin: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
    }

    return (
        <div style={uploadedWaypointsContainer}>
            <Swiper
                scrollbar={{ hide: true }}
                slidesPerView={1}
                spaceBetween={10}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode]}
            >

                <SwiperSlide>
                    <div key={1111} >

                        <WaypointComponent
                            description={"description"}
                            latitude={"latitude"}
                            longitude={"longitude"}
                            profileImage={"profileImage"}
                            title={"title"}
                            pinColor={"pinColor"}
                        />
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div key={1111} >

                        <WaypointComponent
                            description={"description"}
                            latitude={"latitude"}
                            longitude={"longitude"}
                            profileImage={"profileImage"}
                            title={"title"}
                            pinColor={"pinColor"}
                        />
                    </div>
                </SwiperSlide>


                {/* 
                <SwiperSlide>
                    <div key={1111} >

                        <WaypointComponent
                            description={"description"}
                            latitude={"latitude"}
                            longitude={"longitude"}
                            profileImage={"profileImage"}
                            title={"title"}
                            pinColor={"pinColor"}
                        />
                    </div>
                </SwiperSlide> */}

            </Swiper>
        </div>
    )
}

const WaypointComponent = (
    { description,
        latitude,
        longitude,
        profileImage,
        title,
        pinColor }) => {

    const apiUrl = process.env.REACT_APP_API_URL;
    const waypointBaseUrl = `${apiUrl}/Uploads/WaypointImages/`;
    const imageUrl = waypointBaseUrl + profileImage

    return (
        <div style={{
            backgroundColor: "rgba(155,255,255,1)",
            height: "17rem",
            width: "34rem",
            display: "flex",
            flexDirection: "row",
            borderRadius: "1.5rem",
            overflow: "hidden"
        }}>
            <img src={placeHolder} alt="Uploaded preview"
                style={{ height: "100%", }} />
            <div style={{
                backgroundColor: "rgba(155,255,255,1)",
                width: "calc(100% - .8rem)",
                margin: ".4rem"
            }}>
                <div style={{ backgroundColor: "orange", height: "3rem" }}>
                    <span style={{ backgroundColor: "red" }}>{title}</span>
                </div>
                <div style={{ backgroundColor: "lightblue", height: "calc(100% - 3rem)" }}>
                    <span style={{ backgroundColor: "lightgreen" }}>{description}</span>
                </div>
            </div>

        </div>
    )
}

const titleInputStyle = {
    borderRadius: "1rem",
    backgroundColor: "white",
    border: "1px solid rgba(4, 4, 4, 0.2)",
    width: "100%",
    padding: "0.3rem",
    fontSize: "1.2rem",
    color: "#757575",
    fontWeight: 700,
}

const waypointDetailRow = {
    backgroundColor: "grey",
    height: "5rem",
    width: "90%",
    margin: "auto",
    alignContent: "center",
    display: "grid",
    gridTemplateColumns: "1.5fr 5fr",
    paddingRight: "1rem",
    marginRight: "0"

}

const mainContainer = {
    display: "flex",
    flexGrow: "1",
    width: "100%",
    height: "100%",
}

const newWaypointContainer = {
    display: "flex",
    flexDirection: "column",
    // width: "calc(35% - 6rem)",
    height: "calc(50vh - 1.5rem)",
    backgroundColor: "rgba(255,255,25,1)",
    padding: ".5rem",
    margin: "3rem",
    marginBottom: "0",
    marginTop: "0.5rem",
    borderRadius: "1.5rem",
}

const WaypointDescriptionContainerBox = {
    height: "40%",
    width: "100%",
}

const waypointDesctriptionContainer = {
    height: "90%",
    width: "100%",
    backgroundColor: "white",
    margin: "auto"
}

const mapContainerBox = {
    display: "flex",
    flexDirection: "column",
    width: "64%",
    height: "calc(100vh - 3rem)",
    marginTop: "0rem"
}

const mapContainer = {
    display: "flex",
    height: "100%",
    width: "calc(100% - 0rem)",
    backgroundColor: "rgba(155,225,115,0.05)",
}

const WaypointDetailsContainer = {
    height: "100%",
    width: "50%",
    display: "flex",
    flexDirection: "column",
    fontSize: "1.5rem"
}

const WaypointImageUploaderContainer = {
    height: "100%",
    width: "50%",
    backgroundColor: "grey",
    display: "flex",
    justifyContent: "center"
}

const WaypointImageUploaderContainerBox = {
    height: "50%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
}

const MapSpinner = () => {
    return (
        <div style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            height: "100%", width: "100%",
            borderRadius: "1.5rem",
            position: "relative"

        }}>
            <div className="spinner"
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    height: "5rem",
                    width: "5rem",
                    border: "8px solid rgba(173, 216, 230, 0.3)",
                    borderTop: "8px solid #1e90ff",
                }}></div>
        </div>
    )
}
