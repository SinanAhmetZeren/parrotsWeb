/* eslint-disable no-undef */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "../assets/css/CreateVehicle.css";
import "react-quill/dist/quill.snow.css"; // Import styles
import { IoRemoveCircleOutline } from "react-icons/io5";
// import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png";
import uploadImage from "../assets/images/ParrotsLogoPlus.jpg";
import "swiper/css";
import "swiper/css/pagination";
import { toast } from "react-toastify";
import { resizeImage } from "../utils/resizeImage";
// import '../assets/css/VehicleImagesSwiper.css';

export const VoyageProfileImageUploader = ({ voyageImage, setVoyageImage, size = "28rem" }) => { // eslint-disable-line no-unused-vars
  const deleteImageIcon = {
    backgroundColor: "rgba(211,1,1,0.4)",
    width: "3rem",
    height: "3rem",
    position: "absolute",
    top: "-0.5rem",
    right: "-0.5rem",
    borderRadius: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
  };

  const deleteImageIconHover = {
    transform: "scale(1.2)",
  };

  const fileInputRef = React.createRef();
  const [imagePreview, setImagePreview] = useState(null);
  const [hoveredUserImg, setHoveredUserImg] = useState(false);

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const resized = await resizeImage(files[0]);
      setVoyageImage(resized);
      setImagePreview(URL.createObjectURL(resized));
    }
  };

  const handleCancelUpload = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setVoyageImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ backgroundColor: "transparent", borderRadius: "1.5rem" }}>
      <div style={{}}>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <div
            style={{
              position: "relative",
            }}
          >
            {imagePreview ? (
              <div style={{ width: "60%", margin: "0 auto", position: "relative" }}>
                <img
                  src={imagePreview}
                  alt=""
                  style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "11px", display: "block" }}
                />
                {voyageImage && (
                  <div
                    onClick={handleCancelUpload}
                    style={{ position: "absolute", top: "0.5rem", right: "0.5rem", backgroundColor: "rgba(30,30,30,0.6)", color: "white", width: "1.5rem", height: "1.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}
                  >✕</div>
                )}
              </div>
            ) : (
              <div
                onClick={handleImageClick}
                style={{
                  width: "60%", aspectRatio: "1", borderRadius: "11px", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative", alignContent: "center", textAlign: "center", margin: "0 auto"
                }}
              >
                <img src={uploadImage} alt="Upload Icon" style={{ width: "80%", height: "80%", objectFit: "contain", opacity: 0.5 }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
