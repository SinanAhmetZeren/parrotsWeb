import React from "react";
import { TopBarMenu } from "./TopBarMenu";
import { TopLeftComponent } from "./TopLeftComponent";
import { PulsatingParrotLogo } from "./PulsatingParrotLogo";

const cell = {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    boxShadow: "0 8px 24px rgba(0,14,30,.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
};

export const LoadingProfilePage = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", overflow: "hidden", fontFamily: "Nunito, sans-serif", backgroundColor: "#081E36" }}>
            <div className="flex mainpage_TopRow">
                <TopLeftComponent />
                <div className="flex mainpage_TopRight"><TopBarMenu /></div>
            </div>
            <div style={{
                maxWidth: 1500,
                width: "100%",
                flex: 1,
                minHeight: 0,
                margin: "0 auto",
                padding: "0 20px 16px",
                display: "grid",
                gridTemplateColumns: "minmax(0,375px) minmax(0,1fr) minmax(0,375px) 28rem",
                gridTemplateRows: "23rem 1fr",
                gap: 16,
                overflow: "hidden",
            }}>
                {/* Cover */}
                <div style={{ ...cell, gridColumn: 1, gridRow: 1 }}>
                    <PulsatingParrotLogo size={100} />
                </div>
                {/* Map */}
                <div style={{ ...cell, gridColumn: "2 / span 2", gridRow: 1 }}>
                    <PulsatingParrotLogo size={120} />
                </div>
                {/* Rail (vehicles/voyages list) */}
                <div style={{ ...cell, gridColumn: 4, gridRow: "1 / span 2" }}>
                    <PulsatingParrotLogo size={100} />
                </div>
                {/* Identity / bio */}
                <div style={{ ...cell, gridColumn: "1 / span 2", gridRow: 2 }}>
                    <PulsatingParrotLogo size={80} />
                </div>
                {/* Socials */}
                <div style={{ ...cell, gridColumn: 3, gridRow: 2 }}>
                    <PulsatingParrotLogo size={80} />
                </div>
            </div>
        </div>
    );
};
