"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Flame, Repeat, CheckCircle2, Circle, Trash2 } from "lucide-react";
import type { Habit } from "@/types";
import { checkInHabit } from "@/services/habitService";

interface Props {
    habit: Habit;
    todayKey: string;
    onCheckedIn: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function HabitCard({ habit, todayKey, onCheckedIn, onDelete }: Props) {

    const completedToday = habit.completionLogs.some((log) => log.date === todayKey);

    async function handleCheckIn(e: React.MouseEvent) {
        e.preventDefault();
        if (completedToday) return;
        try {
            const { data } = await checkInHabit(habit._id);
            toast.success(data.message ?? "Habit checked in!");
            onCheckedIn(habit._id);
        } catch {
            toast.error("Check-in failed");
        }
    }

    function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        onDelete?.(habit._id);
    }

    return (
        <Link
            href={`/habits/${habit._id}`}
            className="block rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-300 group"
        >

            <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3 min-w-0">

                    <button
                        onClick={handleCheckIn}
                        title={completedToday ? "Done for today" : "Check in today"}
                        className="mt-0.5 shrink-0 text-[#6B7280] transition-colors"
                    >
                        {completedToday ? (
                            <CheckCircle2 size={20} className="text-[#0A0A0A] fill-gray-100" />
                        ) : (
                            <Circle size={20} className="text-[#D1D5DB] hover:text-[#0A0A0A] transition-colors" />
                        )}
                    </button>

                    <div className="min-w-0">

                        <h2 className="text-base font-bold text-[#0A0A0A] truncate transition-colors">
                            {habit.title}
                        </h2>

                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#6B7280] font-medium">
                            <Repeat size={13} className="text-[#9CA3AF]" />
                            <span className="capitalize">{habit.frequency}</span>
                        </div>

                    </div>

                </div>

                <div className="shrink-0 text-right">
                    <Flame size={20} className={habit.currentStreak > 0 ? "text-orange-500 filter drop-shadow-sm animate-pulse-glow" : "text-[#D1D5DB]"} />
                </div>

            </div>

            {/* Streak */}
            <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-extrabold text-[#0A0A0A] tracking-tight">{habit.currentStreak}</span>
                <span className="mb-1 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">day streak</span>
            </div>

            {/* Stats row */}
            <div className="mt-3 flex gap-4 text-xs font-semibold text-[#6B7280]">
                <span>Best: {habit.longestStreak}d</span>
                <span>Total completions: {habit.totalCompletions}</span>
                {completedToday && (
                    <span className="text-green-600 font-bold">✓ Done today</span>
                )}
            </div>

            {onDelete && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-transparent hover:border-red-100"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                </div>
            )}

        </Link>
    );

}