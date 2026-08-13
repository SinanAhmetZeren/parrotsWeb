/* eslint-disable no-undef */
import React from "react";
import parrotCracker from "../assets/images/parrotCookie.png";
import { parrotCaravanOrangeRed, parrotGreen } from "../styles/colors";

const PURCHASE_OPTIONS = [
  { coins: 100, priceEUR: 2.99, label: "NEST PACK" },
  { coins: 250, priceEUR: 5.99, label: "FLOCK PACK", best: true },
  { coins: 500, priceEUR: 9.99, label: "COLONY PACK" },
];

const WHAT_CRACKERS_FEED = [
  { action: "Ask Parrots for a voyage advice", cost: 1 },
  { action: "Feature your voyage on the public map (per day)", cost: 1 },
];

export function ParrotCoinPageMobileView({
  isDark, currentBalance, purchases, transactions,
  processingIndex, isProcessingFree, showClaimModal, displayState,
  setDisplayState, setShowClaimModal, handleClaimFree, handleBuy,
}) {
  const cardBg = isDark ? "#011a32" : "white";
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#003366";
  const textSecondary = isDark ? "rgba(255,255,255,0.55)" : "#888";
  const shadow = isDark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.08)";
  const divider = isDark ? "rgba(255,255,255,0.1)" : "#e0d9ce";

  return (
    <div style={{ width: "100%", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* BALANCE CARD */}
      <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "2rem 1.5rem", boxShadow: shadow, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: "2rem", fontWeight: 800, color: parrotGreen, marginBottom: "1rem" }}>You have</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <img src={parrotCracker} alt="cracker" style={{ width: "6rem", height: "6rem" }} />
          <span style={{ fontSize: "6rem", fontWeight: 900, color: textPrimary, lineHeight: 1 }}>{currentBalance}</span>
        </div>
        <p style={{ fontSize: "2rem", fontWeight: 800, color: parrotGreen, marginBottom: "1.5rem" }}>ParrotCrackers in your jar</p>
        <button
          onClick={() => setShowClaimModal(true)}
          style={{ backgroundColor: parrotCaravanOrangeRed, color: "white", fontWeight: 700, fontSize: "2rem", border: "none", borderRadius: "999rem", padding: "0.9rem 2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem" }}
        >
          <img src={parrotCracker} alt="cracker" style={{ width: "3rem", height: "3rem" }} />
          Get Free ParrotCrackers
        </button>
      </div>

      {/* PRICING CARDS */}
      {PURCHASE_OPTIONS.map((opt, i) => (
        <div
          key={i}
          onClick={() => handleBuy(opt, i)}
          style={{ backgroundColor: cardBg, borderRadius: "1rem", padding: "2rem 1.5rem", boxShadow: opt.best ? `0 0 0 2px #c8a84b, ${shadow}` : shadow, textAlign: "center", position: "relative", opacity: 1, cursor: "pointer" }}
        >
          <div style={{ fontSize: "2rem", fontWeight: 800, color: opt.best ? "#c8a84b" : textSecondary, letterSpacing: "0.1em", marginBottom: "0.75rem" }}>{opt.label}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <img src={parrotCracker} alt="cracker" style={{ width: "4rem", height: "4rem" }} />
            <span style={{ fontSize: "4rem", fontWeight: 900, color: textPrimary }}>{opt.coins}</span>
          </div>
          <div style={{ fontSize: "2rem", color: textSecondary, fontWeight: 600 }}>€{opt.priceEUR.toFixed(2)}</div>
          {processingIndex === i && (
            <div style={{ marginTop: "1rem" }}>
              <div className="spinner" style={{ height: "2rem", width: "2rem", margin: "auto", border: "4px solid rgba(0,0,0,0.1)", borderTop: `4px solid ${parrotCaravanOrangeRed}` }} />
            </div>
          )}
        </div>
      ))}

      {/* WHAT CRACKERS FEED */}
      <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "1.5rem", boxShadow: shadow }}>
        <div style={{ fontSize: "2rem", fontWeight: 800, color: textPrimary, marginBottom: "0.75rem" }}>Feed the Parrots, Chart Your Course.</div>
        <div style={{ fontSize: "1.6rem", fontWeight: 600, color: textSecondary, marginBottom: "1.25rem" }}>Drop a cracker to keep your voyage live on the community map and get instant travel insights for any location and its surrounding area.</div>
        {WHAT_CRACKERS_FEED.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", borderBottom: i < WHAT_CRACKERS_FEED.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f0ebe0"}` : "none" }}>
            <span style={{ fontWeight: 600, color: textPrimary, fontSize: "2rem", flex: 1, paddingRight: "1rem" }}>{item.action}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <img src={parrotCracker} alt="cracker" style={{ width: "3rem", height: "3rem" }} />
              <span style={{ fontWeight: 800, color: "#c8a84b", fontSize: "2rem" }}>{item.cost}</span>
            </div>
          </div>
        ))}
      </div>

      {/* HISTORY */}
      <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "1.5rem", boxShadow: shadow }}>
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e8e2d8"}` }}>
          {["purchases", "transactions"].map((tab) => (
            <button key={tab} onClick={() => setDisplayState(tab)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "2rem", color: displayState === tab ? textPrimary : textSecondary, paddingBottom: "0.5rem", borderBottom: displayState === tab ? `2px solid ${parrotGreen}` : "2px solid transparent", marginBottom: "-2px" }}>
              {tab === "purchases" ? "Purchase History" : "ParrotCracker Log"}
            </button>
          ))}
        </div>
        <div style={{ overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: displayState === "purchases" ? "1fr 1fr 1fr 1fr" : "1fr 2fr 1fr", padding: "0.5rem 0", marginBottom: "0.25rem", position: "sticky", top: 0, backgroundColor: cardBg, zIndex: 1 }}>
            {(displayState === "purchases" ? ["CRACKERS", "PAID", "DATE", "STATUS"] : ["CRACKERS", "DESCRIPTION", "DATE"]).map((h, idx) => (
              <span key={h} style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "0.06em", color: textSecondary, paddingLeft: "0.75rem", borderLeft: idx > 0 ? `1px solid ${divider}` : "none" }}>{h}</span>
            ))}
          </div>
          {displayState === "purchases" ? (
            purchases.length > 0 ? purchases.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "1rem 0", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f0ebe0"}`, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", paddingLeft: "0.75rem" }}>
                  <img src={parrotCracker} alt="cracker" style={{ width: "2.5rem", height: "2.5rem" }} />
                  <span style={{ fontWeight: 700, fontSize: "2rem", color: textPrimary }}>{p.coinsAmount.toLocaleString()}</span>
                </div>
                <span style={{ fontWeight: 600, fontSize: "2rem", color: p.eurAmount === 0 ? parrotGreen : "#c8a84b", paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{p.eurAmount === 0 ? "Free" : `€${p.eurAmount.toFixed(2)}`}</span>
                <span style={{ fontWeight: 600, fontSize: "2rem", color: textSecondary, paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                <span style={{ fontWeight: 700, fontSize: "2rem", color: p.status === "completed" ? parrotGreen : "#c8a84b", paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
              </div>
            )) : <div style={{ color: textSecondary, padding: "1rem 0", fontSize: "2rem" }}>No purchases yet.</div>
          ) : (
            transactions.length > 0 ? transactions.map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", padding: "1rem 0", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f0ebe0"}`, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", paddingLeft: "0.75rem" }}>
                  <img src={parrotCracker} alt="cracker" style={{ width: "2.5rem", height: "2.5rem" }} />
                  <span style={{ fontWeight: 700, fontSize: "2rem", color: textPrimary }}>{t.coinsAmount.toLocaleString()}</span>
                </div>
                <span style={{ fontWeight: 600, fontSize: "2rem", color: textSecondary, paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{t.description}</span>
                <span style={{ fontWeight: 600, fontSize: "2rem", color: textSecondary, paddingLeft: "0.75rem", borderLeft: `1px solid ${divider}` }}>{new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
            )) : <div style={{ color: textSecondary, padding: "1rem 0", fontSize: "2rem" }}>No transactions yet.</div>
          )}
        </div>
      </div>

      {/* CLAIM MODAL */}
      {showClaimModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "2rem", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            <img src={parrotCracker} alt="cracker" style={{ width: "6rem", height: "6rem" }} />
            <span style={{ color: textPrimary, fontSize: "2rem", fontWeight: 800, textAlign: "center" }}>100 ParrotCrackers</span>
            <span style={{ color: textSecondary, fontSize: "2rem", textAlign: "center" }}>
              {currentBalance >= 200 ? "Your balance is too high to claim free ParrotCrackers. Spend some first!" : "Claim 100 free ParrotCrackers to get started."}
            </span>
            <button
              disabled={currentBalance >= 200 || isProcessingFree}
              onClick={handleClaimFree}
              style={{ backgroundColor: currentBalance >= 200 || isProcessingFree ? "#ccc" : parrotCaravanOrangeRed, color: "white", fontWeight: 700, fontSize: "2rem", border: "none", borderRadius: "999rem", padding: "0.9rem 2rem", cursor: currentBalance >= 200 ? "not-allowed" : "pointer", width: "100%" }}
            >
              {isProcessingFree ? <div className="spinner" style={{ height: "2rem", width: "2rem", margin: "auto", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white" }} /> : "Claim"}
            </button>
            <button onClick={() => setShowClaimModal(false)} style={{ background: "none", border: "none", color: textSecondary, cursor: "pointer", fontSize: "2rem" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
