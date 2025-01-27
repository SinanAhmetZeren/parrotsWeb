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
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdHeight } from "react-icons/md";

function VehicleDetailsPage() {
  const { vehicleId } = useParams();
  const userId = "1bf7d55e-7be2-49fb-99aa-93d947711e32";
  const navigate = useNavigate();
  const handleGoToUser = (user) => {
    console.log("go to user: ", user.userName);
  }

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
              <TopLeftComponent userName={"Peter Parker"} />
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
                      <span>{VehicleData.name}</span>
                    </div>
                  </div>
                  <div className="vehiclePage_vacancyContainer">
                    <div className=" ">
                      <span>Capacity</span>
                    </div>
                    <div className=" ">
                      <span>{VehicleData.capacity}</span>
                    </div>

                  </div>
                  <div className="vehiclePage_typeContainer">
                    <div className=" ">
                      <span>Type</span>
                    </div>
                    <div className=" ">
                      <span>{VehicleTypes[VehicleData.type]}</span>
                    </div>
                  </div>

                  <div className="vehiclePage_hostContainer">
                    <div className=" ">
                      <span>Host</span>
                    </div>
                    <div className=" " onClick={() => handleGoToUser(VehicleData.user)}>
                      <div style={userNameStyle} onClick={() => { console.log("message") }}>
                        <span>{VehicleData.user.userName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="vehiclePage_descriptionContainer">
                  <div className="vehiclePage_descriptionContainer_inner">
                    <div className="vehiclePage_descriptionContainer_descriptionTitle">
                      <span>Description</span>
                    </div>
                    <div className="vehiclePage_descriptionContainer_descriptionContent">
                      <span> {VehicleData.description}</span>
                    </div>

                  </div>
                </div>


              </div>
              <div className="vehicle_swiperContainer">
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
  height: "1.8rem"
}
