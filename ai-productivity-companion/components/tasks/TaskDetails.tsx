"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Calendar,
    Clock,
    Flag,
    FolderOpen,
    Pencil,
    Trash2,
    CheckCircle2,
    ArrowLeft,
    Loader2,
} from "lucide-react";

import {
    getTask,
    completeTask,
    deleteTask,
} from "@/services/taskService";

import PriorityBadge from "./PriorityBadge";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonText } from "@/components/common/Skeleton";

function formatDate(dateStr?: string) {
    if (!dateStr) return "No due date";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatMinutes(minutes?: number) {
    if (!minutes) return "No time estimate";
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
}

export default function TaskDetails({ id }: { id: string }) {

    const router = useRouter();

    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    async function loadTask() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getTask(id);
            setTask(data.data?.task ?? data.task);
        } catch {
            setError("Failed to load task details");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTask();
    }, [id]);

    async function handleComplete() {
        if (!task || task.status === "completed") return;
        setUpdating(true);
        try {
            const { data } = await completeTask(id);
            toast.success(data.message || "Task completed");
            setTask({ ...task, status: "completed" });
        } catch {
            toast.error("Failed to complete task");
        } finally {
            setUpdating(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            const { data } = await deleteTask(id);
            toast.success(data.message || "Task deleted");
            router.push("/tasks");
        } catch {
            toast.error("Failed to delete task");
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                <div className="rounded-2xl border bg-white p-8">
                    <SkeletonText lines={4} />
                </div>
            </div>
        );
    }

    if (error || !task) {
        return <ErrorState message={error ?? "Task not found."} onRetry={loadTask} />;
    }

    const isCompleted = task.status === "completed";

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-3">
                    <Link
                        href="/tasks"
                        className="mt-1 rounded-xl border p-2 hover:bg-gray-100 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">{task.title}</h1>
                        <p className="text-gray-500 mt-1 text-sm">Task Details</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/tasks/${id}/edit`}
                        className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                        <Pencil size={16} />
                        Edit
                    </Link>
                    <button
                        onClick={() => setShowDelete(true)}
                        className="flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>

            </div>

            {/* Content card */}
            <div className="rounded-2xl border bg-white p-6 sm:p-8 space-y-6">

                <div>
                    <h2 className="font-semibold text-gray-800 text-lg mb-2">Description</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {task.description || "No description provided."}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 border-t border-b py-6">

                    <div className="flex items-center gap-3 text-gray-600">
                        <Flag size={18} className="text-gray-400 shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs text-gray-400">Priority</span>
                            <PriorityBadge priority={task.priority} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <FolderOpen size={18} className="text-gray-400 shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs text-gray-400">Category</span>
                            <span className="font-medium text-black">{task.category}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={18} className="text-gray-400 shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs text-gray-400">Due Date</span>
                            <span className="font-medium text-black">{formatDate(task.dueDate)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <Clock size={18} className="text-gray-400 shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs text-gray-400">Estimated Duration</span>
                            <span className="font-medium text-black">{formatMinutes(task.estimatedMinutes)}</span>
                        </div>
                    </div>

                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleComplete}
                        disabled={isCompleted || updating}
                        className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition ${isCompleted
                            ? "bg-gray-100 text-gray-500 cursor-default"
                            : "bg-black text-white hover:bg-neutral-800"
                            } disabled:opacity-50`}
                    >
                        <CheckCircle2 size={20} className={isCompleted ? "fill-gray-400 text-white" : ""} />
                        {isCompleted ? "Completed" : updating ? "Saving..." : "Mark Completed"}
                    </button>
                    {task.status && !isCompleted && (
                        <span className="text-sm text-gray-400 italic">Task is currently {task.status}.</span>
                    )}
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowDelete(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
                        <h2 className="text-center text-xl font-bold">Delete Task?</h2>
                        <p className="mt-3 text-center text-sm text-gray-500">This action cannot be undone.</p>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setShowDelete(false)} className="flex-1 h-11 rounded-xl border hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 h-11 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50">
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}