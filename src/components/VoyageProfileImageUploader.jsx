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
import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png";
import "swiper/css";
import "swiper/css/pagination";
// import '../assets/css/VehicleImagesSwiper.css';

export const VoyageProfileImageUploader = ({ voyageImage, setVoyageImage }) => {
  const deleteImageIcon = {
    backgroundColor: "rgba(211,1,1,0.4)",
    width: "3rem",
    height: "3rem",
    position: "absolute",
    top: "-0.5rem",
    right: "-0.5rem",
    borderRadius: "2rem",
    alignContent: "center",
    justifyItems: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
  };

  const deleteImageIconHover = {
    transform: "scale(1.2)",
  };

  const fileInputRef = React.createRef();
  const [imagePreview, setImagePreview] = useState(null);
  const [hoveredUserImg, setHoveredUserImg] = useState(false);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (file.size > maxSizeBytes) {
        alert("File size must be 5MB or less.");
        return;
      }

      setVoyageImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
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
              <div>
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  style={{
                    width: "28rem",
                    height: "28rem",
                    objectFit: "cover",
                    borderRadius: "1.5rem",
                    border: "2px solid transparent",
                  }}
                />
              </div>
            ) : (
              <div>
                <img
                  src={uploadImage}
                  alt="Upload Icon"
                  onClick={handleImageClick}
                  style={{
                    width: "28rem",
                    height: "28rem",
                    objectFit: "cover",
                    borderRadius: "1.5rem",
                    border: "2px solid transparent",
                    //   boxShadow: `
                    // 0 4px 6px rgba(0, 0, 0, 0.1),
                    // inset 0 -4px 6px rgba(0, 0, 0, 0.31)
                    // `,
                  }}
                />
              </div>
            )}
            {voyageImage && (
              <div
                onClick={handleCancelUpload}
                style={{
                  ...deleteImageIcon,
                  ...(hoveredUserImg ? deleteImageIconHover : {}),
                }}
                onMouseEnter={() => {
                  setHoveredUserImg(true);
                }}
                onMouseLeave={() => setHoveredUserImg(false)}
              >
                <IoRemoveCircleOutline size={"2.5rem"} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
