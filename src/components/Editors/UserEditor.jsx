/* eslint-disable no-unused-vars */
import { useState } from "react";
import { SomethingWentWrong } from "../SomethingWentWrong";
import { useHealthCheckQuery } from "../../slices/HealthSlice";
import { useLazyGetSingleUserByUserNameQuery, useLazyGetUserByIdQuery, usePatchUserAdminMutation } from "../../slices/UserSlice";
import {
  adminPage, adminCard, adminTitle, adminRow, adminLabel, adminInput,
  adminTextarea, adminBtnPrimary, adminBtnSecondary, adminBoolBtn,
  adminSearchBar, adminIdInput,
} from "../../styles/adminStyles";

export function UserEditor() {
  const [userName, setUserName] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userBio, setUserBio] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [instagramProfile, setInstagramProfile] = useState("");
  const [twitterProfile, setTwitterProfile] = useState("");
  const [tiktokProfile, setTiktokProfile] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [youtubeProfile, setYoutubeProfile] = useState("");
  const [parrotCoinBalance, setParrotCoinBalance] = useState("");
  const [emailHidden, setEmailHidden] = useState(false);
  const [honeyPotValue, setHoneyPotValue] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [searchUserName, setSearchUserName] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchingByUsername, setSearchingByUsername] = useState(false);
  const [searchingByUserId, setSearchingByUserId] = useState(false);

  const [patchUser] = usePatchUserAdminMutation();
  const [triggerGetUserById] = useLazyGetUserByIdQuery();
  const [triggerGetUserByUserName] = useLazyGetSingleUserByUserNameQuery();

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;

  const populateUserFields = (data) => {
    if (!data) return;
    setUserName(data.userName);
    setUserTitle(data.title);
    setUserBio(data.bio);
    setDisplayEmail(data.displayEmail || "");
    setInstagramProfile(data.instagram || "");
    setYoutubeProfile(data.youtube || "");
    setFacebookProfile(data.facebook || "");
    setPhoneNumber(data.phoneNumber || "");
    setTwitterProfile(data.twitter || "");
    setLinkedinProfile(data.linkedin || "");
    setTiktokProfile(data.tiktok || "");
    setEmailHidden(data.emailVisible === false);
    setParrotCoinBalance(data.parrotCoinBalance);
  };

  const handleSearchByUserName = async () => {
    setSearchingByUsername(true);
    if (!searchUserName?.trim()) { setSearchingByUsername(false); return; }
    const result = await triggerGetUserByUserName(searchUserName);
    if (result?.data) { setSearchUserId(result.data.id); populateUserFields(result.data); }
    setSearchingByUsername(false);
  };

  const handleSearchByUserId = async () => {
    setSearchingByUserId(true);
    if (!searchUserId?.trim()) { setSearchingByUserId(false); return; }
    const result = await triggerGetUserById(searchUserId);
    if (result?.data) { setSearchUserName(result.data.userName); populateUserFields(result.data); }
    setSearchingByUserId(false);
  };

  const handlePatchUser = async () => {
    if (honeyPotValue) { console.warn("Bot detected"); return; }
    setIsUpdatingProfile(true);
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
      { op: "replace", path: "/parrotCoinBalance", value: parrotCoinBalance },
    ];
    try {
      const response = await patchUser({ userId: searchUserId, patchDoc });
      if (!response.data.success) alert("Failed to update profile.");
    } catch (err) { console.error(err); }
    finally { setIsUpdatingProfile(false); }
  };

  return (
    <div style={adminPage}>
      <input type="text" value={honeyPotValue} onChange={e => setHoneyPotValue(e.target.value)} style={{ display: "none" }} autoComplete="off" tabIndex="-1" />

      <div style={adminCard}>
        <div style={adminTitle}>User Editor</div>

        {/* Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          <div style={adminSearchBar}>
            <input type="text" placeholder="Username" value={searchUserName} onChange={e => setSearchUserName(e.target.value)} style={adminIdInput} />
            <button onClick={handleSearchByUserName} style={adminBtnSecondary}>
              {searchingByUsername ? "Searching..." : "Fetch by Username"}
            </button>
          </div>
          <div style={adminSearchBar}>
            <input type="text" placeholder="User ID" value={searchUserId} onChange={e => setSearchUserId(e.target.value)} style={adminIdInput} />
            <button onClick={handleSearchByUserId} style={adminBtnSecondary}>
              {searchingByUserId ? "Searching..." : "Fetch by ID"}
            </button>
          </div>
        </div>

        {/* Fields grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem 1rem", marginBottom: "0.75rem" }}>
          {[
            ["Username", userName, setUserName, "text"],
            ["Title", userTitle, setUserTitle, "text"],
            ["Phone", phoneNumber, setPhoneNumber, "tel"],
            ["Display Email", displayEmail, setDisplayEmail, "email"],
            ["Parrot Coins", parrotCoinBalance, setParrotCoinBalance, "number"],
            ["Facebook", facebookProfile, setFacebookProfile, "text"],
            ["Instagram", instagramProfile, setInstagramProfile, "text"],
            ["Twitter", twitterProfile, setTwitterProfile, "text"],
            ["TikTok", tiktokProfile, setTiktokProfile, "text"],
            ["LinkedIn", linkedinProfile, setLinkedinProfile, "text"],
            ["YouTube", youtubeProfile, setYoutubeProfile, "text"],
          ].map(([label, value, setter, type]) => (
            <div key={label}>
              <div style={adminLabel}>{label}</div>
              <input type={type} value={value ?? ""} onChange={e => setter(e.target.value)} style={adminInput} />
            </div>
          ))}
        </div>

        <div style={adminRow}>
          <div style={adminLabel}>Bio</div>
          <textarea value={userBio ?? ""} onChange={e => setUserBio(e.target.value)} style={adminTextarea} />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button onClick={() => setEmailHidden(!emailHidden)} style={adminBoolBtn(!emailHidden)}>
            Email: {emailHidden ? "Hidden" : "Visible"}
          </button>
          <button onClick={handlePatchUser} disabled={isUpdatingProfile} style={{ ...adminBtnPrimary, opacity: isUpdatingProfile ? 0.5 : 1 }}>
            {isUpdatingProfile ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
