import React, { useEffect } from "react";
import { useGetWeeklyVoyagesQuery } from "../../slices/MetricsSlice";
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { parrotDarkBlue } from "../../styles/colors";

export function WeeklyVoyagesMetrics() {

    const { data: voyagesData, isLoading, isError } = useGetWeeklyVoyagesQuery();

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB");
    };

    const formatNumber = (num) => num?.toLocaleString();

    let chartData = [];

    if (voyagesData) {
        chartData = [...voyagesData].sort(
            (a, b) => new Date(a.weekStart) - new Date(b.weekStart)
        );
    }

    useEffect(() => {
        console.log("Voyages Data:", voyagesData);
    }, [voyagesData]);

    if (isLoading) return <div>Loading weekly voyages...</div>;
    if (isError || !voyagesData) return <div>Error loading weekly voyages.</div>;

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "Arial",
                width: "85%",
                margin: "auto",
                backgroundColor: parrotDarkBlue,
            }}
        >
            <h2 style={{ marginBottom: "1rem" }}>Weekly Voyages Created</h2>

            {/* Table */}
            <div style={{ width: "80%", height: "20rem", margin: "auto", overflowY: "auto", backgroundColor: "white", borderRadius: "8px", padding: "1rem" }}>

                <table
                    style={{
                        width: "60%",
                        borderCollapse: "collapse",
                        margin: "auto",
                        marginBottom: "2rem",
                        backgroundColor: "white"
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: parrotDarkBlue, color: "white" }}>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                                Week Starting
                            </th>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                                Voyages Created
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {chartData.map((week) => (
                            <tr key={week.weekStart} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "8px", color: parrotDarkBlue }}>
                                    {formatDate(week.weekStart)}
                                </td>
                                <td style={{ padding: "8px", color: parrotDarkBlue }}>
                                    {formatNumber(week.voyageCount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Chart */}
            <h3 style={{ marginBottom: "1rem" }}>Voyages Over Time</h3>

            <ResponsiveContainer width="80%" height={350} style={{ margin: "auto" }}>
                <ComposedChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        padding: "10px",
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="weekStart"
                        tickFormatter={formatDate}
                    />

                    <YAxis
                        width={80}
                        tickFormatter={formatNumber}
                    />

                    <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value) =>
                            typeof value === "number" ? formatNumber(value) : value
                        }
                    />

                    <Legend />

                    <Bar
                        dataKey="voyageCount"
                        name="Voyages Created"
                        fill="#ffaa00af"
                        barSize={20}
                        radius={[4, 4, 0, 0]}
                    />

                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}