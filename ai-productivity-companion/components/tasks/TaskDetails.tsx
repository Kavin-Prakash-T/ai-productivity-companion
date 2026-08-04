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
    Sparkles,
    Circle,
    Plus,
} from "lucide-react";

import {
    getTask,
    completeTask,
    deleteTask,
    getSubtasks,
    createSubtask,
    updateSubtask,
    deleteSubtask,
} from "@/services/taskService";

import { breakTask } from "@/services/aiService";

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

    const [subtasks, setSubtasks] = useState<any[]>([]);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [addingSubtask, setAddingSubtask] = useState(false);
    const [breakingTask, setBreakingTask] = useState(false);

    async function loadTask() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getTask(id);
            const loadedTask = data.data?.task ?? data.task;
            setTask(loadedTask);
            setSubtasks(loadedTask?.subtasks ?? []);
        } catch {
            setError("Failed to load task details");
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleSubtask(subtaskId: string, currentCompleted: boolean) {
        try {
            const updatedCompleted = !currentCompleted;
            // Optimistic UI update
            setSubtasks(prev =>
                prev.map(st =>
                    st._id === subtaskId ? { ...st, completed: updatedCompleted } : st
                )
            );
            await updateSubtask(id, subtaskId, { completed: updatedCompleted });
        } catch {
            toast.error("Failed to update subtask");
            // Revert on error
            setSubtasks(prev =>
                prev.map(st =>
                    st._id === subtaskId ? { ...st, completed: currentCompleted } : st
                )
            );
        }
    }

    async function handleAddSubtask(e: React.FormEvent) {
        e.preventDefault();
        if (!newSubtaskTitle.trim()) return;
        setAddingSubtask(true);
        try {
            const { data } = await createSubtask(id, newSubtaskTitle.trim());
            const updatedTask = data.data?.task ?? data.task;
            setSubtasks(updatedTask.subtasks || []);
            setNewSubtaskTitle("");
            toast.success("Subtask added");
        } catch {
            toast.error("Failed to add subtask");
        } finally {
            setAddingSubtask(false);
        }
    }

    async function handleDeleteSubtask(subtaskId: string) {
        try {
            setSubtasks(prev => prev.filter(st => st._id !== subtaskId));
            await deleteSubtask(id, subtaskId);
            toast.success("Subtask deleted");
        } catch {
            toast.error("Failed to delete subtask");
            // Revert
            const { data } = await getTask(id);
            const loadedTask = data.data?.task ?? data.task;
            setSubtasks(loadedTask?.subtasks ?? []);
        }
    }

    async function handleAiBreakdown() {
        setBreakingTask(true);
        const toastId = toast.loading("AI is generating task breakdown...");
        try {
            const { data } = await breakTask(id, true);
            toast.success(data.message || "Task broken down successfully!", { id: toastId });
            // Reload task details and subtasks
            const { data: updatedData } = await getTask(id);
            const loadedTask = updatedData.data?.task ?? updatedData.task;
            setTask(loadedTask);
            setSubtasks(loadedTask?.subtasks ?? []);
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to generate AI breakdown", { id: toastId });
        } finally {
            setBreakingTask(false);
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
                        className="mt-1 rounded-xl border border-[#E5E7EB] bg-white p-2 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">{task.title}</h1>
                        <p className="text-[#6B7280] mt-1 text-sm font-medium">Task Details</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        href={`/tasks/${id}/edit`}
                        className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm"
                    >
                        <Pencil size={16} />
                        Edit
                    </Link>
                    <button
                        onClick={() => setShowDelete(true)}
                        className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition shadow-sm"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>

            </div>

            {/* Content card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-6 sm:p-8 space-y-6">

                <div>
                    <h2 className="font-semibold text-[#0A0A0A] text-lg mb-2">Description</h2>
                    <p className="text-[#6B7280] leading-relaxed whitespace-pre-wrap">
                        {task.description || "No description provided."}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 border-t border-b border-[#E5E7EB] py-6">

                    <div className="flex items-center gap-3 text-[#6B7280]">
                        <Flag size={18} className="text-[#9CA3AF] shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs font-medium text-[#9CA3AF]">Priority</span>
                            <PriorityBadge priority={task.priority} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[#6B7280]">
                        <FolderOpen size={18} className="text-[#9CA3AF] shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs font-medium text-[#9CA3AF]">Category</span>
                            <span className="font-semibold text-[#0A0A0A]">{task.category}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[#6B7280]">
                        <Calendar size={18} className="text-[#9CA3AF] shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs font-medium text-[#9CA3AF]">Due Date</span>
                            <span className="font-semibold text-[#0A0A0A]">{formatDate(task.dueDate)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[#6B7280]">
                        <Clock size={18} className="text-[#9CA3AF] shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs font-medium text-[#9CA3AF]">Estimated Duration</span>
                            <span className="font-semibold text-[#0A0A0A]">{formatMinutes(task.estimatedMinutes)}</span>
                        </div>
                    </div>

                </div>

                {/* Subtasks Section */}
                <div className="border-t border-[#E5E7EB] pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#0A0A0A] text-lg flex items-center gap-2">
                            Subtasks
                            {subtasks.length > 0 && (
                                <span className="text-xs bg-gray-100 text-[#6B7280] px-2.5 py-1 rounded-full font-semibold">
                                    {subtasks.filter(st => st.completed).length}/{subtasks.length}
                                </span>
                            )}
                        </h3>
                        <button
                            onClick={handleAiBreakdown}
                            disabled={breakingTask}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] border border-[#E5E7EB] rounded-xl px-3 py-2 bg-white hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
                        >
                            <Sparkles size={13} className="text-[#0A0A0A]" />
                            {breakingTask ? "Generating..." : "AI Breakdown"}
                        </button>
                    </div>

                    {subtasks.length === 0 ? (
                        <p className="text-sm text-[#9CA3AF] font-medium py-2">No subtasks created yet. Click "AI Breakdown" to generate steps or add one below.</p>
                    ) : (
                        <div className="space-y-1 bg-gray-50/50 rounded-xl p-3 border border-[#E5E7EB]/50">
                            {subtasks.map((subtask) => (
                                <div
                                    key={subtask._id}
                                    className="flex items-center justify-between group rounded-xl border border-transparent hover:border-[#E5E7EB] hover:bg-white p-2.5 transition duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleToggleSubtask(subtask._id, subtask.completed)}
                                            className="text-[#9CA3AF] hover:text-[#0A0A0A] transition shrink-0"
                                        >
                                            {subtask.completed ? (
                                                <CheckCircle2 size={18} className="text-[#0A0A0A]" />
                                            ) : (
                                                <Circle size={18} />
                                            )}
                                        </button>
                                        <span
                                            className={`text-sm font-medium ${
                                                subtask.completed
                                                    ? "line-through text-[#9CA3AF]"
                                                    : "text-[#374151]"
                                            }`}
                                        >
                                            {subtask.title}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSubtask(subtask._id)}
                                        className="text-[#9CA3AF] hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-1"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleAddSubtask} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add a new subtask..."
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            disabled={addingSubtask}
                            className="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={addingSubtask || !newSubtaskTitle.trim()}
                            className="flex items-center justify-center h-11 w-11 rounded-xl bg-[#0A0A0A] text-white hover:bg-black/90 disabled:opacity-50 transition shadow-sm shrink-0"
                        >
                            <Plus size={16} />
                        </button>
                    </form>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleComplete}
                        disabled={isCompleted || updating}
                        className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition shadow-sm ${isCompleted
                            ? "bg-gray-100 text-[#9CA3AF] cursor-default"
                            : "bg-[#0A0A0A] text-white hover:bg-black/90"
                            } disabled:opacity-50`}
                    >
                        <CheckCircle2 size={20} className={isCompleted ? "fill-gray-200 text-white" : ""} />
                        {isCompleted ? "Completed" : updating ? "Saving..." : "Mark Completed"}
                    </button>
                    {task.status && !isCompleted && (
                        <span className="text-sm text-[#9CA3AF] italic font-medium">Task is currently {task.status}.</span>
                    )}
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={() => setShowDelete(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white border border-[#E5E7EB] p-8 shadow-2xl">
                        <h2 className="text-center text-xl font-bold text-[#0A0A0A]">Delete Task?</h2>
                        <p className="mt-3 text-center text-sm font-medium text-[#6B7280]">This action cannot be undone.</p>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setShowDelete(false)} className="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-white font-medium text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 h-11 rounded-xl bg-red-600 font-medium text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50">
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}