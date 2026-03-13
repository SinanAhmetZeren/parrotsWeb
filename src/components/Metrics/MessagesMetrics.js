import React, { useEffect } from "react";
import { useGetWeeklyMessagesQuery } from "../../slices/MetricsSlice";
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

export function WeeklyMessagesMetrics() {

    const { data: messagesData, isLoading, isError } = useGetWeeklyMessagesQuery();

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB");
    };

    const formatNumber = (num) => num?.toLocaleString();

    useEffect(() => {
        console.log(messagesData);
    }, [messagesData]);

    if (isLoading) return <div>Loading weekly Messages...</div>;
    if (isError || !messagesData) return <div>Error loading weekly Messages.</div>;

    return (
        <div style={{
            padding: "20px",
            fontFamily: "Arial",
            width: "85%",
            margin: "auto",
            backgroundColor: parrotDarkBlue
        }}>

            <h2 style={{ marginBottom: "1rem" }}>Weekly Messages Created</h2>

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
                                Messages Created
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {messagesData.map((week) => (
                            <tr key={week.weekStart} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "8px", color: parrotDarkBlue }}>
                                    {formatDate(week.weekStart)}
                                </td>

                                <td style={{ padding: "8px", color: parrotDarkBlue }}>
                                    {formatNumber(week.messageCount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            {/* Chart */}

            <h3 style={{ marginBottom: "1rem" }}>Messages Created Over Time</h3>

            <ResponsiveContainer
                width="80%"
                height={350}
                style={{ margin: "auto" }}
            >

                <ComposedChart
                    data={messagesData}
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
                        label={{ value: "Messages", angle: -90, position: "insideLeft" }}
                    />

                    <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value) =>
                            typeof value === "number" ? formatNumber(value) : value
                        }
                    />

                    <Legend />

                    <Bar
                        dataKey="messageCount"
                        name="Messages Created"
                        fill="#ffaa00af"
                        barSize={20}
                    />

                </ComposedChart>

            </ResponsiveContainer>

        </div>
    );
}