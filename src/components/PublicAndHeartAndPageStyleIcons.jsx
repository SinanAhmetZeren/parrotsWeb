import { IoHeartSharp, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { CustomToolTip } from "./CustomToolTip";
import { useState } from "react";
import { MdOutlineArticle, MdPublic } from "react-icons/md";
import { parrotBlueDarkTransparent2, parrotDarkBlue, parrotGreen, parrotPistachioGreen } from "../styles/colors";
import { LuScroll } from "react-icons/lu";
import { RiComputerLine } from "react-icons/ri";

export const PublicAndHeartAndPageStyleIcons = ({
    isFavorited,
    isPublicOnMap,
    isLegacyView,
    handleAddVoyageToFavorites,
    handleDeleteVoyageFromFavorites,
    setIsLegacyView,
    isDarkMode,
    setIsDarkMode,
}) => {
    const [isHoveredHeart, setIsHoveredHeart] = useState(false)
    const [isHoveredPublicOnMap, setIsHoveredPublicOnMap] = useState(false)
    const [isHoveredLegacy, setIsHoveredLegacy] = useState(false)
    const [isHoveredTheme, setIsHoveredTheme] = useState(false)
    return (
        <>
            {isFavorited ? (
                <div
                    onClick={() => handleDeleteVoyageFromFavorites()}
                    onMouseEnter={() => setIsHoveredHeart(true)}
                    onMouseLeave={() => setIsHoveredHeart(false)}
                    style={heartIconStyle("red")} >
                    <IoHeartSharp size="1.5rem" color="red" />
                    <CustomToolTip isHovered={isHoveredHeart} message={"In Favorites"} />
                </div>
            ) : (
                <div
                    onClick={() => handleAddVoyageToFavorites()}
                    onMouseEnter={() => setIsHoveredHeart(true)}
                    onMouseLeave={() => setIsHoveredHeart(false)}
                    style={heartIconStyle("orange")} >
                    <IoHeartSharp size="1.5rem" color="orange" />
                    <CustomToolTip isHovered={isHoveredHeart} message={"Add to Favorites"} />
                </div>
            )}

            {isPublicOnMap ? (
                <div
                    onMouseEnter={() => setIsHoveredPublicOnMap(true)}
                    onMouseLeave={() => setIsHoveredPublicOnMap(false)}
                    style={publicIconStyle(parrotDarkBlue, "white")} >
                    <MdPublic size="1.5rem" color={parrotDarkBlue} />
                    <CustomToolTip isHovered={isHoveredPublicOnMap} message={"Visible on Map"} />
                </div>
            ) : (
                <div
                    onMouseEnter={() => setIsHoveredPublicOnMap(true)}
                    onMouseLeave={() => setIsHoveredPublicOnMap(false)}
                    style={publicIconStyle(parrotBlueDarkTransparent2, "white")} >
                    <MdPublic size="1.5rem" color={parrotBlueDarkTransparent2} />
                    <CustomToolTip isHovered={isHoveredPublicOnMap} message={"Not Visible Globally"} />
                </div>
            )}


            <div
                onClick={() => setIsDarkMode && setIsDarkMode(!isDarkMode)}
                onMouseEnter={() => setIsHoveredTheme(true)}
                onMouseLeave={() => setIsHoveredTheme(false)}
                style={themeIconStyle}>
                {isDarkMode
                    ? <IoSunnyOutline size="1.5rem" color="goldenrod" />
                    : <IoMoonOutline size="1.5rem" color={parrotDarkBlue} />
                }
                <CustomToolTip isHovered={isHoveredTheme} message={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} />
            </div>

            {isLegacyView ? (
                <div
                    onClick={() => setIsLegacyView(false)}
                    onMouseEnter={() => setIsHoveredLegacy(true)}
                    onMouseLeave={() => setIsHoveredLegacy(false)}
                    style={legacyIconStyle("green")} >
                    <LuScroll size="1.5rem" color={"green"} />
                    <CustomToolTip isHovered={isHoveredLegacy} message={"Switch To Navigator View"} />
                </div>
            ) : (
                <div
                    onClick={() => setIsLegacyView(true)}
                    onMouseEnter={() => setIsHoveredLegacy(true)}
                    onMouseLeave={() => setIsHoveredLegacy(false)}
                    style={legacyIconStyle("green")} >
                    <RiComputerLine size="1.5rem" color={"green"} />
                    <CustomToolTip isHovered={isHoveredLegacy} message={"Switch To Explorer View"} />
                </div>
            )}
        </>
    );
};


const publicIconStyle = (borderColor, backgroundColor) => ({
    position: "absolute",
    // backgroundColor: "white",
    backgroundColor: backgroundColor,
    right: "4.5rem",
    top: "-.50rem",
    borderRadius: "3rem",
    padding: "0.5rem",
    zIndex: 1000,
    // border: `2px solid ${borderColor}`,
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

const themeIconStyle = {
    position: "absolute",
    backgroundColor: "white",
    right: "11.5rem",
    top: "-.50rem",
    borderRadius: "3rem",
    padding: "0.5rem",
    zIndex: 1000,
    borderWidth: "2px",
    borderColor: "goldenrod",
    borderStyle: "solid",
    cursor: "pointer",
};

const legacyIconStyle = (borderColor) => ({
    position: "absolute",
    backgroundColor: "white",
    right: "8rem",
    top: "-.50rem",
    borderRadius: "3rem",
    padding: "0.5rem",
    zIndex: 1000,
    borderWidth: "2px",
    borderColor: borderColor,
    borderStyle: "solid",
    cursor: "pointer"
});