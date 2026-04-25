import { FavoritesPageVehicleCard } from './FavoritesPageVehicleCard';

export function FavoritesPageVehiclesComponent({ FavoriteVehiclesData, isDarkMode }) {
  return (FavoriteVehiclesData.map((vehicle, index) => {
    return (
      <div key={index}>
        <FavoritesPageVehicleCard index={index} vehicle={vehicle} isDarkMode={isDarkMode} />
      </div>
    )
  }))
}

