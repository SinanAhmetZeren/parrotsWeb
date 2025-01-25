import { ProfilePageVehicleCard } from './ProfilePageVehicleCard';

const apiUrl = process.env.REACT_APP_API_URL;
const voyageBaseUrl = `${apiUrl}/Uploads/VoyageImages/`;


export function ProfilePageVehiclesComponent({ userData }) {
  console.log("ProfilePageVoyagesComponent userdata: ", userData);
  return (userData.usersVehicles.map((vehicle, index) => {
    return (
      <ProfilePageVehicleCard key={index} index={index} vehicle={vehicle} />
    )
  }))
}

