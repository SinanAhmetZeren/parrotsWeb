/* eslint-disable react/prop-types */
import React from "react";
import { format } from "date-fns";
import { FaUsers } from "react-icons/fa"; // feather users equivalent
import { useNavigate } from "react-router-dom";
import { parrotTextDarkBlue } from "../styles/colors";

const API_URL = process.env.REACT_APP_API_URL;

export default function VehicleVoyages({ voyages }) {
    const navigate = useNavigate();

    const handleNavigateToVoyage = (voyageId) => {
        // in React Router, you can navigate directly
        navigate(`/voyage-details/${voyageId}`);
    };

    const VoyageBaseUrl = ``;

    const renderVehicleVoyages = () =>
        voyages.map((item) => {
            const formattedStartDate = format(new Date(item.startDate), "MMM d, yy");
            const formattedEndDate = format(new Date(item.endDate), "MMM d, yy");
            return (
                <div
                    key={item.id}
                    onClick={() => handleNavigateToVoyage(item.id)}
                    style={styles.voyageContainer}
                >
                    <div>
                        <img
                            src={VoyageBaseUrl + item.profileImage}
                            alt={item.name}
                            style={styles.voyageImage}
                        />
                    </div>
                    <div style={styles.nameAndVacancy}>

                        <span style={styles.voyageName}>{item.name}</span>
                        <span style={styles.voyageVacancy}>{item.vacancy} <FaUsers size={16} /></span>
                        <span style={styles.voyageDates}>{formattedStartDate} to {formattedEndDate}</span>

                    </div>
                </div>
            );
        });

    return <div style={styles.container}>{renderVehicleVoyages()}</div>;
}


const styles = {
    nameAndVacancy: {
        display: "grid",
        gridTemplateColumns: "40% 10% 45%", // name / vacancy / dates
        alignItems: "center",
        color: parrotTextDarkBlue,
        fontSize: "1.1rem",
        width: "100%",
        gap: "0.5rem",
        // backgroundColor: "lightcoral",
    },
    voyageName: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        // backgroundColor: "lightgrey",
    },
    voyageVacancy: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        // backgroundColor: "lightgreen",
    },
    voyageDates: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        // backgroundColor: "lightblue",
    },
    container: {
        display: "flex",
        flexDirection: "column",
    },
    voyageContainer: {
        display: "flex",
        alignItems: "center",
        padding: "1vh",
        margin: "0.3vh",
        backgroundColor: "white",
        borderRadius: ".4rem",
        cursor: "pointer",
        textAlign: "left",
        width: "99%",
    },
    voyageImage: {
        height: "6vh",
        width: "6vh",
        borderRadius: "50%",
        objectFit: "cover",
        marginRight: "1rem",
    },
};