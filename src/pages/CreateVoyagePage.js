/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'swiper/css';
import 'swiper/css/pagination';
import {
  useGetVehiclesByUserByIdQuery,
} from "../slices/VehicleSlice";
import { useNavigate } from "react-router-dom";
import { CreateVoyageDatePicker } from "../components/CreateVoyageDatePicker";

import {
  useAddVoyageImageMutation
} from "../slices/VoyageSlice";
import { VoyageImageUploaderComponent } from "../components/VoyageImageUploaderComponent";
import { VoyageProfileImageUploader } from "../components/VoyageProfileImageUploader";
import { VoyageDetailsInputsComponent } from "../components/VoyageDetailsInputsComponent";

export default function CreateVoyagePage() {
  const userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const userName = "Ahmet Zeren";
  const navigate = useNavigate();
  const [vehicleDescription, setVehicleDescription] = useState("")
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [voyageImage, setVoyageImage] = useState(null);

  const [addedVoyageImages, setAddedVoyageImages] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
                      {/*                       
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
                      </div> */}
                      <VoyageDetailsInputsComponent
                        selectedVacancy={selectedVacancy}
                        setSelectedVacancy={setSelectedVacancy}
                        vehicleId={vehicleId}
                        setVehicleId={setVehicleId}
                        vehiclesList={vehiclesList}
                        voyageName={voyageName}
                        setVoyageName={setVoyageName}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        lastBidDate={lastBidDate}
                        setLastBidDate={setLastBidDate}
                        isAuction={isAuction}
                        isFixedPrice={isFixedPrice}
                        setIsAuction={setIsAuction}
                        setIsFixedPrice={setIsFixedPrice}
                      />

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
                <VoyageImageUploaderComponent
                  voyageImage={voyageImage} setVoyageImage={setVoyageImage}
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
