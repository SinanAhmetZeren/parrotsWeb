import React, { useEffect } from "react";
import { useGetWeeklyTransactionsQuery } from "../../slices/MetricsSlice";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { parrotDarkBlue } from "../../styles/colors";

export function WeeklyTransactionsMetrics() {
    const { data: transactionsData, isLoading, isError } = useGetWeeklyTransactionsQuery();

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
    };

    const formatNumber = (num) => num?.toLocaleString();

    // Transform data for chart
    let chartData = [];
    if (transactionsData) {
        const groupedByWeek = {};

        transactionsData.forEach((t) => {
            const weekKey = t.weekStart; // keep ISO for sorting
            if (!groupedByWeek[weekKey]) groupedByWeek[weekKey] = { weekStart: weekKey };

            // Fill data for chart
            groupedByWeek[weekKey][t.type] = t.totalAmount;
            groupedByWeek[weekKey][`${t.type}_count`] = t.transactionCount;
        });

        // Ensure every week has all three types
        Object.values(groupedByWeek).forEach((week) => {
            if (week.send_parrotCoins === undefined) week.send_parrotCoins = 0;
            if (week.receive_parrotCoins === undefined) week.receive_parrotCoins = 0;
            if (week.voyage_cost === undefined) week.voyage_cost = 0;

            if (week.send_parrotCoins_count === undefined) week.send_parrotCoins_count = 0;
            if (week.receive_parrotCoins_count === undefined) week.receive_parrotCoins_count = 0;
            if (week.voyage_cost_count === undefined) week.voyage_cost_count = 0;

            chartData.push(week);
        });

        // Sort by date ascending
        chartData.sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
    }

    useEffect(() => {
        console.log("Transactions Data:", transactionsData);
        console.log("Chart Data:", chartData);
    }, [transactionsData]);

    if (isLoading) return <div>Loading weekly transactions...</div>;
    if (isError || !transactionsData) return <div>Error loading weekly transactions.</div>;

    const colWidth = 150;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial", width: "95%", margin: "auto", backgroundColor: parrotDarkBlue }}>
            <h2 style={{ marginBottom: "1rem" }}>Weekly Transactions Metrics</h2>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
                <thead>
                    <tr style={{ backgroundColor: "#4a90e2", color: "white" }}>
                        <th style={{ padding: "8px", border: "1px solid #ddd", width: "120px" }}>Week Starting</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd", width: colWidth }}>Send Count</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd", width: colWidth }}>Send Total</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd", width: colWidth }}>Receive Count</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd", width: colWidth }}>Receive Total</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd", width: colWidth }}>Voyage Count</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd", width: colWidth }}>Voyage Total</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.map((week) => (
                        <tr key={week.weekStart} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "8px" }}>{formatDate(week.weekStart)}</td>
                            <td style={{ padding: "8px" }}>{formatNumber(week.send_parrotCoins_count)}</td>
                            <td style={{ padding: "8px" }}>${formatNumber(week.send_parrotCoins)}</td>
                            <td style={{ padding: "8px" }}>{formatNumber(week.receive_parrotCoins_count)}</td>
                            <td style={{ padding: "8px" }}>${formatNumber(week.receive_parrotCoins)}</td>
                            <td style={{ padding: "8px" }}>{formatNumber(week.voyage_cost_count)}</td>
                            <td style={{ padding: "8px" }}>${formatNumber(week.voyage_cost)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Line Chart */}
            <h3 style={{ marginBottom: "1rem" }}>Transactions Over Time</h3>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    style={{ backgroundColor: "white", borderRadius: "8px", padding: "10px" }} // white background

                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="weekStart" tickFormatter={formatDate} />
                    <YAxis width={80} tickFormatter={formatNumber} />
                    <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value) => (typeof value === "number" ? formatNumber(value) : value)}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="send_parrotCoins" name="Send Coins" strokeWidth={3} stroke="#ff7300" dot={false} />
                    <Line type="monotone" dataKey="receive_parrotCoins" name="Receive Coins" strokeWidth={3} stroke="#82ca9d" dot={false} />
                    <Line type="monotone" dataKey="voyage_cost" name="Voyage Cost" strokeWidth={3} stroke="#8884d8" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}