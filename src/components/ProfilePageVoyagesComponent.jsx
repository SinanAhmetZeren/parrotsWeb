import { ProfilePageVoyageCard } from './ProfilePageVoyageCard';

export function ProfilePageVoyagesComponent({ userData }) {
  return (userData.usersVoyages.map((voyage, index) => {
    return (
      <ProfilePageVoyageCard key={index} index={index} voyage={voyage} />
    )
  }))
}