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

export function EditProfileSocialsComponent({
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

  const socialInputs = [
    { key: "email", state: displayEmail, setter: setDisplayEmail },
    { key: "instagram", state: instagramProfile, setter: setInstagramProfile },
    { key: "youtube", state: youtubeProfile, setter: setYoutubeProfile },
    { key: "facebook", state: facebookProfile, setter: setFacebookProfile },
    { key: "phoneNumber", state: phoneNumber, setter: setPhoneNumber },
    { key: "twitter", state: twitterProfile, setter: setTwitterProfile },
    { key: "linkedin", state: linkedinProfile, setter: setLinkedinProfile },
    { key: "tiktok", state: tiktokProfile, setter: setTiktokProfile },
  ];

  return (
    <div style={{ marginTop: "2rem", width: "100%" }}>
      {socialInputs.map(({ key, state, setter }) => (
        <div style={socialRow} key={key}>
          <div>
            <img style={socialIcon} src={socialIcons[key]} alt={key} />
          </div>
          <div style={socialIconTextContainer}>
            <input
              className="font-bold text-base custom-input"
              type="text"
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={state}
              style={inputStyle}
              onChange={(e) => {
                setter(e.target.value);
                console.log("e", e.target.value);
              }}
            />
          </div>
        </div>
      ))}

      <div style={emailHiddenRow} key={"34254243242342342"}>
        <EmailHiddenCheckBox
          emailHidden={emailHidden}
          setEmailHidden={setEmailHidden}
        />
      </div>
    </div>
  );
}

const inputStyle = {
  width: "98%",
  padding: ".3rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  cursor: "pointer",
  height: "3rem",
  fontSize: "1.1rem",
  color: parrotTextDarkBlue,
  backgroundColor: "#007bff21",
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
  // width: "23rem",
  width: "30rem",
  boxShadow: `
  0 2px 2px rgba(0, 0, 0, 0.31),
  inset 0 -4px 6px rgba(0, 0, 0, 0.31)
`,
  borderRadius: "2rem",
  margin: "auto",
  marginTop: ".5rem",
};

const emailHiddenRow = {
  backgroundColor: "white",
  display: "flex",
  width: "20rem",
  boxShadow: `
  0 2px 2px rgba(0, 0, 0, 0.31),
  inset 0 -4px 6px rgba(0, 0, 0, 0.31)
`,
  borderRadius: "2rem",
  margin: "auto",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "1rem",
};

const socialIconTextContainer = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginLeft: "1rem",
};

const EmailHiddenCheckBox = ({ emailHidden, setEmailHidden }) => {
  return (
    <div
      style={{
        height: "2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        borderRadius: "1.5rem",
      }}
    >
      <label
        className="text-lg font-bold"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: parrotTextDarkBlue,
          cursor: "pointer",
        }}
      >
        Display email on profile
        <input
          type="checkbox"
          checked={!emailHidden}
          onChange={() => setEmailHidden(!emailHidden)}
          style={{ width: "2rem", height: "2rem", accentColor: "#007bff" }}
        />
      </label>
    </div>
  );
};
