"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Flame, Trash2 } from "lucide-react";

import { getHabits, deleteHabit } from "@/services/habitService";
import type { Habit } from "@/types";

import HabitCard from "@/components/habits/HabitCard";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonCard } from "@/components/common/Skeleton";

function getTodayKey() {
    return new Date().toISOString().split("T")[0];
}

export default function HabitsPage() {

    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const todayKey = getTodayKey();

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getHabits();
            setHabits(data.data?.habits ?? []);
        } catch {
            setError("Failed to load habits.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function handleCheckedIn(id: string) {
        setHabits((prev) =>
            prev.map((h) =>
                h._id === id
                    ? {
                        ...h,
                        currentStreak: h.currentStreak + 1,
                        totalCompletions: h.totalCompletions + 1,
                        completionLogs: [
                            ...h.completionLogs,
                            { date: todayKey, completedAt: new Date().toISOString() },
                        ],
                    }
                    : h
            )
        );
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const { data } = await deleteHabit(deleteId);
            toast.success(data.message ?? "Habit deleted");
            setHabits((prev) => prev.filter((h) => h._id !== deleteId));
            setDeleteId(null);
        } catch {
            toast.error("Failed to delete habit");
        } finally {
            setDeleteLoading(false);
        }
    }

    const habitToDelete = habits.find((h) => h._id === deleteId);

    const completedCount = habits.filter((h) =>
        h.completionLogs.some((l) => l.date === todayKey)
    ).length;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Habits</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {loading ? "Loading..." : `${completedCount} of ${habits.length} done today`}
                    </p>
                </div>

                <Link
                    href="/habits/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition"
                >
                    <Plus size={18} />
                    New Habit
                </Link>

            </div>

            {/* Error */}
            {error && <ErrorState message={error} onRetry={load} />}

            {/* Grid */}
            {!error && (
                loading ? (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                    </div>
                ) : habits.length === 0 ? (
                    <EmptyState
                        icon={Flame}
                        title="No Habits Yet"
                        description="Build positive daily habits to boost your productivity and well-being."
                    />
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {habits.map((habit) => (
                            <HabitCard
                                key={habit._id}
                                habit={habit}
                                todayKey={todayKey}
                                onCheckedIn={handleCheckedIn}
                                onDelete={(id) => setDeleteId(id)}
                            />
                        ))}
                    </div>
                )
            )}

            {/* Delete confirm */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
                        <div className="flex items-center justify-center mb-5">
                            <div className="rounded-2xl bg-red-50 p-4">
                                <Trash2 size={28} className="text-red-500" />
                            </div>
                        </div>
                        <h2 className="text-center text-xl font-bold">Delete Habit?</h2>
                        <p className="mt-2 text-center text-sm text-gray-500">
                            "{habitToDelete?.title}" and all streak data will be deleted.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 h-11 rounded-xl border hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 h-11 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50">
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}