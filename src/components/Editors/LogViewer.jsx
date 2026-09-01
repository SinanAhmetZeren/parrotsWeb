import { useState } from "react";
import { useLazyGetLogsQuery } from "../../slices/LogSlice";
import { adminPage, adminCard, adminTitle, adminBtnPrimary, adminBtnGhost } from "../../styles/adminStyles";

const LEVELS = ["ALL", "INF", "WRN", "ERR", "FTL"];

const LEVEL_COLORS = {
  INF: { badge: "#334155", text: "#94a3b8" },
  WRN: { badge: "#78350f", text: "#fcd34d" },
  ERR: { badge: "#7f1d1d", text: "#fca5a5" },
  FTL: { badge: "#4c0519", text: "#fda4af" },
};

const pgBtn = {
  backgroundColor: "white", color: "#475569", border: "1px solid #e2e8f0",
  borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: "0.78rem",
};

const dtInputStyle = {
  padding: "0.4rem 0.65rem",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  fontSize: "0.85rem",
  color: "#1e3a5f",
};

function parseLine(line) {
  const match = line.match(/^\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([A-Z]{3})\] (.*)$/s);
  if (!match) return null;
  return { date: match[1], time: match[2], level: match[3], message: match[4] };
}

function LogLine({ line }) {
  const parsed = parseLine(line);

  if (!parsed) {
    return (
      <div style={{ color: "#475569", padding: "1px 4px", fontSize: "0.73rem", whiteSpace: "pre-wrap", wordBreak: "break-word", textAlign: "left", paddingLeft: "13.5rem" }}>
        {line}
      </div>
    );
  }

  const colors = LEVEL_COLORS[parsed.level] || LEVEL_COLORS.INF;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "5.5rem 3.5rem 3rem 1fr",
      gap: "0.5rem",
      alignItems: "start",
      padding: "2px 4px",
      borderRadius: "3px",
      borderBottom: "1px solid rgba(255,255,255,0.03)",
      textAlign: "left",
    }}>
      <span style={{ color: "#475569", whiteSpace: "nowrap", fontSize: "0.73rem", paddingTop: "1px" }}>
        {parsed.date}
      </span>
      <span style={{ color: "#64748b", whiteSpace: "nowrap", fontSize: "0.73rem", paddingTop: "1px" }}>
        {parsed.time}
      </span>
      <span style={{
        backgroundColor: colors.badge,
        color: colors.text,
        borderRadius: "3px",
        padding: "0 5px",
        fontSize: "0.68rem",
        fontWeight: 700,
        textAlign: "center",
        letterSpacing: "0.04em",
        alignSelf: "start",
        marginTop: "1px",
      }}>
        {parsed.level}
      </span>
      <span style={{
        color: colors.text,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: "0.78rem",
        lineHeight: "1.5",
        textAlign: "left",
      }}>
        {parsed.message}
      </span>
    </div>
  );
}

const PAGE_SIZE = 100;

export function LogViewer() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const utcDatetime = (d) =>
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;

  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [from, setFrom] = useState(utcDatetime(oneDayAgo));
  const [to, setTo] = useState(utcDatetime(now));
  const [level, setLevel] = useState("ERR");
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [logsData, setLogsData] = useState(null);
  const [triggerGetLogs] = useLazyGetLogsQuery();

  const logs = logsData?.items;
  const totalCount = logsData?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handleFetch = async (p = 1) => {
    setPage(p);
    setIsFetching(true);
    setError(null);
    try {
      const result = await triggerGetLogs({ from: new Date(from).toISOString(), to: new Date(to).toISOString(), level, page: p, pageSize: PAGE_SIZE }).unwrap();
      const normalized = Array.isArray(result)
        ? { totalCount: result.length, items: result }
        : result;
      setLogsData(normalized);
    } catch (e) {
      setError(e);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div style={adminPage}>
      <div style={adminCard}>
        <div style={adminTitle}>Log Viewer</div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>From</span>
            <input type="datetime-local" value={from} onChange={e => setFrom(e.target.value)} style={dtInputStyle} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>To</span>
            <input type="datetime-local" value={to} onChange={e => setTo(e.target.value)} style={dtInputStyle} />
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            {LEVELS.map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                style={{
                  ...adminBtnGhost,
                  backgroundColor: level === l ? "#1e3a5f" : "#f1f5f9",
                  color: level === l ? "white" : "#475569",
                  fontWeight: level === l ? 700 : 500,
                  padding: "0.35rem 0.65rem",
                  fontSize: "0.78rem",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <button onClick={() => handleFetch(1)} style={adminBtnPrimary} disabled={isFetching}>
            {isFetching ? "Loading..." : "Fetch Logs"}
          </button>

          {logsData && (
            <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
              {totalCount} line{totalCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ color: "#991b1b", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            {error?.data?.message || "No log files found for this range."}
          </div>
        )}

        {/* Log output */}
        {logs && (
          <>
            <div style={{
              backgroundColor: "#0f172a",
              borderRadius: "8px",
              padding: "0.5rem 0.75rem",
              overflowY: "auto",
              maxHeight: "70vh",
              fontFamily: "monospace",
            }}>
              {logs.length === 0 ? (
                <div style={{ color: "#64748b", fontSize: "0.8rem" }}>No entries match the selected filter.</div>
              ) : (
                logs.map((line, i) => <LogLine key={i} line={line} />)
              )}
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", alignItems: "center" }}>
                <button onClick={() => handleFetch(page - 1)} disabled={page === 1 || isFetching} style={pgBtn}>← Prev</button>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Page {page} / {totalPages}</span>
                <button onClick={() => handleFetch(page + 1)} disabled={page === totalPages || isFetching} style={pgBtn}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
