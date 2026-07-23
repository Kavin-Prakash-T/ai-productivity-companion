"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Calendar, FolderOpen, Pencil, Trash2, CheckCircle2 } from "lucide-react";

import { getGoal, deleteGoal } from "@/services/goalService";
import { useRouter } from "next/navigation";
import type { Goal } from "@/types";
import GoalProgress from "./GoalProgress";
import { SkeletonText } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";

const statusStyles: Record<string, string> = {
    "not-started": "bg-gray-100 text-gray-600",
    "in-progress": "bg-blue-100 text-blue-700",
    "completed": "bg-green-100 text-green-700",
    "cancelled": "bg-red-100 text-red-600",
};

function formatDate(dateStr?: string) {
    if (!dateStr) return "No date set";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export default function GoalDetails({ id }: { id: string }) {

    const router = useRouter();

    const [goal, setGoal] = useState<Goal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        loadGoal();
    }, []);

    async function loadGoal() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getGoal(id);
            setGoal(data.data?.goal ?? data.goal);
        } catch {
            setError("Failed to load goal.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            const { data } = await deleteGoal(id);
            toast.success(data.message ?? "Goal deleted");
            router.push("/goals");
        } catch {
            toast.error("Failed to delete goal");
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

    if (error || !goal) {
        return <ErrorState message={error ?? "Goal not found."} onRetry={loadGoal} />;
    }

    const style = statusStyles[goal.status] ?? "bg-gray-100 text-gray-600";

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-3">

                    <Link
                        href="/goals"
                        className="mt-1 rounded-xl border p-2 hover:bg-gray-100 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">{goal.title}</h1>
                        <p className="mt-1 text-sm text-gray-500">Goal Details</p>
                    </div>

                </div>

                <div className="flex gap-2">

                    <Link
                        href={`/goals/${id}/edit`}
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

            {/* Main card */}
            <div className="rounded-2xl border bg-white p-6 sm:p-8 space-y-6">

                <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${style}`}>
                        {goal.status.replace("-", " ")}
                    </span>
                    {goal.category && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <FolderOpen size={15} />
                            {goal.category}
                        </div>
                    )}
                </div>

                {goal.description && (
                    <p className="text-gray-600 leading-relaxed">{goal.description}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    Target: {formatDate(goal.targetDate)}
                </div>

                {goal.completedAt && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 size={16} />
                        Completed: {formatDate(goal.completedAt)}
                    </div>
                )}

            </div>

            {/* Progress updater */}
            {goal.status !== "completed" && goal.status !== "cancelled" && (
                <GoalProgress
                    goalId={id}
                    currentProgress={goal.progress}
                    onUpdated={(p) => setGoal({ ...goal, progress: p })}
                />
            )}

            {/* Delete confirm */}
            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowDelete(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
                        <h2 className="text-center text-xl font-bold">Delete Goal?</h2>
                        <p className="mt-3 text-center text-sm text-gray-500">This cannot be undone.</p>
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
