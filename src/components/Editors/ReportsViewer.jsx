import React, { useState } from "react";
import {
    useGetReportsQuery,
    useMarkReportReviewedMutation,
    useSuspendUserMutation,
    useUnsuspendUserMutation,
} from "../../slices/MetricsSlice";

const PAGE_SIZE = 50;

export function ReportsViewer() {
    const [statusFilter, setStatusFilter] = useState("pending");
    const [page, setPage] = useState(1);
    const [suspendReason, setSuspendReason] = useState({});
    const [suspendStatus, setSuspendStatus] = useState({});
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    const toLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const [fromDate, setFromDate] = useState(toLocal(oneWeekAgo));
    const [toDate, setToDate] = useState(toLocal(now));

    const { data, isLoading, isError, refetch } = useGetReportsQuery(
        { status: statusFilter || undefined, page, pageSize: PAGE_SIZE, from: fromDate || undefined, to: toDate || undefined },
        { refetchOnMountOrArgChange: true }
    );

    const [markReviewed] = useMarkReportReviewedMutation();
    const [suspendUser] = useSuspendUserMutation();
    const [unsuspendUser] = useUnsuspendUserMutation();

    const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 1;

    async function handleMarkReviewed(id) {
        await markReviewed(id);
    }

    async function handleSuspend(userId) {
        const reason = suspendReason[userId] || "";
        setSuspendStatus(p => ({ ...p, [userId]: "suspending" }));
        await suspendUser({ userId, reason });
        setSuspendStatus(p => ({ ...p, [userId]: "suspended" }));
        refetch();
    }

    async function handleUnsuspend(userId) {
        setSuspendStatus(p => ({ ...p, [userId]: "unsuspending" }));
        await unsuspendUser(userId);
        setSuspendStatus(p => ({ ...p, [userId]: "unsuspended" }));
        refetch();
    }

    return (
        <div style={{ padding: "1.5rem", fontFamily: "sans-serif", fontSize: "0.82rem", color: "#1e293b", display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>

            {/* FILTERS */}
            <div style={card}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
                    <FSel
                        label="STATUS"
                        value={statusFilter}
                        onChange={v => { setStatusFilter(v); setPage(1); }}
                        options={["pending", "reviewed", ""]}
                        labels={["Pending", "Reviewed", "All"]}
                    />
                    <FDate label="FROM" value={fromDate} onChange={v => { setFromDate(v); setPage(1); }} />
                    <FDate label="TO" value={toDate} onChange={v => { setToDate(v); setPage(1); }} />
                    {(fromDate || toDate) && (
                        <button
                            onClick={() => { setFromDate(""); setToDate(""); setPage(1); }}
                            style={{ marginBottom: 1, padding: "4px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: "0.75rem", color: "#64748b", backgroundColor: "white", cursor: "pointer" }}
                        >
                            Clear dates
                        </button>
                    )}
                    <span style={{ color: "#64748b", fontSize: "0.78rem", marginBottom: 2 }}>
                        {data ? `${data.totalCount} report${data.totalCount !== 1 ? "s" : ""}` : ""}
                    </span>
                </div>
            </div>

            {/* TABLE */}
            <div style={card}>
                {isLoading && <div style={empty}>Loading…</div>}
                {isError && <div style={{ ...empty, color: "#dc2626" }}>Error loading reports.</div>}
                {!isLoading && !isError && data?.items.length === 0 && (
                    <div style={empty}>No reports found.</div>
                )}

                {data && data.items.length > 0 && (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ borderCollapse: "collapse", fontSize: "0.78rem", width: "100%", tableLayout: "fixed" }}>
                            <colgroup>
                                <col style={{ width: "3rem" }} />
                                <col style={{ width: "8rem" }} />
                                <col style={{ width: "9rem" }} />
                                <col style={{ width: "10rem" }} />
                                <col style={{ width: "6rem" }} />
                                <col style={{ width: "13rem" }} />
                                <col style={{ width: "6rem" }} />
                                <col style={{ width: "9rem" }} />
                                <col style={{ width: "20rem" }} />
                            </colgroup>
                            <thead>
                                <tr style={{ backgroundColor: "#0f2744", color: "#94a3b8" }}>
                                    <th style={th}>ID</th>
                                    <th style={th}>DATE</th>
                                    <th style={th}>REPORTER</th>
                                    <th style={th}>REPORTED</th>
                                    <th style={th}>TYPE</th>
                                    <th style={th}>REASON</th>
                                    <th style={th}>STATUS</th>
                                    <th style={th}>REVIEW</th>
                                    <th style={th}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((row, i) => (
                                    <tr key={row.id} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                        <td style={td}>{row.id}</td>
                                        <td style={td}>{fmtDate(row.createdAt)}</td>
                                        <td style={{ ...td, color: "#475569" }}>{row.reporterUsername ?? "—"}</td>
                                        <td style={{ ...td, fontWeight: 600 }}>
                                            {row.reportedUsername ? (
                                                <span style={{ color: (row.isUserSuspended || suspendStatus[row.reportedUserId] === "suspended") ? "#dc2626" : "inherit" }}>
                                                    {row.reportedUsername}
                                                </span>
                                            ) : row.reportedVoyageId ? `Voyage ID: ${row.reportedVoyageId}` : "—"}
                                            {row.voyageName && <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 400 }}>{row.voyageName}</div>}
                                        </td>
                                        <td style={td}>
                                            {row.reportedUserId
                                                ? <Badge color="#fee2e2" text="#b91c1c">User</Badge>
                                                : <Badge color="#fef9c3" text="#854d0e">Voyage</Badge>}
                                        </td>
                                        <td style={td}><Badge color="#ede9fe" text="#6d28d9">{row.reason}</Badge></td>
                                        <td style={td}>
                                            {row.status === "pending"
                                                ? <span style={{ color: "#f59e0b", fontWeight: 700 }}>Pending</span>
                                                : <span style={{ color: "#16a34a", fontWeight: 700 }}>Reviewed</span>}
                                        </td>
                                        <td style={td}>
                                            {row.status === "pending" && (
                                                <button onClick={() => handleMarkReviewed(row.id)} style={reviewBtn}>
                                                    ✓ Mark reviewed
                                                </button>
                                            )}
                                        </td>
                                        <td style={{ ...td, whiteSpace: "normal" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                                {row.reportedUserId && (() => {
                                                    const st = suspendStatus[row.reportedUserId];
                                                    const busy = st === "suspending" || st === "unsuspending";
                                                    return (
                                                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                                                            <input
                                                                placeholder="Suspend reason…"
                                                                value={suspendReason[row.reportedUserId] ?? ""}
                                                                onChange={e => setSuspendReason(p => ({ ...p, [row.reportedUserId]: e.target.value }))}
                                                                style={reasonInput}
                                                                disabled={busy}
                                                            />
                                                            <button
                                                                onClick={() => handleSuspend(row.reportedUserId)}
                                                                disabled={busy}
                                                                style={{ ...suspendBtn, opacity: busy ? 0.6 : 1 }}
                                                            >
                                                                {st === "suspending" ? "Suspending…" : st === "suspended" ? "✓ Suspended" : "Suspend"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleUnsuspend(row.reportedUserId)}
                                                                disabled={busy}
                                                                style={{ ...unsuspendBtn, opacity: busy ? 0.6 : 1 }}
                                                            >
                                                                {st === "unsuspending" ? "Unsuspending…" : st === "unsuspended" ? "✓ Unsuspended" : "Unsuspend"}
                                                            </button>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", alignItems: "center" }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pgBtn}>← Prev</button>
                        <span style={{ color: "#64748b", fontSize: "0.78rem" }}>Page {page} / {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pgBtn}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Badge({ children, color, text }) {
    if (!children) return <span style={{ color: "#cbd5e1" }}>—</span>;
    return (
        <span style={{ backgroundColor: color, color: text, borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 500, whiteSpace: "nowrap" }}>
            {children}
        </span>
    );
}

function FDate({ label, value, onChange }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{label}</span>
            <input
                type="datetime-local"
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{
                    border: "1px solid #e2e8f0", borderRadius: 8, padding: "0 6px",
                    fontSize: "0.75rem", color: "#0f172a", backgroundColor: "white", outline: "none",
                    height: 30, boxSizing: "border-box",
                }}
            />
        </div>
    );
}

function FSel({ label, value, onChange, options, labels }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{label}</span>
            <select value={value} onChange={e => onChange(e.target.value)} style={{
                border: "1px solid #e2e8f0", borderRadius: 8, padding: "0 6px",
                fontSize: "0.75rem", color: "#0f172a", backgroundColor: "white", outline: "none",
                height: 30, boxSizing: "border-box",
            }}>
                {options.map((o, i) => <option key={i} value={o}>{labels ? labels[i] : o}</option>)}
            </select>
        </div>
    );
}

function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

const card = { background: "white", borderRadius: 12, padding: "1rem 1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" };
const th = { padding: "0.6rem 0.9rem", whiteSpace: "nowrap", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.04em", textAlign: "left" };
const td = { padding: "0.5rem 0.9rem", verticalAlign: "middle", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const empty = { color: "#94a3b8", padding: "1.5rem 0", textAlign: "center" };

const reviewBtn = {
    backgroundColor: "#dcfce7", color: "#15803d", border: "none",
    borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: "0.74rem", fontWeight: 600,
};
const suspendBtn = {
    backgroundColor: "#fee2e2", color: "#b91c1c", border: "none",
    borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: "0.74rem", fontWeight: 600, whiteSpace: "nowrap",
};
const unsuspendBtn = {
    backgroundColor: "#f1f5f9", color: "#475569", border: "none",
    borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: "0.74rem", fontWeight: 600, whiteSpace: "nowrap",
};
const reasonInput = {
    border: "1px solid #e2e8f0", borderRadius: 6, padding: "3px 8px",
    fontSize: "0.74rem", color: "#0f172a", width: 130, outline: "none",
};
const pgBtn = {
    backgroundColor: "white", color: "#475569", border: "1px solid #e2e8f0",
    borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: "0.78rem",
};
