/* eslint-disable no-undef */
import React, {
  useState,
  useCallback,
  useMemo,
} from "react";
import "../assets/css/CreateVehicle.css";
import "react-quill/dist/quill.snow.css"; // Import styles
import { IoRemoveCircleOutline } from "react-icons/io5";
// import uploadImage from "../assets/images/ParrotsWhiteBgPlus.png";
import uploadImage from "../assets/images/ParrotsLogoPlus.png";
import placeHolder from "../assets/images/placeholder.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { FreeMode } from "swiper/modules";
import { toast } from "react-toastify";

export const VoyageImageUploaderComponent = ({
  voyageImage,
  setVoyageImage,
  addedVoyageImages,
  setAddedVoyageImages,
  voyageId,
  addVoyageImage,
  deleteVoyageImage,
  isUploadingImage,
  setIsUploadingImage,
  setPageState,
}) => {
  const newImageDeleteIconHover = {
    transform: "scale(1.2)",
  };
  const handleUploadImage = useCallback(async () => {
    if (!voyageImage) {
      return;
    }
    setIsUploadingImage(true);
    try {
      const addedVoyageImageResponse = await addVoyageImage({
        voyageImage,
        voyageId,
      }).unwrap();
      const addedvoyageImageId = addedVoyageImageResponse.imagePath;
      const newItem = {
        addedvoyageImageId,
        voyageImage,
      };
      setAddedVoyageImages((prevImages) => {
        const newState = [...prevImages, newItem];
        return newState;
      });
      setVoyageImage(null);
      setNewImagePreview(null);
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Failed to upload image. Please check your connection and try again.");
    }
    setIsUploadingImage(false);
  }, [
    voyageImage,
    voyageId,
    addVoyageImage,
    setAddedVoyageImages,
    setIsUploadingImage,
    setVoyageImage,
  ]);

  const handleDeleteImage = useCallback(
    async (imageId) => {
      console.log("image Id", imageId);
      if (!imageId) return;

      try {
        await deleteVoyageImage(imageId).unwrap();

        setAddedVoyageImages((prevImages) =>
          prevImages.filter((img) => img.addedvoyageImageId !== imageId)
        );
      } catch (error) {
        console.error("Error deleting image", error);
        toast.error("Failed to delete image. Please try again.");
      }
    },
    [deleteVoyageImage, setAddedVoyageImages]
  );

  const addImageButton = {
    backgroundColor: "#007bff",
    position: "absolute",
    bottom: "-0.5rem",
    borderRadius: "1.5rem",
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "0.6rem 1.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    border: "none",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
    transition: "box-shadow 0.2s ease",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    whiteSpace: "nowrap",
  };

  const uploadedImagesContainer = {
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
    width: "calc(100vw - 26rem)",
    margin: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };

  const newImageDeleteIcon = {
    backgroundColor: " #3c9dee99",
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

  const placeHolderImage = {
    width: "20rem",
    height: "20rem",
    maxWidth: "20rem",
    margin: "0.5rem",
    borderRadius: "1rem",
    overflow: "hidden",
    objectFit: "cover",
  };

  const uploadImage2 = {
    width: "25rem",
    height: "25rem",
    objectFit: "cover",
    borderRadius: "1.5rem",
    border: "2px solid transparent",
  };

  const userUploadedImage = {
    width: "20rem",
    height: "20rem",
    objectFit: "cover",
    maxWidth: "20rem",
    borderRadius: "1rem",
    margin: "0.5rem",
  };

  const uploadedImageDeleteIcon = {
    backgroundColor: " #3e99",
    width: "3rem",
    height: "3rem",
    position: "absolute",
    top: "0",
    right: "0",
    borderRadius: "2rem",
    alignContent: "center",
    justifyItems: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
  };

  const maxItems = 10;
  const placeholders = Array.from({ length: maxItems }, (_, index) => ({
    key: `placeholder_${index + 1}`,
  }));

  const data = useMemo(
    () =>
      addedVoyageImages.length < maxItems
        ? [
          ...addedVoyageImages,
          ...placeholders.slice(addedVoyageImages.length),
        ]
        : addedVoyageImages.map((item) => ({
          ...item,
          key: item.addedvehicleImageId,
        })),
    [addedVoyageImages, maxItems, placeholders]
  );

  const newImageInputRef = React.createRef();
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [isNewImageDeleteHovered, setIsNewImageDeleteHovered] = useState(false);


  const handleImageChange2 = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (file.size > maxSizeBytes) {
        toast.error(`File size must be ${maxSizeMB}MB or less.`);
        if (newImageInputRef.current) {
          newImageInputRef.current.value = "";
        }
        return;
      }

      setVoyageImage(file);
      const previewUrl = URL.createObjectURL(file);
      setNewImagePreview(previewUrl);
    }
  };

  const handleImageClick2 = () => {
    newImageInputRef.current.click();
  };

  const handleCancelUpload2 = () => {
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
    }
    setVoyageImage(null);
    setNewImagePreview(null);
    if (newImageInputRef.current) {
      newImageInputRef.current.value = "";
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "1rem",
            marginLeft: "1rem",
          }}
        >
          <div
            style={{
              width: "26rem",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange2}
              onClick={(e) => (e.target.value = null)} // Reset value before selection
              style={{ display: "none" }}
              ref={newImageInputRef}
            />
            <div
              style={{
                position: "relative",
                width: "25rem",
              }}
            >
              {newImagePreview ? (
                <div className="image-preview">
                  <img
                    src={newImagePreview}
                    alt="Uploaded preview"
                    style={uploadImage2}
                  />
                </div>
              ) : (
                <img
                  src={uploadImage}
                  alt="Upload Icon"
                  onClick={handleImageClick2}
                  style={uploadImage2}
                />
              )}
              {voyageImage && (
                <>
                  <div
                    onClick={handleCancelUpload2}
                    style={{
                      ...newImageDeleteIcon,
                      ...(isNewImageDeleteHovered ? newImageDeleteIconHover : {}),
                    }}
                    onMouseEnter={() => {
                      setIsNewImageDeleteHovered(true);
                    }}
                    onMouseLeave={() => setIsNewImageDeleteHovered(false)}
                  >
                    <IoRemoveCircleOutline size={"2.5rem"} />
                  </div>

                  <button
                    style={addImageButton}
                    onClick={() => handleUploadImage()}
                    disabled={isUploadingImage}
                  >
                    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "6rem" }}>
                      <span style={{ visibility: isUploadingImage ? "hidden" : "visible" }}>Add Image</span>
                      {isUploadingImage && (
                        <div className="spinner" style={{ height: "1rem", width: "1rem", border: "3px solid white", borderTop: "3px solid #1e90ff", position: "absolute" }}></div>
                      )}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div style={uploadedImagesContainer}>
            <Swiper
              scrollbar={{ hide: true }}
              slidesPerView={3}
              spaceBetween={10}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
              modules={[FreeMode]}
              className="mySwiper"
            >
              {data.map((item, index) => {
                // if (index === 0)
                //     console.log("item:", item);
                return (
                  <SwiperSlide>
                    <div
                      key={index}
                      className="placeholder_imageContainer"
                      style={{ borderRadius: "2rem", overflow: "hidden" }}
                    >
                      {item.addedvoyageImageId ? (
                        <>
                          <img
                            src={URL.createObjectURL(item.voyageImage)}
                            alt={`Uploaded ${index + 1}`}
                            style={userUploadedImage}
                          />
                          <div
                            onClick={() =>
                              handleDeleteImage(item.addedvoyageImageId)
                            }
                            style={uploadedImageDeleteIcon}
                          >
                            <IoRemoveCircleOutline size={"2.5rem"} />
                          </div>
                        </>
                      ) : (
                        <img
                          src={placeHolder}
                          alt={`Placeholder ${index + 1}`}
                          style={placeHolderImage}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>

      {/* <div className="completeVehicleButton"
                onClick={() => goToWaypoints()}
            >Complete Voyage</div> */}

      <GoToWaypointsButton
        setPageState={setPageState}
        addedVoyageImages={addedVoyageImages}
      />

      <style>
        {`
            #app {
              height: 100%;
            }
  
            html, body {
              position: relative;
              height: 100%;
            }
  
            body {
              background: #eee;
              font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
              font-size: 14px;
              color: #000;
              margin: 0;
              padding: 0;
            }
  
            .swiper {
              width: 100%;
              height: 100%;
              background-color: rgba(255, 255, 255, 0.3);
              border-radius: 1.5rem;
            }
  
            .swiper-slide {
              text-align: center;
              font-size: 18px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: rgba(255, 255, 255, 0.3);
              border-radius: 1.5rem;
              filter: none !important;
              opacity: 1 !important;
              padding: 1rem !important;
              width: 23rem !important;
            }
  
            .swiper-slide img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          `}
      </style>
    </>
  );
};

const GoToWaypointsButton = ({ setPageState, addedVoyageImages }) => {
  // useEffect(() => {
  //     console.log("addedvoyage images  :--->", addedVoyageImages);
  // }, [addedVoyageImages])

  const buttonStyle = {
    width: "30%",
    backgroundColor: "#007bff",
    padding: "0.6rem",
    marginBottom: "1rem",
    borderRadius: "1.5rem",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.2rem",
    border: "none",
    boxShadow:
      "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
    transition: "box-shadow 0.2s ease",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => {
          console.log("apply");
          setPageState(3);
        }}
        disabled={addedVoyageImages?.length === 0}
        style={
          addedVoyageImages?.length > 0
            ? buttonStyle
            : { ...buttonStyle, opacity: "0.5" }
        }
      >
        Next
      </button>
    </div>
  );
};
