import React from "react";
import { useGetWeeklyTransactionsQuery } from "../../slices/MetricsSlice";
import { MetricCard } from "./MetricCard";

export function WeeklyTransactionsMetrics() {
  const { data, isLoading, isError } = useGetWeeklyTransactionsQuery();
  if (isLoading) return <div style={{ padding: "1.5rem", color: "#64748b" }}>Loading...</div>;
  if (isError || !data) return <div style={{ padding: "1.5rem", color: "#dc2626" }}>Error loading data.</div>;

  // Group flat rows by week
  const grouped = {};
  data.forEach(t => {
    if (!grouped[t.weekStart]) grouped[t.weekStart] = { weekStart: t.weekStart };
    grouped[t.weekStart][t.type] = t.totalAmount;
    grouped[t.weekStart][`${t.type}_count`] = t.transactionCount;
  });
  const chartData = Object.values(grouped)
    .map(w => ({
      ...w,
      send_parrotCoins: w.send_parrotCoins ?? 0,
      receive_parrotCoins: w.receive_parrotCoins ?? 0,
      voyage_cost: w.voyage_cost ?? 0,
    }))
    .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));

  return (
    <MetricCard
      title="Weekly Transactions"
      data={chartData}
      columns={[
        { key: "send_parrotCoins_count", label: "Send Count" },
        { key: "send_parrotCoins", label: "Send Total", prefix: "$" },
        { key: "receive_parrotCoins_count", label: "Receive Count" },
        { key: "receive_parrotCoins", label: "Receive Total", prefix: "$" },
        { key: "voyage_cost_count", label: "Voyage Count" },
        { key: "voyage_cost", label: "Voyage Total", prefix: "$" },
      ]}
      chartType="line"
      series={[
        { key: "send_parrotCoins", label: "Send Coins", color: "#f97316", prefix: "$" },
        { key: "receive_parrotCoins", label: "Receive Coins", color: "#34d399", prefix: "$" },
        { key: "voyage_cost", label: "Voyage Cost", color: "#818cf8", prefix: "$" },
      ]}
    />
  );
}
