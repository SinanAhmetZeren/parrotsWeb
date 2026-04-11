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

export function LogViewer() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const localDatetime = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const [from, setFrom] = useState(localDatetime(startOfToday));
  const [to, setTo] = useState(localDatetime(now));
  const [level, setLevel] = useState("ALL");
  const [triggerGetLogs, { data: logs, isFetching, error }] = useLazyGetLogsQuery();

  const handleFetch = () => {
    triggerGetLogs({ from: new Date(from).toISOString(), to: new Date(to).toISOString(), level });
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

          <button onClick={handleFetch} style={adminBtnPrimary} disabled={isFetching}>
            {isFetching ? "Loading..." : "Fetch Logs"}
          </button>

          {logs && (
            <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
              {logs.length} line{logs.length !== 1 ? "s" : ""}
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
        )}
      </div>
    </div>
  );
}
