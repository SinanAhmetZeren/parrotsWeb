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