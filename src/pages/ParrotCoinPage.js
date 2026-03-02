/* eslint-disable no-undef */
import "../assets/css/ProfilePage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useSelector } from "react-redux";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import parrotcoin from "../assets/images/parrotcoin.png";
import { parrotBlueDarkTransparent, parrotBlueDarkTransparent2, parrotDarkBlue, parrotTextDarkBlue } from "../styles/colors";

export function ParrotCoinPage() {
  const local_userId = localStorage.getItem("storedUserId");
  const state_userId = useSelector((state) => state.users.userId);
  const userId = local_userId !== null ? local_userId : state_userId;
  const navigate = useNavigate();

  const initial = 50000;
  const [currentBalance, setCurrentBalance] = useState(initial);
  const [selectedAmounts, setSelectedAmounts] = useState([]); // basket array
  const [totalPayment, setTotalPayment] = useState(0); // basket array
  const [newBalance, setNewBalance] = useState(initial);
  const [isProcessing, setIsProcessing] = useState(false)

  const purchaseAmounts = [1000, 10000, 100000];

  const purchaseOptions = [
    { coins: 1000, priceUSD: 0.10 },     // 1000 coins = $0.10
    { coins: 10000, priceUSD: 1.0 },       // 10k coins = $1
    { coins: 100000, priceUSD: 10 },     // 100k coins = $10
  ];



  const handleAddToBasket = (amount) => {
    setSelectedAmounts((prev) => [...prev, amount.coins]);
    setTotalPayment((prev) => prev + amount.priceUSD); // sum numbers
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

    // simulate 2-second delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const totalCoins = selectedAmounts.reduce((acc, val) => acc + val, 0);

    setCurrentBalance((prev) => prev + totalCoins);
    console.log("Purchasing coins:", totalCoins, "for $", totalPayment.toFixed(2));

    // Clear basket
    setSelectedAmounts([]);
    setTotalPayment(0);
    setNewBalance((currentBalance + totalCoins)); // update after adding coins
    setIsProcessing(false);
  };

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

          <div className="flex profilePage_Bottom">

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
  height: "60vh",
  width: "80vw",
  margin: "auto",
  marginTop: "3rem",
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gridTemplateRows: "1fr 1fr 1fr 1fr  ",
  gap: "1rem",
  backgroundColor: "rgba(0,0,0,0.2)",
  padding: "3rem"
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
const boxConfirm2 = { ...boxBase, gridRow: " 4", gridColumn: "3", justifyContent: "center" };

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

