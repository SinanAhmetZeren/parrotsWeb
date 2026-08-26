import React, { useState } from "react";

const BUCKET_URL = "https://parrotsstorage.nbg1.your-objectstorage.com/ParrotsProjectImages";

const IMAGE_FILES = [
  "0-title-persona-journeys.jpg",
  "00_use-cases-and-pain-points.jpg",
  "1_boat-or-vehicle-owner-rent-out-vehicle.jpg",
  "2_boat-broker-rent-captains-boats-commissions.jpg",
  "3_car-enthusiast-showcase-car-to-friends.jpg",
  "4_visiting-tourist-find-nearby-tours.jpg",
  "5_group-of-friends-attend-tour-guide-event.jpg",
  "6_social-good-organizer-raise-money-fundraiser.jpg",
  "7_motorcycle-club-wild-west-tour.jpg",
  "8_restaurant-owner-advertise-to-tourists.jpg",
  "9_university-student-cross-college-formal-hall-hopping.jpg",
  "A1_core-idea-organizer-sets-voyage-people-bid.jpg",
  "A2_why-no-commission-no-commissions-on-accepted-bids.jpg",
];

export function ParrotsImages() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "white", marginBottom: "1.5rem" }}>Parrots Project Images</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {IMAGE_FILES.map((key) => (
          <img
            key={key}
            src={`${BUCKET_URL}/${key}`}
            alt={key}
            title={key}
            onClick={() => setSelected(`${BUCKET_URL}/${key}`)}
            style={{
              width: "280px",
              height: "160px",
              objectFit: "cover",
              borderRadius: "10px",
              cursor: "pointer",
              border: "2px solid rgba(255,255,255,0.1)",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        ))}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, cursor: "pointer",
          }}
        >
          <img
            src={selected}
            alt="preview"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "12px" }}
          />
        </div>
      )}
    </div>
  );
}
