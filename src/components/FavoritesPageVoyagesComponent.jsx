import { FavoritesPageVoyagesCard } from './FavoritesPageVoyageCard';

export function FavoritesPageVoyagesComponent({ FavoriteVoyages, isDarkMode }) {
  return (FavoriteVoyages.map((voyage, index) => {
    return (
      <div key={index} style={{ position: "relative" }}>
        <FavoritesPageVoyagesCard index={index} voyage={voyage} isDarkMode={isDarkMode} />
      </div>

    )
  }))
}