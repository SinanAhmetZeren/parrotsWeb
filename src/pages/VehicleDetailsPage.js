/* eslint-disable no-undef */
import "../assets/css/VehicleDetails.css";
import "../assets/css/advancedmarker.css";
import React, { useState, useEffect, useRef } from "react";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css";
import "swiper/css/navigation";
import {
  useGetVehicleByIdQuery,
} from "../slices/VehicleSlice";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { VehiclePageImageSwiper } from "../components/VehiclePageImageSwiper";
import { useParams, useNavigate } from "react-router-dom";

function VehicleDetailsPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const handleGoToUser = ({ userId, userName }) => {
    navigate(`/profile-public/${userId}/${userName}`);
  }

  const apiUrl = process.env.REACT_APP_API_URL;
  const baseUserImageUrl = `${apiUrl}/Uploads/UserImages/`;
  const [hoveredUserImg, setHoveredUserImg] = useState(false)
  const {
    data: VehicleData,
    isSuccess: isSuccessVehicle,
    isLoading: isLoadingVehicle,
    isError: isErrorVehicle,
    refetch,
  } = useGetVehicleByIdQuery(vehicleId);

  useEffect(() => {
    if (VehicleData)
      console.log("VehicleData", VehicleData);
  }, [VehicleData]);

  return (
    isLoadingVehicle ? (
      <div style={spinnerContainer}>
        <div className="spinner"></div>
      </div>
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
              <div className="vehiclePage1_dataContainer">
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
                    <div className=" " onClick={() => handleGoToUser({ userId: VehicleData.user.id, userName: VehicleData.user.userName })}>
                      <div style={userNameStyle} onClick={() => { console.log("message") }}>
                        <img src={baseUserImageUrl + VehicleData.user.profileImageUrl}
                          style={{ ...userImageStyle, ...((hoveredUserImg) ? userImageStyleHover : {}) }}
                          onMouseEnter={() => {
                            setHoveredUserImg(true)
                          }}
                          onMouseLeave={() => setHoveredUserImg(false)}


                          alt="User" onClick={() => handleGoToUser({ userId: VehicleData.user.id, userName: VehicleData.user.userName })} />
                        <span style={userNameTextStyle} >{VehicleData.user.userName}</span>
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
                      <div dangerouslySetInnerHTML={{ __html: VehicleData.description }} />
                    </div>

                  </div>
                </div>


              </div>
              <div className="vehiclePage1_swiperContainer">
                <VehiclePageImageSwiper vehicleData={VehicleData} />
              </div>

            </div>
          </div>
        </header>
      </div>
    ) : null
  );



}

export default VehicleDetailsPage;


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


