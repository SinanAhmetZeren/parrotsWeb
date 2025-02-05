/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css"
import React, { useState, useEffect } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useGetUserByIdQuery } from "../slices/UserSlice";
import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png"

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
  const [image, setImage] = useState(null); // State to store the image
  const [imagePreview, setImagePreview] = useState(null); // State for the image preview
  const fileInputRef = React.createRef(); // Reference to the file input

  const handleImageChange = (e) => {
    console.log("hello from image change");
    console.log("e: --->", e);
    const files = e.target.files;
    if (files && files.length > 0) { // Check if files array is not empty
      const file = files[0]; // Get the selected file
      setImage(file); // Update the state with the selected image
      const previewUrl = URL.createObjectURL(file); // Generate a preview URL
      setImagePreview(previewUrl); // Set the preview URL for the image
    }
  };

  const handleCancelUpload = () => {
    console.log("hello from cancel image");
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Make sure it's safe to revoke
    }
    setImage(null);
    setImagePreview(null);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };


  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error,
    isSuccess: isSuccessUser,
    refetch: refetchUserData,
  } = useGetUserByIdQuery(userId);

  const handleRegisterVehicle = () => {
    console.log("...register vehicle...");
  }


  return (
    isLoadingUser ? (
      <div style={spinnerContainer}>
        <div className="spinner"></div>
      </div>
    ) : true ? (
      <div className="App">
        <header className="App-header">
          <div className="flex mainpage_Container">
            <div className="flex mainpage_TopRow">
              <TopLeftComponent />
              <div className="flex mainpage_TopRight">
                <TopBarMenu />

              </div>
            </div>

            <div style={mainContainer}>
              <div style={wrapper}>
                <div className="image-upload-container">
                  {/* Hidden file input field */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    ref={fileInputRef}
                  />
                  {/* Clickable image that triggers the file input */}
                  <img
                    src={uploadImage} // Placeholder image for the "upload" button
                    alt="Upload Icon"
                    onClick={handleImageClick}
                    style={{ cursor: "pointer", maxWidth: "5rem", maxHeight: "5rem" }}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Uploaded preview" style={{ maxWidth: "100%", maxHeight: "400px" }} />
                    </div>
                  )}
                  {image && (
                    <img
                      style={{ cursor: "pointer", maxWidth: "5rem", maxHeight: "5rem" }}
                      src={uploadImage} // Example cancel icon
                      alt="Cancel Upload"
                      onClick={handleCancelUpload}
                    />
                  )}
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
    ) : null
  );



}

export default CreateVehiclePage;



const spinnerContainer = {
  marginTop: "20%",
};

const mainContainer = {
  backgroundColor: "rgba(255, 255, 255, .3)",
  width: "40%",
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

const mainWrapper = {
}

const wrapper = {
  backgroundColor: "white",
  width: "100%",
  padding: "1rem",
  paddingTop: "2rem",
  paddingBottom: "3rem",
  borderRadius: "1.5rem",
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
