"use client";

import Link from "next/link";
import { Target, Calendar, Trash2 } from "lucide-react";
import type { Goal } from "@/types";

interface Props {
    goal: Goal;
    onDelete?: (id: string) => void;
}

const statusStyles: Record<string, string> = {
    "not-started": "bg-gray-100 text-[#6B7280] border border-[#E5E7EB]",
    "in-progress": "bg-blue-50 text-blue-700 border border-blue-200",
    "completed": "bg-green-50 text-green-700 border border-green-200",
    "cancelled": "bg-red-50 text-red-700 border border-red-200",
};

function formatDate(dateStr?: string) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function GoalCard({ goal, onDelete }: Props) {

    function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        onDelete?.(goal._id);
    }

    const style = statusStyles[goal.status] ?? "bg-gray-100 text-[#6B7280]";

    return (
        <Link
            href={`/goals/${goal._id}`}
            className="block rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-300 group"
        >

            <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3 min-w-0">

                    <div className="shrink-0 rounded-xl bg-gray-50 border border-[#E5E7EB] p-2.5 mt-0.5 text-[#9CA3AF] group-hover:text-[#0A0A0A] group-hover:bg-gray-100 group-hover:border-gray-300 transition-all duration-300 shadow-sm">
                        <Target size={18} />
                    </div>

                    <div className="min-w-0">

                        <h2 className="font-bold text-base leading-snug text-[#0A0A0A] truncate">
                            {goal.title}
                        </h2>

                        {goal.description && (
                            <p className="mt-1.5 text-sm text-[#6B7280] line-clamp-2 leading-relaxed">
                                {goal.description}
                            </p>
                        )}

                    </div>

                </div>

                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${style}`}>
                    {goal.status.replace("-", " ")}
                </span>

            </div>

            {/* Progress */}
            <div className="mt-5">

                <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#6B7280]">Progress</span>
                    <span className="font-bold text-[#0A0A0A]">{goal.progress}%</span>
                </div>

                <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                    <div
                        className="h-1.5 rounded-full bg-[#0A0A0A] transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                    />
                </div>

            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">

                {goal.targetDate ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
                        <Calendar size={13} className="text-[#9CA3AF]" />
                        {formatDate(goal.targetDate)}
                    </div>
                ) : (
                    <div />
                )}

                {onDelete && (
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-100"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                )}

            </div>

        </Link>
    );

}