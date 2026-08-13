import { initializePaddle } from "@paddle/paddle-js";

const CLIENT_TOKEN = process.env.REACT_APP_PADDLE_CLIENT_TOKEN;
export const PADDLE_PRICE_IDS = {
  "NEST PACK":   process.env.REACT_APP_PADDLE_PRICE_NEST,
  "FLOCK PACK":  process.env.REACT_APP_PADDLE_PRICE_FLOCK,
  "COLONY PACK": process.env.REACT_APP_PADDLE_PRICE_COLONY,
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
