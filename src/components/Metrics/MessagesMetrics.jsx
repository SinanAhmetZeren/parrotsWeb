import React from "react";
import { useGetWeeklyMessagesQuery } from "../../slices/MetricsSlice";
import { MetricCard } from "./MetricCard";

export function WeeklyMessagesMetrics() {
  const { data, isLoading, isError } = useGetWeeklyMessagesQuery();
  if (isLoading) return <div style={{ padding: "1.5rem", color: "#64748b" }}>Loading...</div>;
  if (isError || !data) return <div style={{ padding: "1.5rem", color: "#dc2626" }}>Error loading data.</div>;

  return (
    <MetricCard
      title="Weekly Messaging"
      data={data}
      columns={[{ key: "messageCount", label: "Messages Sent" }]}
      chartType="bar"
      series={[{ key: "messageCount", label: "Messages Sent", color: "#a78bfa" }]}
    />
  );
}
