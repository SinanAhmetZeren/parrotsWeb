/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { IoRemoveCircleOutline } from "react-icons/io5";
import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png"
import placeHolder from "../assets/images/placeholder.png"


function CreateVehiclePage() {
  const { userId } = "43242342432342342342";
  const userName = "Ahmet Zeren";

  useEffect(() => {
    console.log("public profile page: ", userId, " ", userName);
  }, [userId, userName])

  const [vehicleName, setVehicleName] = useState("")
  const [vehicleDescription, setVehicleDescription] = useState("")
  const [vehicleCapacity, setVehicleCapacity] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = React.createRef();
  const [hoveredUserImg, setHoveredUserImg] = useState(false)
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);
  const [pageState, setPageState] = useState("s1")

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCancelUpload = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleCreateVehicle = () => {
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

  const data =
    addedVehicleImages.length < maxItems
      ? [
        ...addedVehicleImages,
        ...placeholders.slice(addedVehicleImages.length),
      ]
      : addedVehicleImages.map((item) => ({
        ...item,
        key: item.addedVoyageImageId,
      }));


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


          {pageState === "s1" ?
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

                        style={{
                          // backgroundColor: "rgb(249, 245, 244)"
                        }}

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
                          // backgroundColor: "rgb(249, 245, 244)"
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
                  // backgroundColor: "cyan",
                  // width: "20.5rem"
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
                      // width: "35rem",
                      // width: "100%",
                      // height: "35rem",
                      // backgroundColor: "orange"
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
                    {image && (
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
            :
            <>
              {/* s2 */}

              <div style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "orange",
                overflow: "scroll",
                width: "100vw"
              }}>
                {data.map((item, index) => (
                  <div key={item.key} className="imageContainer">
                    {item.addedVoyageImageId ? (
                      <img
                        src={item.imageUrl}
                        alt={`Uploaded ${index + 1}`}
                        style={{
                          width: "20rem",
                          height: "20rem",
                          objectFit: "cover",
                          maxWidth: "20rem",

                        }}
                      />
                    ) : (
                      <img
                        src={placeHolder}
                        alt={`Placeholder ${index + 1}`}
                        style={{
                          width: "20rem",
                          height: "20rem",
                          maxWidth: "20rem",
                          margin: "0.5rem",
                          padding: "0.5rem",
                          backgroundColor: "red"
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

            </>
          }


          <div className="createVehicleButton"
            onClick={() => handleCreateVehicle()}
          >Create Vehicle</div>


        </div>
      </header>
    </div>
  );
}

export default CreateVehiclePage;


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

const messageInputStyle = {
  width: "100%",
  fontSize: "1.3rem",
  color: "black",
  overflowY: "hidden",
  minHeight: "18rem",
  maxHeight: "18rem",
  resize: "none",
  backgroundColor: "rgb(249, 245, 244)",
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
  justifyContent: "space-between"
}
