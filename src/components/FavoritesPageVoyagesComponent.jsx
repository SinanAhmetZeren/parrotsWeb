import { ProfilePageVoyageCard } from './ProfilePageVoyageCard';

export function FavoritesPageVoyagesComponent({ FavoriteVoyages }) {
  return (FavoriteVoyages.map((voyage, index) => {
    return (
      <ProfilePageVoyageCard key={index} index={index} voyage={voyage} />
    )
  }))
}