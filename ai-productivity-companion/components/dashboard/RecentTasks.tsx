"use client";

import Link from "next/link";
import { CircleCheckBig, Clock } from "lucide-react";
import type { Task } from "@/types";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import { SkeletonListItem } from "@/components/common/Skeleton";

interface Props {
    tasks: Task[];
    loading?: boolean;
}

function formatDate(dateStr?: string) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export default function RecentTasks({ tasks, loading }: Props) {
    return (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between mb-5">

                <h2 className="text-lg font-bold text-[#0A0A0A]">Recent Tasks</h2>

                <Link
                    href="/tasks"
                    className="text-xs text-[#6B7280] hover:text-[#0A0A0A] hover:underline transition-colors font-medium"
                >
                    View all
                </Link>

            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => <SkeletonListItem key={i} />)}
                </div>
            ) : tasks.length === 0 ? (
                <div className="py-10 text-center text-[#9CA3AF]">
                    <CircleCheckBig size={32} className="mx-auto mb-2 text-[#D1D5DB]" />
                    <p className="text-sm">No tasks yet</p>
                </div>
            ) : (
                <div className="space-y-2.5">

                    {tasks.slice(0, 5).map((task) => (

                        <Link
                            key={task._id}
                            href={`/tasks/${task._id}`}
                            className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-gray-50 p-3 hover:bg-white hover:shadow-sm hover:border-gray-300 transition-all duration-200"
                        >

                            <div className="flex items-center gap-3 min-w-0">

                                <CircleCheckBig
                                    size={18}
                                    className={`transition-colors ${task.status === "completed" ? "text-green-600 fill-green-50" : "text-[#D1D5DB]"}`}
                                />

                                <div className="min-w-0">

                                    <p className={`text-sm font-semibold truncate ${task.status === "completed" ? "line-through text-[#9CA3AF] font-normal" : "text-[#0A0A0A]"}`}>
                                        {task.title}
                                    </p>

                                    {task.dueDate && (
                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-[#9CA3AF] font-medium">
                                            <Clock size={11} className="text-[#D1D5DB]" />
                                            {formatDate(task.dueDate)}
                                        </div>
                                    )}

                                </div>

                            </div>

                            <PriorityBadge priority={task.priority} />

                        </Link>

                    ))}

                </div>
            )}

        </div>
    );

}