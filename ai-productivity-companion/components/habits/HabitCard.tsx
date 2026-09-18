"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Flame, Repeat, CheckCircle2, Circle, Trash2, Loader2 } from "lucide-react";
import type { Habit } from "@/types";
import { checkInHabit, uncheckInHabit } from "@/services/habitService";

import { isHabitCompletedInCurrentPeriod } from "@/utils/habitStreak";

interface Props {
    habit: Habit;
    todayKey: string;
    onCheckedIn: (updatedHabit: Habit) => void;
    onDelete?: (id: string) => void;
}

export default function HabitCard({ habit, todayKey, onCheckedIn, onDelete }: Props) {

    const [loading, setLoading] = useState(false);
    const completedToday = isHabitCompletedInCurrentPeriod(habit.completionLogs, habit.frequency, todayKey);
    const periodUnit = habit.frequency === 'weekly' ? 'week' : habit.frequency === 'monthly' ? 'month' : habit.frequency === 'yearly' ? 'year' : 'day';
    const periodShort = habit.frequency === 'weekly' ? 'w' : habit.frequency === 'monthly' ? 'm' : habit.frequency === 'yearly' ? 'y' : 'd';

    async function handleToggleCheckIn(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;

        setLoading(true);
        try {
            let updatedHabit: Habit | null = null;
            if (completedToday) {
                const { data } = await uncheckInHabit(habit._id);
                updatedHabit = data.data?.habit ?? data.habit;
                toast.success(data.message ?? "Check-in removed");
            } else {
                const { data } = await checkInHabit(habit._id);
                updatedHabit = data.data?.habit ?? data.habit;
                toast.success(data.message ?? "Habit checked in!");
            }
            if (updatedHabit) {
                onCheckedIn(updatedHabit);
            }
        } catch {
            toast.error(completedToday ? "Failed to remove check-in" : "Check-in failed");
        } finally {
            setLoading(false);
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
                        onClick={handleToggleCheckIn}
                        disabled={loading}
                        title={completedToday ? `Click to undo check-in for this ${periodUnit}` : `Click to check in for this ${periodUnit}`}
                        className="mt-0.5 shrink-0 text-[#6B7280] transition-transform active:scale-90 hover:scale-110 disabled:opacity-50 group/check"
                    >
                        {loading ? (
                            <Loader2 size={22} className="animate-spin text-[#0A0A0A]" />
                        ) : completedToday ? (
                            <CheckCircle2 size={22} className="text-emerald-600 fill-emerald-100 group-hover/check:text-rose-600 group-hover/check:fill-rose-100 transition-colors" />
                        ) : (
                            <Circle size={22} className="text-[#D1D5DB] group-hover/check:text-emerald-600 group-hover/check:fill-emerald-50 transition-colors" />
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
                <span className="mb-1 text-[#6B7280] text-xs font-semibold uppercase tracking-wider">{periodUnit} streak</span>
            </div>

            {/* Stats row */}
            <div className="mt-3 flex gap-4 text-xs font-semibold text-[#6B7280]">
                <span>Best: {habit.longestStreak}{periodShort}</span>
                <span>Total completions: {habit.totalCompletions}</span>
                {completedToday && (
                    <span className="text-green-600 font-bold">✓ Done {habit.frequency === 'daily' ? 'today' : `this ${periodUnit}`}</span>
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