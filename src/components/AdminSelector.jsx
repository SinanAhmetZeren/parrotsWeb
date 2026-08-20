import React from "react";
import { parrotBlue } from "../styles/colors";

const sections = [
    {
        label: "Editors",
        items: [
            { key: "userEditor", label: "Users" },
            { key: "vehicleEditor", label: "Vehicles" },
            { key: "voyageEditor", label: "Voyages" },
            { key: "bidEditor", label: "Bids" },
            { key: "placeEditorEdit", label: "Places" },
            { key: "termsEditor", label: "Terms of Use" },
            { key: "logViewer", label: "Logs" },
            { key: "docsViewer", label: "Docs" },
        ]
    },
    {
        label: "Metrics",
        items: [
            { key: "usersCreated", label: "Users" },
            { key: "vehiclesRegistered", label: "Vehicles" },
            { key: "voyagesCreated", label: "Voyages" },
            { key: "bidsCreated", label: "Bids" },
            { key: "messaging", label: "Messaging" },
            { key: "purchases", label: "Purchases" },
            { key: "transactions", label: "Transactions" },
        ]
    },
    {
        label: "AI",
        items: [
            { key: "aiQueriesViewer", label: "Ask Parrots" },
            { key: "aiMetrics", label: "AI Metrics" },
        ]
    },
    {
        label: "Register",
        items: [
            { key: "placeEditor", label: "Places" },
        ]
    },
    {
        label: "Config",
        items: [
            { key: "mobileVersionEditor", label: "Mobile Version" },
        ]
    }
];

export default function AdminSelector({ selected, setSelected }) {
    return (
        <div style={{
            width: "9rem",
            padding: "0.75rem 0.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            backgroundColor: parrotBlue,
            height: "100%",
        }}>
            {sections.map(section => (
                <div key={section.label} >
                    <div style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: "rgba(255,255,255,0.5)",
                        padding: "0 0.5rem",
                        marginBottom: "0.35rem",
                    }}>
                        {section.label}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {section.items.map(item => (
                            <button
                                key={item.key}
                                onClick={() => setSelected(item.key)}
                                style={{
                                    textAlign: "left",
                                    padding: "0.35rem 0.6rem",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "0.82rem",
                                    fontWeight: selected === item.key ? 700 : 500,
                                    cursor: "pointer",
                                    backgroundColor: selected === item.key ? "rgba(255,255,255,0.15)" : "transparent",
                                    color: selected === item.key ? "white" : "rgba(255,255,255,0.7)",
                                    transition: "background 0.1s",
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
