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
        "Goal Progress": item.goalProgress ?? 0,
    }));

    return (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#0A0A0A]">
                    Weekly Activity & Goal Progress
                </h2>
                {data.length > 0 && data[0].goalProgress !== undefined && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Goal Boost Active
                    </span>
                )}
            </div>

            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                            opacity={0.8}
                        />

                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                            axisLine={false}
                            tickLine={false}
                            width={25}
                        />

                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid #E5E7EB",
                                background: "rgba(255, 255, 255, 0.95)",
                                backdropFilter: "blur(12px)",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                                color: "#0A0A0A",
                            }}
                            itemStyle={{ color: "#0A0A0A" }}
                            labelStyle={{ color: "#6B7280", fontWeight: "bold", fontSize: "12px" }}
                        />

                        <Line
                            type="monotone"
                            dataKey="Tasks"
                            stroke="#0A0A0A"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#0A0A0A", strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#0A0A0A" }}
                        />

                        <Line
                            type="monotone"
                            dataKey="Habits"
                            stroke="#9CA3AF"
                            strokeWidth={2.5}
                            strokeDasharray="4 4"
                            dot={{ r: 4, fill: "#9CA3AF", strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#9CA3AF" }}
                        />

                        <Line
                            type="monotone"
                            dataKey="Goal Progress"
                            stroke="#F59E0B"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#F59E0B", strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#F59E0B" }}
                        />

                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-xs font-semibold text-[#6B7280]">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-4 rounded-full bg-[#0A0A0A]" />
                    Tasks Completed
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-4 rounded-full bg-[#9CA3AF] border-dashed border-t" />
                    Habits Done
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-4 rounded-full bg-[#F59E0B]" />
                    Goal Progress (%)
                </div>
            </div>

        </div>
    );

}
