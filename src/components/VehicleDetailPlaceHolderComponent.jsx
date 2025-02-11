import React from "react";
import { TopBarMenu } from "./TopBarMenu";
import { TopLeftComponent } from "./TopLeftComponent";
import { VehiclesVoyagesTitle } from "../pages/FavoritesPage";
import { DefaultSpinner } from "./DefaultSpinner";

export const VehicleDetailPlaceHolderComponent = () => {
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
                    <div className="vehiclePage1_vehicleContainer">
                        <div className="vehiclePage1_dataContainer" style={{ position: "relative" }}>

                            <div className="vehiclePage1_descriptionContainer" style={{
                                height: "30rem",
                                backgroundColor: "transparent",
                                boxShadow: "none"
                            }}>
                                <DefaultSpinner />

                            </div>
                        </div>
                        <div className="vehiclePage1_swiperContainer">
                            <DefaultSpinner />
                        </div>
                    </div>
                </div>
            </header>
        </div>

    );
};



