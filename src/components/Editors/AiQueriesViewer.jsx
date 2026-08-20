import React, { useState } from "react";
import { useGetAiQueriesQuery } from "../../slices/MetricsSlice";

const PAGE_SIZE = 50;
const ROW_HEIGHT = 52;
const HEADER_HEIGHT = 44;
const VISIBLE_ROWS = 2;

const VEHICLES = ["Boat", "Car", "Caravan", "Bus", "Walk", "Run", "Motorcycle", "Bicycle", "TinyHouse", "Airplane", "Train"];
const DURATIONS = ["Half day", "1 day", "2-3 days", "1 week", "2 weeks"];
const VIBES = ["Culture", "Food", "Nature", "Chill", "Adventure", "Budget", "Scenic", "Any"];
const SPOT_TYPES = ["Popular Spots", "Local Favorites", "Hidden Gems", "Mixed Picks"];
const RADII = [{ label: "1km", value: "1" }, { label: "5km", value: "5" }, { label: "10km", value: "10" }, { label: "50km", value: "50" }];
const MODELS = ["gemini-flash-lite-latest", "gemini-flash-latest"];

export function AiQueriesViewer() {
    const today = new Date().toISOString().slice(0, 10);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const defaultFilters = {
        userId: "", vehicleType: "", duration: "", vibe: "",
        spotType: "", radiusKm: "", from: monthAgo, to: today, isSuccess: "", model: "",
    };

    const [filters, setFilters] = useState(defaultFilters);
    const [pendingFilters, setPendingFilters] = useState(defaultFilters);
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [applied, setApplied] = useState(false);

    const queryParams = {
        page, pageSize: PAGE_SIZE,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "")),
    };
    if (filters.isSuccess !== "") queryParams.isSuccess = filters.isSuccess === "true";

    const { data, isLoading, isError, isFetching, refetch } = useGetAiQueriesQuery(queryParams, { skip: !applied });

    const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 1;
    const selectedRow = data?.items.find(r => r.id === selectedId) ?? null;

    function applyFilters() { setFilters(pendingFilters); setPage(1); setSelectedId(null); if (applied) { refetch(); } else { setApplied(true); } }
    function clearFilters() { setPendingFilters(defaultFilters); setFilters(defaultFilters); setPage(1); setApplied(false); setSelectedId(null); }
    function setPending(key, val) { setPendingFilters(p => ({ ...p, [key]: val })); }

    return (
        <div style={{ padding: "1.5rem", fontFamily: "sans-serif", fontSize: "0.82rem", color: "#1e293b", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* ── 1. FILTERS ── */}
            <div style={card}>
                <div style={{ display: "flex", flexWrap: "nowrap", gap: "0.5rem", alignItems: "flex-end", overflowX: "auto" }}>
                    <FText label="USER ID" value={pendingFilters.userId} onChange={v => setPending("userId", v)} width={240} />
                    <FSel label="VEHICLE" value={pendingFilters.vehicleType} onChange={v => setPending("vehicleType", v)} options={VEHICLES} />
                    <FSel label="DURATION" value={pendingFilters.duration} onChange={v => setPending("duration", v)} options={DURATIONS} />
                    <FSel label="VIBE" value={pendingFilters.vibe} onChange={v => setPending("vibe", v)} options={VIBES} />
                    <FSel label="SPOT TYPE" value={pendingFilters.spotType} onChange={v => setPending("spotType", v)} options={SPOT_TYPES} />
                    <FSel label="RADIUS" value={pendingFilters.radiusKm} onChange={v => setPending("radiusKm", v)} options={RADII.map(r => r.value)} labels={RADII.map(r => r.label)} />
                    <FText label="FROM" value={pendingFilters.from} onChange={v => setPending("from", v)} type="date" width={130} />
                    <FText label="TO" value={pendingFilters.to} onChange={v => setPending("to", v)} type="date" width={130} />
                    <FSel label="STATUS" value={pendingFilters.isSuccess} onChange={v => setPending("isSuccess", v)} options={["true", "false"]} labels={["Success", "Failed"]} />
                    <FSel label="MODEL" value={pendingFilters.model} onChange={v => setPending("model", v)} options={MODELS} labels={MODELS.map(shortModel)} />
                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "flex-end", paddingBottom: "1px" }}>
                        <button onClick={applyFilters} style={applyBtn}>Apply</button>
                        <button onClick={clearFilters} style={clearBtn}>Clear</button>
                    </div>
                </div>
            </div>

            {/* ── 2. TABLE ── */}
            <div style={card}>
                {!applied && (
                    <div style={{ color: "#94a3b8", padding: "1.5rem 0", textAlign: "center" }}>Press Apply to load results.</div>
                )}
                {applied && isLoading && <div style={{ color: "#64748b", padding: "1.5rem 0", textAlign: "center" }}>Loading…</div>}
                {applied && isError && <div style={{ color: "#dc2626", padding: "1.5rem 0", textAlign: "center" }}>Error loading data.</div>}
                {applied && !isLoading && !isError && data?.items.length === 0 && (
                    <div style={{ color: "#64748b", padding: "1.5rem 0", textAlign: "center" }}>No records found.</div>
                )}

                {applied && data && data.items.length > 0 && (<>

                    <div style={{ overflowX: "auto" }}>
                        <div style={{ maxHeight: VISIBLE_ROWS * ROW_HEIGHT + HEADER_HEIGHT, overflowY: "auto" }}>
                            <table style={{ borderCollapse: "collapse", fontSize: "0.78rem", tableLayout: "fixed", width: "100%" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#0f2744", color: "#94a3b8" }}>
                                        <th style={{ ...th, width: "2.5rem" }}>ID</th>
                                        <th style={{ ...th, width: "7rem" }}>DATE</th>
                                        <th style={{ ...th, width: "17rem" }}>USER ID</th>
                                        <th style={{ ...th, width: "5.5rem" }}>VEHICLE</th>
                                        <th style={{ ...th, width: "5.5rem" }}>DURATION</th>
                                        <th style={{ ...th, width: "4.5rem" }}>VIBE</th>
                                        <th style={{ ...th, width: "7.5rem" }}>SPOT TYPE</th>
                                        <th style={{ ...th, width: "4rem" }}>RADIUS</th>
                                        <th style={{ ...th, width: "6rem" }}>REQUESTED</th>
                                        <th style={{ ...th, width: "4rem" }}>MS</th>
                                        <th style={{ ...th, width: "3.5rem" }}>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((row, i) => (
                                        <tr
                                            key={row.id}
                                            onClick={() => setSelectedId(selectedId === row.id ? null : row.id)}
                                            style={{
                                                backgroundColor: selectedId === row.id ? "#eff6ff" : i % 2 === 0 ? "white" : "#f8fafc",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #e2e8f0",
                                                height: ROW_HEIGHT,
                                            }}
                                        >
                                            <td style={{ ...td, width: "2.5rem" }}>{row.id}</td>
                                            <td style={{ ...td, width: "7rem" }}>{fmtDate(row.createdAt)}</td>
                                            <td style={{ ...td, width: "17rem", color: "#475569" }}>{row.userId}</td>
                                            <td style={{ ...td, width: "5.5rem" }}><Badge color="#dbeafe" text="#1d4ed8">{row.vehicleType}</Badge></td>
                                            <td style={{ ...td, width: "5.5rem" }}><Badge color="#dcfce7" text="#15803d">{row.duration}</Badge></td>
                                            <td style={{ ...td, width: "4.5rem" }}><Badge color="#fef9c3" text="#854d0e">{row.vibe}</Badge></td>
                                            <td style={{ ...td, width: "7.5rem" }}><Badge color="#f3e8ff" text="#7e22ce">{row.spotType}</Badge></td>
                                            <td style={{ ...td, width: "4rem" }}>{row.radiusKm} km</td>
                                            <td style={{ ...td, width: "6rem", color: "#64748b", fontSize: "0.72rem" }}>{shortModel(row.modelRequested)}</td>
                                            <td style={{ ...td, width: "4rem" }}>{row.durationMs}</td>
                                            <td style={{ ...td, width: "3.5rem" }}>
                                                {row.isSuccess
                                                    ? <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
                                                    : <span style={{ color: "#dc2626", fontWeight: 700 }} title={row.errorMessage ?? ""}>✗</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", alignItems: "center" }}>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pgBtn}>← Prev</button>
                            <span style={{ color: "#64748b", fontSize: "0.78rem" }}>Page {page} / {totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pgBtn}>Next →</button>
                        </div>
                    )}
                </>)}
            </div>

            {/* ── 3. DETAIL PANEL ── */}
            <div style={card}>
                {!selectedRow ? (
                    <div style={{ color: "#94a3b8", padding: "1.5rem 0", textAlign: "center" }}>Select a row to see details.</div>
                ) : (
                    <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1.25rem", borderBottom: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4rem" }}>
                                <SummaryCell label="DATE" value={fmtDate(selectedRow.createdAt)} />
                                <SummaryCell label="USER ID" value={selectedRow.userId} mono />
                                <SummaryCell label="VEHICLE"><Badge color="#dbeafe" text="#1d4ed8">{selectedRow.vehicleType}</Badge></SummaryCell>
                                <SummaryCell label="DURATION"><Badge color="#dcfce7" text="#15803d">{selectedRow.duration}</Badge></SummaryCell>
                                <SummaryCell label="VIBE"><Badge color="#fef9c3" text="#854d0e">{selectedRow.vibe}</Badge></SummaryCell>
                                <SummaryCell label="SPOT TYPE"><Badge color="#f3e8ff" text="#7e22ce">{selectedRow.spotType}</Badge></SummaryCell>
                                <SummaryCell label="LAT / LNG" value={`${selectedRow.latitude.toFixed(4)}, ${selectedRow.longitude.toFixed(4)}`} />
                                <SummaryCell label="RADIUS" value={`${selectedRow.radiusKm} km`} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4rem" }}>
                                <SummaryCell label="SUGGESTED" value={selectedRow.plannedSpotCount} />
                                <SummaryCell label="VERIFIED" value={selectedRow.placesVerified} />
                                <SummaryCell label="TOKENS IN / OUT" value={`${selectedRow.inputTokens} / ${selectedRow.outputTokens}`} />
                                <SummaryCell label="CACHED" value={selectedRow.cachedInputTokens ?? "—"} />
                                <SummaryCell label="DURATION MS" value={`${selectedRow.durationMs} ms`} />
                                <SummaryCell label="MODEL REQUESTED" value={shortModel(selectedRow.modelRequested) || "—"} />
                                <SummaryCell label="MODEL USED" value={shortModel(selectedRow.modelUsed)} />
                                <SummaryCell label="STATUS" value={selectedRow.isSuccess ? "✓ Success" : "✗ Failed"} valueColor={selectedRow.isSuccess ? "#16a34a" : "#dc2626"} />
                                {selectedRow.errorMessage && <SummaryCell label="ERROR" value={selectedRow.errorMessage} valueColor="#dc2626" />}
                            </div>
                        </div>

                        {(selectedRow.placesApiAuditJson || selectedRow.plannedSpotsJson) && <PlacesAudit spotsJson={selectedRow.plannedSpotsJson} auditJson={selectedRow.placesApiAuditJson} />}

                        <SectionLabel>FULL QUERY</SectionLabel>
                        <Pre>{selectedRow.userQuery || "—"}</Pre>

                        <div style={{ display: "flex", gap: "1.25rem", marginTop: "1rem" }}>
                            <div style={{ flex: 1 }}>
                                <SectionLabel>DRAFT NARRATIVE</SectionLabel>
                                <Pre>{selectedRow.draftNarrative || "—"}</Pre>
                            </div>
                            <div style={{ flex: 1 }}>
                                <SectionLabel>FINAL NARRATIVE</SectionLabel>
                                <Pre>{selectedRow.finalSanitizedNarrative || "—"}</Pre>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function PlacesAudit({ spotsJson, auditJson }) {
    let spots = [];
    let audit = [];
    try { if (spotsJson) spots = JSON.parse(spotsJson); } catch { }
    try { if (auditJson) audit = JSON.parse(auditJson); } catch { }

    const rows = spots.length > 0 ? spots.map((s, i) => {
        const a = audit.find(a => a.spotName === s.Name) ?? audit[i] ?? {};
        return { ...s, placeId: a.placeId ?? null };
    }) : audit.map(a => ({ Name: a.spotName, placeId: a.placeId }));

    if (!rows.length) return null;

    return (
        <div style={{ marginBottom: "1.25rem" }}>
            <SectionLabel>PLACES API RESULTS</SectionLabel>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                        <th style={{ ...auditTh, width: "2rem" }}>#</th>
                        <th style={auditTh}>Name</th>
                        <th style={auditTh}>Region</th>
                        <th style={auditTh}>Fallback Label</th>
                        <th style={auditTh}>Lat / Lng</th>
                        <th style={auditTh}>Place ID</th>
                        <th style={{ ...auditTh, width: "4.5rem" }}>Verified</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((p, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={auditTd}>{i + 1}</td>
                            <td style={{ ...auditTd, fontWeight: 600 }}>{p.Name ?? p.spotName}</td>
                            <td style={auditTd}>{p.Region ?? "—"}</td>
                            <td style={{ ...auditTd, color: "#64748b", fontStyle: "italic" }}>{p.FallbackLabel ?? "—"}</td>
                            <td style={{ ...auditTd, fontSize: "0.75rem", color: "#64748b" }}>
                                {p.Lat != null ? `${p.Lat.toFixed(4)}, ${p.Lng.toFixed(4)}` : "—"}
                            </td>
                            <td style={{ ...auditTd, fontFamily: "monospace", fontSize: "0.72rem", color: "#475569" }}>
                                {p.placeId
                                    ? <a href={`https://maps.google.com/?q=${encodeURIComponent(p.Name ?? p.spotName)}`} target="_blank" rel="noreferrer" style={{ color: "rgb(10,119,234)" }}>{p.placeId}</a>
                                    : <span style={{ color: "#94a3b8" }}>—</span>}
                            </td>
                            <td style={auditTd}>
                                {p.placeId
                                    ? <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span>
                                    : <span style={{ color: "#dc2626", fontWeight: 700 }}>✗</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const auditTh = { padding: "0.4rem 0.75rem", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.04em", borderBottom: "1px solid #e2e8f0" };
const auditTd = { padding: "0.4rem 0.75rem", color: "#0f172a", verticalAlign: "middle" };

function SummaryCell({ label, value, valueColor, mono, children }) {
    return (
        <div>
            <div style={{ fontSize: "0.63rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", marginBottom: 5, textTransform: "uppercase" }}>{label}</div>
            {children
                ? <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
                : <div style={{ fontWeight: 700, color: valueColor ?? "#0f172a", fontSize: "0.85rem", fontFamily: mono ? "monospace" : "inherit" }}>{value}</div>
            }
        </div>
    );
}

function SectionLabel({ children }) {
    return <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgb(10, 119, 234)", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>{children}</div>;
}

function parseNarrative(text) {
    const parts = [];
    const re = /\[\[(.+?)\]\]|\*\*(.+?)\*\*|\{\{(.+?)\}\}/g;
    let last = 0, m, i = 0;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) parts.push(<span key={i++}>{text.slice(last, m.index)}</span>);
        if (m[1] !== undefined)
            parts.push(<span key={i++} style={{ color: "#10B981", fontWeight: 800 }}>@ {m[1]} </span>);
        else if (m[2] !== undefined)
            parts.push(<span key={i++} style={{ color: "rgb(10, 119, 234)", fontWeight: 800 }}>{m[2]}</span>);
        else
            parts.push(<span key={i++} style={{ color: "#8B5CF6", fontWeight: 800, textTransform: "capitalize" }}>{m[3]}</span>);
        last = re.lastIndex;
    }
    if (last < text.length) parts.push(<span key={i++}>{text.slice(last)}</span>);
    return parts;
}

function Pre({ children }) {
    const content = typeof children === "string" ? parseNarrative(children) : children;
    return (
        <pre style={{
            background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10,
            padding: "1rem 1.25rem", whiteSpace: "pre-wrap", wordBreak: "break-word",
            margin: 0, fontSize: "0.95rem", color: "#1e293b",
            fontFamily: "inherit", lineHeight: 1.7, textAlign: "left",
        }}>
            {content}
        </pre>
    );
}

function Badge({ children, color, text }) {
    if (!children) return <span style={{ color: "#cbd5e1" }}>—</span>;
    return (
        <span style={{
            backgroundColor: color, color: text,
            borderRadius: 6, padding: "2px 8px", whiteSpace: "nowrap", fontSize: "0.72rem", fontWeight: 500,
        }}>
            {children}
        </span>
    );
}

function FText({ label, value, onChange, type = "text", width = 130 }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{label}</span>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{
                border: "1px solid #e2e8f0", borderRadius: 8, padding: "0 8px",
                fontSize: "0.75rem", color: "#0f172a", width, outline: "none", backgroundColor: "white",
                height: 30, boxSizing: "border-box",
            }} />
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
                <option value="">All</option>
                {options.map((o, i) => <option key={o} value={o}>{labels ? labels[i] : o}</option>)}
            </select>
        </div>
    );
}

function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function shortModel(m) {
    if (!m) return "—";
    return m.replace("gemini-", "").replace("-latest", "");
}

const card = {
    background: "white", borderRadius: 12, padding: "1rem 1.25rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const th = {
    padding: "0.6rem 0.9rem", whiteSpace: "nowrap", fontWeight: 600,
    fontSize: "0.7rem", letterSpacing: "0.04em", textAlign: "center",
};

const td = { padding: "0.5rem 0.9rem", verticalAlign: "middle", whiteSpace: "nowrap", color: "#0f172a" };

const applyBtn = {
    backgroundColor: "rgb(10, 119, 234)", color: "white", border: "none",
    borderRadius: 8, padding: "0 16px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
    height: 30, boxSizing: "border-box",
};

const clearBtn = {
    backgroundColor: "white", color: "#475569", border: "1px solid #e2e8f0",
    borderRadius: 8, padding: "0 16px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
    height: 30, boxSizing: "border-box",
};

const pgBtn = {
    backgroundColor: "white", color: "#475569", border: "1px solid #e2e8f0",
    borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: "0.78rem",
};
