"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import { getGoals, deleteGoal } from "@/services/goalService";
import type { Goal } from "@/types";

import GoalCard from "@/components/goals/GoalCard";
import GoalFilter from "@/components/goals/GoalFilter";
import DeleteGoalModal from "@/components/goals/DeleteGoalModal";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonCard } from "@/components/common/Skeleton";
import { Target } from "lucide-react";

export default function GoalsPage() {

    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getGoals();
            setGoals(data.data?.goals ?? []);
        } catch {
            setError("Failed to load goals.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        let list = [...goals];
        if (search) {
            const q = search.toLowerCase();
            list = list.filter((g) => g.title.toLowerCase().includes(q));
        }
        if (status) {
            list = list.filter((g) => g.status === status);
        }
        return list;
    }, [goals, search, status]);

    async function handleDelete() {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const { data } = await deleteGoal(deleteId);
            toast.success(data.message ?? "Goal deleted");
            setGoals((prev) => prev.filter((g) => g._id !== deleteId));
            setDeleteId(null);
        } catch {
            toast.error("Failed to delete goal");
        } finally {
            setDeleteLoading(false);
        }
    }

    const goalToDelete = goals.find((g) => g._id === deleteId);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Goals</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {loading ? "Loading..." : `${filtered.length} goal${filtered.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                <Link
                    href="/goals/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition"
                >
                    <Plus size={18} />
                    New Goal
                </Link>

            </div>

            {/* Filter */}
            <GoalFilter
                search={search}
                status={status}
                onSearch={setSearch}
                onStatus={setStatus}
            />

            {/* Error */}
            {error && <ErrorState message={error} onRetry={load} />}

            {/* Grid */}
            {!error && (
                loading ? (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={Target}
                        title="No Goals Found"
                        description="You haven't set any goals yet. Start by creating your first goal."
                    />
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {filtered.map((goal) => (
                            <GoalCard
                                key={goal._id}
                                goal={goal}
                                onDelete={(id) => setDeleteId(id)}
                            />
                        ))}
                    </div>
                )
            )}

            {/* Delete Modal */}
            {deleteId && (
                <DeleteGoalModal
                    goalTitle={goalToDelete?.title}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                    loading={deleteLoading}
                />
            )}

        </div>
    );

}