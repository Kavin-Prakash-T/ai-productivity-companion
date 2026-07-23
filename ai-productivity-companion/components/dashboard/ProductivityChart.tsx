"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import type { DailyStats } from "@/types";

interface Props {
    data: DailyStats[];
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "short" });
}

export default function ProductivityChart({ data }: Props) {

    const chartData = data.map((item) => ({
        day: formatDate(item.date),
        Tasks: item.completedTasks,
        Habits: item.completedHabits,
    }));

    return (
        <div className="rounded-2xl border bg-white p-6">

            <h2 className="mb-5 text-xl font-semibold">
                Weekly Activity
            </h2>

            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                        />

                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            width={25}
                        />

                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="Tasks"
                            stroke="#000000"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#000" }}
                            activeDot={{ r: 6 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="Habits"
                            stroke="#6b7280"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={{ r: 4, fill: "#6b7280" }}
                            activeDot={{ r: 6 }}
                        />

                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 flex gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 bg-black" />
                    Tasks Completed
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 bg-gray-400 border-dashed border-t-2" />
                    Habits Done
                </div>
            </div>

        </div>
    );

}
