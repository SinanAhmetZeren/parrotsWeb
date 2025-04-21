import { ProfilePageVoyageCard } from './ProfilePageVoyageCard';

const apiUrl = process.env.REACT_APP_API_URL;


export function ProfilePageVoyagesComponent({ userData }) {
  return (userData.usersVoyages.map((voyage, index) => {
    return (
      <ProfilePageVoyageCard key={index} index={index} voyage={voyage} />
    )
  }))
}