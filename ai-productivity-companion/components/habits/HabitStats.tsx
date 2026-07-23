"use client";

import type { Habit } from "@/types";
import { Flame, TrendingUp, CheckSquare } from "lucide-react";

interface Props {
    habit: Habit;
}

export default function HabitStats({ habit }: Props) {

    const completionRate = habit.totalCompletions > 0
        ? Math.round(
            (habit.totalCompletions /
                Math.max(1, Math.round(
                    (new Date().getTime() - new Date(habit.createdAt ?? "").getTime()) /
                    (1000 * 60 * 60 * 24)
                ))) * 100
        )
        : 0;

    const stats = [
        {
            icon: Flame,
            label: "Current Streak",
            value: `${habit.currentStreak}d`,
            color: habit.currentStreak > 0 ? "text-orange-500" : "text-gray-400",
        },
        {
            icon: TrendingUp,
            label: "Longest Streak",
            value: `${habit.longestStreak}d`,
            color: "text-black",
        },
        {
            icon: CheckSquare,
            label: "Total Check-ins",
            value: habit.totalCompletions,
            color: "text-black",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-3">

            {stats.map((stat) => {

                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="rounded-2xl border bg-white p-5 text-center"
                    >

                        <Icon size={24} className={`mx-auto mb-2 ${stat.color}`} />

                        <div className="text-2xl font-bold">{stat.value}</div>

                        <div className="mt-1 text-xs text-gray-500">{stat.label}</div>

                    </div>
                );

            })}

        </div>
    );

}
