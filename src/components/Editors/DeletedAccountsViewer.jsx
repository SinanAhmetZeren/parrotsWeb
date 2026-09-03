import React, { useState } from "react";
import {
    useGetDeletedAccountsQuery,
    useUnsuspendUserMutation,
} from "../../slices/MetricsSlice";

export function DeletedAccountsViewer() {
    const { data, isLoading, isError, refetch } = useGetDeletedAccountsQuery(undefined, { refetchOnMountOrArgChange: true });
    const [unsuspendUser] = useUnsuspendUserMutation();
    const [status, setStatus] = useState({});

    async function handleUnsuspend(userId) {
        setStatus(p => ({ ...p, [userId]: "unsuspending" }));
        await unsuspendUser(userId);
        setStatus(p => ({ ...p, [userId]: "unsuspended" }));
        refetch();
    }

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>Deleted Accounts</h2>
            {isLoading && <p>Loading…</p>}
            {isError && <p style={{ color: "red" }}>Failed to load.</p>}
            {data && data.length === 0 && <p style={{ color: "#888" }}>No deleted accounts.</p>}
            {data && data.length > 0 && (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Username</th>
                            <th style={thStyle}>Deleted At</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => {
                            const st = status[row.userId];
                            const busy = st === "unsuspending";
                            return (
                                <tr key={row.userId} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                    <td style={tdStyle}>
                                        <span style={{ color: "#CB0404", fontWeight: 500 }}>{row.username ?? "—"}</span>
                                    </td>
                                    <td style={tdStyle}>{new Date(row.createdAt).toLocaleString()}</td>
                                    <td style={tdStyle}>
                                        {st === "unsuspended" ? (
                                            <span style={{ color: "#16a34a", fontWeight: 500 }}>✓ Restored</span>
                                        ) : (
                                            <button
                                                onClick={() => handleUnsuspend(row.userId)}
                                                disabled={busy}
                                                style={{ ...unsuspendBtn, opacity: busy ? 0.6 : 1 }}
                                            >
                                                {busy ? "Restoring…" : "Restore Account"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const thStyle = {
    textAlign: "left",
    padding: "10px 14px",
    backgroundColor: "#f9fafb",
    fontWeight: 600,
    fontSize: "0.85rem",
    borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
    padding: "10px 14px",
    fontSize: "0.9rem",
    verticalAlign: "middle",
};

const unsuspendBtn = {
    padding: "4px 12px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.85rem",
};
