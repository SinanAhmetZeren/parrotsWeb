import React, { useState, useRef, useCallback } from "react";
import parrotLogoHead from "../assets/images/ParrotLogoHead.png";
import parrotsIconPadded from "../assets/images/parrotsiconpaddedtransparent.png";
import parrotsRealLife from "../assets/images/parrotsreallife.jpg";

const PARROT_IMAGES = [
  new URL("../assets/game-parrots/benita5-parrot-2509677_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/bestrongenoughtoletgo-beautiful-macaw-4488679_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/bestrongenoughtoletgo-rare-parakeets-4462423_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/biobush-bird-3052985_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/christels-parrot-2796741_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/christels-parrot-2875363_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/couleur-parrot-3417217_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/couleur-parrot-3601194_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/davidclode-parrot-9295172_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/davidclode-parrot-9897724_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/jlkramer-cockatiel-4064348_1920_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/manfredrichter-bird-6955201_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/manfredrichter-lorikeet-6969471_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/rlleslie-parrot-7527071_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/tirriko-bird-3491624_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/yancabrera-bird-1823839_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/zaidoopro-parrot-6238905_small.jpg", import.meta.url).href,
  new URL("../assets/game-parrots/zsolt71-zoo-8378189_small.jpg", import.meta.url).href,
];

const MODES = {
  "4x4": { cols: 4, pairs: 8,  centerIdx: null },
  "5x5": { cols: 5, pairs: 12, centerIdx: 12   },
  "6x6": { cols: 6, pairs: 18, centerIdx: null  },
};

const CARD_SIZE = { "4x4": 110, "5x5": 96, "6x6": 80 };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(mode) {
  const { pairs, centerIdx } = MODES[mode];
  const imgs = shuffle([...PARROT_IMAGES]).slice(0, pairs);
  const cards = shuffle(
    imgs.flatMap((img, idx) => [
      { id: idx * 2,     imageIdx: idx, img },
      { id: idx * 2 + 1, imageIdx: idx, img },
    ])
  );
  if (centerIdx !== null) {
    cards.splice(centerIdx, 0, { id: -1, imageIdx: -1, isLogo: true });
  }
  return cards;
}

function CardTile({ card, isFlipped, isMatched, onPress, size }) {
  if (card.isLogo) {
    return (
      <div style={{ ...tileWrap(size), backgroundColor: "#1e3a5f", border: "1px solid #2d5a9e", borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={parrotsIconPadded} alt="" style={{ width: size, height: size, objectFit: "contain" }} />
      </div>
    );
  }

  const revealed = isFlipped || isMatched;

  return (
    <div style={{ ...tileWrap(size), perspective: 600, cursor: revealed ? "default" : "pointer" }} onClick={revealed ? undefined : onPress}>
      <div style={{
        width: "100%", height: "100%", position: "relative",
        transformStyle: "preserve-3d",
        transition: "transform 0.35s ease",
        transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Back */}
        <div style={{ ...face, backgroundColor: "#1e3a5f", border: "1px solid #2d5a9e", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={parrotLogoHead} alt="" style={{ width: size * 0.35, height: size * 0.35, objectFit: "contain" }} />
        </div>
        {/* Front */}
        <div style={{ ...face, transform: "rotateY(180deg)" }}>
          <img src={card.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );
}

export function ParrotMemoryGame({ onClose }) {
  const [mode, setMode] = useState(null);
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const flipTimer = useRef(null);
  const wonTimer = useRef(null);

  const startGame = (m) => {
    if (flipTimer.current) clearTimeout(flipTimer.current);
    if (wonTimer.current) clearTimeout(wonTimer.current);
    setMode(m);
    setDeck(buildDeck(m));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  const handlePress = useCallback((card) => {
    if (flipped.find(c => c.id === card.id) || matched.includes(card.imageIdx)) return;

    // 3rd card pressed while 2 mismatched are showing — clear immediately and flip the new card
    if (locked && flipTimer.current) {
      clearTimeout(flipTimer.current);
      flipTimer.current = null;
      setFlipped([card]);
      setLocked(false);
      return;
    }

    if (locked) return;

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      if (a.imageIdx === b.imageIdx) {
        const newMatched = [...matched, a.imageIdx];
        setMatched(newMatched);
        setFlipped([]);
        setLocked(false);
        if (newMatched.length === MODES[mode].pairs) {
          wonTimer.current = setTimeout(() => setWon(true), 5000);
        }
      } else {
        flipTimer.current = setTimeout(() => {
          setFlipped([]);
          setLocked(false);
          flipTimer.current = null;
        }, 1200);
      }
    }
  }, [flipped, matched, locked, mode]);

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>

        {/* Mode selector */}
        {!mode && (
          <>
            <button style={closeBtnStyle} onClick={onClose}>✕</button>
            <img src={parrotsRealLife} alt="Parrots" style={{ width: 150, height: 150, borderRadius: "50%", objectFit: "cover", marginBottom: "1rem", boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }} />
            <p style={tagline}>Match the parrots before your next voyage</p>
            <div style={{ display: "flex", flexDirection: "row", gap: 16, marginTop: "2rem", marginBottom: "2rem" }}>
              {["4x4", "5x5", "6x6"].map(m => (
                <button key={m} style={modeBtnStyle} onClick={() => startGame(m)}>
                  <span style={{ color: "white", fontSize: "1.4rem", fontWeight: "700", display: "block" }}>{m}</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: "600", display: "block", marginTop: 4 }}>
                    {m === "4x4" ? "8 pairs" : m === "5x5" ? "12 pairs" : "18 pairs"}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Won screen */}
        {won && (
          <>
            <button style={closeBtnStyle} onClick={onClose}>✕</button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem" }}>
              <span style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</span>
              <p style={{ color: "white", fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", textAlign: "center" }}>You matched all parrots!</p>
              <p style={{ color: "#94a3b8", fontSize: "1rem", fontWeight: "600", marginBottom: "2rem" }}>Completed in {moves} moves</p>
              <button style={primaryBtn} onClick={() => startGame(mode)}>Play Again</button>
              <button style={secondaryBtn} onClick={onClose}>Close</button>
            </div>
          </>
        )}

        {/* Game */}
        {mode && !won && (
          <>
            <button style={closeBtnStyle} onClick={onClose}>✕</button>
            <p style={tagline}>Match the parrots before your next voyage</p>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", marginBottom: "0.6rem", paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
              <span style={{ flex: 1, color: "#e2e8f0", fontSize: "1rem", fontWeight: "700" }}>Moves: {moves}</span>
              <span style={{ flex: 1, textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "600" }}>
                {matched.length}/{MODES[mode].pairs} matched
              </span>
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                <button style={restartBtnStyle} onClick={() => { if (flipTimer.current) clearTimeout(flipTimer.current); setMode(null); setWon(false); }}>Restart</button>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${MODES[mode].cols}, ${CARD_SIZE[mode]}px)`,
              gap: 4,
            }}>
              {deck.map(card => (
                <CardTile
                  key={card.id}
                  card={card}
                  isFlipped={!!flipped.find(c => c.id === card.id)}
                  isMatched={matched.includes(card.imageIdx)}
                  onPress={() => handlePress(card)}
                  size={CARD_SIZE[mode]}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function tileWrap(size) {
  return { width: size, height: size, borderRadius: 8, flexShrink: 0 };
}

const face = {
  position: "absolute", inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  borderRadius: 6, overflow: "hidden",
};


const overlay = {
  position: "fixed", inset: 0,
  backgroundColor: "rgba(0,0,0,0.8)",
  zIndex: 9999,
  display: "flex", alignItems: "center", justifyContent: "center",
};

const modal = {
  backgroundColor: "#0f172a",
  borderRadius: 16,
  padding: "1.5rem",
  position: "relative",
  maxHeight: "95vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
};

const closeBtnStyle = {
  position: "absolute", top: 12, right: 12,
  backgroundColor: "#334155", border: "none",
  color: "white", borderRadius: 8,
  padding: "6px 12px", cursor: "pointer",
  fontSize: "0.9rem", fontWeight: "700", zIndex: 1,
};

const tagline = {
  color: "#ffffff", fontSize: "1rem",
  letterSpacing: "0.025em", textAlign: "center",
  fontWeight: "600", margin: "0.5rem 0 0",
};

const modeBtnStyle = {
  backgroundColor: "#1e3a5f",
  border: "1px solid #2d5a9e",
  borderRadius: 14,
  padding: "20px 24px",
  cursor: "pointer",
  textAlign: "center",
};

const restartBtnStyle = {
  backgroundColor: "#1e40af", border: "none",
  color: "white", borderRadius: 8,
  padding: "6px 14px", cursor: "pointer",
  fontSize: "0.85rem", fontWeight: "700",
};

const primaryBtn = {
  width: "80%", padding: "14px 0",
  backgroundColor: "#1e40af", border: "none",
  borderRadius: 12, color: "white",
  fontSize: "1rem", fontWeight: "700",
  cursor: "pointer", marginBottom: 12,
};

const secondaryBtn = {
  width: "80%", padding: "14px 0",
  backgroundColor: "#e2e8f0", border: "none",
  borderRadius: 12, color: "#334155",
  fontSize: "1rem", fontWeight: "700",
  cursor: "pointer",
};
