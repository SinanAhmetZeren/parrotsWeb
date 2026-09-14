import instagram from "../assets/images/instagram_icon.png";
import youtube from "../assets/images/youtube_icon.png";
import facebook from "../assets/images/facebook_logo.png";
import twitter from "../assets/images/twitter_logo.png";
import linkedin from "../assets/images/linkedin_logo.png";
import tiktok from "../assets/images/tiktok_logo.png";
import emaillogo from "../assets/images/email_logo.png";
import phone from "../assets/images/phone_logo.jpeg";
import "../assets/css/CreateVehicle.css";
import { parrotTextDarkBlue } from "../styles/colors";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";

export function EditProfileSocialsComponent({
  isDarkMode = false,
  userData,
  setEmail,
  setDisplayEmail,
  setPhoneNumber,
  setFacebookProfile,
  setInstagramProfile,
  setTwitterProfile,
  setTiktokProfile,
  setLinkedinProfile,
  setYoutubeProfile,
  email,
  displayEmail,
  emailHidden,
  setEmailHidden,
  phoneNumber,
  facebookProfile,
  instagramProfile,
  twitterProfile,
  tiktokProfile,
  linkedinProfile,
  youtubeProfile,
}) {
  const socialIcons = {
    email: emaillogo,
    instagram: instagram,
    youtube: youtube,
    facebook: facebook,
    phoneNumber: phone,
    twitter: twitter,
    linkedin: linkedin,
    tiktok: tiktok,
  };
  const dark = isDarkMode;
  const [isHovered, setIsHovered] = useState(false);

  const socialInputs = [
    { key: "instagram", state: instagramProfile, setter: setInstagramProfile, maxLen: 150, hint: "max 150" },
    { key: "youtube", state: youtubeProfile, setter: setYoutubeProfile, maxLen: 150, hint: "max 150" },
    { key: "facebook", state: facebookProfile, setter: setFacebookProfile, maxLen: 150, hint: "max 150" },
    { key: "phoneNumber", state: phoneNumber, setter: setPhoneNumber, maxLen: 20, hint: "max 20" },
    { key: "twitter", state: twitterProfile, setter: setTwitterProfile, maxLen: 150, hint: "max 150" },
    { key: "linkedin", state: linkedinProfile, setter: setLinkedinProfile, maxLen: 150, hint: "max 150" },
    { key: "tiktok", state: tiktokProfile, setter: setTiktokProfile, maxLen: 150, hint: "max 150" },
    { key: "email", state: displayEmail, setter: setDisplayEmail, maxLen: 100, hint: "max 100", label: "Display Email" },
  ];

  return (
    <>
      <div style={{
        margin: "auto",
        width: "80%",
        backgroundColor: dark ? "#011a32" : "#F4F7FB",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        borderRadius: "1.5rem",
        marginLeft: 0,
        height: "87%"


      }}>
        {socialInputs.map(({ key, state, setter, maxLen, hint, label }) => (
          <div key={key}>
            <div style={{ ...socialRow, backgroundColor: dark ? "#011a32" : "white" }}>
              <div>
                <img style={socialIcon} src={socialIcons[key]} alt={key} />
              </div>
              <div style={socialIconTextContainer}>
                <input
                  className="font-bold text-base custom-input"
                  type="text"
                  placeholder={`${label ?? (key.charAt(0).toUpperCase() + key.slice(1))} (${hint})`}
                  maxLength={maxLen}
                  value={state}
                  style={{
                    ...inputStyle,
                    backgroundColor: dark ? "#011a32" : "#fff",
                    color: dark ? "rgba(255,255,255,0.9)" : "#0A2540",
                    border: dark ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid rgba(160,175,190,.3)",
                  }}
                  onChange={(e) => {
                    setter(e.target.value);
                  }}
                />
              </div>
            </div>

            {key === "email" && (
              <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
                <div style={messageRow}>
                  <EmailHiddenCheckBox emailHidden={emailHidden} setEmailHidden={setEmailHidden} dark={dark} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

const inputStyle = {
  width: "98%",
  padding: "9px 14px",
  borderRadius: 10,
  textAlign: "left",
  cursor: "text",
  height: "2.6rem",
  fontSize: "0.875rem",
  fontFamily: "Nunito, sans-serif",
  fontWeight: 600,
  color: "#0A2540",
  backgroundColor: "#fff",
  border: "1.5px solid rgba(160,175,190,.3)",
  outline: "none",
};

const socialIcon = {
  width: "3rem",
  height: "3rem",
  margin: "5px",
  cursor: "pointer",
  borderRadius: "5rem",
  objectFit: "cover",
};

const socialRow = {
  backgroundColor: "white",
  display: "flex",
  width: "90%",
  border: "1.5px solid #E3E9F0",
  borderRadius: 14,
  margin: "auto",
  marginTop: ".5rem",
  position: "relative",
  alignItems: "center",
};

const socialIconTextContainer = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginLeft: "1rem",
};

const messageRow = {
  // backgroundColor: "white",
  display: "flex",
  width: "28rem",
  //   boxShadow: `
  //   0 2px 2px rgba(0, 0, 0, 0.31),
  //   inset 0 -4px 6px rgba(0, 0, 0, 0.31)
  // `,
  // borderRadius: "2rem",
  margin: "auto",
  justifyContent: "center",
  alignItems: "center",
  marginTop: ".2rem",
};

const EmailHiddenCheckBox = ({ emailHidden, setEmailHidden, dark }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius: "0.75rem",
        backgroundColor: dark ? "#0a2745" : "#F4F7FB",
        padding: "0.4rem 0.75rem",
      }}
    >
      <label
        style={{
          color: dark ? "rgba(255,255,255,0.7)" : "#5C6B7A",
          fontSize: "0.9rem",
          fontFamily: "Nunito, sans-serif",
          fontWeight: 600,
          lineHeight: 1.4,
        }}
      >
        This email will be publicly visible on your profile. It may differ from your login email and is optional.
      </label>
    </div>
  );
};
