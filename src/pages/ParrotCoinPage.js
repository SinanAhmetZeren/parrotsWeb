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
  const [newBalance, setNewBalance] = useState(initial);
  const [isProcessing, setIsProcessing] = useState(false)

  const purchaseAmounts = [1000, 10000, 100000];

  const handleAddToBasket = (amount) => {
    setSelectedAmounts((prev) => [...prev, amount]);
    setNewBalance((prev) => prev + amount);
  };

  const handleConfirmPurchase = async () => {
    if (selectedAmounts.length === 0) return;

    setIsProcessing(true); // start spinner

    // simulate 2-second delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const total = selectedAmounts.reduce((acc, val) => acc + val, 0);
    setCurrentBalance((prev) => prev + total);

    // TODO: send selectedAmounts to backend for real processing
    console.log("Purchasing coins:", selectedAmounts);

    setSelectedAmounts([]);
    setIsProcessing(false); // stop spinner
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

              {purchaseAmounts.map((amt, index) => (
                <div
                  key={index}
                  style={boxClickable(index)}
                  onClick={() => handleAddToBasket(amt)}
                >
                  <span style={textStyle}>{amt.toLocaleString()}</span>
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

