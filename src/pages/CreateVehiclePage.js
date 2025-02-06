/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { IoRemoveCircleOutline } from "react-icons/io5";
import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png"
import placeHolder from "../assets/images/placeholder.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../assets/css/VehicleImagesSwiper.css';
import { Pagination, FreeMode } from 'swiper/modules';
import {
  useCreateVehicleMutation,
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
  useCheckAndDeleteVehicleMutation,
} from "../slices/VehicleSlice";

function CreateVehiclePage() {
  const [createVehicle] = useCreateVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const [checkAndDeleteVehicle] = useCheckAndDeleteVehicleMutation();
  const { userId } = "43242342432342342342";
  const userName = "Ahmet Zeren";

  const [vehicleName, setVehicleName] = useState("")
  const [vehicleDescription, setVehicleDescription] = useState("")
  const [vehicleCapacity, setVehicleCapacity] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [image1, setImage1] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const fileInputRef = React.createRef();
  const fileInputRef2 = React.createRef();
  const [hoveredUserImg, setHoveredUserImg] = useState(false)
  const [hoveredUserImg2, setHoveredUserImg2] = useState(false)
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);
  const [pageState, setPageState] = useState("s1")
  const [vehicleId, setVehicleId] = useState(3)
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage1(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageChange2 = (e) => {
    const files2 = e.target.files;
    if (files2 && files2.length > 0) {
      const file2 = files2[0];
      setVehicleImage(file2);
      const previewUrl2 = URL.createObjectURL(file2);
      setImagePreview2(previewUrl2);
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

  const handleCreateVehicle = () => {
    if (pageState === "s1")
      setPageState("s2")

    if (pageState === "s2")
      setPageState("s1")
  }



  const completeVehicleCreate = () => {
    if (pageState === "s1")
      setPageState("s2")

    if (pageState === "s2")
      setPageState("s1")
  }

  const printStates = () => {
    console.log("image: ", image);
    console.log("image preview: ", imagePreview);
  }

  const handleRegisterVehicle = () => {
    console.log("...register vehicle...");
  }

  const maxItems = 10;
  const placeholders = Array.from({ length: maxItems }, (_, index) => ({
    key: `placeholder_${index + 1}`,
  }));

  const data = useMemo(() =>
    addedVehicleImages.length < maxItems
      ? [
        ...addedVehicleImages,
        ...placeholders.slice(addedVehicleImages.length),
      ]
      : addedVehicleImages.map((item) => ({
        ...item,
        key: item.addedvehicleImageId,
      })), [addedVehicleImages, maxItems, placeholders]);



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

      const addedvehicleImageId = addedVehicleImageResponse.data.imagePath;
      const newItem = {
        addedvehicleImageId,
        vehicleImage,
      };
      setAddedVehicleImages((prevImages) => [...prevImages, newItem]);
      setVehicleImage(null);
      setImagePreview2(null)
    } catch (error) {
      console.error("Error uploading image", error);
      alert(
        "Failed to upload image. Please check your connection and try again."
      );
    }
    setIsUploadingImage(false);
  }, [vehicleImage, vehicleId, addVehicleImage]);

  useEffect(() => {
    console.log("data", data);
  }, [data])

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
              >Vehicle Details</span>
              <span
                style={{
                  ...VehiclesVoyagesTitle,
                  ...(pageState === "s2" ? activeStyle : {}),
                }}
              >Vehicle Images</span>
            </div>
          </div>



          {pageState === "s1" &&
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

                          style={{
                            // backgroundColor: "rgb(249, 245, 244)"
                          }}

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
                          <option value="" disabled className="placeholderOption">
                            Select
                          </option>
                          {Object.keys(vehicles)
                            .filter((vehicle) => vehicle !== "Walk" && vehicle !== "Run")
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
                      <div className="vehiclePage_descriptionContainer_descriptionContent"
                      >

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
                  <div style={{
                  }}>
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
                        <div className="image-preview">
                          <img src={imagePreview} alt="Uploaded preview"
                            style={{
                              width: "35rem",
                              height: "35rem",
                              objectFit: "cover",
                              borderRadius: "1.5rem",
                              // border: "2px solid #3c9dee42"
                              border: "2px solid transparent"

                            }}
                          />
                        </div>
                      ) :
                        <img
                          src={uploadImage}
                          alt="Upload Icon"
                          onClick={handleImageClick}
                          style={{
                            width: "35rem",
                            height: "35rem",
                            objectFit: "cover",
                            borderRadius: "1.5rem",
                            border: "2px solid transparent"
                          }}
                        />
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

              <div className="createVehicleButton"
                onClick={() => handleCreateVehicle()}
              >Create Vehicle</div>
            </>

          }
          {pageState === "s2" &&
            <>
              <div>
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "1rem"
                }}>
                  <div style={{
                    width: "26rem"
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange2}
                      style={{ display: "none" }}
                      ref={fileInputRef2}
                    />
                    <div
                      style={{
                        position: "relative",
                        width: "25rem"
                      }}
                    >
                      {imagePreview2 ? (
                        <div className="image-preview">
                          <img src={imagePreview2} alt="Uploaded preview"
                            style={uploadImage2}
                          />
                        </div>
                      ) :
                        <img
                          src={uploadImage}
                          alt="Upload Icon"
                          onClick={handleImageClick2}
                          style={uploadImage2}
                        />
                      }
                      {vehicleImage && (
                        <>
                          <div onClick={handleCancelUpload2}
                            style={{ ...deleteImageIcon2, ...((hoveredUserImg2) ? deleteImageIconHover2 : {}) }}
                            onMouseEnter={() => {
                              setHoveredUserImg2(true)
                            }}
                            onMouseLeave={() => setHoveredUserImg2(false)}
                          >
                            <IoRemoveCircleOutline size={"2.5rem"} />
                          </div>

                          <div className="completeVehicleButton"
                            onClick={() => handleUploadImage()}
                          >Add Image</div>

                          <div className="completeVehicleButton"
                            onClick={() => printState()}
                          >Print Image</div>
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
                        console.log("item", item);
                        console.log("item", item.addedvehicleImageId);
                        console.log("item", item.vehicleImage);

                        return (
                          <SwiperSlide>
                            <div key={item.key} className="placeholder_imageContainer" style={{ borderRadius: "2rem", overflow: "hidden" }}>

                              {item.addedvehicleImageId ? (
                                <img
                                  // src={item.vehicleImage}
                                  src={URL.createObjectURL(item.vehicleImage)}

                                  alt={`Uploaded ${index + 1}`}
                                  style={userUploadedImage}
                                />
                              ) : (
                                <img
                                  src={placeHolder}
                                  alt={`Placeholder ${index + 1}`}
                                  style={placeHolderImage}
                                />
                              )}
                            </div>
                          </SwiperSlide>)
                      }
                      )}
                    </Swiper>
                  </div>
                </div>
              </div>
              <div className="completeVehicleButton"
                onClick={() => completeVehicleCreate()}
              >Complete Vehicle</div>
            </>
          }
        </div>
      </header>
    </div>
  );
}

export default CreateVehiclePage;

const placeHolderImage = {
  width: "20rem",
  height: "20rem",
  maxWidth: "20rem",
  margin: "0.5rem",
  borderRadius: "1rem",
  overflow: "hidden",
}

const userUploadedImage = {
  width: "20rem",
  height: "20rem",
  objectFit: "cover",
  maxWidth: "20rem",
  borderRadius: "1rem"
}

const uploadImage2 = {
  width: "25rem",
  height: "25rem",
  objectFit: "cover",
  borderRadius: "1.5rem",
  border: "2px solid transparent"
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
}

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
}

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
  borderRadius: "1.5rem"
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
}

const pageStateDisplayContainer = {
}