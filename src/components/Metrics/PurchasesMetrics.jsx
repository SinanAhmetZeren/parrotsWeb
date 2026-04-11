import React from "react";
import { useGetWeeklyPurchasesQuery } from "../../slices/MetricsSlice";
import { MetricCard } from "./MetricCard";

export function WeeklyPurchasesMetrics() {
  const { data, isLoading, isError } = useGetWeeklyPurchasesQuery();
  if (isLoading) return <div style={{ padding: "1.5rem", color: "#64748b" }}>Loading...</div>;
  if (isError || !data) return <div style={{ padding: "1.5rem", color: "#dc2626" }}>Error loading data.</div>;

  return (
    <MetricCard
      title="Weekly Purchases"
      data={data}
      columns={[
        { key: "purchaseCount", label: "Purchases" },
        { key: "totalAmount", label: "Total Amount", prefix: "$" },
      ]}
      chartType="bar"
      series={[
        { key: "purchaseCount", label: "Purchases", color: "#60a5fa" },
        { key: "totalAmount", label: "Total Amount ($)", color: "#34d399" },
      ]}
    />
  );
}
