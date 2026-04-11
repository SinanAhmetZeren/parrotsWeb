import React from "react";
import { useGetWeeklyUsersQuery } from "../../slices/MetricsSlice";
import { MetricCard } from "./MetricCard";

export function WeeklyUsersMetrics() {
  const { data, isLoading, isError } = useGetWeeklyUsersQuery();
  if (isLoading) return <div style={{ padding: "1.5rem", color: "#64748b" }}>Loading...</div>;
  if (isError || !data) return <div style={{ padding: "1.5rem", color: "#dc2626" }}>Error loading data.</div>;

  return (
    <MetricCard
      title="Weekly Users Created"
      data={data}
      columns={[{ key: "userCount", label: "Users Created" }]}
      chartType="bar"
      series={[{ key: "userCount", label: "Users Created", color: "#818cf8" }]}
    />
  );
}
