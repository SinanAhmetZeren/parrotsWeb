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
  usePurchaseCoinsMutation, useLazyGetParrotCoinBalanceQuery,
  useLazyGetUsersByUsernameQuery, useSendParrotCoinsMutation
} from "../slices/UserSlice";
import { parrotBlue, parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotBlueSemiTransparent, parrotDarkBlue, parrotDarkerBlue, parrotGreen, parrotPlaceholderGrey } from "../styles/colors";
import { IoSearch } from "react-icons/io5";

export function ParrotCoinPage() {
  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const navigate = useNavigate();
  const [purchaseCoins] = usePurchaseCoinsMutation();
  const [sendParrotCoins] = useSendParrotCoinsMutation();
  const [getParrotCoinBalance] = useLazyGetParrotCoinBalanceQuery();
  const [getUsersByUsername] = useLazyGetUsersByUsernameQuery();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAmounts, setSelectedAmounts] = useState([]); // basket array
  const [totalPayment, setTotalPayment] = useState(0); // basket array
  const [newBalance, setNewBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false)
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
    { coins: 100, priceUSD: 3.00 },     // 1000 coins = $0.10
    { coins: 1000, priceUSD: 30.0 },       // 10k coins = $1
    { coins: 10000, priceUSD: 300.0 },     // 100k coins = $10
  ];
  const handleAddToBasket = (amount) => {
    setSelectedAmounts((prev) => [...prev, amount.coins]);
    setTotalPayment((prev) => Math.round((prev + amount.priceUSD) * 100) / 100);
    setNewBalance((prev) => prev + amount.coins);
  };
  const handleClearBasket = () => {
    setSelectedAmounts([]);
    setTotalPayment(0);
    setNewBalance(currentBalance); // reset new balance to current
  };
  const handleConfirmPurchase = async () => {
    if (selectedAmounts.length === 0 || isProcessing) return;
    setIsProcessing(true);
    const totalCoins = selectedAmounts.reduce((acc, val) => acc + val, 0);
    try {
      // 1. Deposit coins and wait for completion
      await purchaseCoins({
        userId: userId,
        coins: totalCoins,
        usdAmount: totalPayment,
        paymentProviderId: "parrotsVirtual"
      }).unwrap();
      // 2. Refetch the latest balance & purchases from server
      const response = await getParrotCoinBalance(userId).unwrap();
      console.log("-->>>", response);
      setCurrentBalance(response.balance);
      setPurchases(response.purchases);
      setTransactions(response.transactions);
      setNewBalance(response.balance);

      // 3. Clear basket
      setSelectedAmounts([]);
      setTotalPayment(0);

      console.log(
        "Purchased coins:", totalCoins,
        "for $", totalPayment.toFixed(2)
      );

    } catch (err) {
      console.error("Error purchasing coins:", err);
    } finally {
      setIsProcessing(false);
    }
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
      <header className="App-header">
        <div className="flex mainpage_Container" style={{ backgroundColor: "rgba(1, 1, 88, 0.87)" }}>
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>
          {/* EXPLANATION OF PARROT COINS */}
          <div style={wrapperWrapper3}>
            <div>
              <span style={accountBalanceTitle}>ParrotCoins  </span>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <span style={{}}>
                Featuring your voyage on the main map costs ParrotCoins
                <div style={{ ...coinContainer2, display: "inline-grid", marginLeft: "4px" }}>
                  <img src={parrotcoin} alt="Parrot Coin" style={coinImg2} />
                </div>.
                {"\u00A0\u00A0"}This is a one-time deduction based on the number of days between your
                posting date and the start of your voyage—at which point it is no longer visible on the map.
                {"\u00A0\u00A0"}For example, a voyage starting in 10 days will cost 10 ParrotCoins.
              </span>
            </div>
          </div>
          {/* BALANCE, PURCHASE AND BUTTONS */}
          <div style={accountDataWrapper}>
            <div>
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
              </div>
            </div>
            <div style={wrapperWrapper}>
              <div style={wrapper}>
                {/* 1ST ROW: Get Parrot Coins & AMOUNT BUTTONS */}
                <div style={box3}>
                  <span style={textStyle}>Get ParrotCoins</span>
                </div>
                {purchaseOptions.map((amt, index) => (
                  <div
                    key={index}
                    style={boxClickable(index, hovered === index)}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleAddToBasket(amt)}
                  >
                    <span style={textStylePrice}>${amt.priceUSD.toFixed(2)}  </span>
                    <span style={textStyle}>{amt.coins.toLocaleString()}</span>
                    <div style={coinContainer}>
                      <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                    </div>

                  </div>
                ))}
              </div>
            </div>
            <div style={wrapperWrapper2}>
              <div style={wrapper2}>
                {/* BASKET Row */}
                <div style={boxBasketLeft}>
                  <span style={textStyle}>
                    Basket Total:
                  </span>
                </div>
                <div style={boxBasketRight}>
                  <span style={{ ...textStylePrice, color: "red", textDecoration: 'line-through' }}
                    title="it's discounted at the moment"
                  >${totalPayment}  </span>
                  {(
                    <>
                      <span style={textStyle}>
                        {basketTotal.toLocaleString() || "0"}
                      </span>
                      <div style={coinContainer}>
                        <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div style={wrapperWrapper}>
              <div style={wrapper}>

                {/* New Balance AFTER PURCHASE AND CONFIRM BUTTON */}
                <div style={box7}>
                  <span style={textStyle}>New Balance</span>
                </div>
                <div style={box8}>
                  <span style={{ ...amountStyle, color: (currentBalance !== newBalance) ? "yellow" : "white" }}>{newBalance.toLocaleString()}</span>
                  <div style={coinContainer}>
                    <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                  </div>
                </div>
                <div style={{ ...boxConfirm, gridColumn: "3" }}>
                  <button
                    style={selectedAmounts.length === 0 || isProcessing ? clearButtonDisabled : clearButton} // or create a new style for "clear"
                    disabled={selectedAmounts.length === 0 || isProcessing}
                    onClick={handleClearBasket}>
                    Clear Basket
                  </button>
                </div>
                <div style={boxConfirm}>
                  <button
                    style={
                      basketTotal === 0 || isProcessing
                        ? confirmButtonDisabled
                        : confirmButton}
                    disabled={basketTotal === 0 || isProcessing}
                    onClick={() => handleConfirmPurchase()}>
                    <div style={{ width: "100%", textAlign: "center", position: "relative" }}>
                      {isProcessing ? (
                        <>
                          {/* Spinner centered in button */}
                          <div style={spinnerContainer}>
                            <div className="spinner" style={spinnerInner}></div>
                          </div>
                          {/* Invisible text to maintain button size */}
                          <span style={{ opacity: 0 }}>Confirm Purchase</span>
                        </>
                      ) : (
                        "Confirm Purchase"
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div style={wrapperWrapper}>
              <div style={wrapper}>
                {/* FIRST DIV: "SEND" TEXT */}
                <div style={boxSend}>
                  <span style={textStyle}>Send ParrotCoins</span>
                </div>

                {/* SECOND DIV: RECIPIENT INPUT (TEXT) */}
                <div style={{ ...boxSend, gridColumn: "2", justifyContent: "flex-end", position: "relative" }}>
                  <input
                    type="text"
                    placeholder="send to"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="send-input"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "white",
                      textAlign: "right",
                      outline: "none",
                      width: "100%",
                      fontWeight: "800"
                    }}
                  />

                  <style>
                    {`
              .send-input::placeholder {
                color: rgba(160,160,200,0.2); 
                opacity: 1;
                font-size: 1.5rem;
                font-weight: 800;
              }
            `}
                  </style>
                  <div style={magnifierContainerStyle} onClick={() => handleSearch()}>
                    <IoSearch style={magnifierStyle} /> {/* search */}
                  </div>


                  {showResults && (
                    <div style={{
                      position: "absolute",
                      bottom: "0%",
                      right: "0rem",
                      background: "#0b1e2d",
                      border: "1px solid gold",
                      borderRadius: "1rem",
                      width: "20rem",
                      zIndex: 10,
                      transform: "translateX(100%)"
                    }}>
                      {searchResults.map((user, index) => (
                        <div
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                            cursor: "pointer",
                            background: index === hoveredSearch ? "linear-gradient(-90deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, .050) 50%)" : null
                          }}
                          onMouseEnter={() => { setHoveredSearch(index); }}
                          onMouseLeave={() => { setHoveredSearch(null); }}
                        >
                          <img
                            src={user.profileImageThumbnailUrl || user.profileImageUrl}
                            alt="recipient profile"
                            style={{ width: "3rem", height: "3rem", borderRadius: "50%", marginRight: 8 }}
                          />
                          <span>{user.userName}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>



                {/* THIRD DIV: AMOUNT INPUT (NUMBER ONLY) */}
                <div style={{ ...boxSend, gridColumn: "3", justifyContent: "flex-end" }}>
                  <input
                    type="text"
                    placeholder="0"
                    value={displayValue}
                    onChange={handleAmountChange}
                    style={{
                      ...amountStyle,
                      background: "transparent",
                      border: "none",
                      width: "10rem",
                      textAlign: "right",
                      color: (currentBalance !== newBalance) ? "yellow" : "white"
                    }}
                    className="send-input"

                  />
                  <div style={coinContainer}>
                    <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                  </div>
                </div>


                {/* FOURTH DIV: "SEND" TEXT */}
                <div style={{ ...boxSend, gridColumn: "4", justifyContent: "center" }}>
                  <button
                    style={
                      amount === 0 || recipient === "" || isProcessingSend
                        ? sendButtonDisabled
                        : sendButton}
                    disabled={amount === 0 || isProcessingSend}
                    onClick={() => handleSendAmount()}>
                    <div style={{ width: "100%", textAlign: "center", position: "relative" }}>
                      {isProcessingSend ? (
                        <>
                          {/* Spinner centered in button */}
                          <div style={spinnerContainer}>
                            <div className="spinner" style={spinnerInner}></div>
                          </div>
                          {/* Invisible text to maintain button size */}
                          <span style={{ opacity: 0 }}>Send ParrotCoins</span>
                        </>
                      ) : (
                        "Send ParrotCoins"
                      )}
                    </div>
                  </button>
                </div>
              </div>
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
                  <span style={historyCell}>USD Paid</span>
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
                          ${p.usdAmount.toFixed(2)}
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
  width: "80vw",
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
  width: "39.5vw",
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




const box1 = { ...boxBase, gridRow: "1", gridColumn: "1" };
const box2 = { ...boxBase, gridRow: "1", gridColumn: "2", justifyContent: "flex-end" };
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



const confirmButton = {
  padding: "0.4rem 2rem",
  fontSize: "1rem",
  fontWeight: 800,
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#ffcc00",
  color: "#0f2a47",
  display: "flex",
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