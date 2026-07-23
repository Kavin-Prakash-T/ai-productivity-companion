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
            className="block rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
        >

            <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3 min-w-0">

                    <button
                        onClick={handleComplete}
                        title={isCompleted ? "Completed" : "Mark complete"}
                        className="mt-0.5 shrink-0 text-gray-400 hover:text-black transition"
                    >
                        <CheckCircle2
                            size={20}
                            className={isCompleted ? "fill-black text-black" : ""}
                        />
                    </button>

                    <div className="min-w-0">

                        <h2 className={`text-base font-semibold leading-snug ${isCompleted ? "line-through text-gray-400" : ""}`}>
                            {task.title}
                        </h2>

                        {task.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                    </div>

                </div>

                <div className="shrink-0">
                    <PriorityBadge priority={task.priority} />
                </div>

            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">

                {task.dueDate && (
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {formatDate(task.dueDate)}
                    </div>
                )}

                {task.category && (
                    <div className="flex items-center gap-1.5">
                        <Flag size={14} />
                        {task.category}
                    </div>
                )}

                <div className="flex items-center gap-1.5">
                    <SquareCheckBig size={14} />
                    <span className="capitalize">{task.status}</span>
                </div>

            </div>

            {onDelete && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                </div>
            )}

        </Link>
    );

}