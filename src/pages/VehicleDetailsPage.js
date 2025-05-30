/* eslint-disable no-undef */
import "../assets/css/VehicleDetails.css";
import "../assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import {
  useDeleteVehicleMutation,
  useGetVehicleByIdQuery,
} from "../slices/VehicleSlice";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { VehiclePageImageSwiper } from "../components/VehiclePageImageSwiper";
import { useParams, useNavigate } from "react-router-dom";
import { IoHeartSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddVehicleToFavoritesMutation,
  useDeleteVehicleFromFavoritesMutation,
} from "../slices/VehicleSlice";
import {
  addVehicleToUserFavorites,
  removeVehicleFromUserFavorites,
  useGetFavoriteVehicleIdsByUserIdQuery,
  updateUserFavoriteVehicles,
} from "../slices/UserSlice";
import { VehicleDetailPlaceHolderComponent } from "../components/VehicleDetailPlaceHolderComponent";
import { parrotBlue, parrotRed } from "../styles/colors";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";

function VehicleDetailsPage() {
  const { vehicleId } = useParams();
  const userId = localStorage.getItem("storedUserId");
  // const favoriteVehicles = JSON.parse(localStorage.getItem("storedFavoriteVehicles"))
  const [isDeleting, setIsDeleting] = useState(false);
  let favoriteVehicles;
  try {
    favoriteVehicles = JSON.parse(
      localStorage.getItem("storedFavoriteVehicles")
    );
  } catch (err) {
    console.log(err);
  }
  const isInFavorites = favoriteVehicles?.includes(Number(vehicleId));
  const { data: favoriteVehiclesData } =
    useGetFavoriteVehicleIdsByUserIdQuery(userId);

  useEffect(() => {
    const updateFavoriteVehicles = () => {
      dispatch(
        updateUserFavoriteVehicles({
          favoriteVehicles: favoriteVehiclesData,
        })
      );
    };
    updateFavoriteVehicles();
  }, [favoriteVehiclesData]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoToUser = ({ userId, userName }) => {
    navigate(`/profile-public/${userId}/${userName}`);
  };
  const [isFavorited, setIsFavorited] = useState(isInFavorites);
  const [addVehicleToFavorites] = useAddVehicleToFavoritesMutation();
  const [deleteVehicleFromFavorites] = useDeleteVehicleFromFavoritesMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();

  const handleAddVehicleToFavorites = () => {
    const vehicleId_number = Number(vehicleId);
    addVehicleToFavorites({ userId, vehicleId: vehicleId_number });
    setIsFavorited(true);
    dispatch(
      addVehicleToUserFavorites({
        favoriteVehicle: vehicleId_number,
      })
    );
  };

  const handleDeleteVehicleFromFavorites = () => {
    const vehicleId_number = Number(vehicleId);
    deleteVehicleFromFavorites({ userId, vehicleId: vehicleId_number });
    setIsFavorited(false);
    dispatch(
      removeVehicleFromUserFavorites({
        favoriteVehicle: vehicleId_number,
      })
    );
  };

  const handleDeleteVehicle = async () => {
    setIsDeleting(true);
    const result = await deleteVehicle(vehicleId);
    console.log("delete result:", result);
    navigate("/profile", { state: { refetch: true } });
    setIsDeleting(false);
  };

  const apiUrl = process.env.REACT_APP_API_URL;
  const baseUserImageUrl = `${apiUrl}/Uploads/UserImages/`;
  const [hoveredUserImg, setHoveredUserImg] = useState(false);
  const {
    data: VehicleData,
    isSuccess: isSuccessVehicle,
    isLoading: isLoadingVehicle,
    isError: isErrorVehicle,
    refetch,
  } = useGetVehicleByIdQuery(vehicleId);

  useEffect(() => {
    if (VehicleData) {
      console.log("VehicleData", VehicleData.user.id);
      // console.log("VehicleData", VehicleData.user);
    }
  }, [VehicleData]);

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (isErrorVehicle) return <SomethingWentWrong />;

  return (
    // true ||
    isLoadingVehicle ? (
      <VehicleDetailPlaceHolderComponent />
    ) : isSuccessVehicle ? (
      <div className="App">
        <header className="App-header">
          <div className="flex mainpage_Container">
            <div className="flex mainpage_TopRow">
              <TopLeftComponent />
              <div className="flex mainpage_TopRight">
                <TopBarMenu />
              </div>
            </div>
            <div className="vehiclePage1_vehicleContainer">
              <div
                className="vehiclePage1_dataContainer"
                style={{ position: "relative" }}
              >
                {isFavorited ? (
                  <div
                    onClick={() => handleDeleteVehicleFromFavorites()}
                    style={{
                      ...heartIcon,
                      border: "2px red solid",
                    }}
                  >
                    <IoHeartSharp size="2.5rem" color="red" />
                  </div>
                ) : (
                  <div
                    onClick={() => handleAddVehicleToFavorites()}
                    style={{
                      ...heartIcon,
                      border: "2px orange solid",
                    }}
                  >
                    <IoHeartSharp size="2.5rem" color="orange" />
                  </div>
                )}

                <div className="vehiclePage1_detailsContainer">
                  <div className="vehiclePage1_nameContainer">
                    <div className=" ">
                      <span>Name</span>
                    </div>
                    <div className=" ">
                      <span>{VehicleData.name}</span>
                    </div>
                  </div>
                  <div className="vehiclePage1_vacancyContainer">
                    <div className=" ">
                      <span>Capacity</span>
                    </div>
                    <div className=" ">
                      <span>{VehicleData.capacity}</span>
                    </div>
                  </div>
                  <div className="vehiclePage1_typeContainer">
                    <div className=" ">
                      <span>Type</span>
                    </div>
                    <div className=" ">
                      <span>{VehicleTypes[VehicleData.type]}</span>
                    </div>
                  </div>

                  <div className="vehiclePage1_hostContainer">
                    <div className=" ">
                      <span>Host</span>
                    </div>
                    <div
                      className=" "
                      onClick={() =>
                        handleGoToUser({
                          userId: VehicleData.user.id,
                          userName: VehicleData.user.userName,
                        })
                      }
                    >
                      <div
                        style={userNameStyle}
                        onClick={() => {
                          console.log("message");
                        }}
                      >
                        <img
                          src={
                            baseUserImageUrl + VehicleData.user.profileImageUrl
                          }
                          style={{
                            ...userImageStyle,
                            ...(hoveredUserImg ? userImageStyleHover : {}),
                          }}
                          onMouseEnter={() => {
                            setHoveredUserImg(true);
                          }}
                          onMouseLeave={() => setHoveredUserImg(false)}
                          alt="User"
                          onClick={() =>
                            handleGoToUser({
                              userId: VehicleData.user.id,
                              userName: VehicleData.user.userName,
                            })
                          }
                        />
                        <span style={userNameTextStyle}>
                          {VehicleData.user.userName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="vehiclePage1_descriptionContainer">
                  <div className="vehiclePage1_descriptionContainer_inner">
                    <div className="vehiclePage1_descriptionContainer_descriptionTitle">
                      <span>Description</span>
                    </div>
                    <div className="vehiclePage1_descriptionContainer_descriptionContent">
                      {/* <span> {VehicleData.description}</span> */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: VehicleData.description,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="vehiclePage1_swiperContainer">
                <VehiclePageImageSwiper vehicleData={VehicleData} />
              </div>
            </div>

            {VehicleData?.user.id === userId ? (
              <div style={editVehicleButtonContainer}>
                <div
                  onClick={() => {
                    navigate(`/edit-vehicle/${vehicleId}`);
                  }}
                >
                  <span style={editVehicleButton}>Edit Vehicle</span>
                </div>
                <div
                  onClick={() => {
                    handleDeleteVehicle();
                  }}
                >
                  {isDeleting ? (
                    <div
                      style={{
                        backgroundColor: parrotRed,
                        borderRadius: "1.5rem",
                        padding: "0.25rem 1.5rem",
                        boxShadow:
                          "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
                        fontSize: "1.4rem",
                        fontWeight: 800,
                        color: "white",
                        marginTop: "0.3rem",
                        cursor: "pointer",
                        border: "none",
                        height: "2.1rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "0.5rem",
                        width: "13.5rem",
                      }}
                    >
                      <div
                        className="spinner"
                        style={{
                          height: "1.5rem",
                          width: "1.5rem",
                          border: "5px solid white",
                          borderTop: "5px solid orange",
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{}}>
                      <span style={deleteVehicleButton}>Delete Vehicle</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </header>
      </div>
    ) : null
  );
}

export default VehicleDetailsPage;

const deletingVehicleButton = {
  backgroundColor: parrotRed,
  borderRadius: "1.5rem",
  padding: "0.25rem 1.5rem",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  fontSize: "1.4rem",
  fontWeight: 800,
  color: "white",
  marginTop: "0.3rem",
  cursor: "pointer",
  border: "none",
};

const editVehicleButtonContainer = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "1rem",
  display: "flex",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  // backgroundColor: "pink",
  width: "30rem",
};

const editVehicleButton = {
  backgroundColor: parrotBlue,
  borderRadius: "1.5rem",
  padding: "0.25rem 1.5rem",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  // fontWeight: "bold",
  fontSize: "1.4rem",
  fontWeight: 800,
  color: "white",
  paddingRight: "2rem",
  paddingLeft: "2rem",
  marginTop: "0.3rem",
  cursor: "pointer",
  border: "none",
  width: "100%",
};

const deleteVehicleButton = {
  backgroundColor: parrotRed,
  borderRadius: "1.5rem",
  padding: "0.25rem 1.5rem",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  fontSize: "1.4rem",
  fontWeight: 800,
  color: "white",
  paddingRight: "2rem",
  paddingLeft: "2rem",
  marginTop: "0.3rem",
  cursor: "pointer",
  border: "none",
};

const heartIcon = {
  position: "absolute",
  backgroundColor: "white",
  right: "-1rem",
  top: "-1rem",
  borderRadius: "3rem",
  padding: "0.5rem",
};

const userNameStyle = {
  borderRadius: "1.5rem", // Keep this as the final value for border-radius
  backgroundColor: "#007bff",
  color: "white",
  textAlign: "center",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
  border: "none",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  height: "1.8rem",
  display: "flex",
  flexDirection: "row",
};

const userNameTextStyle = {
  // backgroundColor: "red"
};

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
  backgroundColor: "red",
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

const DeleteVehicleSpinner = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 119, 234,0.1)",
        borderRadius: "1.5rem",
        position: "relative",
        margin: "auto",
        display: "flex",
        alignItems: "center",
        height: "1.7rem",
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
