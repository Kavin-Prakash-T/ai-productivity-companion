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
    "not-started": "bg-gray-100 text-[#6B7280] border border-[#E5E7EB]",
    "in-progress": "bg-blue-50 text-blue-700 border border-blue-200",
    "completed": "bg-green-50 text-green-700 border border-green-200",
    "cancelled": "bg-red-50 text-red-700 border border-red-200",
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
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
                    <SkeletonText lines={4} />
                </div>
            </div>
        );
    }

    if (error || !goal) {
        return <ErrorState message={error ?? "Goal not found."} onRetry={loadGoal} />;
    }

    const style = statusStyles[goal.status] ?? "bg-gray-100 text-[#6B7280]";

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-3">

                    <Link
                        href="/goals"
                        className="mt-1 rounded-xl border border-[#E5E7EB] bg-white p-2 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </Link>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">{goal.title}</h1>
                        <p className="mt-1 text-sm font-medium text-[#6B7280]">Goal Details</p>
                    </div>

                </div>

                <div className="flex gap-2">

                    <Link
                        href={`/goals/${id}/edit`}
                        className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm"
                    >
                        <Pencil size={16} />
                        Edit
                    </Link>

                    <button
                        onClick={() => setShowDelete(true)}
                        className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition shadow-sm"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>

                </div>

            </div>

            {/* Main card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-6 sm:p-8 space-y-6">

                <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${style}`}>
                        {goal.status.replace("-", " ")}
                    </span>
                    {goal.category && (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280]">
                            <FolderOpen size={15} />
                            {goal.category}
                        </div>
                    )}
                </div>

                {goal.description && (
                    <p className="text-[#6B7280] leading-relaxed">{goal.description}</p>
                )}

                <div className="flex items-center gap-2 text-sm font-medium text-[#6B7280]">
                    <Calendar size={16} className="text-[#9CA3AF]" />
                    Target: {formatDate(goal.targetDate)}
                </div>

                {goal.completedAt && (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600">
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
                    <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={() => setShowDelete(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white border border-[#E5E7EB] p-8 shadow-2xl">
                        <h2 className="text-center text-xl font-bold text-[#0A0A0A]">Delete Goal?</h2>
                        <p className="mt-3 text-center text-sm font-medium text-[#6B7280]">This cannot be undone.</p>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setShowDelete(false)} className="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-white font-medium text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 h-11 rounded-xl bg-red-600 font-medium text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50">
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}
