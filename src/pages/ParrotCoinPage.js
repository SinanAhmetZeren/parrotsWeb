/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useSelector } from "react-redux";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import parrotCracker from "../assets/images/parrotCookie.png";
import {
  useCreatePaymentIntentMutation, useLazyGetParrotCoinBalanceQuery,
  useClaimFreeCoinsMutation
} from "../slices/UserSlice";
import { StripePaymentModal } from "../components/StripePaymentModal";
import { parrotCaravanOrangeRed, parrotDarkBlue, parrotGreen } from "../styles/colors";
import { toast } from "react-toastify";
import { ParrotCoinPageMobile } from "./ParrotCoinPageMobile";

const PURCHASE_OPTIONS = [
  { coins: 25, priceEUR: 1.99, label: "NEST PACK" },
  { coins: 100, priceEUR: 5.99, label: "FLOCK PACK", best: true },
  { coins: 300, priceEUR: 12.99, label: "COLONY PACK" },
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
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripeCoins, setStripeCoins] = useState(0);
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

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const bg = isDark ? "transparent" : "transparent";
  const cardBg = isDark ? "#011a32" : "white";
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#003366";
  const textSecondary = isDark ? "rgba(255,255,255,0.55)" : "#888";
  const shadow = isDark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.08)";

  useEffect(() => {
    if (userId) {
      getParrotCoinBalance(userId).unwrap().then((response) => {
        setCurrentBalance(response.balance);
        setPurchases(response.purchases);
        setTransactions(response.transactions);
      }).catch(console.error);
    }
  }, [userId, getParrotCoinBalance]);

  const handlePaymentSuccess = async () => {
    setStripeClientSecret(null);
    toast.success("Payment successful! ParrotCrackers will be credited shortly.");
    setTimeout(async () => {
      const response = await getParrotCoinBalance(userId).unwrap();
      setCurrentBalance(response.balance);
      setPurchases(response.purchases);
      setTransactions(response.transactions);
    }, 3000);
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
          {stripeClientSecret && (
            <StripePaymentModal
              clientSecret={stripeClientSecret}
              coins={stripeCoins}
              onSuccess={handlePaymentSuccess}
              onClose={() => setStripeClientSecret(null)}
            />
          )}
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>

          {isMobile ? (
            <ParrotCoinPageMobile
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
            />
          ) : (
            <div style={{ width: "100%", maxWidth: "72rem", margin: "0 auto", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* ROW 1: 2 columns */}
              <div style={{ display: "grid", gridTemplateColumns: "22rem 1fr", gap: "1rem", alignItems: "stretch" }}>

                {/* HEADER CARD */}
                <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "2.5rem 2rem 2rem", boxShadow: shadow, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: parrotGreen, marginBottom: "1.25rem" }}>
                    You have
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <img src={parrotCracker} alt="cracker" style={{ width: "3.5rem", height: "3.5rem" }} />
                    <span style={{ fontSize: "4rem", fontWeight: 900, color: textPrimary, lineHeight: 1 }}>{currentBalance}</span>
                  </div>
                  <p style={{ fontSize: "1.1rem", fontWeight: 800, color: parrotGreen, marginBottom: "2rem" }}>
                    ParrotCrackers in your jar
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <button
                      onClick={() => setShowClaimModal(true)}
                      style={{ backgroundColor: parrotCaravanOrangeRed, color: "white", fontWeight: 700, fontSize: "1rem", border: "none", borderRadius: "999rem", padding: "0.75rem 2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <img src={parrotCracker} alt="cracker" style={{ width: "1.4rem", height: "1.4rem" }} />
                      Get Free ParrotCrackers
                    </button>
                  </div>
                </div>{/* end HEADER CARD */}

                {/* RIGHT COLUMN */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                  {/* PRICING CARDS */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                    {PURCHASE_OPTIONS.map((opt, i) => (
                      <div
                        key={i}
                        // onClick={async () => {
                        //   setProcessingIndex(i);
                        //   try {
                        //     const { clientSecret } = await createPaymentIntent({ userId, coins: opt.coins }).unwrap();
                        //     setStripeCoins(opt.coins);
                        //     setStripeClientSecret(clientSecret);
                        //   } catch {
                        //     toast.error("Could not initiate payment. Please try again.");
                        //   } finally {
                        //     setProcessingIndex(null);
                        //   }
                        // }}
                        style={{
                          backgroundColor: cardBg, borderRadius: "1rem", padding: "1.5rem 1rem",
                          boxShadow: opt.best ? `0 0 0 2px #c8a84b, ${shadow}` : shadow,
                          textAlign: "center", cursor: "pointer", position: "relative",
                          transition: "transform 0.15s ease", opacity: 0.5,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; if (!opt.best) e.currentTarget.style.boxShadow = `0 0 0 1px ${parrotGreen}, ${shadow}`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = opt.best ? `0 0 0 2px #c8a84b, ${shadow}` : shadow; }}
                      >
                        {opt.best && (
                          <div style={{ position: "absolute", top: "-0.75rem", left: "50%", transform: "translateX(-50%)", backgroundColor: "#c8a84b", color: "white", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em", padding: "0.2rem 0.75rem", borderRadius: "999rem" }}>
                            BEST VALUE
                          </div>
                        )}
                        {opt.label && (
                          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: opt.best ? "#c8a84b" : textSecondary, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{opt.label}</div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                          <img src={parrotCracker} alt="cracker" style={{ width: "1.6rem", height: "1.6rem" }} />
                          <span style={{ fontSize: "2rem", fontWeight: 900, color: textPrimary }}>{opt.coins}</span>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: textSecondary, fontWeight: 600 }}>€{opt.priceEUR.toFixed(2)}</div>
                        {processingIndex === i && (
                          <div style={{ marginTop: "0.5rem" }}>
                            <div className="spinner" style={{ height: "1rem", width: "1rem", margin: "auto", border: "3px solid rgba(0,0,0,0.1)", borderTop: `3px solid ${parrotCaravanOrangeRed}` }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* WHAT CRACKERS FEED */}
                  <div style={{ backgroundColor: cardBg, borderRadius: "1.25rem", padding: "1.5rem", boxShadow: shadow }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: textPrimary, marginBottom: "1rem" }}>What ParrotCrackers feed</div>
                    {WHAT_CRACKERS_FEED.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: i < WHAT_CRACKERS_FEED.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f0ebe0"}` : "none" }}>
                        <span style={{ fontWeight: 600, color: textPrimary, fontSize: "0.95rem" }}>{item.action}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <img src={parrotCracker} alt="cracker" style={{ width: "1.2rem", height: "1.2rem" }} />
                          <span style={{ fontWeight: 800, color: "#c8a84b", fontSize: "1rem" }}>{item.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>{/* end WHAT CRACKERS */}
                </div>{/* end RIGHT COLUMN */}
              </div>{/* end ROW 1 */}

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
