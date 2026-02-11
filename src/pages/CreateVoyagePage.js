/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import "../assets/css/CreateVehicle.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "swiper/css";
import "swiper/css/pagination";
import {
  useCheckAndDeleteVehicleMutation,
  useGetVehiclesByUserByIdQuery,
} from "../slices/VehicleSlice";
import { CreateVoyageDatePicker } from "../components/CreateVoyageDatePicker";

import {
  useAddVoyageImageMutation,
  useCheckAndDeleteVoyageMutation,
  useCreateVoyageMutation,
  useDeleteVoyageImageMutation,
} from "../slices/VoyageSlice";
import { VoyageImageUploaderComponent } from "../components/VoyageImageUploaderComponent";
import { VoyageProfileImageUploader } from "../components/VoyageProfileImageUploader";
import { VoyageDetailsInputsComponent } from "../components/VoyageDetailsInputsComponent";
import { AddWaypointsPage } from "../components/AddWaypointsComponent";
import { useLocation } from "react-router-dom";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { SomethingWentWrong } from "../components/SomethingWentWrong";

export default function CreateVoyagePage() {
  // const userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const userId = localStorage.getItem("storedUserId");
  const [voyageImage, setVoyageImage] = useState(null);
  const [addedVoyageImages, setAddedVoyageImages] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pageState, setPageState] = useState(1);
  const [voyageBrief, setVoyageBrief] = useState("333");
  const [voyageDescription, setVoyageDescription] = useState("333");
  const [selectedVacancy, setSelectedVacancy] = useState(3); // empty
  const [voyageName, setVoyageName] = useState("xyz");
  const [minPrice, setMinPrice] = useState(5); // null
  const [maxPrice, setMaxPrice] = useState(5);
  const [isAuction, setIsAuction] = useState(false);
  const [isFixedPrice, setIsFixedPrice] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(true);
  // const [lastBidDate, setLastBidDate] = useState("2025-04-30");
  const [lastBidDate, setLastBidDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]);
  const [voyageId, setVoyageId] = useState(15); // ""
  const [order, setOrder] = useState(1);
  const [isCreatingVoyage, setIsCreatingVoyage] = useState(false);
  const [vehicleId, setVehicleId] = useState(3); //""

  const walkDBId = process.env.REACT_APP_WALK_ID;
  const runDBId = process.env.REACT_APP_RUN_ID;
  const trainDBId = process.env.REACT_APP_TRAIN_ID;


  const [vehiclesList, setVehiclesList] = useState([
    { label: "Walk", value: walkDBId },
    { label: "Run", value: runDBId },
    { label: "Train", value: trainDBId },
  ]);
  const [dates, setDates] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const [addVoyageImage] = useAddVoyageImageMutation();
  const [deleteVoyageImage] = useDeleteVoyageImageMutation();
  const [createVoyage] = useCreateVoyageMutation();

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
        { label: "Walk", value: walkDBId },
        { label: "Run", value: runDBId },
        { label: "Train", value: trainDBId },
      ].concat(
        usersVehiclesData?.map((vehicle) => ({
          label: vehicle.name,
          value: vehicle.id,
        }))
      );

    setVehiclesList(dropdownData);
  }, [usersVehiclesSuccess, usersVehiclesData, setVehiclesList]);


  function convertDateFormat(inputDate) {
    const date = new Date(inputDate);
    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);
    const hours = `0${date.getUTCHours()}`.slice(-2);
    const minutes = `0${date.getUTCMinutes()}`.slice(-2);
    const seconds = `0${date.getUTCSeconds()}`.slice(-2);
    const milliseconds = `00${date.getUTCMilliseconds()}`.slice(-3);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  function convertDateFormat_LastBidDate(inputDate) {
    const date = new Date(`${inputDate}T00:00:00.000Z`);
    const formattedDate = `${date.getUTCFullYear()}-${(
      "0" +
      (date.getUTCMonth() + 1)
    ).slice(-2)}-${("0" + date.getUTCDate()).slice(-2)}T00:00:00.000Z`;
    return formattedDate;
  }

  const handleCreateVoyage = async () => {
    if (!voyageImage) {
      return;
    }
    setIsCreatingVoyage(true);
    const startDate = dates[0].startDate;
    const endDate = dates[0].endDate;

    try {
      const formattedStartDate = convertDateFormat(startDate);
      const formattedEndDate = endDate
        ? convertDateFormat(endDate)
        : convertDateFormat(startDate);
      // const formattedLastBidDate = convertDateFormat_LastBidDate(lastBidDate);
      const formattedLastBidDate = formattedStartDate;

      const response = await createVoyage({
        voyageImage,
        name: voyageName,
        brief: voyageBrief,
        description: voyageDescription,
        vacancy: selectedVacancy,
        formattedStartDate,
        formattedEndDate,
        formattedLastBidDate,
        minPrice,
        maxPrice,
        isAuction,
        isFixedPrice,
        userId,
        vehicleId,
      });

      const createdVoyageId = response.data.data.id;
      setVoyageId(createdVoyageId);
      console.log("created voyage id: ", createdVoyageId);
      setVoyageImage(null);
      setAddedVoyageImages([]);
      setIsUploadingImage(false);
      setPageState(1);
      setVoyageBrief("");
      setVoyageDescription("");
      setSelectedVacancy(undefined);
      setVoyageName("");
      setMinPrice(null);
      setMaxPrice(null);
      setIsAuction(true);
      setIsFixedPrice(true);
      setCalendarOpen(true);
      setLastBidDate(null);
      setIsCreatingVoyage(false);
      setVehicleId("");
      setVehiclesList([
        { label: "Walk", value: walkDBId },
        { label: "Run", value: runDBId },
        { label: "Train", value: trainDBId },
      ]);
      setDates([
        {
          startDate: null,
          endDate: null,
          key: "selection",
        },
      ]);
      setPageState(2);
    } catch (error) {
      console.error("Error uploading image", error);
    }
    setIsCreatingVoyage(false);
  };



  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  return (
    <div
      style={{
        height: "100vh",
        fontSize: "2rem",
      }}
    >
      <div className="App">
        <header className="App-header">
          <div className="flex mainpage_Container">
            <div className="flex mainpage_TopRow">
              <TopLeftComponent />
              <div className="flex mainpage_TopRight">
                <TopBarMenu />
              </div>
            </div>

            {
              // false &&
              pageState === 1 && (
                <>
                  <div style={{ position: "relative" }}>
                    <ProfileImageandDetailsTitlesComponent />
                    <div style={profileImageandDetailsContainer}>
                      <div
                        style={{
                          backgroundColor: "rgba(255,255,255,.3)",
                          borderRadius: "1.5rem",
                          margin: "auto",
                          padding: "1rem",
                        }}
                      >
                        <VoyageProfileImageUploader
                          voyageImage={voyageImage}
                          setVoyageImage={setVoyageImage}
                        />
                      </div>
                      <div
                        style={{
                          backgroundColor: "rgba(255,255,255,0.3)",
                          borderRadius: "1.5rem",
                        }}
                      >
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
                      <div
                        style={{
                          backgroundColor: "rgba(255,255,255,.31)",
                          borderRadius: "1.5rem",
                        }}
                      >
                        <div style={datePickerContainer}>
                          <CreateVoyageDatePicker
                            dates={dates}
                            setDates={setDates}
                            calendarOpen={calendarOpen}
                            setCalendarOpen={setCalendarOpen}

                          />
                        </div>
                      </div>

                      {/* <div style={addWaypointButton}
                      onClick={() => handlePrintState()}
                    >Print State</div> */}
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
                  <CreateVoyageButton
                    handleCreateVoyage={handleCreateVoyage}
                    isCreatingVoyage={isCreatingVoyage}
                    disabled={
                      !(
                        voyageDescription &&
                        voyageBrief &&
                        voyageImage &&
                        selectedVacancy &&
                        vehicleId &&
                        voyageName &&
                        minPrice &&
                        maxPrice &&
                        lastBidDate &&
                        // isAuction !== "" &&
                        // isFixedPrice !== "" &&
                        dates[0]?.startDate
                      )
                    }
                  />
                  {/* <div style={addWaypointButton}
                  onClick={() => setPageState(2)}
                >Back</div> */}
                </>
              )
            }

            {
              // false &&
              pageState === 2 && (
                <>
                  <VoyageImageUploaderComponent
                    voyageImage={voyageImage}
                    setVoyageImage={setVoyageImage}
                    addedVoyageImages={addedVoyageImages}
                    setAddedVoyageImages={setAddedVoyageImages}
                    voyageId={voyageId}
                    addVoyageImage={addVoyageImage}
                    deleteVoyageImage={deleteVoyageImage}
                    isUploadingImage={isUploadingImage}
                    setIsUploadingImage={setIsUploadingImage}
                    setPageState={setPageState}
                  />
                  {/* <div style={addWaypointButton}
                  onClick={() => setPageState(1)}
                >Back</div> */}
                  {/* <div style={addWaypointButton}
                  onClick={() => handlePrintState()}
                >Print States</div> */}
                </>
              )
            }

            {/* {pageState !== 3 || */}
            {pageState === 3 && (
              <>
                <AddWaypointsPage
                  voyageId={voyageId}
                  setPageState={setPageState}
                  order={order}
                  setOrder={setOrder}
                />
              </>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}

const ProfileImageandDetailsTitlesComponent = () => {
  return (
    <div style={profileImageandDetailsTitles}>
      <div>
        <span style={shadowText}>Profile Image</span>
      </div>
      <div>
        <span style={shadowText}>Details</span>
      </div>
      <div>
        <span style={shadowText}>Dates</span>
      </div>
    </div>
  );
};

const CreateVoyageButton = ({
  handleCreateVoyage,
  disabled,
  isCreatingVoyage,
}) => {
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
          handleCreateVoyage();
        }}
        disabled={disabled}
        style={disabled ? { ...buttonStyle, opacity: 0.5 } : buttonStyle}
      >
        {isCreatingVoyage ? <CreateVogageSpinner /> : "Next"}
      </button>
    </div>
  );
};

const VoyageBriefInput = ({ voyageBrief, setVoyageBrief }) => {
  return (
    <div className="brief-editor-container">
      <style>{quellStyleBrief}</style>
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
  );
};

const VoyageDescriptionInput = ({
  voyageDescription,
  setVoyageDescription,
}) => {
  return (
    <div className="description-editor-container">
      <style>{quellStyleDescription}</style>
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
  );
};

const VoyageBriefAndDescriptionComponent = ({
  voyageBrief,
  setVoyageBrief,
  voyageDescription,
  setVoyageDescription,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,.3)",
        marginLeft: "1rem",
        marginRight: "1rem",
        borderRadius: "1.5rem",
        marginBottom: "1rem",
        alignItems: "flex-start", // Ensures children align to the top
        justifyContent: "space-around", // Distributes space around children
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255,255,255,.3)", // -- > this item should go to the top
          padding: "1rem",
          marginTop: "3rem",
          borderRadius: "1.5rem",
          width: "35%",
          marginBottom: "1rem",
        }}
      >
        <div style={BriefContainer}>
          <VoyageBriefInput
            voyageBrief={voyageBrief}
            setVoyageBrief={setVoyageBrief}
          />
        </div>
      </div>
      <div
        style={{
          backgroundColor: "rgba(255,255,255,.3)",
          padding: "1rem",
          marginBottom: "1.5rem",
          marginTop: "3rem",
          borderRadius: "1.5rem",
          width: "62%",
        }}
      >
        <div style={DescriptionContainer}>
          <VoyageDescriptionInput
            voyageDescription={voyageDescription}
            setVoyageDescription={setVoyageDescription}
          />
        </div>
      </div>
    </div>
  );
};

const BriefAndDescriptionTitlesComponent = () => {
  return (
    <div style={BriefAndDescriptionTitles}>
      <div>
        <span style={shadowText}>Brief</span>
      </div>
      <div>
        <span style={shadowText}>Description</span>
      </div>
    </div>
  );
};

const datePickerContainer = {
  alignContent: "center",
  backgroundColor: "rgba(255,255,255,31)",
  borderRadius: "1.5rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transform: "scale(.93)",
};

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
};

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
  paddingRight: "2rem",
};

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
  paddingRight: "2rem",
};

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
};

const BriefContainer = {
  backgroundColor: "white",
  borderRadius: "1.5rem",
  overflow: "hidden",
};

const DescriptionContainer = {
  backgroundColor: "white",
  borderRadius: "1.5rem",
  overflow: "hidden",
};

const quellStyleBrief = `
      .brief-editor-container .ql-editor {
      min-height: calc(1.5em * 15);
      overflow-y: auto;
      line-height: 1.5;
      color: black
      }
    `;

const quellStyleDescription = `
    .description-editor-container .ql-editor {
    min-height: calc(1.5em * 15);
    overflow-y: auto;
    line-height: 1.5;
    color: black
    }
  `;

const CreateVogageSpinner = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 119, 234,0.1)",
        borderRadius: "1.5rem",
        position: "relative",
        margin: "auto",
        display: "flex",
        alignItems: "center",
        height: "2rem",
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
