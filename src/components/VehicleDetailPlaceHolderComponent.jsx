import React from "react";
import { TopBarMenu } from "./TopBarMenu";
import { TopLeftComponent } from "./TopLeftComponent";
import { VehiclesVoyagesTitle } from "../pages/FavoritesPage";
import { PulsatingParrotLogo } from "./PulsatingParrotLogo";

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
                                boxShadow: "none",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <PulsatingParrotLogo size={200} />
                            </div>
                        </div>
                        <div className="vehiclePage1_swiperContainer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <PulsatingParrotLogo size={200} />
                        </div>
                    </div>
                </div>
            </header>
        </div>

    );
};



