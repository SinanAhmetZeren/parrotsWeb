import React from "react";
import { DefaultSpinner } from "./DefaultSpinner";

export const FavoritesPlaceHolderComponent = () => {
    return (
        <div style={{ marginLeft: "3.5rem" }}>
            <div
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    height: "45rem",
                    borderRadius: "2rem",
                    overflow: "hidden",
                    width: "40rem",
                    maxWidth: "600px",
                }}
            >
                <DefaultSpinner />
            </div>
        </div>

    );
};
