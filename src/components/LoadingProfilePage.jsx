import React from "react";
import { TopBarMenu } from "./TopBarMenu";
import { TopLeftComponent } from "./TopLeftComponent";
import { PulsatingParrotLogo } from "./PulsatingParrotLogo";

export const LoadingProfilePage = () => {
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
                    <div className="flex profilePage_Bottom">
                        <div className="flex profilePage_BottomLeft">
                            <div className="flex profilePage_CoverAndProfile">
                                <div className="flex profilePage_CoverImage"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <PulsatingParrotLogo size={120} />
                                </div>
                            </div>
                            <div className="flex profilePage_BioAndContactDetails"
                            >
                                <div className="flex profilePage_BioTitleUserName"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <PulsatingParrotLogo size={100} />
                                </div>
                                <div className="flex profilePage_ContactDetails"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", padding: "1rem", borderRadius: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <PulsatingParrotLogo size={100} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col"
                            style={{
                                backgroundColor: "rgba(0, 0, 0, .3)",
                                padding: ".5rem",
                                // borderRadius: "1.5rem",
                                height: "100%",
                                width: "40%",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    borderRadius: "1.5rem",
                                    height: "100%",
                                    flexDirection: "column",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <PulsatingParrotLogo size={120} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>);

};
