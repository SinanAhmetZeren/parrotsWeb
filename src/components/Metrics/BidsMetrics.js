import React, { useEffect } from "react";
import { useGetWeeklyBidsQuery } from "../../slices/MetricsSlice";
import { parrotDarkBlue } from "../../styles/colors";
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export function WeeklyBidsMetrics() {

    const { data: bidsData, isLoading, isError } = useGetWeeklyBidsQuery();

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB");
    };

    const formatNumber = (num) => num?.toLocaleString();

    useEffect(() => {
        console.log(bidsData);
    }, [bidsData]);

    if (isLoading) return <div>Loading weekly Bids...</div>;
    if (isError || !bidsData) return <div>Error loading weekly Bids.</div>;

    return (
        <div style={{
            padding: "20px",
            fontFamily: "Arial",
            width: "85%",
            margin: "auto",
            backgroundColor: parrotDarkBlue
        }}>

            <h2 style={{ marginBottom: "1rem" }}>Weekly Bids Created and Accepted</h2>

            {/* Table */}
            <div style={{ width: "80%", height: "20rem", margin: "auto", overflowY: "auto", backgroundColor: "white", borderRadius: "8px", padding: "1rem" }}>

                <table style={{
                    width: "80%",
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    margin: "auto",
                    marginBottom: "2rem"
                }}>

                    <thead>
                        <tr style={{ backgroundColor: "#4a90e2", color: "white" }}>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                                Week Starting
                            </th>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                                Bids Created
                            </th>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                                Bids Accepted
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {bidsData.map((week) => (
                            <tr key={week.weekStart} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "8px", color: parrotDarkBlue }}>
                                    {formatDate(week.weekStart)}
                                </td>

                                <td style={{ padding: "8px", color: parrotDarkBlue }}>
                                    {formatNumber(week.bidCount)}
                                </td>

                                <td style={{ padding: "8px", color: parrotDarkBlue }}>
                                    {formatNumber(week.acceptBidCount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            {/* Chart */}

            <h3 style={{ marginBottom: "1rem" }}>Bids Created and Accepted Over Time</h3>

            <ResponsiveContainer
                width="80%"
                height={350}
                style={{ margin: "auto" }}
            >
                <ComposedChart
                    data={bidsData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    style={{ backgroundColor: "white", borderRadius: "8px", padding: "10px" }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="weekStart"
                        tickFormatter={formatDate}
                    />
                    <YAxis
                        width={80}
                        tickFormatter={formatNumber}
                        label={{ value: "Bids", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value) =>
                            typeof value === "number" ? formatNumber(value) : value
                        }
                    />
                    <Legend />
                    <Bar
                        dataKey="bidCount"
                        name="Bids Created"
                        fill="#ffaa00af"
                        barSize={20}
                    />

                    {/* Bids Accepted */}
                    <Bar
                        dataKey="acceptBidCount"
                        name="Bids Accepted"
                        fill="#4caf50aa"
                        barSize={20}
                    />

                </ComposedChart>
            </ResponsiveContainer>

        </div>
    );
}