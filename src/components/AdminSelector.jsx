import React from "react";
import { useSelector } from "react-redux";

const sections = [
    {
        label: "Editors",
        items: [
            { key: "userEditor", label: "Users" },
            { key: "vehicleEditor", label: "Vehicles" },
            { key: "voyageEditor", label: "Voyages" },
            { key: "bidEditor", label: "Bids" },
            { key: "placeEditorEdit", label: "Places" },
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
        label: "Ask Parrots",
        items: [
            { key: "aiQueriesViewer", label: "Ask Parrots" },
            { key: "aiMetrics", label: "AI Metrics" },
        ]
    },
    {
        label: "Places",
        items: [
            { key: "placeEditor", label: "Places" },
        ]
    },
    {
        label: "Config",
        items: [
            { key: "mobileVersionEditor", label: "Mobile Version" },
            { key: "termsEditor", label: "Terms of Use" },
        ]
    },
    {
        label: "Moderation",
        items: [
            { key: "reportsViewer", label: "Reports" },
            { key: "directMessagesViewer", label: "Direct Messages" },
            { key: "groupMessagesViewer", label: "Group Messages" },
        ]
    },
    {
        label: "Logs",
        items: [
            { key: "logViewer", label: "Logs" },
        ]
    },
    {
        label: "Project",
        items: [
            { key: "parrotsImages", label: "ParrotsImages" },
            { key: "docsViewer", label: "Docs" },
        ]
    }
];

function getSectionForKey(key) {
    return sections.find(s => s.items.some(i => i.key === key))?.label ?? sections[0].label;
}

export default function AdminSelector({ selected, setSelected }) {
    const userName = useSelector(state => state.users.userName);
    const activeSection = getSectionForKey(selected);
    const activeSectionItems = sections.find(s => s.label === activeSection)?.items ?? [];

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {/* ── TOP BAR ── */}
            <div style={{
                backgroundColor: "#0f1f35",
                display: "grid",
                gridTemplateColumns: "11rem 1fr auto",
                alignItems: "center",
                padding: "0 1.5rem",
                height: "52px",
                flexShrink: 0,
            }}>
                {/* Logo + brand */}
                <div id="admin-logo" style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginRight: "1rem", flexShrink: 0 }}>
                    <img src="/logo192.png" alt="Parrots" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                    <span style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", whiteSpace: "nowrap" }}>
                        Parrots Admin
                    </span>
                </div>

                {/* Section tabs */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 0, height: "100%", flex: 1 }}>
                    {sections.map(section => {
                        const isActive = section.label === activeSection;
                        return (
                            <button
                                key={section.label}
                                onClick={() => setSelected(section.items[0].key)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    borderBottom: isActive ? "3px solid #4ade80" : "3px solid transparent",
                                    color: isActive ? "white" : "rgba(255,255,255,0.55)",
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: "0.72rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                    padding: "0 1rem",
                                    height: "100%",
                                    whiteSpace: "nowrap",
                                    transition: "color 0.15s",
                                }}
                            >
                                {section.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right: env badge + user */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexShrink: 0 }}>
                    <span style={{
                        backgroundColor: "#16a34a",
                        color: "white",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: "4px",
                    }}>
                        Production
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem" }}>
                        {userName ? `${userName}` : "admin"}
                    </span>
                </div>
            </div>

            {/* ── SUB-TAB ROW ── */}
            {activeSectionItems.length >= 2 && <div style={{
                backgroundColor: "white",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.55rem 1.5rem 0.55rem calc(1.5rem + 12rem)",
                flexShrink: 0,
            }}>
                {activeSectionItems.map(item => {
                    const isActive = selected === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => setSelected(item.key)}
                            style={{
                                border: isActive ? "none" : "1px solid #d1d5db",
                                borderRadius: "999px",
                                padding: "0.35rem 1rem",
                                fontSize: "0.82rem",
                                fontWeight: isActive ? 700 : 500,
                                cursor: "pointer",
                                backgroundColor: isActive ? "#0f1f35" : "white",
                                color: isActive ? "white" : "#374151",
                                transition: "background 0.15s, color 0.15s",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>}
        </div>
    );
}
