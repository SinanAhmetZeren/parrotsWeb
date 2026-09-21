/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css";
import React, { useState, useEffect, useRef, createRef } from "react";
import { CropModal } from "../components/CropModal";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import {
  useGetUserByIdQuery,
  usePatchUserMutation,
  useUpdateBackgroundImageMutation,
  useUpdateProfileImageMutation,
  useDeleteAccountMutation,
} from "../slices/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { LoadingProfilePage } from "../components/LoadingProfilePage";
import { EditProfileSocialsComponent } from "../components/EditProfileSocialsComponent";
import ReactQuill, { displayName } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserNameInputComponent } from "../components/UserNameInputComponent";
import { UserTitleInputComponent } from "../components/UserTitleInputComponent";
import { IoRemoveCircleOutline, IoCameraReverseOutline } from "react-icons/io5";
import { updateUserName, updateAsLoggedOut } from "../slices/UserSlice";
import { parrotBlue, parrotRed, parrotTextDarkBlue } from "../styles/colors";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { toast } from "react-toastify";

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
  const isDarkMode = useSelector((state) => state.users.isDarkMode);
  const dark = isDarkMode;
  const dispatch = useDispatch();
  const fileInputRef_ProfileImage = createRef();
  const fileInputRef_BackgroundImage = createRef();
  const [profileCropSrc, setProfileCropSrc] = useState(null);
  const [bgCropSrc, setBgCropSrc] = useState(null);
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
  const [honeyPotValue, setHoneyPotValue] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const userBaseUrl = ``;
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [pendingNav, setPendingNav] = useState(null);

  const stripHtml = (s) => (s || "").replace(/<[^>]+>/g, "").trim();

  const hasChanges = savedSnapshot && (
    userName !== savedSnapshot.userName ||
    userTitle !== savedSnapshot.userTitle ||
    stripHtml(userBio) !== stripHtml(savedSnapshot.userBio) ||
    displayEmail !== savedSnapshot.displayEmail ||
    phoneNumber !== savedSnapshot.phoneNumber ||
    facebookProfile !== savedSnapshot.facebookProfile ||
    instagramProfile !== savedSnapshot.instagramProfile ||
    twitterProfile !== savedSnapshot.twitterProfile ||
    tiktokProfile !== savedSnapshot.tiktokProfile ||
    linkedinProfile !== savedSnapshot.linkedinProfile ||
    youtubeProfile !== savedSnapshot.youtubeProfile ||
    profileImage !== savedSnapshot.profileImage ||
    backGroundImage !== savedSnapshot.backGroundImage
  );

  const takeSnapshot = () => setSavedSnapshot({ userName, userTitle, userBio, displayEmail, phoneNumber, facebookProfile, instagramProfile, twitterProfile, tiktokProfile, linkedinProfile, youtubeProfile, profileImage, backGroundImage });

  const handleGoToPublicProfilePage = () => {
    if (hasChanges) { setPendingNav("public"); return; }
    navigate(`/profile-public/${userData.publicId}/${userData.userName}`);
  };
  const handleGoToProfilePage = () => {
    if (hasChanges) { setPendingNav("profile"); return; }
    navigate(`/profile`);
  };
  const confirmNav = () => {
    if (pendingNav === "public") navigate(`/profile-public/${userData.publicId}/${userData.userName}`);
    else navigate(`/profile`);
    setPendingNav(null);
  };

  const [patchUser] = usePatchUserMutation();
  const [updateBackgroundImage] = useUpdateBackgroundImageMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount().unwrap();
    } catch (_) { }
    setIsDeletingAccount(false);
    setShowDeleteModal(false);
    dispatch(updateAsLoggedOut());
  };

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
      setSavedSnapshot({
        userName: userData.userName,
        userTitle: userData.title,
        userBio: stripHtml(userData.bio),
        displayEmail: userData.displayEmail || "",
        phoneNumber: userData.phoneNumber || "",
        facebookProfile: userData.facebook || "",
        instagramProfile: userData.instagram || "",
        twitterProfile: userData.twitter || "",
        tiktokProfile: userData.tiktok || "",
        linkedinProfile: userData.linkedin || "",
        youtubeProfile: userData.youtube || "",
        profileImage: userData.profileImageUrl,
        backGroundImage: userData.backgroundImageUrl,
      });
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
      await patchUser({ patchDoc, userId }).unwrap();
      dispatch(updateUserName({ username: userName }));
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleBackGroundImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].size > 5 * 1024 * 1024) { toast.error("File size must be 5MB or less."); return; }
      setBgCropSrc(URL.createObjectURL(files[0]));
    }
  };

  const handleBgCropConfirm = (blob) => {
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    URL.revokeObjectURL(bgCropSrc);
    setBgCropSrc(null);
    setBackGroundImage(file);
    setBackGroundImagePreview(URL.createObjectURL(file));
  };

  const handleBgCropCancel = () => {
    URL.revokeObjectURL(bgCropSrc);
    setBgCropSrc(null);
    if (fileInputRef_BackgroundImage.current) fileInputRef_BackgroundImage.current.value = "";
  };

  const handleProfileImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].size > 5 * 1024 * 1024) { toast.error("File size must be 5MB or less."); return; }
      setProfileCropSrc(URL.createObjectURL(files[0]));
    }
  };

  const handleProfileCropConfirm = (blob) => {
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    URL.revokeObjectURL(profileCropSrc);
    setProfileCropSrc(null);
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleProfileCropCancel = () => {
    URL.revokeObjectURL(profileCropSrc);
    setProfileCropSrc(null);
    if (fileInputRef_ProfileImage.current) fileInputRef_ProfileImage.current.value = "";
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
      await updateProfileImage({ profileImage, userId }).unwrap();
    } catch (error) {
      console.error("Error uploading profile image", error);
      toast.error("Failed to update profile image. Please try again.");
    }
  };

  const handleUploadBackgroundImage = async () => {
    if (!backGroundImage || backGroundImage === userData.backgroundImageUrl) {
      console.log("---- not doing anything with profileImage");

      return;
    }
    try {
      await updateBackgroundImage({ backGroundImage, userId }).unwrap();
    } catch (error) {
      console.error("Error uploading background image", error);
      toast.error("Failed to update background image. Please try again.");
    }
  };

  const handleUpdateChanges = async () => {

    if (honeyPotValue) {
      console.warn("Bot detected – update blocked");
      return;
    }

    setIsUpdatingProfile(true);
    if (backGroundImage) {
      await handleUploadBackgroundImage();
    }
    if (profileImage) {
      await handleUploadProfileImage();
    }
    await handlePatchUser();
    const { data: freshData } = await refetchUserData();
    if (freshData) {
      setSavedSnapshot({
        userName: freshData.userName,
        userTitle: freshData.title,
        userBio: stripHtml(freshData.bio),
        displayEmail: freshData.displayEmail || "",
        phoneNumber: freshData.phoneNumber || "",
        facebookProfile: freshData.facebook || "",
        instagramProfile: freshData.instagram || "",
        twitterProfile: freshData.twitter || "",
        tiktokProfile: freshData.tiktok || "",
        linkedinProfile: freshData.linkedin || "",
        youtubeProfile: freshData.youtube || "",
        profileImage: freshData.profileImageUrl,
        backGroundImage: freshData.backgroundImageUrl,
      });
    } else {
      takeSnapshot();
    }
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
                        alt=""
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
                    <div onClick={handleCancelUploadBackGroundImage} style={imageActionBtn}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="rgb(0,119,234)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}><circle cx="12" cy="12" r="9" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    </div>
                  ) : (
                    <div onClick={handleBackGroundImageClick} style={imageActionBtn}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="rgb(0,119,234)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    </div>
                  )}
                  <div style={imageLabelPill}>Background Image</div>
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
                            alt=""
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
                        <div onClick={handleCancelUploadProfileImage} style={imageActionBtn}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="rgb(0,119,234)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}><circle cx="12" cy="12" r="9" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                        </div>
                      ) : (
                        <div onClick={handleProfileImageClick} style={imageActionBtn}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="rgb(0,119,234)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 19, height: 19 }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                        </div>
                      )}
                      <div style={imageLabelPill}>Profile Image</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex editprofilePage_BioAndContactDetails">
                <div className="flex editprofilePage_BioTitleUserName" style={dark ? { backgroundColor: "#011a32" } : {}}>
                  <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", width: "100%" }}>
                    <div style={{ flex: 1 }}>
                      <UserNameInputComponent
                        userName={userName}
                        setUserName={setUserName}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <UserTitleInputComponent
                        userTitle={userTitle}
                        setUserTitle={setUserTitle}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  </div>
                  <div className="flex editprofilePage_Bio">
                    <ReactQuill
                      className="custom-quill"
                      value={userBio}
                      onChange={(value) => { if (value.replace(/<[^>]+>/g, "").length <= 700) setUserBio(value); }}
                      placeholder="Tell us about yourself... (max 700 characters)"
                      modules={{
                        toolbar: false,
                      }}
                      style={{
                        color: dark ? "rgba(255,255,255,0.9)" : "#0A2540",
                        fontFamily: "Nunito, sans-serif",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                        borderRadius: 10,
                        border: "1.5px solid rgba(160,175,190,.3)",
                        padding: "0rem",
                        backgroundColor: dark ? "#0a2745" : "#fff",
                        width: "100%",
                        marginTop: "0.4rem",
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
                              font-family: "Nunito", sans-serif !important;
                              font-weight: 600;
                              font-size: 0.875rem;
                              line-height: 1.5rem;
                              letter-spacing: 0.015em;
                            }
                            .custom-quill .ql-editor.ql-blank::before {
                              // color: red;
                              font-size: 1rem;
                              font-style: normal;
                              opacity: 0.6;
                            }
                            .custom-quill .ql-editor::-webkit-scrollbar {
                              width: 6px;
                            }
                            .custom-quill .ql-editor::-webkit-scrollbar-track {
                              background: ${dark ? "#0a2745" : "#F4F7FB"};
                              border-radius: 3px;
                            }
                            .custom-quill .ql-editor::-webkit-scrollbar-thumb {
                              background-color: ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,123,255,0.3)"};
                              border-radius: 3px;
                            }
                            .custom-quill .ql-editor::-webkit-scrollbar-thumb:hover {
                              background-color: ${dark ? "rgba(255,255,255,0.35)" : "rgba(0,123,255,0.5)"};
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
                  paddingTop: "0.5rem",
                }}
              >
                <div
                  style={{
                    borderRadius: "1.5rem",
                    height: "100%",
                    flexDirection: "column",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {isSuccessUser ? (
                    <EditProfileSocialsComponent
                      isDarkMode={isDarkMode}
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




                  {pendingNav && (
                    <div style={deleteModalOverlayStyle}>
                      <div style={deleteModalStyle}>
                        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#163A5F", marginBottom: "0.5rem" }}>Unsaved Changes</div>
                        <div style={{ fontSize: "1rem", color: "#5C6B7A", marginBottom: "1.5rem", lineHeight: 1.5, textAlign: "left" }}>
                          You have unsaved changes. If you leave now, your changes will be lost.
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <button onClick={() => setPendingNav(null)} style={deleteCancelBtnStyle}>Stay</button>
                          <button onClick={confirmNav} style={deleteConfirmBtnStyle}>Leave Without Saving</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showDeleteModal && (
                    <div style={deleteModalOverlayStyle}>
                      <div style={deleteModalStyle}>
                        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#163A5F", marginBottom: "0.5rem" }}>Delete Account</div>
                        <div style={{ fontSize: "1.1rem", color: "#163A5F", marginBottom: "1.5rem", lineHeight: 1.5, textAlign: "center" }}>
                          Your account will be deactivated. If you are a host with active voyages, your trip details will remain visible to your counterparties. As mentioned in the Terms of Use, Parrots may contact you via your registered email in the event of urgent coordination, and prompt responsiveness to guests is required for active trips and ongoing commitments.
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <button onClick={() => setShowDeleteModal(false)} style={deleteCancelBtnStyle}>Cancel</button>
                          <button onClick={handleDeleteAccount} disabled={isDeletingAccount} style={deleteConfirmBtnStyle}>
                            {isDeletingAccount ? "Deleting…" : "Yes, Delete My Account"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "center",
            padding: "0.6rem 1.5rem",
            boxSizing: "border-box",
            flexShrink: 0,
          }}>
            <input
              type="text"
              value={honeyPotValue}
              onChange={(e) => setHoneyPotValue(e.target.value)}
              style={{ display: "none" }}
              autoComplete="off"
            />
            <span onClick={() => handleGoToProfilePage()} style={{ ...navigationButton, width: "9rem", textAlign: "center" }}>Go to Profile</span>
            {local_userId === userId &&
              <span onClick={() => handleGoToPublicProfilePage()} style={{ ...navigationButton, width: "12rem", textAlign: "center" }}>Go to Public Profile</span>
            }
            <span onClick={() => handleUpdateChanges()} style={{ ...UpdateChangesButton, width: "9rem", textAlign: "center" }}>
              {isUpdatingProfile ? <UpdateProfileSpinner /> : "Save Changes"}
            </span>
            <span onClick={() => setShowDeleteModal(true)} style={{ ...DeleteAccountButton, width: "9rem", textAlign: "center" }}>
              Delete Account
            </span>
          </div>
        </div>
      </header>
      <CropModal src={profileCropSrc} onConfirm={handleProfileCropConfirm} onCancel={handleProfileCropCancel} />
      <CropModal src={bgCropSrc} onConfirm={handleBgCropConfirm} onCancel={handleBgCropCancel} />
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

const imageActionBtn = {
  backgroundColor: "rgba(255,255,255,.95)",
  position: "absolute",
  bottom: ".5rem",
  right: "0.5rem",
  borderRadius: "50%",
  width: 44,
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 3px 10px rgba(0,14,30,.24)",
};

const imageLabelPill = {
  position: "absolute",
  bottom: "0.5rem",
  left: "0.5rem",
  backgroundColor: "rgba(255,255,255,0.85)",
  color: "#0A2540",
  fontFamily: "Nunito, sans-serif",
  fontWeight: 700,
  fontSize: "0.75rem",
  borderRadius: 99,
  padding: "3px 10px",
  pointerEvents: "none",
  backdropFilter: "blur(4px)",
};

const epBtn = {
  fontFamily: "Nunito, sans-serif",
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 44, height: 44,
  background: "rgba(255,255,255,.95)",
  border: "none",
  color: "#0A2540",
  borderRadius: "50%",
  cursor: "pointer",
  boxShadow: "0 3px 10px rgba(0,14,30,.24)",
  position: "relative", padding: 0, flexShrink: 0,
};

const UpdateChangesButton = {
  fontFamily: "Nunito, sans-serif",
  fontSize: "0.8rem",
  fontWeight: 800,
  color: "white",
  borderRadius: 99,
  backgroundColor: "#0A77EA",
  cursor: "pointer",
  border: "1.5px solid #0A77EA",
  padding: "8px 20px",
  textAlign: "center",
  letterSpacing: "0.02em",
  transition: "background 0.15s",
  whiteSpace: "nowrap",
};


const DeleteAccountButton = {
  fontFamily: "Nunito, sans-serif",
  fontSize: "0.8rem",
  fontWeight: 800,
  color: "#cb0404",
  borderRadius: 99,
  backgroundColor: "#fff",
  cursor: "pointer",
  border: "1.5px solid #cb0404",
  padding: "8px 20px",
  textAlign: "center",
  letterSpacing: "0.02em",
  transition: "background 0.15s",
  whiteSpace: "nowrap",
};

const buttonsContainer = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "0.5rem",
  boxSizing: "border-box",
  borderTopLeftRadius: "1rem",
  borderTopRightRadius: "1rem",
  zIndex: 10,
}

const navigationButton = {
  fontFamily: "Nunito, sans-serif",
  borderRadius: 99,
  backgroundColor: "white",
  color: "#0A77EA",
  padding: "7px 18px",
  textAlign: "center",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: "0.85rem",
  border: "1.5px solid #0A77EA",
  letterSpacing: "0.02em",
  transition: "background 0.15s",
};

const deleteAccountButtonStyle = {
  fontSize: "1.4rem",
  fontWeight: 800,
  color: "white",
  borderRadius: "1.5rem",
  paddingRight: "2rem",
  paddingLeft: "2rem",
  marginTop: "0.3rem",
  backgroundColor: "#cb0404",
  cursor: "pointer",
  border: "none",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  padding: "0.2rem",
  width: "20rem",
};

const deleteModalOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const deleteModalStyle = {
  backgroundColor: "#fff",
  borderRadius: "1.5rem",
  padding: "1.5rem",
  width: "30rem",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
};

const deleteCancelBtnStyle = {
  flex: 1,
  fontFamily: "Nunito, sans-serif",
  padding: "8px 0",
  borderRadius: 99,
  border: "1.5px solid #E3E9F0",
  backgroundColor: "#fff",
  color: "#5C6B7A",
  fontWeight: 800,
  fontSize: "0.8rem",
  cursor: "pointer",
  transition: "background 0.15s",
};

const deleteConfirmBtnStyle = {
  flex: 1,
  fontFamily: "Nunito, sans-serif",
  padding: "8px 0",
  borderRadius: 99,
  border: "1.5px solid #cb0404",
  backgroundColor: "#cb0404",
  color: "white",
  fontWeight: 800,
  fontSize: "0.8rem",
  cursor: "pointer",
  transition: "background 0.15s",
};