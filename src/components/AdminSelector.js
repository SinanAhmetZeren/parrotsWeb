import React, { useState } from "react";
import { parrotBlueDarkTransparent, parrotDarkBlue, parrotPlaceholderGrey } from "../styles/colors";

export default function AdminSelector({ selected, setSelected }) {

    const [group, setGroup] = useState("editors");

    const editors = [
        { key: "voyageEditor", label: "Voyage Editor" },
        { key: "bidEditor", label: "Bid Editor" },
        { key: "vehicleEditor", label: "Vehicle Editor" },
        { key: "userEditor", label: "User Editor" },
        { key: "moneyManagement", label: "Money Management" }
    ];

    const metrics = [
        { key: "purchases", label: "Purchases" },
        { key: "transactions", label: "Transactions" },
        { key: "voyagesCreated", label: "Voyages Created" },
        { key: "vehiclesRegistered", label: "Vehicles Registered" },
        { key: "usersCreated", label: "Users Created" },
        { key: "bidsCreated", label: "Bids Created" },
        { key: "bidsAccepted", label: "Bids Accepted" },
        { key: "messaging", label: "Messaging" }
    ];

    const items = group === "editors" ? editors : metrics;

    const topButton = (name) => ({
        padding: "8px 16px",
        cursor: "pointer",
        border: "1px solid #ccc",
        background: group === name ? parrotDarkBlue : parrotBlueDarkTransparent,
        color: group === name ? "white" : parrotPlaceholderGrey,
        opacity: group === name ? 1 : 0.5,
        borderRadius: "6px",
        fontWeight: "bold"
    });

    const itemButton = (name) => ({
        padding: "6px 12px",
        cursor: "pointer",
        border: "1px solid #ddd",
        background: selected === name ? parrotDarkBlue : parrotBlueDarkTransparent,
        color: selected === name ? "white" : parrotPlaceholderGrey,
        opacity: selected === name ? 1 : 0.5,
        borderRadius: "6px"
    });

    return (
        <div style={{ width: "100%", padding: "10px", borderBottom: "1px solid #ddd" }}>

            {/* Row 1 */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <button style={topButton("editors")} onClick={() => setGroup("editors")}>
                    Editors
                </button>

                <button style={topButton("metrics")} onClick={() => setGroup("metrics")}>
                    Metrics
                </button>
            </div>

            {/* Row 2 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {items.map(item => (
                    <button
                        key={item.key}
                        style={itemButton(item.key)}
                        onClick={() => setSelected(item.key)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

        </div>
    );
}