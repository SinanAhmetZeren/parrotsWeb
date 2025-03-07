/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css"
import React, { useState, useEffect, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useGetUserByIdQuery, usePatchUserMutation } from "../slices/UserSlice";
import { useSelector } from "react-redux";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { EditProfileSocialsComponent } from "../components/EditProfileSocialsComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserNameInputComponent } from "../components/UserNameInputComponent";
import { UserTitleInputComponent } from "../components/UserTitleInputComponent";
import { IoRemoveCircleOutline, IoCameraReverseOutline } from "react-icons/io5";


/* TODO:

when pressed update:
  1. handle upload profile image
  2. handle upload background image
  3. handle patch user

  4. update state changes to local storage

*/

export function EditProfilePage() {
  const local_userId = localStorage.getItem("storedUserId")
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;

  const fileInputRef = createRef();
  const fileInputRefProfile = createRef();
  const [imagePreview, setImagePreview] = useState(null);
  const [image1, setImage1] = useState(null);
  const [backGroundImage, setBackGroundImage] = useState("");
  const [imagePreviewProfile, setImagePreviewProfile] = useState(null);
  const [imageProfile, setImageProfile] = useState(null);
  const [profileImage, setProfileImage] = useState("");

  const [userName, setUserName] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userBio, setUserBio] = useState("");

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [instagramProfile, setInstagramProfile] = useState("");
  const [twitterProfile, setTwitterProfile] = useState("");
  const [tiktokProfile, setTiktokProfile] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [youtubeProfile, setYoutubeProfile] = useState("");
  const [emailHidden, setEmailHidden] = useState(false);

  const [patchUser] = usePatchUserMutation();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const userBaseUrl = `${apiUrl}/Uploads/UserImages/`;
  const handleGoToPublicPage = () => {
    navigate(`/profile-public/${userData.id}/${userData.userName}`);
  }


  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error,
    isSuccess: isSuccessUser,
    refetch: refetchUserData,
  } = useGetUserByIdQuery(userId);




  const handlePatchUser = async () => {
    const patchDoc = [
      { op: "replace", path: "/userName", value: userName },
      { op: "replace", path: "/email", value: email },
      { op: "replace", path: "/phonenumber", value: phoneNumber },
      { op: "replace", path: "/facebook", value: facebookProfile },
      { op: "replace", path: "/instagram", value: instagramProfile },
      { op: "replace", path: "/twitter", value: twitterProfile },
      { op: "replace", path: "/tiktok", value: tiktokProfile },
      { op: "replace", path: "/linkedin", value: linkedinProfile },
      { op: "replace", path: "/youtube", value: youtubeProfile },
      { op: "replace", path: "/title", value: userTitle },
      { op: "replace", path: "/bio", value: userBio },
      { op: "replace", path: "/emailVisible", value: !emailHidden },
    ];
    try {
      /*
      const response = await patchUser({ patchDoc, userId });
      dispatch(
        updateUserName({
          username,
        })
      );
      dispatch(
        updateUserData({
          image: profileImage,
        })
      );
      */
      console.log("patchDoc: ", patchDoc);
      console.log("updating user");
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };



  const handleUploadProfile = async () => {
    if (!image) {
      return;
    }
    const formData = new FormData();
    formData.append("imageFile", {
      uri: image,
      type: "image/jpeg",
      name: "profileImage.jpg",
    });
    try {
      const response = await updateProfileImage({ formData, userId });
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleUploadBackground = async () => {
    if (!image2) {
      return;
    }
    const formData = new FormData();
    formData.append("imageFile", {
      uri: image2,
      type: "image/jpeg",
      name: "backgroundImage.jpg",
    });
    try {
      const response = await updateBackgroundImage({ formData, userId });
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };


  useEffect(() => {
    if (isSuccessUser) {
      // console.log("userData: ", userData);
      setUserName(userData.userName);
      setUserTitle(userData.title);
      setUserBio(userData.bio);
      setBackGroundImage(userData.backgroundImageUrl);
      setProfileImage(userData.profileImageUrl);
      setEmail(userData.email || "");
      setInstagramProfile(userData.instagram || "");
      setYoutubeProfile(userData.youtube || "");
      setFacebookProfile(userData.facebook || "");
      setPhoneNumber(userData.phoneNumber || "");
      setTwitterProfile(userData.twitter || "");
      setLinkedinProfile(userData.linkedin || "");
      setTiktokProfile(userData.tiktok || "");
    }

  }, [userData, isSuccessUser])


  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImage1(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageChangeProfile = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageProfile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewProfile(previewUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };


  const handleImageClickProfile = () => {
    fileInputRefProfile.current.click();
  };

  const handleCancelUpload = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage1(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelUploadProfile = () => {
    if (imagePreviewProfile) {
      URL.revokeObjectURL(imagePreviewProfile);
    }
    setImageProfile(null);
    setImagePreviewProfile(null);
    if (fileInputRefProfile.current) {
      fileInputRefProfile.current.value = "";
    }
  };


  return (
    isLoadingUser ? (
      <LoadingProfilePage />
    ) :
      isSuccessUser
        ? (
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

                      <div className="editProfilePage_gotoPublicProfileButton" onClick={() => handleGoToPublicPage()}>
                        <span>Public Profile</span>
                      </div>

                      <div className="flex profilePage_CoverImage">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                          ref={fileInputRef}
                        />
                        {imagePreview ? (
                          <div className="
                            // image-preview 
                            profilePage_CoverImage_Img">
                            <img src={imagePreview} alt="Uploaded preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                border: "2px solid transparent",
                                overFlow: "hidden",
                                borderRadius: "1rem",
                              }}
                            />
                          </div>
                        ) :
                          <img
                            src={userBaseUrl + backGroundImage}
                            alt="Upload Icon"
                            onClick={handleImageClick}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              border: "2px solid transparent",
                              overFlow: "hidden",
                              borderRadius: "1rem",
                            }}
                          />
                        }
                        {image1 ? (
                          <div onClick={handleCancelUpload}
                            style={deleteImageIcon}
                          >
                            <IoRemoveCircleOutline
                              color="rgb(0, 119, 234)"
                              size={"2rem"}
                            />
                          </div>
                        ) :

                          <div onClick={handleImageClick} style={clickToAddImage}>
                            <IoCameraReverseOutline
                              color="rgb(0, 119, 234)"
                              size={"2rem"}
                            />
                          </div>
                        }
                      </div>

                      <div className="flex profilePage_ProfileImage">
                        <div>
                          <div className="profilePage_ProfileImage_Img_Container" >
                            {/* <img src={userBaseUrl + userData?.profileImageUrl} className=" profilePage_ProfileImage_Img" alt="b" /> */}

                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChangeProfile}
                              style={{ display: "none" }}
                              ref={fileInputRefProfile}
                            />
                            {imagePreviewProfile ? (
                              <div className="profilePage_ProfileImage_Img">
                                <img src={imagePreviewProfile} alt="Uploaded preview"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    border: "2px solid transparent",
                                    overFlow: "hidden",
                                    borderRadius: "1rem",
                                  }}
                                />
                              </div>
                            ) :
                              <div className="profilePage_ProfileImage_Img">

                                <img
                                  src={userBaseUrl + profileImage}
                                  alt="Upload Icon"
                                  onClick={handleImageClickProfile}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    border: "2px solid transparent",
                                    overFlow: "hidden",
                                    borderRadius: "1rem",
                                  }}
                                />
                              </div>
                            }
                            {imageProfile ? (
                              <div onClick={handleCancelUploadProfile}
                                style={deleteImageIcon}
                              >
                                <IoRemoveCircleOutline
                                  color="rgb(0, 119, 234)"
                                  size={"2rem"}
                                />
                              </div>
                            ) :

                              <div onClick={handleImageClickProfile} style={clickToAddImage}>
                                <IoCameraReverseOutline
                                  color="rgb(0, 119, 234)"
                                  size={"2rem"}
                                />
                              </div>
                            }
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="flex editprofilePage_BioAndContactDetails">
                      <div className="flex editprofilePage_BioTitleUserName">
                        <div className="flex profilePage_UserName">
                          <span className="profilePage_UserName">
                            <UserNameInputComponent userName={userName} setUserName={setUserName} />
                          </span>
                        </div>
                        <div className="flex profilePage_Title">
                          <span className="profilePage_Title">
                            <UserTitleInputComponent userTitle={userTitle} setUserTitle={setUserTitle} />
                          </span>
                        </div>
                        <div className="flex profilePage_Bio">
                          <ReactQuill
                            value={userBio}
                            onChange={(value) => setUserBio(value)}
                            placeholder="Tell us about your vehicle"
                            modules={{
                              toolbar: false,
                            }}
                            style={{
                              color: "rgba(0, 119, 234, 0.9)",
                              fontWeight: "600",
                              fontSize: "1.1rem",
                              borderRadius: "1.5rem",
                              padding: "0.5rem",
                              backgroundColor: "#007bff21",
                            }}
                          />
                          <style>
                            {`
                            .ql-container {
                              border: none !important; /* Removes border around editor */
                            }
                            .ql-editor {
                              border: none !important; /* Removes inner border */
                            }
                          `}
                          </style>
                        </div>
                      </div>
                      {/* <div className="flex editProfilePage_ContactDetails" style={{ backgroundColor: " " }}>
                        {isSuccessUser ?
                          <EditProfileSocialsComponent userData={userData} />
                          : null
                        }
                      </div> */}
                    </div>
                  </div>

                  <div className="flex flex-col profilePage_BottomRight">
                    <div className="flex flex-col"
                      style={{
                        paddingLeft: ".5rem",
                        borderRadius: "1.5rem",
                        height: "calc(100vh - 3.5rem)",
                        width: "calc(100% - 0%)",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "1.5rem",
                          height: "100%",
                          flexDirection: "column",
                          width: "100%",
                          position: "relative",
                        }}
                      >

                        {isSuccessUser ?
                          <EditProfileSocialsComponent
                            userData={userData}
                            setEmail={setEmail}
                            setPhoneNumber={setPhoneNumber}
                            setFacebookProfile={setFacebookProfile}
                            setInstagramProfile={setInstagramProfile}
                            setTwitterProfile={setTwitterProfile}
                            setTiktokProfile={setTiktokProfile}
                            setLinkedinProfile={setLinkedinProfile}
                            setYoutubeProfile={setYoutubeProfile}
                            setEmailHidden={setEmailHidden}
                            email={email}
                            phoneNumber={phoneNumber}
                            facebookProfile={facebookProfile}
                            instagramProfile={instagramProfile}
                            twitterProfile={twitterProfile}
                            tiktokProfile={tiktokProfile}
                            linkedinProfile={linkedinProfile}
                            youtubeProfile={youtubeProfile}
                            emailHidden={emailHidden}
                          />
                          : null
                        }

                        <div style={{
                          display: "flex",
                          flexDirection: "row",
                          position: "absolute",
                          width: "20rem",
                          height: "5rem",
                          bottom: "0",
                          left: "50%",
                          transform: "translateX(-50%)"

                        }}>

                          <span
                            onClick={() => { handlePatchUser() }}
                            style={NewVehicle}>Update Changes</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header >
          </div >
        ) : null
  );
}

const deleteImageIcon = {
  // backgroundColor: " #3c9dee",
  backgroundColor: "white",
  position: "absolute",
  bottom: ".5rem",
  right: "0.5rem",
  borderRadius: "4rem",
  alignContent: "center",
  justifyItems: "center",
  lineHeight: "1.5rem",
  padding: "1rem",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
}

const clickToAddImage = {
  backgroundColor: "white",
  position: "absolute",
  bottom: ".5rem",
  right: "0.5rem",
  borderRadius: "4rem",
  alignContent: "center",
  justifyItems: "center",
  lineHeight: "1.5rem",
  padding: "1rem",
}

const NewVehicle = {
  position: "absolute",
  fontSize: "1.6rem",
  fontWeight: 800,
  color: "white",
  borderRadius: "1.5rem",
  paddingRight: "2rem",
  paddingLeft: "2rem",
  marginTop: "0.3rem",
  backgroundColor: "#007bff",
  cursor: "pointer",
  border: "none",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  padding: "0.2rem",
  width: "20rem",
};

