import React from "react";
import { useGetWeeklyVehiclesQuery } from "../../slices/MetricsSlice";
import { MetricCard } from "./MetricCard";

export function WeeklyVehiclesMetrics() {
  const { data, isLoading, isError } = useGetWeeklyVehiclesQuery();
  if (isLoading) return <div style={{ padding: "1.5rem", color: "#64748b" }}>Loading...</div>;
  if (isError || !data) return <div style={{ padding: "1.5rem", color: "#dc2626" }}>Error loading data.</div>;

  return (
    <MetricCard
      title="Weekly Vehicles Registered"
      data={data}
      columns={[{ key: "vehicleCount", label: "Vehicles Registered" }]}
      chartType="bar"
      series={[{ key: "vehicleCount", label: "Vehicles Registered", color: "#2dd4bf" }]}
    />
  );
}
