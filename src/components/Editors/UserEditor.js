/* eslint-disable no-undef */
import "../../assets/css/advancedmarker.css";
import "../../assets/css/ConnectPage.css";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TopBarMenu } from "../TopBarMenu";
import { TopLeftComponent } from "../TopLeftComponent";
import { useNavigate, useParams } from "react-router-dom";
import { SomethingWentWrong } from "../SomethingWentWrong";
import { useHealthCheckQuery } from "../../slices/HealthSlice";
import { useLazyGetVoyageByIdAdminQuery } from "../../slices/VoyageSlice";
import { parrotBlue, parrotDarkBlue, parrotGreen, parrotGreyTransparent, parrotPlaceholderGrey, parrotRed, parrotTextDarkBlue } from "../../styles/colors";
import { useSelector } from "react-redux";
import { useLazyGetSingleUserByUserNameQuery, useLazyGetUserByIdQuery, usePatchUserAdminMutation, usePatchUserMutation } from "../../slices/UserSlice";


export function UserEditor() {
  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
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

  const [searchUserName, setSearchUserName] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchingByUsername, setSearchingByUsername] = useState(false)
  const [searchingByUserId, setSearchingByUserId] = useState(false)

  const [patchUser] = usePatchUserAdminMutation();

  const [
    triggerGetUserById,
    {
      data: userData,
      isLoading,
      isError,
      error,
      isSuccess: isSuccessUser,
    },
  ] = useLazyGetUserByIdQuery();


  const [
    triggerGetUserByUserName,
    {
      data: userData2,
      isLoading: isLoading2,
      isError: isError2,
      error: error2,
      isSuccess: isSuccessUser2,
    },
  ] = useLazyGetSingleUserByUserNameQuery();

  const handleSearchUserbyUserId2 = async () => {
    setSearchingByUserId(true)
    console.log(searchUserId);
    if (!searchUserId || searchUserId.trim() === "") {
      console.warn("Username is empty");
      setSearchingByUserId(false)

      return;
    }
    let a = await triggerGetUserById(searchUserId);
    console.log("by id - email visible: ", a.data.emailVisible);

    setSearchingByUserId(false)
  };


  const handleSearchUserbyUserName2 = async () => {
    setSearchingByUsername(true)
    console.log(searchUserName);
    if (!searchUserName || searchUserName.trim() === "") {
      console.warn("Username is empty");
      setSearchingByUsername(false)

      return;
    }
    let a = await triggerGetUserByUserName(searchUserName);
    console.log("by username - email visible: ", a.data);
    setSearchingByUsername(false)
  };

  const populateUserFields = (data) => {
    if (!data) return;

    setUserName(data.userName);
    setUserTitle(data.title);
    setUserBio(data.bio);
    setEmail(data.email || "");
    setDisplayEmail(data.displayEmail || "");
    setInstagramProfile(data.instagram || "");
    setYoutubeProfile(data.youtube || "");
    setFacebookProfile(data.facebook || "");
    setPhoneNumber(data.phoneNumber || "");
    setTwitterProfile(data.twitter || "");
    setLinkedinProfile(data.linkedin || "");
    setTiktokProfile(data.tiktok || "");
    setEmailHidden(data.emailVisible === false); // ensure boolean

  };

  /*
  useEffect(() => {

    if (!userData && !userData2) return;

    if (isSuccessUser) {
      populateUserFields(userData)
    }

    if (isSuccessUser2) {
      populateUserFields(userData2)
    }
  }, [userData, isSuccessUser, userData2, isSuccessUser2]);
*/

  const handleSearchUserbyUserId = async () => {
    setSearchingByUserId(true);
    if (!searchUserId?.trim()) {
      setSearchingByUserId(false);
      return;
    }

    const result = await triggerGetUserById(searchUserId);
    if (result?.data) {
      setSearchUserName(result.data.userName)
      populateUserFields(result.data); // populate immediately
    }
    setSearchingByUserId(false);
  };

  const handleSearchUserbyUserName = async () => {
    setSearchingByUsername(true);
    if (!searchUserName?.trim()) {
      setSearchingByUsername(false);
      return;
    }

    const result = await triggerGetUserByUserName(searchUserName);
    if (result?.data) {
      console.log("result:", result.data.id);
      setSearchUserId(result.data.id)
      populateUserFields(result.data); // populate immediately
    }
    setSearchingByUsername(false);
  };

  const handlePatchUser = async () => {

    if (honeyPotValue) {
      console.warn("Bot detected – update blocked");
      return;
    }
    setIsUpdatingProfile(true)
    const patchDoc = [
      { op: "replace", path: "/userName", value: userName },
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
      const response = await patchUser({ userId: searchUserId, patchDoc });
      console.log("patch user response: ", response);
      console.log("patch user response success: ", response.data.success);
      if (response.data.success) {
        console.log("Profile updated successfully");

      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
    finally {
      setIsUpdatingProfile(false)
    }
  };

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }



  return (
    <div style={{ width: "90%", margin: "auto", padding: "1rem", fontFamily: "Arial", backgroundColor: parrotDarkBlue }}>
      <h2>User Profile Editor</h2>

      {/* Search Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 4fr 1fr",
        gap: "8px",
        marginBottom: "1rem",
        alignItems: "center"
      }}>
        <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "16rem" }}>
          Enter Username
        </div>
        <input
          type="text"
          placeholder="Search username"
          style={{
            width: "100%",
            paddingLeft: "1rem",
            height: "32px",
            color: "darkblue"
          }}
          value={searchUserName}
          onChange={(e) => setSearchUserName(e.target.value)}
        />

        <button
          style={{
            backgroundColor: parrotBlue,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            height: "32px"
          }}
          onClick={() => handleSearchUserbyUserName()}
        >
          {searchingByUsername ? "Searching" : "Search"}
        </button>
      </div>

      <input
        type="text"
        value={honeyPotValue}
        onChange={(e) => setHoneyPotValue(e.target.value)}
        style={{ display: "none" }}
        autoComplete="off"
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 4fr 1fr",
        gap: "8px",
        marginBottom: "1rem",
        alignItems: "center"
      }}>
        <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "16rem" }}>
          Enter User Id</div>
        <input
          type="text"
          placeholder="Search user id"
          style={{
            width: "100%",
            paddingLeft: "1rem",
            height: "32px",
            color: "darkblue"
          }}
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
        />

        <button
          style={{
            backgroundColor: parrotBlue,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            height: "32px"
          }}
          onClick={() => handleSearchUserbyUserId()}

        >
          {searchingByUserId ? "Searching" : "Search"}
        </button>
      </div>

      {/* Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>



        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>Title</div>
          <input
            type="text"
            value={userTitle}
            onChange={(e) => setUserTitle(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem", height: "32px", color: "darkblue" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>Phone</div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem", height: "32px", color: "darkblue" }}
          />
        </div>

      </div>


      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>Display Email</div>
          <input
            type="email"
            value={displayEmail}
            onChange={(e) => setDisplayEmail(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem", height: "32px", color: "darkblue" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>Facebook</div>
          <input
            type="text"
            value={facebookProfile}
            onChange={(e) => setFacebookProfile(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem", height: "32px", color: "darkblue" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>Instagram</div>
          <input
            type="text"
            value={instagramProfile}
            onChange={(e) => setInstagramProfile(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem", height: "32px", color: "darkblue" }}
          />
        </div>

      </div>


      {/* Row 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>Twitter</div>
          <input
            type="text"
            value={twitterProfile}
            onChange={(e) => setTwitterProfile(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem", height: "32px", color: "darkblue" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>TikTok</div>
          <input
            type="text"
            value={tiktokProfile}
            onChange={(e) => setTiktokProfile(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem", height: "32px", color: "darkblue" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>LinkedIn</div>
          <input
            type="text"
            value={linkedinProfile}
            onChange={(e) => setLinkedinProfile(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem", height: "32px", color: "darkblue" }}
          />
        </div>

      </div>


      {/* Row 4 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>YouTube</div>
          <input
            type="text"
            value={youtubeProfile}
            onChange={(e) => setYoutubeProfile(e.target.value)}
            style={{ width: "100%", paddingLeft: "1rem", height: "32px", color: "darkblue" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <button
            onClick={() => setEmailHidden(!emailHidden)}
            style={{
              backgroundColor: emailHidden ? "red" : "green",
              color: "white",
              border: "none",
              borderRadius: "4px",
              height: "32px"
            }}
          >
            Email {emailHidden ? "Hidden" : "Visible"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <button
            onClick={handlePatchUser}
            disabled={isUpdatingProfile}
            style={{
              backgroundColor: parrotBlue,
              color: "white",
              border: "none",
              borderRadius: "4px",
              height: "32px"
            }}
          >
            {isUpdatingProfile ? "Saving..." : "Save"}
          </button>
        </div>

      </div>


      {/* Bio */}
      <div style={{ marginTop: "10px", display: "flex" }}>
        <div style={{ fontSize: "1.2rem", color: "white", backgroundColor: parrotBlue, width: "12rem" }}>Bio</div>

        <textarea
          value={userBio}
          placeholder="Bio"
          onChange={(e) => setUserBio(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            minHeight: "80px",
            color: "darkblue"
          }}
        />
      </div>


      {/* HoneyPot */}
      <input
        type="text"
        value={honeyPotValue}
        onChange={(e) => setHoneyPotValue(e.target.value)}
        style={{ display: "none" }}
        tabIndex="-1"
        autoComplete="off"
      />

    </div>
  );


}

