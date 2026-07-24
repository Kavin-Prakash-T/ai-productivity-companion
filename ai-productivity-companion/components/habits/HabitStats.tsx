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
            color: habit.currentStreak > 0 ? "text-orange-500" : "text-[#D1D5DB]",
        },
        {
            icon: TrendingUp,
            label: "Longest Streak",
            value: `${habit.longestStreak}d`,
            color: "text-[#0A0A0A]",
        },
        {
            icon: CheckSquare,
            label: "Total Check-ins",
            value: habit.totalCompletions,
            color: "text-[#0A0A0A]",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-3">

            {stats.map((stat) => {

                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-center shadow-sm"
                    >

                        <Icon size={24} className={`mx-auto mb-2 ${stat.color}`} />

                        <div className="text-2xl font-bold text-[#0A0A0A]">{stat.value}</div>

                        <div className="mt-1 text-xs font-medium text-[#6B7280]">{stat.label}</div>

                    </div>
                );

            })}

        </div>
    );

}
