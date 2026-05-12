import React from "react";
import { PulsatingParrotLogo } from "./PulsatingParrotLogo";

export const FavoritesPlaceHolderComponent = () => {
    return (
        <div style={{ marginLeft: "3.5rem" }}>
            <div
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    height: "45rem",
                    borderRadius: "2rem",
                    width: "40rem",
                    maxWidth: "600px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <PulsatingParrotLogo size={120} />
            </div>
        </div>

    );
};
