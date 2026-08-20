/* eslint-disable no-undef */
import React from "react";
import parrotCracker from "../assets/images/parrotCracker.png";
import jarImg from "../assets/images/jar.png";
import { parrotCaravanOrangeRed, parrotGreen } from "../styles/colors";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";

const PURCHASE_OPTIONS = [
  { crackers: 100, priceEUR: 2.99, label: "Nest Pack", color: "#4a90d9" },
  { crackers: 250, priceEUR: 5.99, label: "Flock Pack", color: "#4caf87" },
  { crackers: 500, priceEUR: 9.99, label: "Colony Pack", color: "#e8874a" },
];

export function ParrotCrackerPageMobileView({
  isDark, currentBalance, purchases, transactions,
  processingIndex, isProcessingFree, showClaimModal, displayState,
  setDisplayState, setShowClaimModal, handleClaimFree, handleBuy,
}) {
  const cardBg = "white";
  const textPrimary = "#0d1f35";
  const textSecondary = "#6b7f96";
  const shadow = "0 2px 16px rgba(13,31,53,0.10)";
  const divider = "#e0d9ce";

  return (
    <div style={{ width: "100%", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* BALANCE CARD */}
      <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "2rem 1.5rem", boxShadow: shadow, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <span style={{ fontSize: "4rem", fontWeight: 800, color: textPrimary, textAlign: "center" }}>ParrotCracker Balance</span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ flex: 2, display: "flex", justifyContent: "flex-end", paddingRight: "2rem" }}>
            <img src={jarImg} alt="jar" style={{ width: "10rem", height: "10rem", objectFit: "contain" }} />
          </div>
          <div style={{ flex: 3, display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "4rem", fontWeight: 800, color: textPrimary }}>You have</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "6rem", fontWeight: 900, color: parrotGreen, lineHeight: 1, WebkitTextStroke: "5px " + parrotGreen }}>{currentBalance}</span>
              <img src={parrotCracker} alt="cracker" style={{ width: "4rem", height: "4rem" }} />
            </div>
          </div>
        </div>
      </div>

      {/* PRICING CARDS */}
      {PURCHASE_OPTIONS.map((opt, i) => (
        <div
          key={i}
          onClick={() => handleBuy(opt, i)}
          style={{
            backgroundColor: cardBg, borderRadius: "1rem", padding: "1.25rem 3rem",
            boxShadow: `0 0 0 4px ${opt.color}, ${shadow}`,
            cursor: "pointer", transition: "transform 0.15s ease",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
          }}
        >
          <div style={{ fontSize: "2rem", fontWeight: 800, color: opt.color, letterSpacing: "0.1em", width: "18rem", flexShrink: 0 }}>{opt.label.toUpperCase()}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "12rem", justifyContent: "center", flexShrink: 0 }}>
            <img src={parrotCracker} alt="cracker" style={{ width: "3rem", height: "3rem" }} />
            <span style={{ fontSize: "4rem", fontWeight: 900, color: textPrimary, WebkitTextStroke: "2px " + textPrimary }}>{opt.crackers}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem", width: "12rem", flexShrink: 0 }}>
            <div style={{ display: "inline-block", backgroundColor: opt.color + "1a", borderRadius: "999px", padding: "0.3rem 1.25rem", fontSize: "2.2rem", fontWeight: 800, color: opt.color }}>
              €{opt.priceEUR.toFixed(2)}
            </div>
            {processingIndex === i && (
              <div className="spinner" style={{ height: "1.5rem", width: "1.5rem", border: "3px solid rgba(0,0,0,0.1)", borderTop: `3px solid ${parrotCaravanOrangeRed}` }} />
            )}
          </div>
        </div>
      ))}

      {/* INFO CARD */}
      <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "1.5rem", boxShadow: shadow }}>
        <div style={{
          fontSize: "3rem", fontWeight: 800, color: textPrimary, marginBottom: "0.5rem",
          marginTop: "2rem", textAlign: "left", marginLeft: "2rem"
        }}>Feed the Parrots, Chart Your Course.</div>
        <div style={{
          fontSize: "2.5rem", fontWeight: 500, color: textSecondary,
          marginBottom: "1.25rem", textAlign: "left", marginLeft: "2rem"
        }}>Drop a cracker to keep your voyage live on the community map, or get instant travel insights for any location and its surrounding area.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginLeft: "2rem", marginTop: "4rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <div style={{ width: "3rem", flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: "0.1rem" }}>
              <FaMapMarkerAlt size={32} color={parrotGreen} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginLeft: "2rem" }}>
              <div style={{ fontWeight: 800, color: textPrimary, fontSize: "3rem", textAlign: "left" }}>Feature Your Voyage</div>
              <div style={{ fontWeight: 500, color: textSecondary, fontSize: "2.5rem" }}>Put your journey on the public map</div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600, color: textSecondary,
                fontSize: "2.5rem"
              }}>
                1 <img src={parrotCracker} alt="cracker" style={{ width: "1rem", height: "1rem" }} /> / day
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${divider}` }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <div style={{ width: "3rem", flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: "0.1rem" }}>
              <BsChatDotsFill size={32} color={parrotGreen} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginLeft: "2rem" }}>
              <div style={{ fontWeight: 800, color: textPrimary, fontSize: "3rem", textAlign: "left" }}>Ask Parrots</div>
              <div style={{ fontWeight: 500, color: textSecondary, fontSize: "2.5rem" }}>Get tips for any location and nearby spots</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600, color: textSecondary, fontSize: "2.5rem" }}>
                1 <img src={parrotCracker} alt="cracker" style={{ width: "1rem", height: "1rem" }} /> / query
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HISTORY */}
      <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "1.5rem", boxShadow: shadow }}>
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", borderBottom: `1px solid ${divider}` }}>
          {["purchases", "transactions"].map((tab) => (
            <button key={tab} onClick={() => setDisplayState(tab)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "2rem", color: displayState === tab ? textPrimary : textSecondary, paddingBottom: "0.5rem", borderBottom: displayState === tab ? `2px solid ${parrotGreen}` : "2px solid transparent", marginBottom: "-2px" }}>
              {tab === "purchases" ? "Purchase History" : "ParrotCracker Log"}
            </button>
          ))}
        </div>
        <div style={{ overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: displayState === "purchases" ? "1fr 1fr 1fr 1fr" : "1fr 2fr 1fr", padding: "0.5rem 0", marginBottom: "0.25rem", position: "sticky", top: 0, backgroundColor: cardBg, zIndex: 1 }}>
            {(displayState === "purchases" ? ["CRACKERS", "PAID", "DATE", "STATUS"] : ["CRACKERS", "DESCRIPTION", "DATE"]).map((h, idx) => (
              <span key={h} style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "0.08em", color: textSecondary, paddingLeft: "0.75rem", borderLeft: idx > 0 ? `1px solid ${divider}` : "none" }}>{h}</span>
            ))}
          </div>
          {displayState === "purchases" ? (
            purchases.length > 0 ? purchases.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "0.75rem 0", borderTop: `1px solid #f0ebe0`, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", paddingLeft: "0.75rem" }}>
                  <img src={parrotCracker} alt="cracker" style={{ width: "1rem", height: "1rem" }} />
                  <span style={{ fontWeight: 700, fontSize: "1.8rem", color: textPrimary }}>{p.crackersAmount.toLocaleString()}</span>
                </div>
                <span style={{ fontWeight: 600, fontSize: "1.8rem", color: p.eurAmount === 0 ? parrotGreen : "#c8a84b", paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{p.eurAmount === 0 ? "Free" : `€${p.eurAmount.toFixed(2)}`}</span>
                <span style={{ fontWeight: 600, fontSize: "1.8rem", color: textSecondary, paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                <span style={{ fontWeight: 700, fontSize: "1.8rem", color: p.status === "completed" ? parrotGreen : "#c8a84b", paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
              </div>
            )) : <div style={{ color: textSecondary, padding: "1rem 0", fontSize: "1.8rem" }}>No purchases yet.</div>
          ) : (
            transactions.length > 0 ? transactions.map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", padding: "0.75rem 0", borderTop: `1px solid #f0ebe0`, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", paddingLeft: "0.75rem" }}>
                  <img src={parrotCracker} alt="cracker" style={{ width: "1rem", height: "1rem" }} />
                  <span style={{ fontWeight: 700, fontSize: "1.8rem", color: textPrimary }}>{t.crackersAmount.toLocaleString()}</span>
                </div>
                <span style={{ fontWeight: 600, fontSize: "1.8rem", color: textSecondary, paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{t.description}</span>
                <span style={{ fontWeight: 600, fontSize: "1.8rem", color: textSecondary, paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
            )) : <div style={{ color: textSecondary, padding: "1rem 0", fontSize: "1.8rem" }}>No transactions yet.</div>
          )}
        </div>
      </div>

    </div>
  );
}
