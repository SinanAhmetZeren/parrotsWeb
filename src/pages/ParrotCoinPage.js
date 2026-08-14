/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useSelector } from "react-redux";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import parrotCracker from "../assets/images/parrotCookie.png";
import jarImg from "../assets/images/jar.png";
import {
  useLazyGetParrotCoinBalanceQuery,
  useClaimFreeCoinsMutation
} from "../slices/UserSlice";
import { openCheckout, PADDLE_PRICE_IDS } from "../components/PaddleCheckout";
import { parrotCaravanOrangeRed, parrotDarkBlue, parrotGreen } from "../styles/colors";
import { toast } from "react-toastify";
import { ParrotCoinPageMobileView } from "./ParrotCoinPageMobileView";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";

const PURCHASE_OPTIONS = [
  { coins: 100, priceEUR: 2.99, label: "Nest Pack",   color: "#4a90d9" },
  { coins: 250, priceEUR: 5.99, label: "Flock Pack",  color: "#4caf87" },
  { coins: 500, priceEUR: 9.99, label: "Colony Pack", color: "#e8874a" },
];

const WHAT_CRACKERS_FEED = [
  { action: "Ask Parrots for a voyage advice", cost: 1 },
  { action: "Feature your voyage on the public map (per day)", cost: 1 },
];

export function ParrotCoinPage() {
  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const isDark = useSelector((state) => state.users.isDarkMode);
  const navigate = useNavigate();
  const [claimFreeCoins] = useClaimFreeCoinsMutation();
  const [getParrotCoinBalance] = useLazyGetParrotCoinBalanceQuery();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [processingIndex, setProcessingIndex] = useState(null);
  const [isProcessingFree, setIsProcessingFree] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [displayState, setDisplayState] = useState("purchases");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [purchaseBanner, setPurchaseBanner] = useState(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const bg = "transparent";
  const cardBg = "white";
  const textPrimary = "#0d1f35";
  const textSecondary = "#6b7f96";
  const shadow = "0 2px 16px rgba(13,31,53,0.10)";

  useEffect(() => {
    if (userId) {
      getParrotCoinBalance(userId).unwrap().then((response) => {
        setCurrentBalance(response.balance);
        setPurchases(response.purchases);
        setTransactions(response.transactions);
      }).catch(console.error);
    }
  }, [userId, getParrotCoinBalance]);

  const handlePaymentSuccess = async (opt) => {
    setTimeout(async () => {
      const response = await getParrotCoinBalance(userId).unwrap();
      setCurrentBalance(response.balance);
      setPurchases(response.purchases);
      setTransactions(response.transactions);
      setPurchaseBanner({ label: opt.label, coins: opt.coins });
    }, 3000);
  };

  const handleBuy = async (opt, i) => {
    setProcessingIndex(i);
    try {
      await openCheckout(PADDLE_PRICE_IDS[opt.label], userId, () => handlePaymentSuccess(opt));
    } finally {
      setProcessingIndex(null);
    }
  };

  const handleClaimFree = async () => {
    if (isProcessingFree) return;
    if (currentBalance >= 200) {
      toast.info("Your balance is too high to claim free ParrotCrackers.");
      return;
    }
    setIsProcessingFree(true);
    try {
      await claimFreeCoins().unwrap();
      const response = await getParrotCoinBalance(userId).unwrap();
      setCurrentBalance(response.balance);
      setPurchases(response.purchases);
      setTransactions(response.transactions);
      setShowClaimModal(false);
      toast.success("100 ParrotCrackers added to your balance!");
    } catch {
      toast.error("Could not claim ParrotCrackers. Please try again.");
    } finally {
      setIsProcessingFree(false);
    }
  };

  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex mainpage_Container" style={{ backgroundColor: bg }}>
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>

          {isMobile ? (
            <ParrotCoinPageMobileView
              isDark={isDark}
              currentBalance={currentBalance}
              purchases={purchases}
              transactions={transactions}
              processingIndex={processingIndex}
              isProcessingFree={isProcessingFree}
              showClaimModal={showClaimModal}
              displayState={displayState}
              setDisplayState={setDisplayState}
              setShowClaimModal={setShowClaimModal}
              handleClaimFree={handleClaimFree}
              handleBuy={handleBuy}
            />
          ) : (
            <div style={{ width: "100%", maxWidth: "70rem", margin: "0 auto", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* ROW 1: 2 columns */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr", gap: "1rem", alignItems: "stretch" }}>

                {/* LEFT COLUMN: BANNER + HEADER CARD */}
                <div style={{ display: "flex", flexDirection: "column", borderRadius: "1.25rem", boxShadow: shadow, overflow: "hidden" }}>
                  {purchaseBanner && (
                    <div style={{ backgroundColor: "#4caf87", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ color: "white", fontWeight: 900, fontSize: "1rem" }}>✓</span>
                        </div>
                        <div>
                          <div style={{ color: "white", fontWeight: 800, fontSize: "0.95rem" }}>Purchase complete!</div>
                          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem" }}>{purchaseBanner.label.charAt(0) + purchaseBanner.label.slice(1).toLowerCase()} — {purchaseBanner.coins} crackers added</div>
                        </div>
                      </div>
                      <button onClick={() => setPurchaseBanner(null)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.1rem", fontWeight: 700, opacity: 0.7, lineHeight: 1 }}>✕</button>
                    </div>
                  )}

                  {/* HEADER CARD */}
                  <div style={{ backgroundColor: cardBg, padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", justifyContent: "space-evenly", flex: 1, boxSizing: "border-box" }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: textPrimary }}>ParrotCracker Balance</span>
                    <img src={jarImg} alt="jar" style={{ width: "9rem", height: "9rem", objectFit: "contain" }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                      <span style={{ fontSize: "1.5rem", fontWeight: 800, color: textPrimary }}>You have</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "3.6rem", fontWeight: 900, color: parrotGreen, lineHeight: 1, WebkitTextStroke: "2px " + parrotGreen }}>{currentBalance}</span>
                        <img src={parrotCracker} alt="cracker" style={{ width: "3rem", height: "3rem" }} />
                      </div>
                    </div>
                    {/* <button
                    onClick={() => setShowClaimModal(true)}
                    style={{ backgroundColor: parrotCaravanOrangeRed, color: "white", fontWeight: 700, fontSize: "1rem", border: "none", borderRadius: "999rem", padding: "0.75rem 2rem", cursor: "pointer" }}
                  >
                    Get Free ParrotCrackers
                  </button> */}
                  </div>{/* end HEADER CARD */}
                </div>{/* end LEFT COLUMN */}

                {/* RIGHT COLUMN: WHAT CRACKERS FEED */}
                <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "1.5rem 2rem", boxShadow: shadow, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: textPrimary, marginBottom: "0.5rem" }}>Feed the Parrots, Chart Your Course.</div>
                  <div style={{ fontSize: "1rem", fontWeight: 500, color: textSecondary, marginBottom: "1.5rem" }}>Drop a cracker to keep your voyage live on the community map and get instant travel insights for any location and its surrounding area.</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingLeft: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <div style={{ width: "2rem", flexShrink: 0, display: "flex", justifyContent: "center" }}>
                        <FaMapMarkerAlt size={22} color={parrotGreen} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <div style={{ fontWeight: 800, color: textPrimary, fontSize: "1.1rem" }}>Feature Your Voyage</div>
                        <div style={{ fontWeight: 500, color: textSecondary, fontSize: "0.95rem" }}>Put your journey on the public map</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600, color: textSecondary, fontSize: "0.95rem" }}>
                          1 <img src={parrotCracker} alt="cracker" style={{ width: "1rem", height: "1rem" }} /> / day
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <div style={{ width: "2rem", flexShrink: 0, display: "flex", justifyContent: "center" }}>
                        <BsChatDotsFill size={22} color={parrotGreen} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <div style={{ fontWeight: 800, color: textPrimary, fontSize: "1.1rem" }}>Ask Parrots</div>
                        <div style={{ fontWeight: 500, color: textSecondary, fontSize: "0.95rem" }}>Get tips for any location and nearby spots</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600, color: textSecondary, fontSize: "0.95rem" }}>
                          1 <img src={parrotCracker} alt="cracker" style={{ width: "1rem", height: "1rem" }} /> / query
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{/* end RIGHT COLUMN */}
              </div>{/* end ROW 1 */}

              {/* ROW 2: PRICING CARDS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {PURCHASE_OPTIONS.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => handleBuy(opt, i)}
                    style={{
                      backgroundColor: cardBg, borderRadius: "1rem", padding: "1.5rem 1rem",
                      boxShadow: `0 0 0 4px ${opt.color}, ${shadow}`,
                      textAlign: "center", cursor: "pointer", position: "relative",
                      transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <div style={{ fontSize: "1.3rem", fontWeight: 900, color: opt.color, marginBottom: "0.5rem" }}>{opt.label}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                      <img src={parrotCracker} alt="cracker" style={{ width: "1.6rem", height: "1.6rem" }} />
                      <span style={{ fontSize: "2rem", fontWeight: 900, color: textPrimary, WebkitTextStroke: "1px " + textPrimary }}>{opt.coins}</span>
                    </div>
                    <div style={{ display: "inline-block", backgroundColor: opt.color + "1a", borderRadius: "999px", padding: "0.3rem 1.1rem", fontSize: "1.1rem", color: opt.color, fontWeight: 800 }}>€{opt.priceEUR.toFixed(2)}</div>
                    {processingIndex === i && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <div className="spinner" style={{ height: "1rem", width: "1rem", margin: "auto", border: "3px solid rgba(0,0,0,0.1)", borderTop: `3px solid ${parrotCaravanOrangeRed}` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>{/* end ROW 2 */}

              {/* HISTORY */}
              <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "1.5rem", boxShadow: shadow }}>
                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e8e2d8"}` }}>
                  {["purchases", "transactions"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDisplayState(tab)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", color: displayState === tab ? textPrimary : textSecondary, paddingBottom: "0.5rem", borderBottom: displayState === tab ? `2px solid ${parrotGreen}` : "2px solid transparent", marginBottom: "-2px" }}
                    >
                      {tab === "purchases" ? "Purchase History" : "ParrotCracker Log"}
                    </button>
                  ))}
                </div>

                {/* Rows */}
                <div style={{ maxHeight: "16rem", overflowY: "auto" }}>

                  {/* Table header */}
                  <div style={{ display: "grid", gridTemplateColumns: displayState === "purchases" ? "1fr 1fr 1fr 1fr" : "1fr 2fr 1fr", padding: "0.5rem 0", marginBottom: "0.25rem", position: "sticky", top: 0, backgroundColor: cardBg, zIndex: 1 }}>
                    {(displayState === "purchases"
                      ? ["CRACKERS", "PAID", "DATE", "STATUS"]
                      : ["CRACKERS", "DESCRIPTION", "DATE"]
                    ).map((h, idx) => (
                      <span key={h} style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", color: textSecondary, paddingLeft: "0.75rem", borderLeft: idx > 0 ? `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0d9ce"}` : "none" }}>{h}</span>
                    ))}
                  </div>
                  {displayState === "purchases" ? (
                    purchases.length > 0 ? purchases.map((p, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "0.75rem 0", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f0ebe0"}`, alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", paddingLeft: "0.75rem" }}>
                          <img src={parrotCracker} alt="cracker" style={{ width: "1rem", height: "1rem" }} />
                          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: textPrimary }}>{p.coinsAmount.toLocaleString()}</span>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: p.eurAmount === 0 ? parrotGreen : "#c8a84b", paddingLeft: "0.75rem", borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0d9ce"}` }}>
                          {p.eurAmount === 0 ? "Free" : `€${p.eurAmount.toFixed(2)}`}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: textSecondary, paddingLeft: "0.75rem", borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0d9ce"}` }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: p.status === "completed" ? parrotGreen : "#c8a84b", paddingLeft: "0.75rem", borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0d9ce"}` }}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                      </div>
                    )) : <div style={{ color: textSecondary, padding: "1rem 0", fontSize: "0.9rem" }}>No purchases yet.</div>
                  ) : (
                    transactions.length > 0 ? transactions.map((t, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", padding: "0.75rem 0", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f0ebe0"}`, alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", paddingLeft: "0.75rem" }}>
                          <img src={parrotCracker} alt="cracker" style={{ width: "1rem", height: "1rem" }} />
                          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: textPrimary }}>{t.coinsAmount.toLocaleString()}</span>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: textSecondary, paddingLeft: "0.75rem", borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0d9ce"}` }}>{t.description}</span>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: textSecondary, paddingLeft: "0.75rem", borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e0d9ce"}` }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                      </div>
                    )) : <div style={{ color: textSecondary, padding: "1rem 0", fontSize: "0.9rem" }}>No transactions yet.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* CLAIM MODAL — desktop only, mobile has its own */}
          {!isMobile && showClaimModal && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
              <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "2rem", width: "20rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                <img src={parrotCracker} alt="cracker" style={{ width: "4rem", height: "4rem" }} />
                <span style={{ color: textPrimary, fontSize: "1.3rem", fontWeight: 800, textAlign: "center" }}>100 ParrotCrackers</span>
                <span style={{ color: textSecondary, fontSize: "0.9rem", textAlign: "center" }}>
                  {currentBalance >= 200
                    ? "Your balance is too high to claim free ParrotCrackers. Spend some first!"
                    : "Claim 100 free ParrotCrackers to get started."}
                </span>
                <button
                  disabled={currentBalance >= 200 || isProcessingFree}
                  onClick={handleClaimFree}
                  style={{ backgroundColor: currentBalance >= 200 || isProcessingFree ? "#ccc" : parrotCaravanOrangeRed, color: "white", fontWeight: 700, fontSize: "0.95rem", border: "none", borderRadius: "999rem", padding: "0.65rem 2rem", cursor: currentBalance >= 200 ? "not-allowed" : "pointer", width: "100%" }}
                >
                  {isProcessingFree ? <div className="spinner" style={{ height: "1rem", width: "1rem", margin: "auto", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white" }} /> : "Claim"}
                </button>
                <button onClick={() => setShowClaimModal(false)} style={{ background: "none", border: "none", color: textSecondary, cursor: "pointer", fontSize: "0.85rem" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default ParrotCoinPage;
