import instagram from "../assets/instagram_icon.png"
import youtube from '../assets/youtube_icon.png';
import facebook from '../assets/facebook_logo.png';
import twitter from '../assets/twitter_logo.png';
import linkedin from '../assets/linkedin_logo.png';
import tiktok from '../assets/tiktok_logo.png';
import email from '../assets/email_logo.png';
import phone from '../assets/phone_logo.jpeg';
import { text } from "d3";


export function SocialRenderComponent({ userData }) {
  let contactDataArray = [];

  if (userData.email !== null && userData.emailVisible === true) {
    contactDataArray.push({ key: 'email', value: userData.email });
  }
  if (userData.instagram !== null) {
    contactDataArray.push({ key: 'instagram', value: userData.instagram });
  }
  if (userData.youtube !== null) {
    contactDataArray.push({ key: 'youtube', value: userData.youtube });
  }
  if (userData.facebook !== null) {
    contactDataArray.push({ key: 'facebook', value: userData.facebook });
  }
  if (userData.phoneNumber !== null) {
    contactDataArray.push({ key: 'phoneNumber', value: userData.phoneNumber });
  }
  if (userData.twitter !== null) {
    contactDataArray.push({ key: 'twitter', value: userData.twitter });
  }
  if (userData.linkedin !== null) {
    contactDataArray.push({ key: 'linkedin', value: userData.linkedin });
  }
  if (userData.tiktok !== null) {
    contactDataArray.push({ key: 'tiktok', value: userData.tiktok });
  }



  return (
    <div style={socialItemsContainer}>
      {contactDataArray.map(({ key, value }) => {
        if (value) {
          return (
            <div style={socialRow} key={key}>
              <div>
                {key === 'instagram' && <img style={socialIcon} src={instagram} alt="instagram" />}
                {key === 'youtube' && <img style={socialIcon} src={youtube} alt="youtube" />}
                {key === 'facebook' && <img style={socialIcon} src={facebook} alt="facebook" />}
                {key === 'twitter' && <img style={socialIcon} src={twitter} alt="twitter" />}
                {key === 'linkedin' && <img style={socialIcon} src={linkedin} alt="linkedin" />}
                {key === 'tiktok' && <img style={socialIcon} src={tiktok} alt="tiktok" />}
                {key === 'email' && <img style={socialIcon} src={email} alt="email" />}
                {key === 'phoneNumber' && <img style={socialIcon} src={phone} alt="phone" />}
              </div>
              <div style={socialIconTextContainer}>
                <a href={key === 'email' ? `mailto:${value}`
                  : key === 'phoneNumber' ? `tel:${value}`
                    : `https://${key}.com/${value}`} target="_blank" rel="noopener noreferrer" style={socialIconText}>
                  {value.toLowerCase()}
                </a>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

const socialIcon = {
  width: '3rem',
  height: '3rem',
  margin: '5px',
  cursor: 'pointer',
  borderRadius: "5rem",
  objectFit: "cover"
};

const socialIconText = {
  fontSize: '1.2rem',
  color: 'black',
  margin: '5px'
}

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

const socialItemsContainer = {
  margin: 'auto',
}

const socialIconTextContainer = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginLeft: '1rem',
}