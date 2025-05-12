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
import { FavoritesPlaceHolderComponent } from "../components/FavoritesPlaceHolderComponent";

export default function FavoritePage() {
  const userId = localStorage.getItem("storedUserId")
  // console.log("userid", userId);
  const {
    data: FavoriteVoyagesData,
    isError: isFavoriteVoyagesError,
    isSuccess: isFavoriteVoyagesSuccess,
    isLoading: isFavoriteVoyagesLoading,
    refetch: refetchFavoriteVoyages,
  } = useGetFavoriteVoyagesByUserIdQuery(userId);
  const {
    data: FavoriteVehiclesData,
    isError: isFavoriteVehiclesError,
    isSuccess: isFavoriteVehiclesSuccess,
    isLoading: isFavoriteVehiclesLoading,
    refetch: refetchFavoriteVehicles,
  } = useGetFavoriteVehiclesByUserByIdQuery(userId);

  useEffect(() => {
    refetchFavoriteVoyages();
    refetchFavoriteVehicles();
  }, []);

  // useEffect(() => {
  //   if (isFavoriteVoyagesSuccess)
  //     console.log("FavoriteVoyagesData from api", FavoriteVoyagesData);
  //   if (isFavoriteVehiclesSuccess)
  //     console.log("FavoriteVehiclesData from api", FavoriteVehiclesData);
  // }, [FavoriteVehiclesData, FavoriteVoyagesData])

  return (
    // (isFavoriteVehiclesLoading || isFavoriteVoyagesLoading) ? (

    //   null

    // ) : (isFavoriteVehiclesSuccess && isFavoriteVoyagesSuccess) ? (
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
                {isFavoriteVehiclesSuccess && isFavoriteVoyagesSuccess ? (
                  FavoriteVehiclesData?.length > 0 ?

                    <FavoritesPageVehiclesComponent FavoriteVehiclesData={FavoriteVehiclesData} />
                    :
                    null
                )
                  : <FavoritesPlaceHolderComponent />
                }
              </div>
            </div>
            <div className="flex flex-col favoritesPage_BottomRight">
              <div className="flex favoritesPage_Voyages">
                {isFavoriteVoyagesSuccess && isFavoriteVehiclesSuccess ? (
                  FavoriteVoyagesData?.length > 0 ?
                    <FavoritesPageVoyagesComponent FavoriteVoyages={FavoriteVoyagesData} />
                    :
                    null
                )
                  : <FavoritesPlaceHolderComponent />
                }
              </div>
            </div>
          </div>
        </div>
      </header >
    </div >
    // ) : null
  );



}


const spinnerContainer = {
  marginTop: "20%",
};

export const VehiclesVoyagesTitle = {
  width: "100%", // Added quotes around "100%"
  fontSize: "2rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white"
};



