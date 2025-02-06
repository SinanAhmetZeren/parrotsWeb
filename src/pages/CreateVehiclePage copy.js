/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css"
import React, { useState, useEffect } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png"
import placeHolder from "../assets/images/placeholder.png"
import { IoRemoveCircleOutline } from "react-icons/io5";

function CreateVehiclePage() {
  const { userId } = "43242342432342342342";
  const { userName } = "Ahmet Zeren";

  useEffect(() => {
    console.log("public profile page: ", userId, " ", userName);
  }, [userId, userName])

  const [vehicleName, setVehicleName] = useState("")
  const [vehicleDescription, setVehicleDescription] = useState("")
  const [vehicleCapacity, setVehicleCapacity] = useState(1);
  const [selectedVehicleType, setSelectedVehicleType] = useState("Boat");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = React.createRef();
  const [hoveredUserImg, setHoveredUserImg] = useState(false)
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);

  const handleImageChange = (e) => {
    console.log("hello from image change");
    console.log("e: --->", e);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCancelUpload = () => {
    console.log("hello from cancel image");
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
    // <div style={spinnerContainer}>
    //   <div className="spinner"></div>
    // </div>
    <div className="App">
      <header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>
          <div style={{
            // mainContainer
          }}>
            <div style={wrapper}>
              <div style={{
                display: "flex",
                flexDirection: "row",
                padding: "1rem",
                backgroundColor: "lightgoldenrodyellow",
                width: "100%"
              }}>
                <div style={{
                  backgroundColor: "cyan",
                  width: "20.5rem"
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
                      width: "20rem",
                      padding: "0.5rem",
                      backgroundColor: "orange"

                    }}
                  >
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Uploaded preview"
                          style={{
                            width: "20rem",
                            height: "20rem",
                            objectFit: "cover",
                            borderRadius: "1.5rem",
                            border: "2px solid #3c9dee42"
                          }}
                        />
                      </div>
                    ) :
                      <img
                        src={uploadImage}
                        alt="Upload Icon"
                        onClick={handleImageClick}
                        style={{
                          width: "20rem",
                          height: "20rem",
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


                <div style={{ backgroundColor: "red" }}>
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "orange",
                    overflow: "scroll",
                    width: "calc(100vw - 22.5rem)"
                  }}>
                    {data.map((item, index) => (
                      <div key={item.key} className="image-container">
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
                </div>


              </div>

              <div
                className="username-wrapper">
                <input
                  type="text"
                  placeholder="Vehicle Name"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="username-input"
                />
              </div>
              <div
                className="password-wrapper">
                <input
                  type={"text"}
                  placeholder="Description"
                  value={vehicleDescription}
                  onChange={(e) => setVehicleDescription(e.target.value)}
                  className="password-input"
                />
              </div>
              <div className="capacity-wrapper">
                <input
                  type="number"
                  id="capacity"
                  min="1"
                  max="100"
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                  className="password-input"
                />
              </div>
              <div className="vehicle-type-wrapper">
                <select
                  id="vehicle-type"
                  value={selectedVehicleType}
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                  className="password-input"
                >
                  {Object.keys(vehicles).map((vehicle) => (
                    <option key={vehicle} value={vehicle}>
                      {vehicles[vehicle]} {vehicle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="login-button"
                onClick={() => handleRegisterVehicle()}
              > Register Vehicle</div>
            </div>
          </div>
        </div>
      </header >
    </div >
  );
}

export default CreateVehiclePage;


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
  transition: "transform 0.3s ease-in-out", // Smooth transition
}

const deleteImageIconHover = {
  transform: "scale(1.2)", // Enlarge on hover
};

const spinnerContainer = {
  marginTop: "20%",
};

const mainContainer = {
  backgroundColor: "rgba(255, 255, 255, .3)",
  width: "80%",
  margin: "auto",
  borderRadius: "2rem",
  padding: "1rem",
  display: "flex",
  justifyContent: "center",
  marginTop: "3rem"
}

const welcomeStyle = {
  color: "rgba(10, 119, 234,.7)",
  margin: "0.5rem",
  fontSize: "1.8rem",
  fontWeight: "bold",
  borderRadius: "2rem"
}

const wrapper = {
  backgroundColor: "white",
  width: "100%",
  backgroundColor: "yellow"
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
