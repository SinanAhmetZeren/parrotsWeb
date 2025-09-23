/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css";
import React, { useState, useEffect, useRef, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import {
  useGetUserByIdQuery,
  usePatchUserMutation,
  useUpdateBackgroundImageMutation,
  useUpdateProfileImageMutation,
} from "../slices/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { EditProfileSocialsComponent } from "../components/EditProfileSocialsComponent";
import ReactQuill, { displayName } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserNameInputComponent } from "../components/UserNameInputComponent";
import { UserTitleInputComponent } from "../components/UserTitleInputComponent";
import { IoRemoveCircleOutline, IoCameraReverseOutline } from "react-icons/io5";
import { updateUserName } from "../slices/UserSlice";
import { parrotBlue, parrotTextDarkBlue } from "../styles/colors";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";

/* TODO:
when pressed update:
  1. handle upload profile image
  2. handle upload background image
  3. handle patch user
  4. update state changes to local storage
*/

export function EditProfilePage() {
  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const dispatch = useDispatch();

  const fileInputRef_ProfileImage = createRef();
  const fileInputRef_BackgroundImage = createRef();

  const [backGroundImage, setBackGroundImage] = useState(null);
  const [backGroundImagePreview, setBackGroundImagePreview] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [userName, setUserName] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userBio, setUserBio] = useState("");

  const [email, setEmail] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [instagramProfile, setInstagramProfile] = useState("");
  const [twitterProfile, setTwitterProfile] = useState("");
  const [tiktokProfile, setTiktokProfile] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [youtubeProfile, setYoutubeProfile] = useState("");
  const [emailHidden, setEmailHidden] = useState();

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const userBaseUrl = ``;
  const handleGoToPublicProfilePage = () => {
    navigate(`/profile-public/${userData.id}/${userData.userName}`);
  };
  const handleGoToProfilePage = () => {
    navigate(`/profile`);
  };

  const [patchUser] = usePatchUserMutation();
  const [updateBackgroundImage] = useUpdateBackgroundImageMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();

  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error,
    isSuccess: isSuccessUser,
    refetch: refetchUserData,
  } = useGetUserByIdQuery(userId);

  useEffect(() => {
    if (isSuccessUser) {
      setUserName(userData.userName);
      setUserTitle(userData.title);
      setUserBio(userData.bio);
      setProfileImage(userData.profileImageUrl);
      setBackGroundImage(userData.backgroundImageUrl);
      setEmail(userData.email || "");
      setDisplayEmail(userData.displayEmail || "");
      setInstagramProfile(userData.instagram || "");
      setYoutubeProfile(userData.youtube || "");
      setFacebookProfile(userData.facebook || "");
      setPhoneNumber(userData.phoneNumber || "");
      setTwitterProfile(userData.twitter || "");
      setLinkedinProfile(userData.linkedin || "");
      setTiktokProfile(userData.tiktok || "");
      setEmailHidden(!userData.emailVisible);
    }
  }, [userData, isSuccessUser]);

  const handlePatchUser = async () => {
    const patchDoc = [
      { op: "replace", path: "/userName", value: userName },
      // { op: "replace", path: "/email", value: email },
      { op: "replace", path: "/displayEmail", value: displayEmail },
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
      const response = await patchUser({ patchDoc, userId });
      console.log("patch user response: ", response);
      console.log("patch user response success: ", response.data.success);
      if (response.data.success) {
        console.log("Profile updated successfully");
        dispatch(
          updateUserName({
            username: userName,
          })
        );
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleBackGroundImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        alert("File size must be 5MB or less.");
        return;
      }

      setBackGroundImage(file);
      const previewUrl = URL.createObjectURL(file);
      setBackGroundImagePreview(previewUrl);
    }
  };

  const handleProfileImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const maxSizeMB = 5;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        alert("File size must be 5MB or less.");
        return;
      }

      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const handleBackGroundImageClick = () => {
    fileInputRef_BackgroundImage.current.click();
  };

  const handleProfileImageClick = () => {
    fileInputRef_ProfileImage.current.click();
  };

  const handleCancelUploadBackGroundImage = () => {
    backGroundImagePreview && URL.revokeObjectURL(backGroundImagePreview);
    setBackGroundImage(userData.backgroundImageUrl);
    setBackGroundImagePreview(null);
    if (fileInputRef_BackgroundImage.current) {
      fileInputRef_BackgroundImage.current.value = "";
    }
  };

  const handleCancelUploadProfileImage = () => {
    profileImagePreview && URL.revokeObjectURL(profileImagePreview);
    setProfileImage(userData.profileImageUrl);
    setProfileImagePreview(null);
    if (fileInputRef_ProfileImage.current) {
      fileInputRef_ProfileImage.current.value = "";
    }
  };

  const handleUploadProfileImage = async () => {
    if (!profileImage || profileImage === userData.profileImageUrl) {
      console.log("---- not doing anything with profileImage");
      return;
    }
    try {
      const response = await updateProfileImage({ profileImage, userId });
      console.log("update profile image response: ", response);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleUploadBackgroundImage = async () => {
    if (!backGroundImage || backGroundImage === userData.backgroundImageUrl) {
      console.log("---- not doing anything with profileImage");

      return;
    }
    try {
      const response = await updateBackgroundImage({ backGroundImage, userId });
      console.log("update background image response: ", response);
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleUpdateChanges = async () => {
    setIsUpdatingProfile(true);
    if (backGroundImage) {
      await handleUploadBackgroundImage();
    }
    if (profileImage) {
      await handleUploadProfileImage();
    }
    await handlePatchUser();
    await refetchUserData();
    setIsUpdatingProfile(false);
  };

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (isErrorUser) {
    return <SomethingWentWrong />;
  }

  return isLoadingUser ? (
    <LoadingProfilePage />
  ) : isSuccessUser ? (
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
                <div
                  className="editProfilePage_gotoPublicProfileButton"
                  onClick={() => handleGoToPublicProfilePage()}
                >
                  <span>Public Profile</span>
                </div>

                <div
                  className="editProfilePage_gotoProfileButton"
                  onClick={() => handleGoToProfilePage()}
                >
                  <span>Profile</span>
                </div>

                <div className="flex profilePage_CoverImage">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackGroundImageChange}
                    style={{ display: "none" }}
                    ref={fileInputRef_BackgroundImage}
                  />
                  {backGroundImagePreview ? (
                    <div
                      className="
                            // image-preview 
                            profilePage_CoverImage_Img"
                    >
                      <img
                        src={backGroundImagePreview}
                        alt="Uploaded preview"
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
                  ) : (
                    <img
                      src={userBaseUrl + backGroundImage}
                      alt="Upload Icon"
                      onClick={handleBackGroundImageClick}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        border: "2px solid transparent",
                        overFlow: "hidden",
                        borderRadius: "1rem",
                      }}
                    />
                  )}
                  {backGroundImage !== userData.backgroundImageUrl ? (
                    <div
                      onClick={handleCancelUploadBackGroundImage}
                      style={deleteImageIcon}
                    >
                      <IoRemoveCircleOutline
                        color="rgb(0, 119, 234)"
                        size={"2rem"}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={handleBackGroundImageClick}
                      style={clickToAddImage}
                    >
                      <IoCameraReverseOutline
                        color="rgb(0, 119, 234)"
                        size={"2rem"}
                      />
                    </div>
                  )}
                </div>

                <div className="flex profilePage_ProfileImage">
                  <div>
                    <div className="profilePage_ProfileImage_Img_Container">
                      {/* <img src={userBaseUrl + userData?.profileImageUrl} className=" profilePage_ProfileImage_Img" alt="b" /> */}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        style={{ display: "none" }}
                        ref={fileInputRef_ProfileImage}
                      />
                      {profileImagePreview ? (
                        <div className="profilePage_ProfileImage_Img">
                          <img
                            src={profileImagePreview}
                            alt="Uploaded preview"
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
                      ) : (
                        <div className="profilePage_ProfileImage_Img">
                          <img
                            src={userBaseUrl + profileImage}
                            alt="Upload Icon"
                            onClick={handleProfileImageClick}
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
                      )}
                      {profileImage !== userData.profileImageUrl ? (
                        <div
                          onClick={handleCancelUploadProfileImage}
                          style={deleteImageIcon}
                        >
                          <IoRemoveCircleOutline
                            color="rgb(0, 119, 234)"
                            size={"2rem"}
                          />
                        </div>
                      ) : (
                        <div
                          onClick={handleProfileImageClick}
                          style={clickToAddImage}
                        >
                          <IoCameraReverseOutline
                            color="rgb(0, 119, 234)"
                            size={"2rem"}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex editprofilePage_BioAndContactDetails">
                <div className="flex editprofilePage_BioTitleUserName">
                  <div className="flex profilePage_UserName">
                    <span className="profilePage_UserName">
                      <UserNameInputComponent
                        userName={userName}
                        setUserName={setUserName}
                      />
                    </span>
                  </div>
                  <div className="flex profilePage_Title">
                    <span className="profilePage_Title">
                      <UserTitleInputComponent
                        userTitle={userTitle}
                        setUserTitle={setUserTitle}
                      />
                    </span>
                  </div>
                  <div className="flex profilePage_Bio">
                    <ReactQuill
                      className="custom-quill"
                      value={userBio}
                      onChange={(value) => setUserBio(value)}
                      placeholder="Tell us about yourself..."
                      modules={{
                        toolbar: false,
                      }}
                      style={{
                        color: parrotTextDarkBlue,
                        fontWeight: "500",
                        fontSize: "1.2rem",
                        borderRadius: "1.5rem",
                        padding: "0rem",
                        backgroundColor: "#007bff21",
                        width: "100%",
                      }}
                    />
                    <style>
                      {`
                            .ql-container {
                              border: none !important; 
                            }
                            .ql-editor {
                              border: none !important; 
                              padding: 0.5rem !important;
                              padding-left: 1rem !important;
                              padding-top: 1rem !important;
                            }
                            .custom-quill .ql-editor.ql-blank::before {
                              color: red; 
                              font-size: 1rem; 
                              font-style: italic;
                              opacity: 0.6;
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
              <div
                className="flex flex-col"
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
                  {isSuccessUser ? (
                    <EditProfileSocialsComponent
                      userData={userData}
                      setEmail={setEmail}
                      setDisplayEmail={setDisplayEmail}
                      setPhoneNumber={setPhoneNumber}
                      setFacebookProfile={setFacebookProfile}
                      setInstagramProfile={setInstagramProfile}
                      setTwitterProfile={setTwitterProfile}
                      setTiktokProfile={setTiktokProfile}
                      setLinkedinProfile={setLinkedinProfile}
                      setYoutubeProfile={setYoutubeProfile}
                      setEmailHidden={setEmailHidden}
                      email={email}
                      displayEmail={displayEmail}
                      phoneNumber={phoneNumber}
                      facebookProfile={facebookProfile}
                      instagramProfile={instagramProfile}
                      twitterProfile={twitterProfile}
                      tiktokProfile={tiktokProfile}
                      linkedinProfile={linkedinProfile}
                      youtubeProfile={youtubeProfile}
                      emailHidden={emailHidden}
                    />
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      position: "absolute",
                      width: "20rem",
                      height: "5rem",
                      bottom: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    {isUpdatingProfile ? (
                      <span
                        onClick={() => {
                          handleUpdateChanges();
                        }}
                        style={UpdateChangesButton}
                      >
                        <UpdateProfileSpinner />
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          handleUpdateChanges();
                        }}
                        style={UpdateChangesButton}
                      >
                        Update Changes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  ) : null;
}

const UpdateProfileSpinner = () => {
  return (
    <div
      style={{
        backgroundColor: "rgba(0, 119, 234,0.1)",
        borderRadius: "1.5rem",
        position: "relative",
        margin: "auto",
        height: "2.2rem",
        display: "flex", // Added for vertical alignment
        alignItems: "center", // Center vertically
      }}
    >
      <div
        className="spinner"
        style={{
          height: "1rem",
          width: "1rem",
          border: "3px solid white",
          borderTop: "3px solid #1e90ff",
        }}
      ></div>
    </div>
  );
};

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
};

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
};

const UpdateChangesButton = {
  position: "absolute",
  fontSize: "1.4rem",
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
