"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Repeat, FolderOpen, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

import { getHabit, checkInHabit, deleteHabit } from "@/services/habitService";
import type { Habit } from "@/types";
import HabitStats from "./HabitStats";
import HabitCalendar from "./HabitCalendar";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonText } from "@/components/common/Skeleton";

function getTodayKey() {
    return new Date().toISOString().split("T")[0];
}

export default function HabitDetails({ id }: { id: string }) {

    const router = useRouter();

    const [habit, setHabit] = useState<Habit | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkingIn, setCheckingIn] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const todayKey = getTodayKey();

    useEffect(() => {
        loadHabit();
    }, []);

    async function loadHabit() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getHabit(id);
            setHabit(data.data?.habit ?? data.habit);
        } catch {
            setError("Failed to load habit.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCheckIn() {
        if (!habit) return;
        const alreadyDone = habit.completionLogs.some((l) => l.date === todayKey);
        if (alreadyDone) return;
        setCheckingIn(true);
        try {
            const { data } = await checkInHabit(id);
            toast.success(data.message ?? "Habit checked in!");
            await loadHabit();
        } catch {
            toast.error("Check-in failed");
        } finally {
            setCheckingIn(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            const { data } = await deleteHabit(id);
            toast.success(data.message ?? "Habit deleted");
            router.push("/habits");
        } catch {
            toast.error("Failed to delete habit");
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                <div className="rounded-2xl border bg-white p-8">
                    <SkeletonText lines={4} />
                </div>
            </div>
        );
    }

    if (error || !habit) {
        return <ErrorState message={error ?? "Habit not found."} onRetry={loadHabit} />;
    }

    const completedToday = habit.completionLogs.some((l) => l.date === todayKey);

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-3">

                    <Link href="/habits" className="mt-1 rounded-xl border p-2 hover:bg-gray-100 transition">
                        <ArrowLeft size={18} />
                    </Link>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">{habit.title}</h1>
                        <p className="mt-1 text-sm text-gray-500">Habit Details</p>
                    </div>

                </div>

                <div className="flex gap-2">

                    <Link
                        href={`/habits/${id}/edit`}
                        className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                        <Pencil size={16} />
                        Edit
                    </Link>

                    <button
                        onClick={() => setShowDelete(true)}
                        className="flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>

                </div>

            </div>

            {/* Info card */}
            <div className="rounded-2xl border bg-white p-6 sm:p-8 space-y-4">

                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Repeat size={15} />
                        <span className="capitalize">{habit.frequency}</span>
                    </div>
                    {habit.category && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FolderOpen size={15} />
                            {habit.category}
                        </div>
                    )}
                </div>

                {habit.description && (
                    <p className="text-gray-600 leading-relaxed">{habit.description}</p>
                )}

                {/* Check-in button */}
                <button
                    onClick={handleCheckIn}
                    disabled={completedToday || checkingIn}
                    className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition ${completedToday
                        ? "bg-gray-100 text-gray-500 cursor-default"
                        : "bg-black text-white hover:bg-neutral-800"
                        } disabled:opacity-50`}
                >
                    {completedToday ? (
                        <><CheckCircle2 size={20} /> Done for today!</>
                    ) : (
                        <><Circle size={20} /> {checkingIn ? "Checking in..." : "Check In Today"}</>
                    )}
                </button>

            </div>

            {/* Stats */}
            <HabitStats habit={habit} />

            {/* Calendar */}
            <HabitCalendar logs={habit.completionLogs} />

            {/* Delete confirm */}
            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowDelete(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
                        <h2 className="text-center text-xl font-bold">Delete Habit?</h2>
                        <p className="mt-3 text-center text-sm text-gray-500">All streak data will be lost. This cannot be undone.</p>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setShowDelete(false)} className="flex-1 h-11 rounded-xl border hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 h-11 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50">
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}
