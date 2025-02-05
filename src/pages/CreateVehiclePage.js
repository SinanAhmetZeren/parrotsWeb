/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css"

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
                    {/* <span>22</span> */}

                    <input
                      type="number"
                      id="capacity"
                      placeholder="Capacity"
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
                      style={{ color: selectedVehicleType ? "#00008b" : "#96989c" }} // Change text color dynamically
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
                <div className="vehiclePage_descriptionContainer_inner">
                  <div className="vehiclePage_descriptionContainer_descriptionTitle">
                    <span>Description</span>
                  </div>
                  <div className="vehiclePage_descriptionContainer_descriptionContent">
                    <span> Description</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="vehicle_swiperContainer">
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default CreateVehiclePage;


const userNameStyle = {
  borderRadius: '1.5rem', // Keep this as the final value for border-radius
  backgroundColor: '#007bff',
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  border: 'none',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)',
  transition: 'box-shadow 0.2s ease',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  height: "1.8rem",
  display: "flex",
  flexDirection: "row"
}

const userNameTextStyle = {
  // backgroundColor: "red"
}

const userImageStyleHover = {
  transform: "scale(1.2)", // Enlarge on hover
};

const userImageStyle = {
  height: "2rem",
  width: "2rem",
  borderRadius: "3rem",
  transition: "transform 0.3s ease-in-out", // Smooth transition
  cursor: "pointer",
};

const spinnerContainer = {
  marginTop: "20%",
};

const VehicleTypes = [
  "Boat",
  "Car",
  "Caravan",
  "Bus",
  "Walk",
  "Run",
  "Motorcycle",
  "Bicycle",
  "TinyHouse",
  "Airplane",
];

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

