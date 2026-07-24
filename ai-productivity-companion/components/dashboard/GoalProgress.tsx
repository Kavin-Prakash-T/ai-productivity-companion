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
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between mb-5">

                <h2 className="text-lg font-bold text-[#0A0A0A]">Goal Progress</h2>

                <Link
                    href="/goals"
                    className="text-xs text-[#6B7280] hover:text-[#0A0A0A] hover:underline transition-colors font-medium"
                >
                    View all
                </Link>

            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => <SkeletonCard key={i} />)}
                </div>
            ) : goals.length === 0 ? (
                <div className="py-10 text-center text-[#9CA3AF]">
                    <Target size={32} className="mx-auto mb-2 text-[#D1D5DB]" />
                    <p className="text-sm">No goals yet</p>
                </div>
            ) : (
                <div className="space-y-3">

                    {goals.slice(0, 4).map((goal) => (

                        <Link
                            key={goal._id}
                            href={`/goals/${goal._id}`}
                            className="block rounded-xl border border-[#E5E7EB] bg-gray-50 p-3.5 hover:bg-white hover:shadow-sm hover:border-gray-300 transition-all duration-200"
                        >

                            <div className="flex justify-between items-center mb-2.5">

                                <p className="text-sm font-semibold text-[#0A0A0A] truncate pr-4">
                                    {goal.title}
                                </p>

                                <span className="text-xs font-bold text-[#6B7280] shrink-0">
                                    {goal.progress}%
                                </span>

                            </div>

                            <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                                <div
                                    className="h-1.5 rounded-full bg-[#0A0A0A] transition-all duration-500"
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