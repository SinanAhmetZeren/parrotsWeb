import React from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { PulsatingParrotLogo } from "./PulsatingParrotLogo";

const deep = "#081E36";

const cell = {
  borderRadius: 14,
  backgroundColor: "rgba(255,255,255,0.07)",
  boxShadow: "0 8px 24px rgba(0,14,30,.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function ConnectPagePlaceHolder() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", overflow: "hidden", fontFamily: "Nunito, sans-serif", backgroundColor: deep }}>
      <div className="flex mainpage_TopRow">
        <TopLeftComponent />
        <div className="flex mainpage_TopRight"><TopBarMenu /></div>
      </div>
      <div style={{
        maxWidth: 1240,
        width: "100%",
        margin: "0 auto",
        padding: "0 14px 14px",
        display: "grid",
        gridTemplateColumns: "342px minmax(0,1fr)",
        gridTemplateRows: "46rem",
        gap: 14,
        height: "46rem",
      }}>
        <div style={cell}>
          <PulsatingParrotLogo size={80} />
        </div>
        <div style={cell}>
          <PulsatingParrotLogo size={100} />
        </div>
      </div>
    </div>
  );
}
