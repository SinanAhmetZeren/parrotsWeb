import React, { useEffect } from "react";
import { useGetWeeklyPurchasesQuery } from "../../slices/MetricsSlice";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { parrotDarkBlue } from "../../styles/colors";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function WeeklyPurchasesMetrics() {
    const { data: purchasesData, isLoading, isError } = useGetWeeklyPurchasesQuery();

    // Helper function to format ISO date strings
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
    };

    useEffect(() => { console.log(purchasesData); }, [purchasesData])

    if (isLoading) {
        return <div>Loading weekly purchases...</div>;
    }

    if (isError || !purchasesData) {
        return <div>Error loading weekly purchases.</div>;
    }
    // Format numbers with commas
    const formatNumber = (num) => num?.toLocaleString();

    return (
        <div style={{ padding: "20px", fontFamily: "Arial", width: "90%", margin: "auto", backgroundColor: parrotDarkBlue }}>
            <h2 style={{ marginBottom: "1rem" }}>Weekly Purchases Metrics</h2>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
                <thead>
                    <tr style={{ backgroundColor: "#4a90e2", color: "white" }}>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Week Starting</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Number of Purchases</th>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {purchasesData.map((week) => (
                        <tr key={week.weekStart} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "8px" }}>{formatDate(week.weekStart)}</td>
                            <td style={{ padding: "8px" }}>{formatNumber(week.purchaseCount)}</td>
                            <td style={{ padding: "8px" }}>${formatNumber(week.totalAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Line Chart */}
            <h3 style={{ marginBottom: "1rem" }}>Purchases Over Time</h3>


            <ResponsiveContainer width="100%" height={350}>
                <ComposedChart
                    data={purchasesData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    style={{ backgroundColor: "white", borderRadius: "8px", padding: "10px" }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="weekStart" tickFormatter={formatDate} />
                    <YAxis
                        yAxisId="left"
                        width={80}
                        tickFormatter={formatNumber}
                        label={{ value: "Purchases", angle: -90, position: "insideLeft" }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        width={80}
                        tickFormatter={(value) => `$${formatNumber(value)}`}
                        label={{ value: "Total Amount ($)", angle: 90, position: "insideRight" }}
                    />
                    <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value, name) =>
                            name === "Total Amount" ? `$${formatNumber(value)}` : formatNumber(value)
                        }
                    />
                    <Legend />
                    {/* Bar for purchaseCount */}
                    <Bar yAxisId="left" dataKey="purchaseCount" name="Purchases" fill="#8884d849" barSize={30} />
/>
                    {/* Line for totalAmount */}
                    <Line yAxisId="right" type="monotone" dataKey="totalAmount" name="Total Amount" stroke="#82ca9d" strokeWidth={3} dot={false} />
                </ComposedChart>
            </ResponsiveContainer>

        </div>
    );
}