import React from "react";
import { adminPage, adminCard, adminTitle, adminTable, adminTh, adminTd } from "../../styles/adminStyles";
import { ResponsiveContainer, ComposedChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const formatDate = (iso) => `Wk of ${new Date(iso).toLocaleDateString("en-GB")}`;
const formatNumber = (num) => num?.toLocaleString();

export function MetricCard({ title, data, columns, chartType = "bar", series }) {
  if (!data) return null;

  return (
    <div style={adminPage}>
      <div style={adminCard}>
        <div style={adminTitle}>{title}</div>

        {/* Table */}
        <div style={{ overflowY: "auto", maxHeight: "16rem", marginBottom: "1.5rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
          <table style={adminTable}>
            <thead>
              <tr>
                <th style={adminTh}>Week Starting</th>
                {columns.map(c => <th key={c.key} style={adminTh}>{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.weekStart} style={{ backgroundColor: "white" }}>
                  <td style={adminTd}>{formatDate(row.weekStart)}</td>
                  {columns.map(c => (
                    <td key={c.key} style={adminTd}>
                      {c.prefix}{formatNumber(row[c.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem" }}>
          <ResponsiveContainer width="100%" height={280}>
            {chartType === "line" ? (
              <LineChart data={data} margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="weekStart" tickFormatter={formatDate} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickFormatter={formatNumber} tick={{ fontSize: 11, fill: "#64748b" }} width={60} />
                <Tooltip labelFormatter={formatDate} formatter={(v, n) => [series.find(s => s.key === n)?.prefix ? `${series.find(s => s.key === n)?.prefix}${formatNumber(v)}` : formatNumber(v), n]} />
                <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
                {series.map(s => <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} />)}
              </LineChart>
            ) : (
              <ComposedChart data={data} margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="weekStart" tickFormatter={formatDate} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickFormatter={formatNumber} tick={{ fontSize: 11, fill: "#64748b" }} width={60} />
                <Tooltip labelFormatter={formatDate} formatter={(v, n) => [formatNumber(v), n]} />
                <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
                {series.map(s => <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} barSize={18} radius={[3, 3, 0, 0]} />)}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
