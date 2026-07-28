import React from "react";
import parrotsLogo from "../assets/images/ParrotsLogo.png";
import {
  parrotTextDarkBlue,
} from "../styles/colors";
import { TopLeftComponent } from "./TopLeftComponent";
import { TopBarMenu } from "./TopBarMenu";

export const SomethingWentWrong = ({ onRetry }) => {
  return (
    <div className="App" style={{ position: "relative" }}>
      <header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
          }}
        >
          <div style={styles.container}>
            <div style={styles.imageWrapper}>
              <img
                src={parrotsLogo} // Replace with your image URL
                alt="Error"
                style={styles.image}
              />
            </div>
            <h2 style={styles.message}>Something went wrong</h2>
            <p style={styles.subText}>
              {/* We couldn't connect to the server. Please try again. */}
              We couldn’t connect to Parrots. Please check your connection and
              try again.
            </p>
            <button style={styles.retryButton} onClick={onRetry || (() => window.location.reload())}>
              Reload
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
    width: "100vw",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  imageWrapper: {
    width: "25rem",
    height: "25rem",
    borderRadius: "50%",
    overflow: "hidden",
    // border: "10px solid " + parrotBlueSemiTransparent,
    marginBottom: "20px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  message: {
    fontSize: "24px",
    margin: "0",
    color: parrotTextDarkBlue,
  },
  subText: {
    fontSize: "16px",
    color: parrotTextDarkBlue,
    marginBottom: "20px",
  },
  retryButton: {
    padding: "12px 40px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#1a2f5a",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    letterSpacing: "0.03em",
  },
};
