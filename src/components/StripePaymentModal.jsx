import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { parrotBlue, parrotDarkBlue, parrotGreen } from "../styles/colors";

console.log("Stripe PK:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ coins, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || processing || !ready) return;
    setProcessing(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement onReady={() => setReady(true)} />
      {error && (
        <div style={{ color: "#ff6b6b", marginTop: "1rem", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button type="button" onClick={onClose} style={cancelBtn} disabled={processing}>
          Cancel
        </button>
        <button type="submit" style={processing || !ready ? payBtnDisabled : payBtn} disabled={processing || !stripe || !ready}>
          {processing ? "Processing..." : `Pay for ${coins} ParrotCoins`}
        </button>
      </div>
    </form>
  );
}

export function StripePaymentModal({ clientSecret, coins, onSuccess, onClose }) {
  const options = { clientSecret, appearance: { theme: "night" } };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ color: "white", marginBottom: "1.5rem" }}>Complete Purchase</h3>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm coins={coins} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex", alignItems: "flex-start", justifyContent: "center",
  zIndex: 1000,
  overflowY: "auto",
  padding: "2rem 1rem",
};

const modal = {
  backgroundColor: parrotDarkBlue,
  border: `1px solid ${parrotBlue}`,
  borderRadius: "1rem",
  padding: "2rem",
  width: "100%",
  maxWidth: "480px",
};

const payBtn = {
  flex: 1,
  backgroundColor: parrotGreen,
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1rem",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "1rem",
};

const payBtnDisabled = {
  ...payBtn,
  opacity: 0.5,
  cursor: "not-allowed",
};

const cancelBtn = {
  flex: 1,
  backgroundColor: "transparent",
  color: "white",
  border: `1px solid ${parrotBlue}`,
  borderRadius: "0.5rem",
  padding: "0.75rem 1rem",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "1rem",
};
