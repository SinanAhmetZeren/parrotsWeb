import { ProfilePageVehicleCard } from './ProfilePageVehicleCard';

export function ProfilePageVehiclesComponent({ userData, userFavoriteVehicles, isDarkMode }) {
  return (userData.usersVehicles.map((vehicle, index) => {
    return (
      <ProfilePageVehicleCard
        key={index}
        index={index}
        vehicle={vehicle}
        userFavoriteVehicles={userFavoriteVehicles}
        isDarkMode={isDarkMode} />
    )
  }))
}

