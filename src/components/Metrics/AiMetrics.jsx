import React, { useState } from "react";
import {
  ComposedChart, Bar, Line, LineChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
/* eslint-disable no-unused-vars */
import { adminCard, adminTitle, adminBtnPrimary } from "../../styles/adminStyles";
import { useGetAiQueryStatsQuery } from "../../slices/MetricsSlice";

const DURATIONS = ["Half day", "1 day", "2-3 days", "1 week", "2 weeks"];
const DURATION_COLORS = {
  "Half day":  "#f59e0b",
  "1 day":     "rgb(10, 119, 234)",
  "2-3 days":  "#10b981",
  "1 week":    "#8b5cf6",
  "2 weeks":   "#ef4444",
};

const fmtDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const chartCard = { ...adminCard, marginBottom: "1.5rem" };

export function AiMetrics() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [from, setFrom] = useState(monthAgo);
  const [to, setTo] = useState(todayStr);
  const [appliedFrom, setAppliedFrom] = useState(monthAgo);
  const [appliedTo, setAppliedTo] = useState(todayStr);

  const { data: daily = [], isLoading, isError } = useGetAiQueryStatsQuery({ from: appliedFrom, to: appliedTo });

  function apply() { setAppliedFrom(from); setAppliedTo(to); }

  if (isLoading) return <div style={{ padding: "2rem", color: "#64748b" }}>Loading…</div>;
  if (isError) return <div style={{ padding: "2rem", color: "#dc2626" }}>Error loading data.</div>;

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: 960 }}>

      {/* Date filter */}
      <div style={{ ...adminCard, display: "flex", alignItems: "flex-end", gap: "1rem", marginBottom: "1.5rem" }}>
        <Field label="FROM">
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={dateInput} />
        </Field>
        <Field label="TO">
          <input type="date" value={to} onChange={e => setTo(e.target.value)} style={dateInput} />
        </Field>
        <button onClick={apply} style={{ ...adminBtnPrimary, height: 32 }}>Apply</button>
      </div>

      {/* Chart 1: Queries per day + Avg duration ms */}
      <div style={chartCard}>
        <div style={adminTitle}>Queries per Day &amp; Avg Duration</div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={daily} margin={{ top: 10, right: 40, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} width={30} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={v => `${(v/1000).toFixed(1)}s`} tick={{ fontSize: 11, fill: "#64748b" }} width={45} />
            <Tooltip
              labelFormatter={fmtDate}
              formatter={(v, name) => name === "Avg Duration" ? [`${v} ms`, name] : [v, name]}
            />
            <Legend wrapperStyle={{ fontSize: "0.78rem" }} />
            <Bar yAxisId="left" dataKey="queryCount" name="Queries" fill="rgb(10, 119, 234)" opacity={0.85} radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="avgDurationMs" name="Avg Duration" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Avg tokens per day */}
      <div style={chartCard}>
        <div style={adminTitle}>Avg Tokens per Day</div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={daily} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} width={45} />
            <Tooltip labelFormatter={fmtDate} />
            <Legend wrapperStyle={{ fontSize: "0.78rem" }} />
            <Line type="monotone" dataKey="avgInputTokens" name="Avg In" stroke="rgb(10, 119, 234)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="avgOutputTokens" name="Avg Out" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="avgTotalTokens" name="Avg Total" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3: Avg places suggested by voyage duration per day */}
      <div style={chartCard}>
        <div style={adminTitle}>Avg Places Suggested by Voyage Duration</div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={daily} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} width={35} domain={[0, "auto"]} />
            <Tooltip labelFormatter={fmtDate} />
            <Legend wrapperStyle={{ fontSize: "0.78rem" }} />
            {DURATIONS.map(dur => (
              <Line
                key={dur}
                type="monotone"
                dataKey={d => d.durationBreakdown?.find(b => b.duration === dur)?.avgPlacesSuggested ?? null}
                name={dur}
                stroke={DURATION_COLORS[dur]}
                strokeWidth={2}
                dot={{ r: 4, fill: DURATION_COLORS[dur] }}
                connectNulls
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{label}</span>
      {children}
    </div>
  );
}

const dateInput = {
  border: "1px solid #e2e8f0", borderRadius: 8, padding: "0 8px",
  fontSize: "0.78rem", color: "#0f172a", backgroundColor: "white",
  height: 32, boxSizing: "border-box", outline: "none",
};
