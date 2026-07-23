"use client";

import Link from "next/link";
import { Target, Calendar, Trash2 } from "lucide-react";
import type { Goal } from "@/types";

interface Props {
    goal: Goal;
    onDelete?: (id: string) => void;
}

const statusStyles: Record<string, string> = {
    "not-started": "bg-gray-100 text-gray-600",
    "in-progress": "bg-blue-100 text-blue-700",
    "completed": "bg-green-100 text-green-700",
    "cancelled": "bg-red-100 text-red-600",
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

    const style = statusStyles[goal.status] ?? "bg-gray-100 text-gray-600";

    return (
        <Link
            href={`/goals/${goal._id}`}
            className="block rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition"
        >

            <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3 min-w-0">

                    <div className="shrink-0 rounded-xl bg-gray-100 p-2.5 mt-0.5">
                        <Target size={18} />
                    </div>

                    <div className="min-w-0">

                        <h2 className="font-semibold text-base leading-snug truncate">
                            {goal.title}
                        </h2>

                        {goal.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {goal.description}
                            </p>
                        )}

                    </div>

                </div>

                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
                    {goal.status.replace("-", " ")}
                </span>

            </div>

            {/* Progress */}
            <div className="mt-5">

                <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold">{goal.progress}%</span>
                </div>

                <div className="h-2.5 rounded-full bg-gray-100">
                    <div
                        className="h-2.5 rounded-full bg-black transition-all"
                        style={{ width: `${goal.progress}%` }}
                    />
                </div>

            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">

                {goal.targetDate ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={15} />
                        {formatDate(goal.targetDate)}
                    </div>
                ) : (
                    <div />
                )}

                {onDelete && (
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                )}

            </div>

        </Link>
    );

}