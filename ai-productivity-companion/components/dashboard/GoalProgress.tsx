"use client";

import Link from "next/link";
import type { Goal } from "@/types";
import { SkeletonCard } from "@/components/common/Skeleton";
import { Target } from "lucide-react";

interface Props {
    goals: Goal[];
    loading?: boolean;
}

export default function GoalProgress({ goals, loading }: Props) {
    return (
        <div className="rounded-2xl border bg-white p-6">

            <div className="flex items-center justify-between mb-5">

                <h2 className="text-xl font-semibold">Goal Progress</h2>

                <Link
                    href="/goals"
                    className="text-sm text-gray-500 hover:text-black transition"
                >
                    View all
                </Link>

            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => <SkeletonCard key={i} />)}
                </div>
            ) : goals.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                    <Target size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No goals yet</p>
                </div>
            ) : (
                <div className="space-y-5">

                    {goals.slice(0, 4).map((goal) => (

                        <Link
                            key={goal._id}
                            href={`/goals/${goal._id}`}
                            className="block hover:opacity-80 transition"
                        >

                            <div className="flex justify-between items-center mb-2">

                                <p className="text-sm font-medium truncate pr-4">
                                    {goal.title}
                                </p>

                                <span className="text-sm font-semibold shrink-0">
                                    {goal.progress}%
                                </span>

                            </div>

                            <div className="h-2 rounded-full bg-gray-100">
                                <div
                                    className="h-2 rounded-full bg-black transition-all"
                                    style={{ width: `${goal.progress}%` }}
                                />
                            </div>

                        </Link>

                    ))}

                </div>
            )}

        </div>
    );

}