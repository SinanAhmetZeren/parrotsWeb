import { initializePaddle } from "@paddle/paddle-js";

// LIVE (swap back when Paddle domain approved)
// const CLIENT_TOKEN = "live_5705243e38f42dceb380d4221fc";
// const ENVIRONMENT = "live";
// export const PADDLE_PRICE_IDS = {
//   "NEST PACK":   "pri_01kzy51dwrk3fwffn5mxp9exbf",
//   "FLOCK PACK":  "pri_01kzy50nhj0gcwwva3n2h8nxh5",
//   "COLONY PACK": "pri_01kzy4ybnwkkqg4znhzax5efyn",
// };

// SANDBOX
const CLIENT_TOKEN = "test_cf417181085e33fb375829e32b3";
export const PADDLE_PRICE_IDS = {
  "NEST PACK":   "pri_01kzy7q6p1y27qdv9xw080qvx2",
  "FLOCK PACK":  "pri_01kzy7q6p1y27qdv9xw080qvx2",
  "COLONY PACK": "pri_01kzy7q6p1y27qdv9xw080qvx2",
};

let paddleInstance = null;
let successCallback = null;
let didComplete = false;

export async function getPaddle() {
  if (paddleInstance) return paddleInstance;
  paddleInstance = await initializePaddle({
    environment: "sandbox", // switch to "live" when domain approved
    token: CLIENT_TOKEN,
    eventCallback: (event) => {
      if (event.name === "checkout.completed") {
        didComplete = true;
      }
      if (event.name === "checkout.closed" && didComplete && successCallback) {
        successCallback();
        successCallback = null;
        didComplete = false;
      }
    },
  });
  return paddleInstance;
}

export async function openCheckout(priceId, userId, onSuccess) {
  didComplete = false;
  successCallback = onSuccess;
  const paddle = await getPaddle();
  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customData: { userId },
  });
}
