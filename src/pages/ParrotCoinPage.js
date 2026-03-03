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
import { useDepositCoinsMutation, useLazyGetParrotCoinBalanceQuery } from "../slices/UserSlice";

export function ParrotCoinPage() {
  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const navigate = useNavigate();
  const [depositCoins] = useDepositCoinsMutation();
  const [getParrotCoinBalance] = useLazyGetParrotCoinBalanceQuery();

  const initial = 0;
  const [currentBalance, setCurrentBalance] = useState(initial);
  const [purchases, setPurchases] = useState([]);
  const [selectedAmounts, setSelectedAmounts] = useState([]); // basket array
  const [totalPayment, setTotalPayment] = useState(0); // basket array
  const [newBalance, setNewBalance] = useState(initial);
  const [isProcessing, setIsProcessing] = useState(false)


  const purchaseOptions = [
    { coins: 1000, priceUSD: 0.10 },     // 1000 coins = $0.10
    { coins: 10000, priceUSD: 1.0 },       // 10k coins = $1
    { coins: 100000, priceUSD: 10 },     // 100k coins = $10
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
      await depositCoins({
        userId: userId,
        coins: totalCoins,
        usdAmount: totalPayment,
        paymentProviderId: "parrotsVirtual"
      }).unwrap();

      // 2. Refetch the latest balance & purchases from server
      const response = await getParrotCoinBalance(userId).unwrap();

      setCurrentBalance(response.balance);
      setPurchases(response.purchases);
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

  useEffect(() => {
    if (userId) {
      const fetchBalance = async () => {
        try {
          const response = await getParrotCoinBalance(userId).unwrap();
          setCurrentBalance(response.balance);
          setPurchases(response.purchases);
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
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>
          <span style={accountBalanceTitle}>Account Balance  </span>

          <div style={wrapper}>

            {/* Current Balance */}
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

            {/* Get Parrot Coins */}
            <div style={box3}>
              <span style={textStyle}>Get Parrot Coins</span>
            </div>

            {purchaseOptions.map((amt, index) => (
              <div
                key={index}
                style={boxClickable(index)}
                onClick={() => handleAddToBasket(amt)}
              >
                <span style={textStylePrice}>${amt.priceUSD.toFixed(2)}  </span>
                <span style={textStyle}>{amt.coins.toLocaleString()}</span>
                <div style={coinContainer}>
                  <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                </div>

              </div>
            ))}



            {/* Basket Row */}
            <div style={boxBasketLeft}>
              <span style={textStyle}>
                Basket Total:
              </span>

            </div>

            <div style={boxBasketRight}>
              <span style={textStylePrice}>${totalPayment}  </span>

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


            {/* New Balance */}
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
                onClick={handleClearBasket}
              >
                Clear Basket
              </button>
            </div>

            {/* Confirm Purchase Button */}
            <div style={boxConfirm}>
              <button
                style={
                  basketTotal === 0 || isProcessing
                    ? confirmButtonDisabled
                    : confirmButton
                }
                disabled={basketTotal === 0 || isProcessing}
                onClick={() => handleConfirmPurchase()}
              >
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



          {/* New Section: Purchase History */}
          <span style={accountBalanceTitle}>Purchase History</span>

          <div style={historyWrapper}>
            {/* Header Row */}
            <div style={historyHeader}>
              <span style={historyCell}>Amount</span>
              <span style={historyCell}>USD Paid</span>
              <span style={historyCell}>Date</span>
              <span style={historyCell}>Status</span>
            </div>

            {/* Scrollable Data Rows */}
            <div style={scrollContainer}>
              {purchases.length > 0 ? (
                purchases.map((p, index) => (
                  <div key={index} style={historyRow}>
                    {/* <span style={{ ...historyCell }}>
                      <div style={coinContainerHistory}>
                        <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                      </div>
                      {p.coinsAmount.toLocaleString()}
                    </span> */}

                    <span style={{ ...historyCell, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <div style={coinContainerHistory}>
                        <img src={parrotcoin} alt="Parrot Coin" style={coinImg} />
                      </div>
                      {p.coinsAmount.toLocaleString()}
                    </span>

                    <span style={{ ...historyCell, color: "#ffcc00" }}>
                      ${p.usdAmount.toFixed(2)}
                    </span>
                    <span style={historyCell}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{
                      ...historyCell,
                      color: p.status === "completed" ? "#44ff44" : "#ffcc00"
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







        </div>
      </header>
    </div>
  );
}

export default ParrotCoinPage;

/* ================= STYLES ================= */


const clearButton = {
  padding: "0.8rem 2rem",
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



const wrapper = {
  height: "40vh",
  width: "80vw",
  margin: "auto",
  marginTop: "1rem",
  marginBottom: "1rem",
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gridTemplateRows: "1fr 1fr 1fr 1fr  ",
  gap: "1rem",
  backgroundColor: "rgba(0,0,0,0.2)",
  padding: "2rem"
};

const boxBase = {
  backgroundColor: "#0f2a47",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "0 1rem",
  color: "white",
};



const boxClickable = (index) => ({
  ...boxBase,
  cursor: "pointer",
  justifyContent: "flex-end",
  gridRow: 2,
  gridColumn: 2 + index,
});




const box1 = { ...boxBase, gridRow: "1", gridColumn: "1" };
const box2 = { ...boxBase, gridRow: "1", gridColumn: "2", justifyContent: "flex-end" };
const box3 = { ...boxBase, gridRow: "2", gridColumn: "1" };
const boxBasketLeft = { ...boxBase, gridRow: "3", gridColumn: "1", };
const boxBasketRight = { ...boxBase, gridRow: "3", gridColumn: "2", justifyContent: "flex-end" };
const box7 = { ...boxBase, gridRow: "4", gridColumn: "1" };
const box8 = { ...boxBase, gridRow: "4", gridColumn: "2", justifyContent: "flex-end" };
const boxConfirm = { ...boxBase, gridRow: " 4", gridColumn: "4", justifyContent: "center" };

const textStyle = { fontWeight: 800 };
const textStylePrice = { fontSize: "1.2rem", fontWeight: 800, color: "#ffcc00", textAlign: "left", flex: 1 };
const amountStyle = { fontWeight: 800 };

const coinContainer = {
  height: "3rem",
  width: "3rem",
  borderRadius: "5rem",
  backgroundColor: "#cad8ecaa",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
  width: "90%",
  height: "90%",
  objectFit: "contain",
};

const confirmButtonDisabled = {
  padding: "0.8rem 2rem",
  fontSize: "1rem",
  fontWeight: 800,
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#ffcc0055",
  // color: "#0f2a4755",
  color: "rgba(255,255,255,0.3)",
  display: "flex"
};

const confirmButton = {
  padding: "0.8rem 2rem",
  fontSize: "1rem",
  fontWeight: 800,
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#ffcc00",
  color: "#0f2a47",
  display: "flex",
  // flexDirection: "column", // stack top/bottom
  // alignItems: "center",    // center horizontally
  // justifyContent: "center" // center vertically
};



const accountBalanceTitle = {
  width: "100%", // Added quotes around "100%"
  fontSize: "2rem", // Changed to camelCase
  fontWeight: 800, // Correct format for font-weight
  color: "white",
  // marginTop: "2rem"
};

const historyWrapper = {
  width: "80vw",
  margin: "auto",
  marginTop: "1rem",
  backgroundColor: "rgba(0,0,0,0.2)",
  padding: "1rem",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem"
};

const historyHeader = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  padding: "1rem",
  backgroundColor: "#0f2a47",
  borderRadius: "8px",
  fontWeight: "800",
  color: "white",
  textAlign: "center"
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
  borderRadius: "8px",
  color: "white",
  fontSize: "0.9rem",
  textAlign: "center",
  alignItems: "center",
  grid: "1rem",
  fontSize: "1.5rem",

};

const historyCell = {
  fontWeight: "600"
};