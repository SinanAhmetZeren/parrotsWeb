import instagram from "../assets/images/instagram_icon.png"
import youtube from '../assets/images/youtube_icon.png';
import facebook from '../assets/images/facebook_logo.png';
import twitter from '../assets/images/twitter_logo.png';
import linkedin from '../assets/images/linkedin_logo.png';
import tiktok from '../assets/images/tiktok_logo.png';
import email from '../assets/images/email_logo.png';
import phone from '../assets/images/phone_logo.jpeg';
import "../assets/css/CreateVehicle.css"

import { useState } from 'react';

export function EditProfileSocialsComponent({ userData }) {
  const [emailValue, setEmail] = useState(userData.email || "");
  const [instagramValue, setInstagram] = useState(userData.instagram || "");
  const [youtubeValue, setYoutube] = useState(userData.youtube || "");
  const [facebookValue, setFacebook] = useState(userData.facebook || "");
  const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber || "");
  const [twitterValue, setTwitter] = useState(userData.twitter || "");
  const [linkedinValue, setLinkedin] = useState(userData.linkedin || "");
  const [tiktokValue, setTiktok] = useState(userData.tiktok || "");

  const socialIcons = {
    email: email,
    instagram: instagram,
    youtube: youtube,
    facebook: facebook,
    phoneNumber: phone,
    twitter: twitter,
    linkedin: linkedin,
    tiktok: tiktok,
  };

  const socialInputs = [
    { key: "email", state: emailValue, setter: setEmail },
    { key: "instagram", state: instagramValue, setter: setInstagram },
    { key: "youtube", state: youtubeValue, setter: setYoutube },
    { key: "facebook", state: facebookValue, setter: setFacebook },
    { key: "phoneNumber", state: phoneNumber, setter: setPhoneNumber },
    { key: "twitter", state: twitterValue, setter: setTwitter },
    { key: "linkedin", state: linkedinValue, setter: setLinkedin },
    { key: "tiktok", state: tiktokValue, setter: setTiktok },
  ];

  return (
    <div style={{ backgroundColor: "green" }}>
      {socialInputs.map(({ key, state, setter }) => (
        <div
          key={key}
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: "1.5rem",
            display: "flex",
            alignItems: "center",
            padding: "0.5rem"
          }}
        >
          <img src={socialIcons[key]} alt={key} style={socialIcon} />
          <input
            className="font-bold text-base custom-input"
            type="text"
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={state}
            style={inputStyle}
            onChange={(e) => setter(e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}


const inputStyle = {
  width: "100%",
  padding: ".3rem",
  border: "1px solid #ccc",
  borderRadius: "1.5rem",
  textAlign: "center",
  cursor: "pointer",
  boxShadow: `
0 4px 6px rgba(0, 0, 0, 0.1),
inset 0 -4px 6px rgba(0, 0, 0, 0.1)
`,
  height: "3rem",
  fontSize: "1.1rem",
  color: "#007bff",

}

const labelStyle = {
  width: "28%",
  display: "inline-block",
  textAlign: "end",
  alignSelf: "center",
  color: "black",
  fontSize: "1.3rem"
}

const placeHolderStyle = `
      .custom-input::placeholder {
        font-size: 1.0rem;
        color: gray !important;
      }
    `
const socialIcon = {
  width: '3rem',
  height: '3rem',
  margin: '5px',
  cursor: 'pointer',
  borderRadius: "5rem",
  objectFit: "cover"
};
