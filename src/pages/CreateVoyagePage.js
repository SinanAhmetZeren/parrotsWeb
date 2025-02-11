/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
// import '../assets/css/VehicleImagesSwiper.css';
import { FreeMode } from 'swiper/modules';
import {
  useCreateVehicleMutation,
  useAddVehicleImageMutation,
  useDeleteVehicleImageMutation,
  useCheckAndDeleteVehicleMutation,
  useGetVehiclesByUserByIdQuery,
} from "../slices/VehicleSlice";
import { useNavigate } from "react-router-dom";
import { CreateVoyageDatePicker } from "../components/CreateVoyageDatePicker";

export default function CreateVoyagePage() {
  const [createVehicle] = useCreateVehicleMutation();
  const [addVehicleImage] = useAddVehicleImageMutation();
  const [deleteVehicleImage] = useDeleteVehicleImageMutation();
  const [checkAndDeleteVehicle] = useCheckAndDeleteVehicleMutation();
  const userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const userName = "Ahmet Zeren";
  const navigate = useNavigate();

  const [vehicleDescription, setVehicleDescription] = useState("")
  const [vehicleCapacity, setVehicleCapacity] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [vehicleImage, setVehicleImage] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const fileInputRef2 = React.createRef();
  const [hoveredUserImg2, setHoveredUserImg2] = useState(false)
  const [addedVehicleImages, setAddedVehicleImages] = useState([]);
  const [pageState, setPageState] = useState("s1")
  const [vehicleId, setVehicleId] = useState(3)
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false);

  const [voyageBrief, setVoyageBrief] = useState("")
  const [voyageDescription, setVoyageDescription] = useState("")
  const [selectedVacancy, setSelectedVacancy] = useState();
  const [voyageName, setVoyageName] = useState("")
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [isAuction, setIsAuction] = useState(true);
  const [isFixedPrice, setIsFixedPrice] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [lastBidDate, setLastBidDate] = useState(null);
  const [vehiclesList, setVehiclesList] = useState([
    { label: "Walk", value: 63 },
    { label: "Run", value: 64 },
  ])
  const [dates, setDates] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const {
    data: usersVehiclesData,
    isLoading,
    isError,
    error,
    isSuccess: usersVehiclesSuccess,
    refetch,
  } = useGetVehiclesByUserByIdQuery(userId);




  useEffect(() => {

    const dropdownData =
      usersVehiclesSuccess &&
      [
        { label: "Walk", value: 63 },
        { label: "Run", value: 64 },
      ].concat(
        usersVehiclesData.map((vehicle) => ({
          label: vehicle.name,
          value: vehicle.id,
        }))
      );

    console.log("dropDown: --> ", dropdownData);
    setVehiclesList(dropdownData)

  }, [usersVehiclesSuccess, usersVehiclesData, setVehiclesList]);


  return (
    <div style={{
      height: "100vh",
      fontSize: "2rem"
    }}>

      <div className="App">
        <header className="App-header">
          <div className="flex mainpage_Container">
            <div className="flex mainpage_TopRow">
              <TopLeftComponent />
              <div className="flex mainpage_TopRight">
                <TopBarMenu />
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <ProfileImageandDetailsTitlesComponent />
              <div style={profileImageandDetailsContainer}>
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,1)",
                    borderRadius: "1.5rem"
                  }}
                >
                  <VoyageProfileImageUploader />
                </div>
                <div style={voyageDetails}>
                  <div style={{
                    backgroundColor: "rgba(255,255,255,0.7)"
                  }}>
                    <CreateVoyageVacancyPicker
                      selectedVacancy={selectedVacancy}
                      setSelectedVacancy={setSelectedVacancy}
                    />
                  </div>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
                    <CreateVoyageVehicleSelector
                      vehicleId={vehicleId}
                      setVehicleId={setVehicleId}
                      vehiclesList={vehiclesList}
                    />
                  </div>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
                    <CreateVoyagePageNameInput
                      voyageName={voyageName}
                      setVoyageName={setVoyageName}
                    />
                  </div>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.7)", }}>
                    <CreateVoyagePriceInput
                      minPrice={minPrice}
                      setMinPrice={setMinPrice}
                      maxPrice={maxPrice}
                      setMaxPrice={setMaxPrice}
                      type={"Min Price"}
                    />
                  </div>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
                    <CreateVoyagePriceInput
                      minPrice={minPrice}
                      setMinPrice={setMinPrice}
                      maxPrice={maxPrice}
                      setMaxPrice={setMaxPrice}
                      type={"Max Price"}
                    />
                  </div>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
                    <CreateVoyageLastBidDateInput
                      lastBidDate={lastBidDate}
                      setLastBidDate={setLastBidDate}
                    />
                  </div>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
                    <AuctionFixedPrice
                      isAuction={isAuction}
                      isFixedPrice={isFixedPrice}
                      setIsAuction={setIsAuction}
                      setIsFixedPrice={setIsFixedPrice}
                    />
                  </div>
                </div>
                <div style={{
                  alignContent: "center",
                  backgroundColor: "rgba(255,255,255,1)",
                  borderRadius: "1.5rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <CreateVoyageDatePicker
                    dates={dates}
                    setDates={setDates}
                    calendarOpen={calendarOpen}
                    setCalendarOpen={setCalendarOpen}
                  />

                </div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <BriefAndDescriptionTitlesComponent />
              <VoyageBriefAndDescriptionComponent
                voyageDescription={voyageDescription}
                setVoyageDescription={setVoyageDescription}
                voyageBrief={voyageBrief}
                setVoyageBrief={setVoyageBrief}
              />
            </div>
          </div >
        </header >
      </div >
    </div >
  )
}

const shadowText = {
  color: "white",
  padding: "1vh",
  position: "relative",
  margin: "auto",
  alignContent: "center",
  width: "70%", // Added quotes around "100%"
  height: "80%",
  fontSize: "1.6rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  textShadow: `
2px 2px 4px rgba(0, 0, 0, 0.6),  /* Outer shadow */
-2px -2px 4px rgba(255, 255, 255, 0.2) /* Inner highlight */
`,
  filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))", // Enhances shadow effect
}

const profileImageandDetailsTitles = {
  // backgroundColor: "rgba(255,255,255,0.3)",
  marginLeft: "1rem",
  marginRight: "1rem",
  width: "calc(100% - 2rem)",
  borderRadius: "1.5rem",
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "10px",
  position: "absolute",
  top: "1rem",
  paddingLeft: "2rem",
  paddingRight: "2rem"
}

const BriefAndDescriptionTitles = {
  marginLeft: "1rem",
  marginRight: "1rem",
  width: "calc(100% - 2rem)",
  borderRadius: "1.5rem",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  position: "absolute",
  top: "0rem",
  paddingLeft: "2rem",
  paddingRight: "2rem"
}


const profileImageandDetailsContainer = {
  backgroundColor: "rgba(255,255,255,0.3)",
  margin: "1rem",
  width: "calc(100% - 2rem)",
  padding: "2rem",
  paddingTop: "4rem",
  borderRadius: "1.5rem",
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "10px",
}

const profileImage = {
  width: "30rem",
  height: "30rem",
  margin: "1rem"
}

const voyageDetails = {
  backgroundColor: "rgba(255,255,255,1)",
  borderRadius: "1.5rem",
  alignContent: "center",
  padding: ".2rem",
}

const BriefContainer = {
  backgroundColor: "white",
  borderRadius: "1.5rem",
  overflow: "hidden"
}

const DescriptionContainer = {
  backgroundColor: "white",
  borderRadius: "1.5rem",
  overflow: "hidden"
}

const inputStyle = {
  width: "72%",
  padding: ".3rem",
  border: "1px solid #ccc",
  borderRadius: "1.5rem",
  textAlign: "center",
  cursor: "pointer",
  boxShadow: `
0 4px 6px rgba(0, 0, 0, 0.1),
inset 0 -4px 6px rgba(0, 0, 0, 0.1)
`,
  height: "3rem",
  fontSize: "1.1rem",
  color: "#007bff",

}

const labelStyle = {
  width: "28%",
  display: "inline-block",
  textAlign: "end",
  alignSelf: "center",
  color: "black",
  fontSize: "1.3rem"
}

const placeHolderStyle = `
      .custom-input::placeholder {
        font-size: 1.0rem;
        color: gray !important;
      }
    `

const quellStyleBrief = `
      .brief-editor-container .ql-editor {
      min-height: calc(1.5em * 6);
      overflow-y: auto;
      line-height: 1.5;
      color: black
      }
    `


const quellStyleDescription = `
    .description-editor-container .ql-editor {
    min-height: calc(1.5em * 15);
    overflow-y: auto;
    line-height: 1.5;
    color: black
    }
  `


const VoyageProfileImageUploader = () => {

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
    <div style={{ backgroundColor: "white", borderRadius: "1.5rem" }}>
      <div style={profileImage}>
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
                  style={{
                    width: "30rem",
                    height: "30rem",
                    objectFit: "cover",
                    borderRadius: "1.5rem",
                    border: "2px solid transparent"
                  }}
                />
              </div>
            ) :
              <div>
                <img
                  src={uploadImage}
                  alt="Upload Icon"
                  onClick={handleImageClick}
                  style={{
                    width: "30rem",
                    height: "30rem",
                    objectFit: "cover",
                    borderRadius: "1.5rem",
                    border: "2px solid transparent",
                    // ahmet
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

const CreateVoyagePageNameInput = ({ voyageName, setVoyageName }) => {
  return (
    <div style={{
      height: "4rem",
    }}>
      <div style={{
        margin: ".3rem"
      }}>
        <div
          onClick={() => console.log("hello")}
          style={{
            display: "flex",
            cursor: "pointer",
            position: "relative",

            marginTop: "0rem"
          }}
        >
          <span
            className="text-lg font-bold"
            style={labelStyle}
          >
            Name&nbsp;
          </span>

          <style>
            {placeHolderStyle}
          </style>
          <input
            className="font-bold text-base custom-input"
            type="text"
            placeholder="Voyage Name"
            value={voyageName}
            style={inputStyle}
            onChange={(e) => setVoyageName(e.target.value)}
          />
        </div>
      </div>
    </div >
  )
}

const CreateVoyageVehicleSelector = ({ vehicleId, setVehicleId, vehiclesList }) => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false); // State to toggle the dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown container
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Add event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, []);

  return (
    <div style={{
      height: "4rem",
    }}>
      <div style={{
        margin: ".3rem"
      }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            cursor: "pointer",
            position: "relative",
            marginTop: "0rem"
          }}
        >
          <span
            className="text-lg font-bold"
            style={labelStyle}
          >
            Vehicle&nbsp;
          </span>


          <style>
            {placeHolderStyle}
          </style>
          <input
            className="font-bold text-base custom-input"
            type="text"
            readOnly
            value={value}
            placeholder="Select Vehicle"
            style={inputStyle}
          />
          {open && (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                zIndex: 1000,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "1.5rem",
                marginTop: "2.5rem",
                width: "75%",
                right: "0rem",
                maxHeight: "53vh", // Optional: Limit height for large lists
                overflowY: "auto", // Enable scrolling if content exceeds height
                scrollbarWidth: "none", // For Firefox (hide scrollbar)
                msOverflowStyle: "none", // For IE/Edge (hide scrollbar)
                boxShadow: `
              0 4px 6px rgba(0, 0, 0, 0.3),
              inset 0 -4px 6px rgba(0, 0, 0, 0.3)
            `,
              }}
            >
              <style>
                {`
              .custom-dropdown::-webkit-scrollbar {
                display: none; 
              }
            `}
              </style>

              {vehiclesList.map((vehicle, index) => (
                <div
                  className="font-bold text-xl"
                  key={index}
                  onClick={() => {
                    console.log(vehicle.value);
                    setVehicleId(vehicle.value); // Set the selected vacancy
                    setOpen(false); // Close the dropdown
                    setValue(vehicle.label); // Close the dropdown
                  }}
                  style={{
                    padding: ".5rem 1rem",
                    cursor: "pointer",
                    color: "black",
                    boxShadow: `
                  inset 0 -3px 8px rgba(0, 0, 0, 0.05)
                `,
                    borderBottom:
                      index !== vehiclesList.length - 1 ? "1px solid #eee" : "none",
                  }}
                >
                  {vehicle.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateVoyageLastBidDateInput = ({ lastBidDate, setLastBidDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div style={{
      height: "4rem",
    }}>
      <div style={{
        margin: ".3rem"
      }}>
        <div
          onClick={() => console.log("hello")}
          style={{
            display: "flex",
            cursor: "pointer",
            position: "relative",
            marginTop: "0rem"
          }}
        >
          <span
            className="text-lg font-bold"
            style={labelStyle}
          >
            Last Bid&nbsp;
          </span>

          <style>
            {placeHolderStyle}
          </style>


          {showDatePicker ? (
            // Show Date Input when hovered
            <input
              className="font-bold text-base custom-input"
              type="date"
              value={lastBidDate || ""}
              style={inputStyle}
              onChange={(e) => setLastBidDate(e.target.value)}
              onMouseLeave={() => {
                if (!lastBidDate) setShowDatePicker(false); // Hide if no date selected
              }}
              autoFocus // Automatically focus when shown
            />
          ) : (
            // Show Text Input initially
            <input
              className="font-bold text-base custom-input"
              type="text"
              placeholder="Bids close on..."
              value={lastBidDate || ""}
              style={{ ...inputStyle, color: "gray" }}
              onMouseEnter={() => setShowDatePicker(true)} // Switch to date picker on hover
              readOnly // Prevent manual typing
            />
          )}

        </div>
      </div>
    </div >
  )
}

const CreateVoyageVacancyPicker = ({ selectedVacancy, setSelectedVacancy }) => {
  const [open, setOpen] = useState(false); // State to toggle the dropdown visibility
  const dropdownRef = useRef(null); // Ref for the dropdown container
  const vacancies = Array.from({ length: 50 }, (_, index) => index + 1);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Add event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, []);

  return (

    <div style={{
      height: "4rem",
    }}>

      <div style={{
        margin: ".3rem"
      }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            cursor: "pointer",
            position: "relative",
            marginTop: "0rem"
          }}
        >
          <span
            className="text-lg font-bold"
            style={labelStyle}
          >
            Vacancy&nbsp;
          </span>


          <style>
            {placeHolderStyle}
          </style>
          <input
            className="font-bold text-base custom-input"
            type="text"
            readOnly
            value={selectedVacancy} // Display the selected vacancy number
            placeholder="Max number of voyagers"
            style={inputStyle}
          />
          {open && (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                zIndex: 1000,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "1.5rem",
                marginTop: "2.5rem",
                width: "75%",
                right: "0rem",
                maxHeight: "53vh", // Optional: Limit height for large lists
                overflowY: "auto", // Enable scrolling if content exceeds height
                scrollbarWidth: "none", // For Firefox (hide scrollbar)
                msOverflowStyle: "none", // For IE/Edge (hide scrollbar)
                boxShadow: `
              0 4px 6px rgba(0, 0, 0, 0.3),
              inset 0 -4px 6px rgba(0, 0, 0, 0.3)
            `,
              }}
            >
              <style>
                {`
              .custom-dropdown::-webkit-scrollbar {
                display: none; 
              }
            `}
              </style>

              {vacancies.map((vacancy, index) => (
                <div
                  className="font-bold text-xl"
                  key={index}
                  onClick={() => {
                    setSelectedVacancy(vacancy); // Set the selected vacancy
                    setOpen(false); // Close the dropdown
                  }}
                  style={{
                    padding: ".5rem 1rem",
                    cursor: "pointer",
                    color: "black",

                    boxShadow: `
                  inset 0 -3px 8px rgba(0, 0, 0, 0.05)
                `,

                    borderBottom:
                      index !== vacancies.length - 1 ? "1px solid #eee" : "none",
                  }}
                >
                  {vacancy}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateVoyagePriceInput = ({ minPrice, setMinPrice, maxPrice, setMaxPrice, type }) => {
  return (
    <div style={{
      height: "4rem",
    }}>
      <div style={{
        margin: ".3rem"
      }}>
        <div
          onClick={() => console.log("hello")}
          style={{
            display: "flex",
            cursor: "pointer",
            position: "relative",
            marginTop: "0rem"
          }}
        >
          <span
            className="text-lg font-bold"
            style={labelStyle}
          >
            {type}&nbsp;
          </span>
          <style>
            {placeHolderStyle}
          </style>
          <input
            className="font-bold text-base custom-input"
            type="number"
            placeholder={type}
            value={type === "Max Price" ? (maxPrice === null ? "" : maxPrice) : (minPrice === null ? "" : minPrice)}

            style={inputStyle}
            onChange={(e) => {
              let newValue = e.target.value;
              if (newValue.startsWith("0") && newValue.length > 1) {
                newValue = newValue.slice(1);
              }
              if (newValue === "0" || newValue === "") {
                newValue = null;
              } else {
                newValue = Number(newValue);
              }
              if (type === "Max Price") {
                setMaxPrice(newValue);
              } else {
                setMinPrice(newValue);
              }
            }}
          />
        </div>
      </div>
    </div >
  )
}

const AuctionFixedPrice = ({ isAuction, setIsAuction, isFixedPrice, setIsFixedPrice }) => {
  return (
    <div
      style={{
        height: "4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      <label
        className="text-lg font-bold"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "black",
          cursor: "pointer",
        }}
      >
        Fixed Price
        <input
          type="checkbox"
          checked={isFixedPrice}
          onChange={() => setIsFixedPrice(!isFixedPrice)}
          style={{ width: "2rem", height: "2rem", accentColor: "#007bff" }}
        />
      </label>

      <label
        className="text-lg font-bold"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "black",
          cursor: "pointer",
        }}
      >
        Auction
        <input
          type="checkbox"
          checked={isAuction}
          onChange={() => setIsAuction(!isAuction)}
          style={{ width: "2rem", height: "2rem", accentColor: "#007bff" }}
        />
      </label>
    </div>
  );
}

const VoyageBriefInput = ({ voyageBrief, setVoyageBrief }) => {

  return (
    <div className="brief-editor-container">
      <style>
        {quellStyleBrief}

      </style>
      <ReactQuill
        value={voyageBrief}
        onChange={setVoyageBrief}
        placeholder="Voyage brief - 300 characters"
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
  )
}

const VoyageDescriptionInput = ({ voyageDescription, setVoyageDescription }) => {

  return (
    <div className="description-editor-container">
      <style>
        {quellStyleDescription}

      </style>
      <ReactQuill
        value={voyageDescription}
        onChange={setVoyageDescription}
        placeholder="Voyage description - 300 characters"
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
  )
}

const VoyageBriefAndDescriptionComponent = ({ voyageBrief, setVoyageBrief,
  voyageDescription, setVoyageDescription
}) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      backgroundColor: "rgba(255,255,255,.3)",
      marginLeft: "1rem",
      marginRight: "1rem",
      borderRadius: "1.5rem",
      marginBottom: "1rem",
      alignItems: "flex-start", // Ensures children align to the top
      justifyContent: "space-around", // Distributes space around children
    }}>
      <div style={{
        backgroundColor: "rgba(255,255,255,.3)", // -- > this item should go to the top
        padding: "1rem",
        marginTop: "3rem",
        borderRadius: "1.5rem",
        width: "48%",
        marginBottom: "1rem",
      }}>
        <div style={BriefContainer}>
          <VoyageBriefInput voyageBrief={voyageBrief} setVoyageBrief={setVoyageBrief} />
        </div>
      </div>
      <div style={{
        backgroundColor: "rgba(255,255,255,.3)",
        padding: "1rem",
        marginBottom: "1.5rem",
        marginTop: "3rem",
        borderRadius: "1.5rem",
        width: "48%",
      }}>
        <div style={DescriptionContainer}>
          <VoyageDescriptionInput voyageDescription={voyageDescription} setVoyageDescription={setVoyageDescription} />
        </div>
      </div >
    </div >

  )
}

const BriefAndDescriptionTitlesComponent = () => {
  return (
    <div style={BriefAndDescriptionTitles}>
      <div>
        <span
          style={shadowText} >
          Brief</span>
      </div>
      <div>
        <span
          style={shadowText} >
          Description</span>
      </div>
    </div>
  )
}

const ProfileImageandDetailsTitlesComponent = () => {
  return (
    <div style={profileImageandDetailsTitles}>
      <div>
        <span
          style={shadowText} >
          Profile Image</span>
      </div>
      <div>
        <span
          style={shadowText} >
          Details</span>
      </div>
      <div>
        <span
          style={shadowText} >
          Dates</span>
      </div>
    </div>
  )
}