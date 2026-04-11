import React from "react";
import { useGetWeeklyVoyagesQuery } from "../../slices/MetricsSlice";
import { MetricCard } from "./MetricCard";

export function WeeklyVoyagesMetrics() {
  const { data, isLoading, isError } = useGetWeeklyVoyagesQuery();
  if (isLoading) return <div style={{ padding: "1.5rem", color: "#64748b" }}>Loading...</div>;
  if (isError || !data) return <div style={{ padding: "1.5rem", color: "#dc2626" }}>Error loading data.</div>;

  const sorted = [...data].sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));

  return (
    <MetricCard
      title="Weekly Voyages Created"
      data={sorted}
      columns={[{ key: "voyageCount", label: "Voyages Created" }]}
      chartType="bar"
      series={[{ key: "voyageCount", label: "Voyages Created", color: "#f59e0b" }]}
    />
  );
}
