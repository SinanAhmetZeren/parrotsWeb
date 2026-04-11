import React from "react";
import { useGetWeeklyBidsQuery } from "../../slices/MetricsSlice";
import { MetricCard } from "./MetricCard";

export function WeeklyBidsMetrics() {
  const { data, isLoading, isError } = useGetWeeklyBidsQuery();
  if (isLoading) return <div style={{ padding: "1.5rem", color: "#64748b" }}>Loading...</div>;
  if (isError || !data) return <div style={{ padding: "1.5rem", color: "#dc2626" }}>Error loading data.</div>;

  return (
    <MetricCard
      title="Weekly Bids"
      data={data}
      columns={[
        { key: "bidCount", label: "Bids Created" },
        { key: "acceptBidCount", label: "Bids Accepted" },
      ]}
      chartType="bar"
      series={[
        { key: "bidCount", label: "Bids Created", color: "#f59e0b" },
        { key: "acceptBidCount", label: "Bids Accepted", color: "#34d399" },
      ]}
    />
  );
}
