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
            className="block rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition"
        >

            <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3 min-w-0">

                    <button
                        onClick={handleCheckIn}
                        title={completedToday ? "Done for today" : "Check in today"}
                        className="mt-0.5 shrink-0"
                    >
                        {completedToday ? (
                            <CheckCircle2 size={22} className="text-black fill-black" />
                        ) : (
                            <Circle size={22} className="text-gray-300" />
                        )}
                    </button>

                    <div className="min-w-0">

                        <h2 className="text-base font-semibold truncate">{habit.title}</h2>

                        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
                            <Repeat size={14} />
                            <span className="capitalize">{habit.frequency}</span>
                        </div>

                    </div>

                </div>

                <div className="shrink-0 text-right">
                    <Flame size={22} className={habit.currentStreak > 0 ? "text-orange-500" : "text-gray-300"} />
                </div>

            </div>

            {/* Streak */}
            <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold">{habit.currentStreak}</span>
                <span className="mb-1 text-gray-500 text-sm">day streak</span>
            </div>

            {/* Stats row */}
            <div className="mt-3 flex gap-4 text-xs text-gray-400">
                <span>Best: {habit.longestStreak}d</span>
                <span>Total: {habit.totalCompletions}</span>
                {completedToday && (
                    <span className="text-green-600 font-medium">✓ Done today</span>
                )}
            </div>

            {onDelete && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                </div>
            )}

        </Link>
    );

}