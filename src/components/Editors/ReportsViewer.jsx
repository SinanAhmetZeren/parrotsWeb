import React, { useState } from "react";
import {
    useGetModerationFeedQuery,
    useMarkReportReviewedMutation,
    useSuspendUserMutation,
    useUnsuspendUserMutation,
} from "../../slices/MetricsSlice";

const PAGE_SIZE = 50;

const STATUS_OPTIONS = [
    { value: "all",      label: "All" },
    { value: "pending",  label: "Pending" },
    { value: "reviewed", label: "Reviewed" },
    { value: "deleted",  label: "Deleted" },
];

export function ReportsViewer() {
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [page, setPage] = useState(1);
    const [suspendReason, setSuspendReason] = useState({});
    const [suspendStatus, setSuspendStatus] = useState({});

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    const toLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const [fromDate, setFromDate] = useState(toLocal(oneWeekAgo));
    const [toDate, setToDate] = useState(toLocal(now));

    const [queryParams, setQueryParams] = useState({ status: [], page: 1, pageSize: PAGE_SIZE, from: toLocal(oneWeekAgo), to: toLocal(now) });
    const [fetching, setFetching] = useState(false);

    const { data, isLoading, isError, refetch } = useGetModerationFeedQuery(queryParams, { refetchOnMountOrArgChange: false });

    async function handleFetch() {
        setFetching(true);
        setQueryParams({ status: selectedStatuses, page, pageSize: PAGE_SIZE, from: fromDate || undefined, to: toDate || undefined });
        await refetch();
        setFetching(false);
    }

    const [markReviewed] = useMarkReportReviewedMutation();
    const [suspendUser] = useSuspendUserMutation();
    const [unsuspendUser] = useUnsuspendUserMutation();

    const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 1;

    function toggleStatus(val) {
        setPage(1);
        if (val === "all") {
            setSelectedStatuses([]);
            return;
        }
        setSelectedStatuses(prev =>
            prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]
        );
    }

    async function handleMarkReviewed(id) {
        await markReviewed({ id, reviewed: true });
        refetch();
    }

    async function handleMarkUnreviewed(id) {
        await markReviewed({ id, reviewed: false });
        refetch();
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
    }

    return (
        <div style={{ padding: "1.5rem", fontFamily: "sans-serif", fontSize: "0.82rem", color: "#1e293b", display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>

            {/* FILTERS */}
            <div style={card}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
                    {/* STATUS multi-select chips */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>STATUS</span>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                            {STATUS_OPTIONS.map(opt => {
                                const active = opt.value === "all"
                                    ? selectedStatuses.length === 0
                                    : selectedStatuses.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => toggleStatus(opt.value)}
                                        style={{
                                            padding: "3px 12px", borderRadius: 20, fontSize: "0.75rem", cursor: "pointer",
                                            border: active ? "none" : "1px solid #e2e8f0",
                                            backgroundColor: active ? "#0f2744" : "white",
                                            color: active ? "white" : "#475569",
                                            fontWeight: active ? 600 : 400,
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

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
                    <button
                        onClick={handleFetch}
                        disabled={fetching || isLoading}
                        style={{ marginBottom: 1, padding: "4px 16px", border: "none", borderRadius: 6, fontSize: "0.75rem", color: "white", backgroundColor: "#0f2744", cursor: (fetching || isLoading) ? "not-allowed" : "pointer", fontWeight: 600, opacity: (fetching || isLoading) ? 0.7 : 1, display: "flex", alignItems: "center", gap: "0.4rem" }}
                    >
                        {(fetching || isLoading) && <span style={{ width: 10, height: 10, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />}
                        {(fetching || isLoading) ? "Fetching…" : "Fetch"}
                    </button>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <span style={{ color: "#64748b", fontSize: "0.78rem", marginBottom: 2 }}>
                        {data ? `${data.totalCount} item${data.totalCount !== 1 ? "s" : ""}` : ""}
                    </span>
                </div>
            </div>

            {/* TABLE */}
            <div style={card}>
                {(fetching || isLoading) && <div style={empty}>Loading…</div>}
                {isError && <div style={{ ...empty, color: "#dc2626" }}>Error loading data.</div>}
                {!isLoading && !isError && data?.items.length === 0 && (
                    <div style={empty}>No items found.</div>
                )}

                {data && data.items.length > 0 && (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ borderCollapse: "collapse", fontSize: "0.78rem", width: "100%", tableLayout: "fixed" }}>
                            <colgroup>
                                <col style={{ width: "4rem" }} />
                                <col style={{ width: "8rem" }} />
                                <col style={{ width: "9rem" }} />
                                <col style={{ width: "8rem" }} />
                                <col style={{ width: "4rem" }} />
                                <col style={{ width: "6rem" }} />
                                <col style={{ width: "4rem" }} />
                                <col style={{ width: "4rem" }} />
                                <col style={{ width: "22rem" }} />
                            </colgroup>
                            <thead>
                                <tr style={{ backgroundColor: "#0f2744", color: "#94a3b8" }}>
                                    <th style={th}>DATE</th>
                                    <th style={th}>REPORTER</th>
                                    <th style={th}>REPORTED</th>
                                    <th style={th}>EMAIL</th>
                                    <th style={th}>TYPE</th>
                                    <th style={th}>REASON</th>
                                    <th style={th}>STATUS</th>
                                    <th style={th}>SUSPENDED</th>
                                    <th style={th}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((row, i) => {
                                    const isDeleted = row.rowType === "deleted";
                                    const st = suspendStatus[row.reportedUserId];
                                    const busy = st === "suspending" || st === "unsuspending";

                                    return (
                                        <tr key={`${row.rowType}-${row.id ?? row.reportedUserId}-${i}`} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                            <td style={{ ...td, fontSize: "0.72rem" }}>
                                                <div>{fmtDate(row.createdAt).date}</div>
                                                <div style={{ color: "#94a3b8" }}>{fmtDate(row.createdAt).time}</div>
                                            </td>
                                            <td style={td}>
                                                <div style={{ fontWeight: 500, color: "#475569" }}>{row.reporterUsername ?? "—"}</div>
                                                {row.reporterId && <CopyId id={row.reporterId} />}
                                            </td>
                                            <td style={td}>
                                                {row.reportedUsername ? (
                                                    <>
                                                        <div style={{ fontWeight: 600, color: (row.isUserSuspended || st === "suspended") ? "#dc2626" : "#0f172a" }}>{row.reportedUsername}</div>
                                                        {row.reportedUserId && <CopyId id={row.reportedUserId} />}
                                                    </>
                                                ) : row.reportedVoyageId ? (
                                                    <>
                                                        <div style={{ fontWeight: 600 }}>{row.voyageName ?? "Voyage"}</div>
                                                        <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Voyage ID: {row.reportedVoyageId}</div>
                                                        {row.voyageOwnerUsername && <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Owner: {row.voyageOwnerUsername}</div>}
                                                        {row.voyageOwnerUserId && <CopyId id={row.voyageOwnerUserId} />}
                                                    </>
                                                ) : row.reportedUserId ? (
                                                    <>
                                                        <div style={{ fontWeight: 600, color: "#94a3b8" }}>—</div>
                                                        <CopyId id={row.reportedUserId} />
                                                    </>
                                                ) : "—"}
                                            </td>
                                            <td style={{ ...td, fontSize: "0.7rem", color: "#64748b" }}>
                                                {row.reportedUserEmail
                                                    ? <CopyId id={row.reportedUserEmail} />
                                                    : "—"}
                                            </td>
                                            <td style={td}>
                                                {isDeleted
                                                    ? <Badge color="#fce7f3" text="#9d174d">{row.reason === "self-suspended" ? "Self-deleted" : "Admin-suspended"}</Badge>
                                                    : row.reportedUserId
                                                        ? <Badge color="#fee2e2" text="#b91c1c">User</Badge>
                                                        : <Badge color="#fef9c3" text="#854d0e">Voyage</Badge>}
                                            </td>
                                            <td style={{ ...td, whiteSpace: "normal", wordBreak: "break-word", textAlign: "center", fontSize: "0.75rem", color: "#475569" }}>{row.reason ?? "—"}</td>
                                            <td style={td}>
                                                {row.status === "pending"
                                                    ? <span style={{ color: "#f59e0b", fontWeight: 700 }}>Pending</span>
                                                    : row.status === "reviewed"
                                                        ? <span style={{ color: "#16a34a", fontWeight: 700 }}>Reviewed</span>
                                                        : <span style={{ color: "#dc2626", fontWeight: 700 }}>Deleted</span>}
                                            </td>
                                            <td style={td}>
                                                {(() => {
                                                    const isVoyageRow = !!row.reportedVoyageId;
                                                    let isSuspended;
                                                    if (isDeleted) {
                                                        isSuspended = st === "unsuspended" ? false : (row.currentSuspensionStatus !== "unsuspended");
                                                    } else if (isVoyageRow) {
                                                        isSuspended = row.isVoyageOwnerSuspended || suspendStatus[row.voyageOwnerUserId] === "suspended";
                                                    } else {
                                                        isSuspended = row.isUserSuspended || st === "suspended";
                                                    }
                                                    return isSuspended
                                                        ? <Badge color="#fee2e2" text="#b91c1c">Yes</Badge>
                                                        : <Badge color="#dcfce7" text="#15803d">No</Badge>;
                                                })()}
                                            </td>
                                            <td style={{ ...td, whiteSpace: "normal" }}>
                                                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "nowrap" }}>
                                                    {isDeleted
                                                        ? <button disabled style={{ ...reviewBtn, width: "7.5rem", opacity: 0.3, cursor: "default" }}>Mark reviewed</button>
                                                        : row.status === "pending"
                                                            ? <button onClick={() => handleMarkReviewed(row.id)} style={{ ...reviewBtn, width: "7.5rem" }}>Mark reviewed</button>
                                                            : <button onClick={() => handleMarkUnreviewed(row.id)} style={{ ...reviewBtn, backgroundColor: "#fef9c3", color: "#854d0e", width: "7.5rem" }}>Mark pending</button>
                                                    }
                                                    {/* User report actions */}
                                                    {!isDeleted && row.reportedUserId && !row.reportedVoyageId && (() => {
                                                        const isSuspended = row.isUserSuspended || st === "suspended";
                                                        return (
                                                            <>
                                                                <input
                                                                    placeholder="Suspend reason…"
                                                                    value={suspendReason[row.reportedUserId] ?? ""}
                                                                    onChange={e => setSuspendReason(p => ({ ...p, [row.reportedUserId]: e.target.value }))}
                                                                    style={{ ...reasonInput, opacity: isSuspended ? 0.4 : 1 }}
                                                                    disabled={busy || isSuspended}
                                                                />
                                                                <button onClick={() => handleSuspend(row.reportedUserId)} disabled={busy || isSuspended} style={{ ...suspendBtn, opacity: isSuspended || busy ? 0.4 : 1 }}>
                                                                    {st === "suspending" ? "Suspending…" : "Suspend User"}
                                                                </button>
                                                                <button onClick={() => handleUnsuspend(row.reportedUserId)} disabled={busy || !isSuspended} style={{ ...unsuspendBtn, opacity: (busy || !isSuspended) ? 0.4 : 1, display: "flex", alignItems: "center", gap: "0.3rem", cursor: !isSuspended ? "default" : "pointer" }}>
                                                                    {st === "unsuspending" && <span style={{ width: 9, height: 9, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#475569", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />}
                                                                    {st === "unsuspending" ? "" : st === "unsuspended" ? "Restored" : "Restore"}
                                                                </button>
                                                            </>
                                                        );
                                                    })()}
                                                    {/* Voyage report actions — suspend the owner */}
                                                    {!isDeleted && row.reportedVoyageId && row.voyageOwnerUserId && (() => {
                                                        const vst = suspendStatus[row.voyageOwnerUserId];
                                                        const vbusy = vst === "suspending" || vst === "unsuspending";
                                                        const isSuspended = row.isVoyageOwnerSuspended || vst === "suspended";
                                                        return (
                                                            <>
                                                                <input
                                                                    placeholder="Suspend reason…"
                                                                    value={suspendReason[row.voyageOwnerUserId] ?? ""}
                                                                    onChange={e => setSuspendReason(p => ({ ...p, [row.voyageOwnerUserId]: e.target.value }))}
                                                                    style={{ ...reasonInput, opacity: isSuspended ? 0.4 : 1 }}
                                                                    disabled={vbusy || isSuspended}
                                                                />
                                                                <button onClick={() => handleSuspend(row.voyageOwnerUserId)} disabled={vbusy || isSuspended} style={{ ...suspendBtn, opacity: isSuspended || vbusy ? 0.4 : 1 }}>
                                                                    {vst === "suspending" ? "Suspending…" : "Suspend User"}
                                                                </button>
                                                                <button onClick={() => handleUnsuspend(row.voyageOwnerUserId)} disabled={vbusy || !isSuspended} style={{ ...unsuspendBtn, opacity: (vbusy || !isSuspended) ? 0.4 : 1, display: "flex", alignItems: "center", gap: "0.3rem", cursor: !isSuspended ? "default" : "pointer" }}>
                                                                    {vst === "unsuspending" && <span style={{ width: 9, height: 9, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#475569", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />}
                                                                    {vst === "unsuspending" ? "" : vst === "unsuspended" ? "Restored" : "Restore"}
                                                                </button>
                                                            </>
                                                        );
                                                    })()}
                                                    {/* Deleted row — restore only */}
                                                    {isDeleted && row.reportedUserId && (() => {
                                                        const isAlreadyRestored = st === "unsuspended" || row.currentSuspensionStatus === "unsuspended";
                                                        const isCurrentlySuspended = !isAlreadyRestored || st === "suspended";
                                                        const dbusy = st === "suspending" || st === "unsuspending";
                                                        return (
                                                            <>
                                                                <input
                                                                    placeholder="Suspend reason…"
                                                                    value={suspendReason[row.reportedUserId] ?? ""}
                                                                    onChange={e => setSuspendReason(p => ({ ...p, [row.reportedUserId]: e.target.value }))}
                                                                    style={{ ...reasonInput, opacity: isCurrentlySuspended ? 0.4 : 1 }}
                                                                    disabled={dbusy || isCurrentlySuspended}
                                                                />
                                                                <button onClick={() => handleSuspend(row.reportedUserId)} disabled={dbusy || isCurrentlySuspended} style={{ ...suspendBtn, opacity: (isCurrentlySuspended || dbusy) ? 0.4 : 1, cursor: isCurrentlySuspended ? "default" : "pointer" }}>
                                                                    {st === "suspending" ? "Suspending…" : "Suspend User"}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUnsuspend(row.reportedUserId)}
                                                                    disabled={dbusy || !isCurrentlySuspended}
                                                                    style={{ ...unsuspendBtn, opacity: (dbusy || !isCurrentlySuspended) ? 0.4 : 1, display: "flex", alignItems: "center", gap: "0.3rem", cursor: !isCurrentlySuspended ? "default" : "pointer" }}
                                                                >
                                                                    {st === "unsuspending" && <span style={{ width: 9, height: 9, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#475569", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />}
                                                                    {st === "unsuspending" ? "" : !isCurrentlySuspended ? "Restored" : "Restore"}
                                                                </button>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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

function CopyId({ id }) {
    const [copied, setCopied] = useState(false);
    function handleCopy() {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.68rem", color: "#94a3b8" }}>
            <span title={id}>{id.slice(0, 20)}…</span>
            <button onClick={handleCopy} title="Copy ID" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: copied ? "#16a34a" : "#64748b", lineHeight: 1, fontSize: "1rem" }}>
                {copied ? "✓" : "⧉"}
            </button>
        </div>
    );
}

function Badge({ children, color, text }) {
    if (!children) return <span style={{ color: "#cbd5e1" }}>—</span>;
    return (
        <span style={{ backgroundColor: color, color: text, borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 500, whiteSpace: "normal", wordBreak: "break-word" }}>
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

function fmtDate(iso) {
    const d = new Date(iso);
    const date = d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = d.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
}

const card = { background: "white", borderRadius: 12, padding: "1rem 1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" };
const th = { padding: "0.6rem 0.9rem", whiteSpace: "nowrap", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.04em", textAlign: "left", borderRight: "1px solid #1e3a5f" };
const td = { padding: "0.5rem 0.9rem", verticalAlign: "middle", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", borderRight: "1px solid #e2e8f0" };
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
