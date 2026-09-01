import { IoHeartSharp } from "react-icons/io5";
import { CustomToolTip } from "./CustomToolTip";
import { useState } from "react";
import { MdPublic } from "react-icons/md";
import { parrotBlueDarkTransparent2, parrotDarkBlue } from "../styles/colors";
import { BsThreeDotsVertical } from "react-icons/bs";

export const PublicAndHeartAndPageStyleIcons = ({
    isFavorited,
    isPublicOnMap,
    isLegacyView,
    handleAddVoyageToFavorites,
    handleDeleteVoyageFromFavorites,
    setIsLegacyView,
    isDarkMode,
    onReportPress,
    topOffset = "-.50rem",
}) => {
    const [isHoveredHeart, setIsHoveredHeart] = useState(false)
    const [isHoveredPublicOnMap, setIsHoveredPublicOnMap] = useState(false)
    const [kebabOpen, setKebabOpen] = useState(false)
    return (
        <>
            {isFavorited ? (
                <div
                    onClick={() => handleDeleteVoyageFromFavorites()}
                    onMouseEnter={() => setIsHoveredHeart(true)}
                    onMouseLeave={() => setIsHoveredHeart(false)}
                    style={{ ...heartIconStyle("red"), top: topOffset, zIndex: isHoveredHeart ? 1003 : 1000 }} >
                    <IoHeartSharp size="1.5rem" color="red" />
                    <CustomToolTip isHovered={isHoveredHeart} message={"In Favorites"} offsetLeft="-50%" />
                </div>
            ) : (
                <div
                    onClick={() => handleAddVoyageToFavorites()}
                    onMouseEnter={() => setIsHoveredHeart(true)}
                    onMouseLeave={() => setIsHoveredHeart(false)}
                    style={{ ...heartIconStyle("orange"), top: topOffset, zIndex: isHoveredHeart ? 1003 : 1000 }} >
                    <IoHeartSharp size="1.5rem" color="orange" />
                    <CustomToolTip isHovered={isHoveredHeart} message={"Add to Favorites"} offsetLeft="-50%" />
                </div>
            )}

            {isPublicOnMap ? (
                <div
                    onMouseEnter={() => setIsHoveredPublicOnMap(true)}
                    onMouseLeave={() => setIsHoveredPublicOnMap(false)}
                    style={{ ...publicIconStyle(parrotDarkBlue, "white"), top: topOffset, zIndex: isHoveredPublicOnMap ? 1003 : 1000 }} >
                    <MdPublic size="1.5rem" color={parrotDarkBlue} />
                    <CustomToolTip isHovered={isHoveredPublicOnMap} message={"Visible on Map"} />
                </div>
            ) : (
                <div
                    onMouseEnter={() => setIsHoveredPublicOnMap(true)}
                    onMouseLeave={() => setIsHoveredPublicOnMap(false)}
                    style={{ ...publicIconStyle(parrotBlueDarkTransparent2, "white"), top: topOffset, zIndex: isHoveredPublicOnMap ? 1003 : 1000 }} >
                    <MdPublic size="1.5rem" color={parrotBlueDarkTransparent2} />
                    <CustomToolTip isHovered={isHoveredPublicOnMap} message={"Not Visible Globally"} />
                </div>
            )}

            <div style={{ position: "absolute", right: "8rem", top: topOffset, zIndex: kebabOpen ? 1003 : 1000 }}>
                <div onClick={() => setKebabOpen(v => !v)} style={kebabIconStyle}>
                    <BsThreeDotsVertical size="1.5rem" color="green" />
                </div>
                {kebabOpen && (
                    <div style={kebabMenu} onMouseLeave={() => setKebabOpen(false)}>
                        <div onClick={() => { setKebabOpen(false); setIsLegacyView(!isLegacyView); }} style={kebabItem}>
                            {isLegacyView ? "Switch to Navigator View" : "Switch to Explorer View"}
                        </div>
                        {onReportPress && (
                            <div onClick={() => { setKebabOpen(false); onReportPress(); }} style={{ ...kebabItem, color: "#dc2626" }}>
                                Report voyage
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};


const publicIconStyle = (borderColor, backgroundColor) => ({
    position: "absolute",
    backgroundColor: backgroundColor,
    right: "4.5rem",
    top: "-.50rem",
    borderRadius: "3rem",
    padding: "0.5rem",
    zIndex: 1000,
    borderWidth: "2px",
    borderColor: borderColor,
    borderStyle: "solid",
});

const heartIconStyle = (borderColor) => ({
    position: "absolute",
    backgroundColor: "white",
    right: "1rem",
    top: "-.50rem",
    borderRadius: "3rem",
    padding: "0.5rem",
    zIndex: 1000,
    borderWidth: "2px",
    borderColor: borderColor,
    borderStyle: "solid",
    cursor: "pointer"
});

const kebabIconStyle = {
    backgroundColor: "white",
    borderRadius: "3rem",
    padding: "0.5rem",
    borderWidth: "2px",
    borderColor: "green",
    borderStyle: "solid",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
};

const kebabMenu = {
    position: "absolute",
    bottom: "calc(100% + 6px)",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    zIndex: 100,
    minWidth: "180px",
    overflow: "hidden",
};

const kebabItem = {
    padding: "0.65rem 1rem",
    fontSize: "0.88rem",
    cursor: "pointer",
    color: "#1e3a5f",
    fontWeight: 700,
    whiteSpace: "nowrap",
};
