import { ProfilePageVoyageCard } from './ProfilePageVoyageCard';

export function ProfilePageVoyagesComponent({ userData, isDarkMode }) {
  return (userData.usersVoyages.filter(voyage => !voyage.isPlace).map((voyage, index) => {
    return (
      <div key={index} style={{ position: "relative" }}>
        <ProfilePageVoyageCard index={index} voyage={voyage} isDarkMode={isDarkMode} />
      </div>
    )
  }))
}