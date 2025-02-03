import { FavoritesPageVehicleCard } from './FavoritesPageVehicleCard';

export function FavoritesPageVehiclesComponent({ FavoriteVehiclesData }) {
  return (FavoriteVehiclesData.map((vehicle, index) => {
    return (
      <FavoritesPageVehicleCard key={index} index={index} vehicle={vehicle} />
    )
  }))
}

