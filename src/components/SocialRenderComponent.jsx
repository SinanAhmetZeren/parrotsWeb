import instagram from "../assets/images/instagram_icon.png";
import youtube from "../assets/images/youtube_icon.png";
import facebook from "../assets/images/facebook_logo.png";
import twitter from "../assets/images/twitter_logo.png";
import linkedin from "../assets/images/linkedin_logo.png";
import tiktok from "../assets/images/tiktok_logo.png";
import email from "../assets/images/email_logo.png";
import phone from "../assets/images/phone_logo.jpeg";
import { parrotTextDarkBlue } from "../styles/colors";

<div style={{ backgroundColor: "red", height: "100%", width: "100%" }}></div>;
export function SocialRenderComponent({ userData }) {
  let contactDataArray = [];

  if (userData.displayEmail !== null && userData.emailVisible === true) {
    contactDataArray.push({ key: "email", value: userData.displayEmail });
  }
  if (userData.instagram !== null) {
    contactDataArray.push({ key: "instagram", value: userData.instagram });
  }
  if (userData.youtube !== null) {
    contactDataArray.push({ key: "youtube", value: userData.youtube });
  }
  if (userData.facebook !== null) {
    contactDataArray.push({ key: "facebook", value: userData.facebook });
  }
  if (userData.phoneNumber !== null) {
    contactDataArray.push({ key: "phoneNumber", value: userData.phoneNumber });
  }
  if (userData.twitter !== null) {
    contactDataArray.push({ key: "twitter", value: userData.twitter });
  }
  if (userData.linkedin !== null) {
    contactDataArray.push({ key: "linkedin", value: userData.linkedin });
  }
  if (userData.tiktok !== null) {
    contactDataArray.push({ key: "tiktok", value: userData.tiktok });
  }

  const hasAnyValue = contactDataArray.some(
    (item) => item.value && item.value.trim() !== ""
  );

  return (
    <>
      {/* <div style={socialItemsContainer}> */}

      <div
        style={{
          ...socialItemsContainer,
          backgroundColor: hasAnyValue
            ? "transparent"
            : "rgba(255,255,255,0.2)",
        }}
      >
        {contactDataArray.map(({ key, value }) => {
          if (value) {
            return (
              <div style={socialRow} key={key}>
                <div>
                  {key === "instagram" && (
                    <img style={socialIcon} src={instagram} alt="instagram" />
                  )}
                  {key === "youtube" && (
                    <img style={socialIcon} src={youtube} alt="youtube" />
                  )}
                  {key === "facebook" && (
                    <img style={socialIcon} src={facebook} alt="facebook" />
                  )}
                  {key === "twitter" && (
                    <img style={socialIcon} src={twitter} alt="twitter" />
                  )}
                  {key === "linkedin" && (
                    <img style={socialIcon} src={linkedin} alt="linkedin" />
                  )}
                  {key === "tiktok" && (
                    <img style={socialIcon} src={tiktok} alt="tiktok" />
                  )}
                  {key === "email" && (
                    <img style={socialIcon} src={email} alt="email" />
                  )}
                  {key === "phoneNumber" && (
                    <img style={socialIcon} src={phone} alt="phone" />
                  )}
                </div>
                <div style={socialIconTextContainer}>
                  <a
                    href={
                      key === "email"
                        ? `mailto:${value}`
                        : key === "phoneNumber"
                        ? `tel:${value}`
                        : key === "linkedin"
                        ? `https://www.linkedin.com/in/${value}`
                        : `https://${key}.com/${value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialIconText}
                  >
                    {value.toLowerCase()}
                  </a>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      {contactDataArray.length === 0 && (
        <div style={placeHolderForContacts}></div>
      )}
    </>
  );
}

const placeHolderForContacts = {
  backgroundColor: "red",
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.2)",
  borderRadius: "1.5rem",
};

const socialIcon = {
  width: "3rem",
  height: "3rem",
  margin: "5px",
  cursor: "pointer",
  borderRadius: "5rem",
  objectFit: "cover",
};

const socialIconText = {
  fontSize: "1.2rem",
  color: parrotTextDarkBlue,
  margin: "5px",
};

const socialRow = {
  backgroundColor: "white",
  display: "flex",
  margin: "5px",
  width: "23rem",
  boxShadow: `
  0 2px 2px rgba(0, 0, 0, 0.31),
  inset 0 -4px 6px rgba(0, 0, 0, 0.31)
`,
  borderRadius: "2rem",
};

const socialItemsContainer = {
  margin: "auto",
  backgroundColor: "rgba(255,255,255,0.2)",
  width: "100%",
  height: "100%",
  borderRadius: "2rem",
};

const socialIconTextContainer = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginLeft: "1rem",
};
