import { initializePaddle } from "@paddle/paddle-js";

// SANDBOX (switch to live when Paddle domain approved — retrieve token from Paddle dashboard)
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
