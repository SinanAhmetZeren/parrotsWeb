import { ProfilePageVehicleCard } from './ProfilePageVehicleCard';

export function ProfilePageVehiclesComponent({ userData }) {
  return (userData.usersVehicles.map((vehicle, index) => {
    return (
      <ProfilePageVehicleCard key={index} index={index} vehicle={vehicle} />
    )
  }))
}

