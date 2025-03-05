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
    <div style={{ backgroundColor: "", width: "100%" }}>
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
              onChange={(e) => setter(e.target.value)}
            />
          </div>
        </div>
      ))}
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
  color: "#007bff",
  backgroundColor: "#007bff21",
}

const socialIcon = {
  width: '3rem',
  height: '3rem',
  margin: '5px',
  cursor: 'pointer',
  borderRadius: "5rem",
  objectFit: "cover"
};

const socialRow = {
  backgroundColor: 'white',
  display: 'flex',
  margin: '5px',
  width: "23rem",
  boxShadow: `
  0 2px 2px rgba(0, 0, 0, 0.31),
  inset 0 -4px 6px rgba(0, 0, 0, 0.31)
`,
  borderRadius: "2rem",
}

const socialIconTextContainer = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginLeft: '1rem',
}