import React from "react";
import { TopBarMenu } from "./TopBarMenu";
import { TopLeftComponent } from "./TopLeftComponent";
import { VehiclesVoyagesTitle } from "../pages/FavoritesPage";
import { DefaultSpinner } from "./DefaultSpinner";

export const FavoritesPlaceHolderComponent = () => {
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
                    <div style={{ display: "flex", flexDirection: "row", height: "3rem" }}>
                        <span style={VehiclesVoyagesTitle}>Vehicles</span>
                        <span style={VehiclesVoyagesTitle}>Voyages</span>
                    </div>
                    <div className="flex favoritesPage_Bottom">
                        <div className="flex favoritesPage_BottomLeft">
                            <div className="flex favoritesPage_Vehicles"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    padding: "1rem",
                                    height: "45rem",
                                    borderRadius: "1.5rem",
                                    width: "95%"
                                }}
                            >
                                <DefaultSpinner />
                            </div>
                        </div>
                        <div className="flex flex-col favoritesPage_BottomRight">
                            <div className="flex favoritesPage_Voyages"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    padding: "1rem",
                                    height: "45rem",
                                    borderRadius: "1.5rem",
                                    width: "95%"
                                }}
                            >
                                <DefaultSpinner />

                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>

    );
};
