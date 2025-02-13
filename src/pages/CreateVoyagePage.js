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

import {
  useAddVoyageImageMutation
} from "../slices/VoyageSlice";

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
  const [voyageImage, setVoyageImage] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const fileInputRef2 = React.createRef();

  const [hoveredUserImg2, setHoveredUserImg2] = useState(false)
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isCreatingVehicle, setIsCreatingVehicle] = useState(false);



  const [pageState, setPageState] = useState(1)
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
  const [voyageId, setVoyageId] = useState(88)
  const [vehicleId, setVehicleId] = useState(3)
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

  const [addVoyageImage] = useAddVoyageImageMutation();


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

            {pageState === 1 &&
              <>
                <div style={{ position: "relative" }}>
                  <ProfileImageandDetailsTitlesComponent />
                  <div style={profileImageandDetailsContainer}>

                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,.3)",
                        borderRadius: "1.5rem",
                        margin: "auto",
                        padding: "1rem"
                      }}
                    >
                      <VoyageProfileImageUploader />
                    </div>
                    <div style={{ backgroundColor: "rgba(255,255,255,0.3)", borderRadius: "1.5rem" }}>
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
                        <div style={{ backgroundColor: "rgba(255,255,255,0.7)", borderRadius: "1.5rem" }}>
                          <AuctionFixedPrice
                            isAuction={isAuction}
                            isFixedPrice={isFixedPrice}
                            setIsAuction={setIsAuction}
                            setIsFixedPrice={setIsFixedPrice}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: "rgba(255,255,255,.31)", borderRadius: "1.5rem" }}>


                      <div style={{
                        alignContent: "center",
                        backgroundColor: "rgba(255,255,255,31)",
                        borderRadius: "1.5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: "scale(.93)"
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
                <CreateVoyageButton setPageState={setPageState} />
              </>
            }

            {pageState === 2 &&
              <>
                <VoyageImageUploaderComponent voyageImage={voyageImage} setVoyageImage={setVoyageImage}
                  addedVoyageImages={addedVoyageImages} setAddedVoyageImages={setAddedVoyageImages}
                  voyageId={voyageId} addVoyageImage={addVoyageImage}
                  isUploadingImage={isUploadingImage} setIsUploadingImage={setIsUploadingImage}
                  setPageState={setPageState}
                />
              </>
            }

            {pageState === 3 &&
              <>
                <VoyageImageUploaderComponent voyageImage={voyageImage} setVoyageImage={setVoyageImage}
                  addedVoyageImages={addedVoyageImages} setAddedVoyageImages={setAddedVoyageImages}
                  voyageId={voyageId} addVoyageImage={addVoyageImage}
                  isUploadingImage={isUploadingImage} setIsUploadingImage={setIsUploadingImage}
                  setPageState={setPageState}
                />
              </>
            }

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
  gridTemplateColumns: "33fr 62fr",
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
  gap: "1rem",
}

const profileImage = {
  // width: "30rem",
  // height: "30rem",
  // margin: "1rem"
}

const voyageDetails = {
  backgroundColor: "rgba(255,255,255,1)",
  borderRadius: "1.5rem",
  alignContent: "center",
  padding: ".2rem",
  transform: "scale(0.92)",
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
      min-height: calc(1.5em * 15);
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



const VoyageImageUploaderComponent = ({
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
    <>
      <div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "1rem"
        }}>
          <div style={{
            width: "26rem",
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange2}
              onClick={(e) => (e.target.value = null)} // Reset value before selection
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
              {voyageImage && (
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

                  <div style={addImageButton}
                    onClick={() => handleUploadImage()}
                  >Add Image</div>
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
                if (index === 0)
                  console.log("item:", item);
                return (
                  <SwiperSlide>
                    <div key={item.key} className="placeholder_imageContainer" style={{ borderRadius: "2rem", overflow: "hidden" }}>
                      {item.addedvoyageImageId ? (
                        <>
                          <img
                            src={URL.createObjectURL(item.voyageImage)}
                            alt={`Uploaded ${index + 1}`}
                            style={userUploadedImage}
                          />
                          <div onClick={() => handleDeleteImage(item.addedvoyageImageId)}
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
                  </SwiperSlide>)
              }
              )}
            </Swiper>
          </div>
        </div>
      </div>
      <div className="completeVehicleButton"
        onClick={() => goToWaypoints()}
      >Complete Voyage</div>


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

    </>
  )

}


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
    <div style={{ backgroundColor: "transparent", borderRadius: "1.5rem" }}>
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
                    width: "28rem",
                    height: "28rem",
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
                    width: "28rem",
                    height: "28rem",
                    objectFit: "cover",
                    borderRadius: "1.5rem",
                    border: "2px solid transparent",
                    //   boxShadow: `
                    // 0 4px 6px rgba(0, 0, 0, 0.1),
                    // inset 0 -4px 6px rgba(0, 0, 0, 0.31)
                    // `,
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
        borderRadius: "1.5rem",
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
        width: "35%",
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
        width: "62%",
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

const CreateVoyageButton = ({ setPageState }) => {

  const buttonStyle = {
    width: "30%",
    backgroundColor: "#007bff",
    padding: "0.6rem",
    marginBottom: "1rem",
    borderRadius: "1.5rem",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.2rem",
    border: "none",
    boxShadow:
      "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
    transition: "box-shadow 0.2s ease",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };


  return (

    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => {
          console.log("apply");
          setPageState(2)
        }}
        style={buttonStyle}
      >
        Create Voyage
      </button>
    </div>

  )
}