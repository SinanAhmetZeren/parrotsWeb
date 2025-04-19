import { FavoritesPageVehicleCard } from './FavoritesPageVehicleCard';

export function FavoritesPageVehiclesComponent({ FavoriteVehiclesData }) {
  return (FavoriteVehiclesData.map((vehicle, index) => {
    return (
      <div>
        <FavoritesPageVehicleCard key={index} index={index} vehicle={vehicle} />
      </div>
    )
  }))
}

