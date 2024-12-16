const styles = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [
      { visibility: "simplified" }, // Simplify the map view
    ],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      { visibility: "off" }, // Hide POIs labels
    ],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative",
    stylers: [{ visibility: "off" }],
  },
];

export const MainPageMapStyles = {
  styles: styles,
  clickableIcons: false, // Corrected to boolean false
};
