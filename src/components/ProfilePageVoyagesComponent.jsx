const apiUrl = process.env.REACT_APP_API_URL;
const voyageBaseUrl = `${apiUrl}/Uploads/VoyageImages/`;


export function ProfilePageVoyagesComponent({ userData }) {
  console.log(userData);
  return (userData.usersVoyages.map((voyage, index) => {
    return (
      <ProfilePageVoyageCard index={index} voyage={voyage} />
    )
  }))
}


const ProfilePageVoyageCard = ({ index, voyage }) => {
  if (index == 0) {
    console.log("voyage: ", voyage);
    console.log("brief: ", voyage.brief);
    console.log("vehicle", voyage.vehicleName)
    console.log("name", voyage.name);
    console.log("start", voyage.startDate);
    console.log("end", voyage.endDate);
    console.log("vacancy", voyage.vacancy);
  }
  return (
    <div key={index} className="flex flex-col profilePage_VoyageCard">
      <div className="flex profilePage_VoyageCard_ImgContainer">
        <img src={voyageBaseUrl + voyage?.profileImage} className="profilePage_VoyageCard_Img" alt="b" />
      </div>
      <div className="flex profilePage_VoyageCard_Title">
        <span className="profilePage_VoyageCard_Title">{voyage.voyageTitle}</span>
      </div>
      <div className="flex profilePage_VoyageCard_Description">
        <span className="profilePage_VoyageCard_Description">{voyage.voyageDescription}</span>
      </div>
      <div className="flex profilePage_VoyageCard_Date">
        <span className="profilePage_VoyageCard_Date">{voyage.voyageDate}</span>
      </div>
    </div>
  )
}