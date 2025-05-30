/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { IoRemoveCircleOutline } from "react-icons/io5";
import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png";
import placeHolder from "../assets/images/placeholder.png";
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
} from "../slices/VehicleSlice";
import { useNavigate } from "react-router-dom";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { SomethingWentWrong } from "../components/SomethingWentWrong";

function CreateVehiclePage() {
  const [createVehicle] = useCreateVehicleMutation();
  const [confirmVehicle] = useConfirmVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const [checkAndDeleteVehicle] = useCheckAndDeleteVehicleMutation();
  const userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const userName = "Ahmet Zeren";
  const navigate = useNavigate();

  const [vehicleName, setVehicleName] = useState("");
  const [vehicleDescription, setVehicleDescription] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [image1, setImage1] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const fileInputRef = React.createRef();
  const fileInputRef2 = React.createRef();
  const [hoveredUserImg, setHoveredUserImg] = useState(false);
  const [hoveredUserImg2, setHoveredUserImg2] = useState(false);
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);
  const [pageState, setPageState] = useState("s1");
  const [vehicleId, setVehicleId] = useState(3);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isRegisteringVehicle, setIsRegisteringVehicle] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      vehicleName.trim() &&
      vehicleDescription.trim().length > 0 &&
      vehicleDescription !== "<p><br></p>" &&
      vehicleCapacity &&
      selectedVehicleType &&
      image1
    );
  }, [
    vehicleName,
    vehicleDescription,
    vehicleCapacity,
    selectedVehicleType,
    image1,
  ]);

  // useEffect(() => {
  //   console.log("--->>>", vehicleDescription);
  //   console.log("--->>>", vehicleDescription === "<p><br></p>");
  // }, [vehicleDescription]);

  useEffect(() => {
    console.log("useffect added images: ", addedVehicleImages);
  }, [addedVehicleImages]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (file.size > maxSizeBytes) {
        alert("File size must be 5MB or less.");
        return;
      }
      setImage1(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageChange2 = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (file.size > maxSizeBytes) {
        alert("File size must be 5MB or less.");
        return;
      }

      setVehicleImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview2(previewUrl);
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

  const handleCancelUpload2 = () => {
    if (imagePreview2) {
      URL.revokeObjectURL(imagePreview2);
    }
    setVehicleImage(null);
    setImagePreview2(null);
    if (fileInputRef2.current) {
      fileInputRef2.current.value = "";
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageClick2 = () => {
    fileInputRef2.current.click();
  };

  const handleCreateVehicle = async () => {
    if (!image1) {
      return;
    }
    setIsRegisteringVehicle(true);
    try {
      const response = await createVehicle({
        vehicleImage: image1,
        name: vehicleName,
        description: vehicleDescription,
        userId,
        vehicleType: selectedVehicleType,
        capacity: vehicleCapacity,
      });
      const createdVehicleId = response.data.data.id;

      setVehicleId(createdVehicleId);
      setVehicleDescription("");
      setVehicleCapacity("");
      setSelectedVehicleType("");
      setVehicleName("");
      setImage1("");
      setImagePreview("");
      setVehicleImage("");
      setAddedVehicleImages([]);
      setPageState("s2");
    } catch (error) {
      alert(
        "Failed to create vehicle. Please check your connection and try again."
      );
      console.error("Error creating vehicle:", error);
    } finally {
      setIsRegisteringVehicle(false);
    }
  };

  const completeVehicleCreate = async () => {
    if (addedVehicleImages.length === 0) {
      console.log("images length: -->", addedVehicleImages.length);
      return;
    }
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
      await deleteVehicleImage(imageId);
    } catch (error) {
      console.error("Error deleting image", error);
      setAddedVehicleImages(previousImages);
      alert(
        "Failed to delete image. Please check your connection and try again."
      );
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
      });

      console.log("vehicleImage", vehicleImage);

      const addedvehicleImageId = addedVehicleImageResponse.data.imagePath;
      const newItem = {
        addedvehicleImageId,
        vehicleImage,
      };
      setAddedVehicleImages((prevImages) => [...prevImages, newItem]);
      setVehicleImage(null);
      setImagePreview2(null);
    } catch (error) {
      console.error("Error uploading image", error);
      alert(
        "Failed to upload image. Please check your connection and try again."
      );
    }
    setIsUploadingImage(false);
  }, [vehicleImage, vehicleId, addVehicleImage]);

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (isError) {
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

          <div style={pageStateDisplayContainer}>
            <div style={pageStateDisplay}>
              <span
                style={{
                  ...VehiclesVoyagesTitle,
                  ...(pageState === "s1" ? activeStyle : {}),
                }}
              >
                Vehicle Details
              </span>
              <span
                style={{
                  ...VehiclesVoyagesTitle,
                  ...(pageState === "s2" ? activeStyle : {}),
                }}
              >
                Vehicle Images
              </span>
            </div>
          </div>

          {pageState === "s1" && (
            <>
              <div className="vehiclePage_vehicleContainer">
                <div className="vehiclePage_dataContainer">
                  <div className="vehiclePage_detailsContainer">
                    <div className="vehiclePage_nameContainer">
                      <div className=" ">
                        <span>Name</span>
                      </div>
                      <div className=" ">
                        <input
                          type="text"
                          placeholder="Vehicle Name"
                          value={vehicleName}
                          style={
                            {
                              // backgroundColor: "rgb(249, 245, 244)"
                            }
                          }
                          onChange={(e) => setVehicleName(e.target.value)}
                          className="vehicle-name-input"
                        />
                      </div>
                    </div>
                    <div className="vehiclePage_vacancyContainer">
                      <div className=" ">
                        <span>Capacity</span>
                      </div>
                      <div className=" ">
                        <input
                          type="number"
                          id="capacity"
                          placeholder="Select"
                          min="1"
                          max="100"
                          value={vehicleCapacity}
                          onChange={(e) => setVehicleCapacity(e.target.value)}
                          className="capacity-input"
                        />
                      </div>
                    </div>
                    <div className="vehiclePage_typeContainer">
                      <div className=" ">
                        <span>Type</span>
                      </div>
                      <div className=" ">
                        <select
                          id="vehicle-type"
                          value={selectedVehicleType}
                          onChange={(e) => {
                            setSelectedVehicleType(e.target.value);
                          }}
                          className="type-input"
                          style={{
                            color: selectedVehicleType ? "#00008b" : "#96989c",
                          }}
                        >
                          <option
                            value=""
                            disabled
                            className="placeholderOption"
                          >
                            Select
                          </option>
                          {Object.keys(vehicles)
                            .filter(
                              (vehicle) =>
                                vehicle !== "Walk" && vehicle !== "Run"
                            )
                            .map((vehicle) => (
                              <option key={vehicle} value={vehicle}>
                                {vehicle}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="vehiclePage_descriptionContainer">
                    <div className="createvehiclePage_descriptionContainer_inner">
                      <div className="vehiclePage_descriptionContainer_descriptionTitle">
                        <span>Description</span>
                      </div>
                      <div className="vehiclePage_descriptionContainer_descriptionContent">
                        <div className="editor-container">
                          <ReactQuill
                            value={vehicleDescription}
                            onChange={setVehicleDescription}
                            placeholder="Tell us about your vehicle"
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="vehicle_imageContainer">
                  <div style={{}}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      // onClick={(e) => (e.target.value = null)} // Reset value before selection
                      style={{ display: "none" }}
                      ref={fileInputRef}
                    />
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      {imagePreview ? (
                        <div className="image-preview">
                          <img
                            src={imagePreview}
                            alt="Uploaded preview"
                            style={{
                              width: "35rem",
                              height: "35rem",
                              objectFit: "cover",
                              borderRadius: "1.5rem",
                              // border: "2px solid #3c9dee42"
                              border: "2px solid transparent",
                            }}
                          />
                        </div>
                      ) : (
                        <img
                          src={uploadImage}
                          alt="Upload Icon"
                          onClick={handleImageClick}
                          style={{
                            width: "35rem",
                            height: "35rem",
                            objectFit: "cover",
                            borderRadius: "1.5rem",
                            border: "2px solid transparent",
                          }}
                        />
                      )}
                      {image1 && (
                        <div
                          onClick={handleCancelUpload}
                          style={{
                            ...deleteImageIcon,
                            ...(hoveredUserImg ? deleteImageIconHover : {}),
                          }}
                          onMouseEnter={() => {
                            setHoveredUserImg(true);
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

              {isRegisteringVehicle ? (
                <div
                  className="createVehicleButton"
                  style={{
                    ...registerVehicleButton,
                    ...(isFormValid
                      ? {}
                      : { backgroundColor: "#007bff", cursor: "not-allowed" }),
                  }}
                >
                  <RegisterSpinner />
                </div>
              ) : (
                <div
                  className="createVehicleButton"
                  style={{
                    ...registerVehicleButton,
                    ...(isFormValid ? {} : { opacity: "0.7" }),
                  }}
                  onClick={
                    isFormValid
                      ? handleCreateVehicle
                      : () => {
                          console.log("Form is not valid");
                        }
                  }
                >
                  Register Vehicle
                </div>
              )}
            </>
          )}
          {pageState === "s2" && (
            <>
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "26rem",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange2}
                      onClick={(e) => (e.target.value = null)}
                      style={{ display: "none" }}
                      ref={fileInputRef2}
                    />
                    <div
                      style={{
                        position: "relative",
                        width: "25rem",
                      }}
                    >
                      {imagePreview2 ? (
                        <div className="image-preview">
                          <img
                            src={imagePreview2}
                            alt="Uploaded preview"
                            style={uploadImage2}
                          />
                        </div>
                      ) : (
                        <img
                          src={uploadImage}
                          alt="Upload Icon"
                          onClick={handleImageClick2}
                          style={uploadImage2}
                        />
                      )}
                      {vehicleImage && (
                        <>
                          <div
                            onClick={handleCancelUpload2}
                            style={{
                              ...deleteImageIcon2,
                              ...(hoveredUserImg2 ? deleteImageIconHover2 : {}),
                            }}
                            onMouseEnter={() => {
                              setHoveredUserImg2(true);
                            }}
                            onMouseLeave={() => setHoveredUserImg2(false)}
                          >
                            <IoRemoveCircleOutline size={"2.5rem"} />
                          </div>

                          {isUploadingImage ? (
                            <div style={addImageButton}>
                              <AddImageSpinner />
                            </div>
                          ) : (
                            <div
                              style={addImageButton}
                              onClick={() => {
                                handleUploadImage();
                                // console.log("hi");
                              }}
                            >
                              Add Image
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div style={uploadedImagesContainer}>
                    <Swiper
                      scrollbar={{ hide: true }}
                      slidesPerView={3}
                      spaceBetween={10}
                      freeMode={true}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[FreeMode]}
                      className="mySwiper"
                    >
                      {data.map((item, index) => {
                        return (
                          <SwiperSlide>
                            <div
                              key={item.key}
                              className="placeholder_imageContainer"
                              style={{
                                borderRadius: "2rem",
                                overflow: "hidden",
                              }}
                            >
                              {item.addedvehicleImageId ? (
                                <>
                                  <img
                                    src={URL.createObjectURL(item.vehicleImage)}
                                    alt={`Uploaded ${index + 1}`}
                                    style={userUploadedImage}
                                  />
                                  <div
                                    onClick={() =>
                                      handleDeleteImage(
                                        item.addedvehicleImageId
                                      )
                                    }
                                    style={deleteImageIcon3}
                                  >
                                    <IoRemoveCircleOutline size={"2.5rem"} />
                                  </div>
                                </>
                              ) : (
                                <img
                                  src={placeHolder}
                                  alt={`Placeholder ${index + 1}`}
                                  style={placeHolderImage}
                                />
                              )}
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
              </div>

              {isCompleting ? (
                <div
                  className="completeVehicleButton"
                  style={completeVehicleButton}
                >
                  <CompleteSpinner />
                </div>
              ) : (
                <div
                  className="completeVehicleButton"
                  style={{
                    ...completeVehicleButton,
                    ...(addedVehicleImages.length === 0
                      ? { opacity: "0.7" }
                      : {}),
                  }}
                  onClick={() => completeVehicleCreate()}
                >
                  Complete
                </div>
              )}
            </>
          )}
        </div>
      </header>

      <style>
        {`
          #app {
            height: 100%;
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
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 1.5rem;
          }

          .swiper-slide {
            text-align: center;
            font-size: 18px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.3);
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

const uploadImage2 = {
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
  width: "calc(100vw - 26rem)",
  margin: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const vehicles = {
  Boat: "⛵",
  Car: "🚗",
  Caravan: "🏕️",
  Bus: "🚌",
  Walk: "🚶",
  Run: "🏃",
  Motorcycle: "🏍️",
  Bicycle: "🚲",
  Tinyhouse: "🏠",
  Airplane: "✈️",
};

const deleteImageIcon = {
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
};

const deleteImageIconHover = {
  transform: "scale(1.2)",
};

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
};

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
};

const deleteImageIconHover2 = {
  transform: "scale(1.2)",
};

const VehiclesVoyagesTitle = {
  fontSize: "1.6rem",
  fontWeight: 800,
  color: "#ffffff55",
  backgroundColor: "#a4f4f411",
  padding: ".3rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  borderRadius: "1.5rem",
};

const activeStyle = {
  color: "white",
  backgroundColor: "#a4f4f433",
};

const pageStateDisplay = {
  display: "flex",
  flexDirection: "row",
  width: "28%",
  margin: "auto",
  justifyContent: "space-between",
};

const pageStateDisplayContainer = {};

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
