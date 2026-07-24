"use client";

import Link from "next/link";
import { Calendar, Flag, SquareCheckBig, CheckCircle2, Trash2 } from "lucide-react";
import type { Task } from "@/types";
import PriorityBadge from "./PriorityBadge";

interface Props {
    task: Task;
    onComplete?: (id: string) => void;
    onDelete?: (id: string) => void;
}

function formatDate(dateStr?: string) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function TaskCard({ task, onComplete, onDelete }: Props) {

    const isCompleted = task.status === "completed";

    function handleComplete(e: React.MouseEvent) {
        e.preventDefault();
        onComplete?.(task._id);
    }

    function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        onDelete?.(task._id);
    }

    return (
        <Link
            href={`/tasks/${task._id}`}
            className="block rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm hover:border-gray-300 hover:shadow-md hover:bg-gray-50 transition-all duration-300 group"
        >

            <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3 min-w-0">

                    <button
                        onClick={handleComplete}
                        title={isCompleted ? "Completed" : "Mark complete"}
                        className="mt-0.5 shrink-0 text-[#9CA3AF] hover:text-[#0A0A0A] transition-colors"
                    >
                        <CheckCircle2
                            size={18}
                            className={isCompleted ? "text-green-600 fill-green-50" : ""}
                        />
                    </button>

                    <div className="min-w-0">

                        <h2 className={`text-base font-bold leading-snug ${isCompleted ? "line-through text-[#9CA3AF] font-normal" : "text-[#0A0A0A]"}`}>
                            {task.title}
                        </h2>

                        {task.description && (
                            <p className="mt-1.5 text-sm text-[#6B7280] line-clamp-2 leading-relaxed">
                                {task.description}
                            </p>
                        )}

                    </div>

                </div>

                <div className="shrink-0">
                    <PriorityBadge priority={task.priority} />
                </div>

            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#6B7280] font-medium">

                {task.dueDate && (
                    <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#9CA3AF]" />
                        {formatDate(task.dueDate)}
                    </div>
                )}

                {task.category && (
                    <div className="flex items-center gap-1.5">
                        <Flag size={13} className="text-[#9CA3AF]" />
                        {task.category}
                    </div>
                )}

                <div className="flex items-center gap-1.5">
                    <SquareCheckBig size={13} className="text-[#9CA3AF]" />
                    <span className="capitalize">{task.status}</span>
                </div>

            </div>

            {onDelete && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-100"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                </div>
            )}

        </Link>
    );

}