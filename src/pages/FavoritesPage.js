/* eslint-disable no-undef */
import "../assets/css/FavoritesPage.css"
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { FavoritesPageVehiclesComponent } from "../components/FavoritesPageVehiclesComponent";
import { useGetFavoriteVoyagesByUserIdQuery } from "../slices/VoyageSlice";
import { useGetFavoriteVehiclesByUserByIdQuery } from "../slices/VehicleSlice";
import { FavoritesPageVoyagesComponent } from "../components/FavoritesPageVoyagesComponent";

export default function FavoritePage() {
  const userId = localStorage.getItem("storedUserId")
  console.log("userid", userId);
  const {
    data: FavoriteVoyagesData,
    isError: isFavoriteErrorVoyages,
    isSuccess: isFavoriteSuccessVoyages,
    isLoading: isFavoriteLoadingVoyages,
    refetch: refetchFavoriteVoyages,
  } = useGetFavoriteVoyagesByUserIdQuery(userId);
  const {
    data: FavoriteVehiclesData,
    isError: isFavoriteErrorVehicles,
    isSuccess: isFavoriteSuccessVehicles,
    isLoading: isFavoriteLoadingVehicles,
    refetch: refetchFavoriteVehicles,
  } = useGetFavoriteVehiclesByUserByIdQuery(userId);


  useEffect(() => {
    console.log("hello");
    if (isFavoriteSuccessVoyages)
      console.log("FavoriteVoyagesData ", FavoriteVoyagesData);
    if (isFavoriteSuccessVehicles)
      console.log("FavoriteVehiclesData", FavoriteVehiclesData);
  }, [FavoriteVehiclesData, FavoriteVoyagesData])

  return (
    (isFavoriteLoadingVehicles || isFavoriteLoadingVoyages) ? (
      <div style={spinnerContainer}>
        <div className="spinner"></div>
      </div>
    ) : (isFavoriteSuccessVehicles && isFavoriteSuccessVoyages) ? (
      <div className="App">
        <header className="App-header">
          <div className="flex mainpage_Container">
            <div className="flex mainpage_TopRow">
              <TopLeftComponent />
              <div className="flex mainpage_TopRight">
                <TopBarMenu />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", height: "3rem" }}>
              <span style={VehiclesVoyagesTitle}>Vehicles</span>
              <span style={VehiclesVoyagesTitle}>Voyages</span>
            </div>

            <div className="flex favoritesPage_Bottom">
              <div className="flex favoritesPage_BottomLeft">
                <div className="flex favoritesPage_Vehicles">
                  {isFavoriteSuccessVehicles ? (
                    FavoriteVehiclesData?.length > 0 ?
                      (<>
                        {/* <span style={VehiclesVoyagesTitle}>Vehicles</span> */}
                        <FavoritesPageVehiclesComponent FavoriteVehiclesData={FavoriteVehiclesData} />
                      </>) : null)
                    : null
                  }
                </div>
              </div>
              <div className="flex flex-col favoritesPage_BottomRight">
                <div className="flex favoritesPage_Voyages">
                  {isFavoriteSuccessVoyages ? (
                    FavoriteVoyagesData?.length > 0 ?
                      (<>
                        {/* <span style={VehiclesVoyagesTitle}>Voyages</span> */}
                        <FavoritesPageVoyagesComponent FavoriteVoyages={FavoriteVoyagesData} />
                      </>) : null)
                    : null
                  }
                </div>
              </div>
            </div>
          </div>
        </header >
      </div >
    ) : null
  );



}


const spinnerContainer = {
  marginTop: "20%",
};

const VehiclesVoyagesTitle = {
  width: "100%", // Added quotes around "100%"
  fontSize: "2rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white"
};
