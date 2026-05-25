/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useSelector } from "react-redux";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import parrotcoin from "../assets/images/parrotcoin.png";
import {
  useCreatePaymentIntentMutation, useLazyGetParrotCoinBalanceQuery,
  useLazyGetUsersByUsernameQuery, useSendParrotCoinsMutation,
  useClaimFreeCoinsMutation
} from "../slices/UserSlice";
import { StripePaymentModal } from "../components/StripePaymentModal";
import { parrotBlue, parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotBlueSemiTransparent, parrotDarkBlue, parrotDarkerBlue, parrotGreen, parrotPlaceholderGrey } from "../styles/colors";
import { toast } from "react-toastify";
import { IoSearch } from "react-icons/io5";

export function ParrotCoinPage() {
  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const navigate = useNavigate();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripeCoins, setStripeCoins] = useState(0);
  const [claimFreeCoins] = useClaimFreeCoinsMutation();
  const [sendParrotCoins] = useSendParrotCoinsMutation();
  const [getParrotCoinBalance] = useLazyGetParrotCoinBalanceQuery();
  const [getUsersByUsername] = useLazyGetUsersByUsernameQuery();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAmounts, setSelectedAmounts] = useState([]); // basket array
  const [totalPayment, setTotalPayment] = useState(0); // basket array
  const [newBalance, setNewBalance] = useState(0);
  const [balanceLoaded, setBalanceLoaded] = useState(false)
  const [isProcessingFree, setIsProcessingFree] = useState(false)
  const [processingIndex, setProcessingIndex] = useState(null)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [isProcessingSend, setIsProcessingSend] = useState(false)
  const [hovered, setHovered] = useState(null);
  const [hoveredSearch, setHoveredSearch] = useState(null);
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [displayState, setDisplayState] = useState("purchases")

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 6) return;
    setAmount(rawValue === "" ? 0 : parseInt(rawValue, 10));
  };
  // Calculate this variable every time the component renders
  const displayValue = amount === 0 ? "" : amount.toLocaleString();
  const purchaseOptions = [
    { coins: 100, priceEUR: 3.00 },
    { coins: 1000, priceEUR: 30.0 },
    { coins: 10000, priceEUR: 300.0 },
  ];
  const handleAddToBasket = (amount) => {
    setSelectedAmounts((prev) => [...prev, amount.coins]);
    setTotalPayment((prev) => Math.round((prev + amount.priceEUR) * 100) / 100);
    setNewBalance((prev) => prev + amount.coins);
  };
  const handleClearBasket = () => {
    setSelectedAmounts([]);
    setTotalPayment(0);
    setNewBalance(currentBalance); // reset new balance to current
  };
  const handleClaimFreeCoins = async () => {
    if (isProcessingFree) return;
    if (currentBalance >= 500) {
      toast.info("Your balance is above 500 — free coins are only available when your balance is below 500.");
      return;
    }
    setIsProcessingFree(true);
    try {
      await claimFreeCoins().unwrap();
      const response = await getParrotCoinBalance(userId).unwrap();
      setCurrentBalance(response.balance);
      setPurchases(response.purchases);
      setTransactions(response.transactions);
      setNewBalance(response.balance);
    } catch (err) {
      console.error("Error claiming free coins:", err);
    } finally {
      setIsProcessingFree(false);
    }
  };


  const handlePaymentSuccess = async () => {
    setStripeClientSecret(null);
    setSelectedAmounts([]);
    setTotalPayment(0);
    toast.success("Payment successful! Coins will be credited shortly.");
    setTimeout(async () => {
      const response = await getParrotCoinBalance(userId).unwrap();
      setCurrentBalance(response.balance);
      setPurchases(response.purchases);
      setTransactions(response.transactions);
      setNewBalance(response.balance);
    }, 3000);
  };

  const handleSendAmount = async () => {

    console.log("1. sending parrot coins.");
    // 1. Validate
    if (!recipient || amount <= 0 || isProcessingSend || !selectedUserId) return;
    setIsProcessingSend(true);
    try {
      // 2. Send coins to the recipient
      await sendParrotCoins({
        userId: userId,
        receiverId: selectedUserId,
        coins: amount,
      }).unwrap();

      console.log("sending parrot coins: ", userId, "->", selectedUserId, "->", amount);

      // 3. Refetch sender's balance
      const response = await getParrotCoinBalance(userId).unwrap();
      setCurrentBalance(response.balance);
      setPurchases(response.purchases);
      setTransactions(response.transactions);
      setNewBalance(response.balance);

      // 4. Clear input
      setAmount(0);
      setRecipient("");
      setSelectedUserId(null);

      console.log(`Sent ${amount} coins to ${recipient}`);
    } catch (err) {
      console.error("Error sending coins:", err);
    } finally {
      setIsProcessingSend(false);
    }
  };


  const handleSearch = async () => {
    if (recipient.length < 3) return;
    const users = await getUsersByUsername(recipient, { skip: recipient.length < 3 })
    console.log("--->", users.data);
    setSearchResults(users.data)
    setShowResults(true); // force popup open
  }

  useEffect(() => {
    console.log("searchResult: ", searchResults);
    console.log("recipient: ", recipient);
    console.log("selectedUserId: ", selectedUserId);
  }, [searchResults, recipient, selectedUserId])

  const handleSelectUser = (user) => {
    setRecipient(user.userName);   // populate input
    setSelectedUserId(user.id); // store id
    setShowResults(false);          // close popup
  };

  useEffect(() => {
    if (userId) {
      const fetchBalance = async () => {
        try {
          const response = await getParrotCoinBalance(userId).unwrap();
          console.log("getParrotCoinBalance response ->>", response);
          setCurrentBalance(response.balance);
          setPurchases(response.purchases);
          setTransactions(response.transactions);
          setNewBalance(response.balance);
          setBalanceLoaded(true);
          console.log("purchases: ", response.purchases);
        } catch (err) {
          console.error("Failed to get balance:", err);
        }
      };
      fetchBalance();
    }
  }, [userId, getParrotCoinBalance]);




  const { isError: isHealthCheckError } = useHealthCheckQuery();
  if (isHealthCheckError) return <SomethingWentWrong />;

  const basketTotal = selectedAmounts.reduce((a, b) => a + b, 0);

  return (
    <div className="App">
      {stripeClientSecret && (
        <StripePaymentModal
          clientSecret={stripeClientSecret}
          coins={stripeCoins}
          onSuccess={handlePaymentSuccess}
          onClose={() => setStripeClientSecret(null)}
        />
      )}
      <header className="App-header">
        <div className="flex mainpage_Container" style={{ backgroundColor: "rgba(1, 1, 88, 0.87)" }}>
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>
          {/* EXPLANATION OF PARROT COINS */}

          {/* BALANCE, PURCHASE AND BUTTONS */}
          <div style={accountDataWrapper}>
            <div style={{ marginBottom: "1rem" }}>
              <span style={accountBalanceTitle}>Account and Purchase   </span>
            </div>
            <div style={{ ...wrapperWrapper2, marginTop: "1rem" }}>

              <div style={wrapper2}>
                {/* 1ST ROW: Current Balance */}
                <div style={box1}>
                  <span style={textStyle}>Current Balance</span>
                </div>
                <div style={box2}>
                  <span style={amountStyle}>
                    {currentBalance.toLocaleString()}
                  </span>
                  <div style={coinContainer}>
                    <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                  </div>
                </div>
                {/* 2ND ROW: Get ParrotCoins */}
                <div style={{ ...box1, gridRow: "2", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={textStyle}>100</span>
                    <div style={coinContainer}>
                      <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                    </div>
                  </div>
                </div>
                <div style={{ ...box2, gridRow: "2", justifyContent: "center" }}>
                  <button style={confirmButton} onClick={() => setShowClaimModal(true)}>Get ParrotCoins</button>
                </div>
              </div>
            </div>
            {/* FREE COINS BANNER */}
            <div style={{ ...wrapperWrapper, display: "none" }}>
              <div style={{ ...wrapper, borderRadius: "1rem", backgroundColor: "rgba(0, 180, 120, 0.08)", paddingTop: "0.8rem", paddingBottom: "0.8rem" }}>
                <div style={{ ...boxSend, gridColumn: "1 / 4", flexDirection: "row", alignItems: "center", gap: "1rem" }}>
                  <span style={textStyle}>🎁 Claim 100 Free ParrotCoins</span>
                  <span style={{ fontSize: "1rem", color: "#ff6b6b", textDecoration: "line-through", fontWeight: 700 }}>€3.00</span>
                  <span style={{ fontSize: "1rem", color: parrotGreen, fontWeight: 800 }}>FREE (€0.00)</span>
                </div>
                <div style={{ ...boxConfirm, gridColumn: "4" }}>
                  <button
                    style={isProcessingFree ? freeClaimButtonDisabled : freeClaimButton}
                    disabled={isProcessingFree}
                    onClick={handleClaimFreeCoins}
                  >
                    <div style={{ width: "100%", textAlign: "center", position: "relative" }}>
                      {isProcessingFree ? (
                        <>
                          <div style={spinnerContainer}>
                            <div className="spinner" style={spinnerInner}></div>
                          </div>
                          <span style={{ opacity: 0 }}>Claim Free Coins</span>
                        </>
                      ) : (
                        "Claim Free Coins"
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* CLAIM MODAL */}
            {showClaimModal && (
              <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                <div style={{ backgroundColor: "#0f2a47", borderRadius: "1rem", padding: "2rem", width: "20rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                  <img src={parrotcoin} alt="ParrotCoin" style={{ width: "3.5rem", height: "3.5rem" }} />
                  <span style={{ color: "white", fontSize: "1.3rem", fontWeight: 800, textAlign: "center" }}>100 ParrotCoins</span>
                  <span style={{ color: "#aac4e0", fontSize: "0.9rem", textAlign: "center" }}>
                    {currentBalance >= 200
                      ? "Your balance is too high to claim free coins. Spend some first!"
                      : "Claim 100 free ParrotCoins to get started."}
                  </span>
                  <button
                    style={currentBalance >= 200 || isProcessingFree ? { ...freeClaimButtonDisabled, width: "100%", justifyContent: "center" } : { ...freeClaimButton, width: "100%", justifyContent: "center" }}
                    disabled={currentBalance >= 200 || isProcessingFree}
                    onClick={async () => {
                      setIsProcessingFree(true);
                      try {
                        await claimFreeCoins().unwrap();
                        const response = await getParrotCoinBalance(userId).unwrap();
                        setCurrentBalance(response.balance);
                        setPurchases(response.purchases);
                        setTransactions(response.transactions);
                        setNewBalance(response.balance);
                        setShowClaimModal(false);
                        toast.success("100 ParrotCoins added to your balance!");
                      } catch (err) {
                        toast.error("Could not claim coins. Please try again.");
                      } finally {
                        setIsProcessingFree(false);
                      }
                    }}
                  >
                    {isProcessingFree ? (
                      <div className="spinner" style={{ height: "1rem", width: "1rem", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white" }} />
                    ) : "Claim"}
                  </button>
                  <button onClick={() => setShowClaimModal(false)} style={{ background: "none", border: "none", color: "#aac4e0", cursor: "pointer", fontSize: "0.85rem" }}>Cancel</button>
                </div>
              </div>
            )}
            <div style={{ display: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
                <span style={textStyle}>Get ParrotCoins (hidden)</span>
                {purchaseOptions.map((opt, index) => (
                  <div key={index} style={coinTierRow}>
                    <div style={coinTierInfo}>
                      <span style={textStylePrice}>€{opt.priceEUR.toFixed(2)}</span>
                      <span style={{ ...textStyle, marginLeft: "1rem" }}>{opt.coins.toLocaleString()}</span>
                      <div style={{ ...coinContainer, marginLeft: "0.5rem" }}>
                        <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                      </div>
                    </div>
                    <button
                      style={processingIndex === index ? confirmButtonDisabled : confirmButton}
                      disabled={processingIndex !== null}
                      onClick={async () => {
                        setProcessingIndex(index);
                        try {
                          const { clientSecret } = await createPaymentIntent({ userId, coins: opt.coins }).unwrap();
                          setStripeCoins(opt.coins);
                          setStripeClientSecret(clientSecret);
                        } catch (err) {
                          toast.error("Could not initiate payment. Please try again.");
                        } finally {
                          setProcessingIndex(null);
                        }
                      }}
                    >
                      {processingIndex === index ? (
                        <div style={{ width: "2rem", height: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div className="spinner" style={{ height: "1rem", width: "1rem", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white" }} />
                        </div>
                      ) : "Buy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: "1.2rem" }}>
              Featuring a voyage on the map costs 1 ParrotCoin per day until its end date.
            </div>
          </div>



          {/* Purchase History*/}
          <div style={wrapperWrapper3}>

            <div style={selectorElement}>
              <span
                onClick={() => setDisplayState("purchases")}

                style={{
                  ...(displayState === "purchases" ? selectedTitle : unselectedTitle),
                  marginRight: "0.5rem",
                }}

                className={displayState === "purchases" ? "selected" : "unselected"}>
                Purchase History
              </span>
              <span
                onClick={() => setDisplayState("transactions")}
                style={{ ...(displayState === "transactions" ? selectedTitle : unselectedTitle), marginLeft: "0.5rem" }}
                className={displayState === "transactions" ? "selected" : "unselected"}
              >
                Transactions History
              </span>
              <style>
                {`
                .selected {
                  cursor: default;
                }
              
                .unselected {
                  cursor: pointer;
                  transition: background-color 0.2s ease;
                }
                .unselected:hover {
                  //background-color: rgba(160,160,200,.1); 
                    background-color: ${parrotBlueSemiTransparent};
                }
              `
                }
              </style>
            </div>

            {displayState === "purchases" ?
              <div style={historyWrapper} >
                {/* Header Row */}
                <div style={historyHeader}>
                  <span style={{ ...historyCell, justifyContent: "flex-end" }}>Amount</span>
                  <span style={historyCell}>EUR Paid</span>
                  <span style={historyCell}>Date</span>
                  <span style={historyCell}>Status</span>
                </div>

                {/* Scrollable Data Rows */}
                <div style={scrollContainer} className={"custom-scrollbar"} >
                  {purchases.length > 0 ? (
                    purchases.map((p, index) => (
                      <div key={index} style={historyRow}>

                        <span style={{ ...historyCell, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", marginRight: "5rem" }}>
                          {p.coinsAmount.toLocaleString()}
                          <div style={coinContainerHistory}>
                            <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                          </div>
                        </span>

                        <span style={{ ...historyCell, color: "#ffcc00" }}>
                          {p.eurAmount === 0 ? <span style={{ color: parrotGreen }}>FREE</span> : `€${p.eurAmount.toFixed(2)}`}
                        </span>
                        <span style={historyCell}>
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                        <span style={{
                          ...historyCell,
                          color: p.status === "completed" ? "#44ff44" : "#ffcc00",
                        }}>
                          {p.status.toUpperCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ ...historyRow, justifyContent: 'center', opacity: 0.5 }}>
                      No purchases yet.
                    </div>
                  )}
                </div>
              </div>
              :
              <div style={historyWrapper} >
                {/* Header Row */}
                <div style={historyHeader2}>
                  <span style={historyCell}>Amount</span>
                  <span style={historyCell}>Description</span>
                  <span style={historyCell}>Date</span>
                </div>

                {/* Scrollable Data Rows */}
                <div style={scrollContainer} className={"custom-scrollbar"}>
                  {transactions.length > 0 ? (
                    transactions.map((t, index) => (
                      <div key={index} style={historyRow2}>

                        <span style={{
                          ...historyCell,
                          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", marginRight: "5rem"
                        }}>
                          {t.coinsAmount.toLocaleString()}
                          <div style={coinContainerHistory}>
                            <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                          </div>
                        </span>

                        <span style={{ ...historyCell, color: "#ffcc00", gridColumn: "2 / 3" }}>
                          {t.description}
                        </span>
                        <span style={historyCell}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>

                      </div>
                    ))
                  ) : (
                    <div style={{ ...historyRow2, justifyContent: 'center', opacity: 0.5 }}>
                      No transactions yet.
                    </div>
                  )}
                </div>
              </div>
            }
            <style>
              {`
                    .custom-scrollbar::-webkit-scrollbar {
                        background-color: transparent //#2581d8;
                        width: 15px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: ${parrotBlueDarkTransparent};
                        border-radius: 10px;
                    }
                `}
            </style>

          </div>
        </div>
      </header >
    </div >
  );
}

export default ParrotCoinPage;

/* ================= STYLES ================= */


const clearButton = {
  padding: "0.4rem 2rem",
  fontSize: "1rem",
  fontWeight: 800,
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#ff4444",
  color: "white",
  display: "flex",
  justifyContent: "center",
};

const clearButtonDisabled = {
  ...clearButton,
  backgroundColor: "#ff444455", // lighter/red transparent
  color: "rgba(255,255,255,0.3)",
  cursor: "not-allowed",
};


const spinnerContainer = {
  height: "100%",
  width: "100%",
  borderRadius: "1.5rem",
  position: "relative"
}


const spinnerInner = {
  position: "absolute",
  left: "40%",
  top: "-20%",
  height: "2rem",
  width: "2rem",
  border: "6px solid rgba(223, 230, 173, 0.5)",
  borderTop: "6px solid gold",
}

const accountDataWrapper = {
  backgroundColor: parrotDarkerBlue,
  // backgroundColor: "red",
  width: "50vw",
  margin: "auto",
  marginTop: 0,
  border: "1px solid gold",
  borderColor: parrotGreen,
  padding: "1rem",
  borderRadius: "1rem",
}

const wrapperWrapper = {
  backgroundColor: parrotDarkerBlue,
  // backgroundColor: "red",
  width: "100%",
  margin: "auto",
  marginTop: 0,
  marginBottom: "1rem",
  borderRadius: "2rem"
}
const wrapperWrapper2 = {
  ...wrapperWrapper,
  // width: "39.5vw",
  marginLeft: "0",

}
const wrapperWrapper3 = {
  ...wrapperWrapper,
  border: "1px solid gold",
  borderColor: parrotGreen,
  marginTop: "1rem",
  width: "80vw",
  padding: "1rem",
  borderRadius: "1rem",
  backgroundColor: parrotDarkerBlue,
  // backgroundColor: "red"
}

const wrapper = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gridTemplateRows: "1fr",
  gap: "1rem",
  padding: "1rem",
  paddingBottom: "0",
  paddingTop: "0",
  // background: "linear-gradient(-90deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, .050) 50%)",
  borderRadius: "2rem"
};

const wrapper2 = {
  ...wrapper,
  gridTemplateColumns: "1fr 1fr",
};


const boxBase = {
  backgroundColor: parrotDarkBlue,
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "0 1rem",
  color: "white",
  // border: "1px solid rgba(223, 230, 173, 0.5)",
};



const boxClickable = (index, hovered) => ({
  ...boxBase,
  cursor: "pointer",
  justifyContent: "flex-end",
  gridRow: 1,
  gridColumn: 2 + index,
  border: "1px solid rgb(218, 247, 1)",
  borderLeft: "3px solid rgb(218, 247, 1)",
  borderRight: "3px solid rgb(218, 247, 1)",

  background: hovered
    ? "linear-gradient(90deg, rgba(255,215,0,0.015) 0%, rgba(255,235,150,0.15) 50%, rgba(255,215,0,0.015) 100%)"
    : parrotDarkBlue,

  boxShadow: "0 0 5px #D4AF37, 0 0 15px rgba(212, 175, 55, 0.6)",


});




const box1 = { ...boxBase, gridRow: "1", gridColumn: "1", justifyContent: "center" };
const box2 = { ...boxBase, gridRow: "1", gridColumn: "2", justifyContent: "center" };
const box3 = { ...boxBase, gridRow: "1", gridColumn: "1" };
const boxBasketLeft = { ...boxBase, gridRow: "1", gridColumn: "1", };
const boxBasketRight = { ...boxBase, gridRow: "1", gridColumn: "2", justifyContent: "flex-end" };
const box7 = { ...boxBase, gridRow: "1", gridColumn: "1" };
const boxSend = { ...boxBase, gridRow: "1", gridColumn: "1" };
const box8 = { ...boxBase, gridRow: "1", gridColumn: "2", justifyContent: "flex-end" };
const boxConfirm = { ...boxBase, gridRow: " 1", gridColumn: "4", justifyContent: "center" };

const textStyle = { fontWeight: 800 };
const textStylePrice = { fontSize: "1.2rem", fontWeight: 800, color: "#ffcc00", textAlign: "left", flex: 1 };
const amountStyle = { fontWeight: 800 };

const coinContainer = {
  height: "1.8rem",
  width: "1.8rem",
  borderRadius: "5rem",
  backgroundColor: "#cad8ecaa",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const coinContainer2 = {
  ...coinContainer,
  height: "1.8rem",
  width: "1.8rem"
};

const coinContainerHistory = {
  height: "2rem",
  width: "2rem",
  borderRadius: "5rem",
  backgroundColor: "#cad8ecaa",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "0.5rem"
};

const coinImg = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};
const coinImg2 = {
  ...coinImg,
  width: "100%",
  height: "100%",
};



const coinTierRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
};

const coinTierInfo = {
  display: "flex",
  alignItems: "center",
};

const confirmButton = {
  padding: "0 2rem",
  height: "2.2rem",
  fontSize: "1rem",
  fontWeight: 800,
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#ffcc00",
  color: "#0f2a47",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "5rem",
};

const confirmButtonDisabled = {
  ...confirmButton,
  backgroundColor: "#ffcc0055",
  color: "rgba(255,255,255,0.3)",
};

const sendButton = {
  padding: "0.4rem 2rem",
  fontSize: "1rem",
  fontWeight: 800,
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: parrotGreen,
  color: "#0f2a47",
  display: "flex",
};

const sendButtonDisabled = {
  ...sendButton,
  backgroundColor: "rgb(42, 200, 152,0.3)",
  color: "rgba(255,255,255,0.3)",
};

const accountBalanceTitle = {
  width: "100%", // Added quotes around "100%"
  fontSize: "2rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white",
};

const selectorElement = {
  width: "100%", // Added quotes around "100%"
  fontSize: "2rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white",

}

const selectedTitle = {
  backgroundColor: parrotBlueDarkTransparent,
  padding: "0.5rem",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  borderRadius: "1rem"
}

const unselectedTitle = {

  padding: "0.5rem",
  paddingLeft: "2rem",
  paddingRight: "2rem",
  borderRadius: "1rem"
}


const historyWrapper = {
  width: "100%",
  margin: "auto",
  // marginLeft: "10%",
  marginTop: "1rem",
  backgroundColor: "rgba(0,0,0,0.2)",
  padding: "1rem",
  borderRadius: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  height: "30rem"
};

const historyHeader = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  padding: "1rem",
  backgroundColor: "#0f2a47",
  borderRadius: "1rem",
  fontWeight: "800",
  color: "white",
  textAlign: "center"
};

const historyHeader2 = {
  ...historyHeader,
  gridTemplateColumns: "1fr 2fr 1fr",

};

const scrollContainer = {
  // maxHeight: "60vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",

};

const historyRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  padding: "0.8rem 1rem",
  backgroundColor: "rgba(15, 42, 71, 0.5)",
  borderRadius: "1rem",
  color: "white",
  fontSize: "1.2rem",
  textAlign: "center",
  alignItems: "center",
  grid: "1rem",

};

const historyRow2 = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr 1fr",
  padding: "0.8rem 1rem",
  backgroundColor: "rgba(15, 42, 71, 0.5)",
  borderRadius: "1rem",
  color: "white",
  fontSize: "1.2rem",
  textAlign: "center",
  alignItems: "center",
  grid: "1rem",

};

const historyCell = {
  fontWeight: "600"
};



const freeClaimButton = {
  padding: "0.6rem 2rem",
  fontSize: "1rem",
  fontWeight: 800,
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: parrotGreen,
  color: "#0f2a47",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const freeClaimButtonDisabled = {
  ...freeClaimButton,
  backgroundColor: "rgba(42, 200, 152, 0.3)",
  color: "rgba(255,255,255,0.3)",
  cursor: "not-allowed",
};

const magnifierContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: ".5rem",
};

const magnifierStyle = {
  // backgroundColor: "#f9f5f1",
  backgroundColor: "white",
  borderRadius: "50%",
  padding: ".2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#3c9dde",
  height: "2rem",
  width: "2rem",
  border: "2px solid #c0c0c070",
};