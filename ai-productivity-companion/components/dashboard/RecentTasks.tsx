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
        <div className="rounded-2xl border bg-white p-6">

            <div className="flex items-center justify-between mb-5">

                <h2 className="text-xl font-semibold">Recent Tasks</h2>

                <Link
                    href="/tasks"
                    className="text-sm text-gray-500 hover:text-black transition"
                >
                    View all
                </Link>

            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => <SkeletonListItem key={i} />)}
                </div>
            ) : tasks.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                    <CircleCheckBig size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No tasks yet</p>
                </div>
            ) : (
                <div className="space-y-3">

                    {tasks.slice(0, 5).map((task) => (

                        <Link
                            key={task._id}
                            href={`/tasks/${task._id}`}
                            className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50 transition"
                        >

                            <div className="flex items-center gap-3 min-w-0">

                                <CircleCheckBig
                                    size={18}
                                    className={task.status === "completed" ? "text-black" : "text-gray-300"}
                                />

                                <div className="min-w-0">

                                    <p className={`text-sm font-medium truncate ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>
                                        {task.title}
                                    </p>

                                    {task.dueDate && (
                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                                            <Clock size={11} />
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