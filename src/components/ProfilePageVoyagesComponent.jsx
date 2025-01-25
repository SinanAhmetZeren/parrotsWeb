import { ProfilePageVoyageCard } from './ProfilePageVoyageCard';

const apiUrl = process.env.REACT_APP_API_URL;
const voyageBaseUrl = `${apiUrl}/Uploads/VoyageImages/`;


export function ProfilePageVoyagesComponent({ userData }) {
  console.log("ProfilePageVoyagesComponent userdata: ", userData);
  return (userData.usersVoyages.map((voyage, index) => {
    return (
      <ProfilePageVoyageCard key={index} index={index} voyage={voyage} />
    )
  }))
}

/*
const ProfilePageVoyageCard1 = ({ index, voyage }) => {
  if (index == 0) {
    console.log("voyage: ", voyage);
    console.log("brief: ", voyage.brief);
    console.log("vehicle", voyage.vehicleName)
    console.log("name", voyage.name);
    console.log("start", voyage.startDate);
    console.log("end", voyage.endDate);
    console.log("vacancy", voyage.vacancy);
  }

  //<img src={voyageBaseUrl + voyage?.profileImage} className="profilePage_VoyageCard_Img" alt="b" />


  return (
    <div key={index} >
      <div >
      </div>

    </div>
  )
}
  */