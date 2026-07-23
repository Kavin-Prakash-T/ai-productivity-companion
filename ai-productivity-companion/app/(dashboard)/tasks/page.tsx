"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { getTasks, completeTask, deleteTask } from "@/services/taskService";
import type { Task } from "@/types";

import TaskCard from "@/components/tasks/TaskCard";
import TaskFilter from "@/components/tasks/TaskFilter";
import EmptyTask from "@/components/tasks/EmptyTask";
import DeleteTaskModal from "@/components/tasks/DeleteTaskModal";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonTaskCard } from "@/components/common/Skeleton";

const PAGE_SIZE = 10;

export default function TasksPage() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");

    // Pagination
    const [page, setPage] = useState(1);

    // Delete modal
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const load = useCallback(async () => {

        setLoading(true);
        setError(null);

        try {

            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (priority) params.set("priority", priority);
            if (status) params.set("status", status);

            const { data } = await getTasks();
            setTasks(data.data?.tasks ?? []);

        } catch {
            setError("Failed to load tasks.");
        } finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // Client-side filter + sort
    const filtered = useMemo(() => {

        let list = [...tasks];

        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (t) =>
                    t.title.toLowerCase().includes(q) ||
                    t.description?.toLowerCase().includes(q)
            );
        }

        if (priority) {
            list = list.filter((t) => t.priority === priority);
        }

        if (status) {
            list = list.filter((t) => t.status === status);
        }

        return list;

    }, [tasks, search, priority, status]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, priority, status]);

    async function handleComplete(id: string) {

        try {
            const { data } = await completeTask(id);
            toast.success(data.message ?? "Task completed");
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === id ? { ...t, status: "completed" } : t
                )
            );
        } catch {
            toast.error("Failed to update task");
        }

    }

    async function handleDelete() {

        if (!deleteId) return;

        setDeleteLoading(true);

        try {
            const { data } = await deleteTask(deleteId);
            toast.success(data.message ?? "Task deleted");
            setTasks((prev) => prev.filter((t) => t._id !== deleteId));
            setDeleteId(null);
        } catch {
            toast.error("Failed to delete task");
        } finally {
            setDeleteLoading(false);
        }

    }

    const taskToDelete = tasks.find((t) => t._id === deleteId);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Tasks</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {loading ? "Loading..." : `${filtered.length} task${filtered.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                <Link
                    href="/tasks/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition"
                >
                    <Plus size={18} />
                    New Task
                </Link>

            </div>

            {/* Filters */}
            <TaskFilter
                search={search}
                priority={priority}
                status={status}
                onSearch={setSearch}
                onPriority={setPriority}
                onStatus={setStatus}
            />

            {/* Error */}
            {error && (
                <ErrorState message={error} onRetry={load} />
            )}

            {/* Grid */}
            {!error && (
                <>
                    {loading ? (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <SkeletonTaskCard key={i} />
                            ))}
                        </div>
                    ) : paginated.length === 0 ? (
                        <EmptyTask />
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {paginated.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onComplete={handleComplete}
                                    onDelete={(id) => setDeleteId(id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3">

                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-gray-100 transition disabled:opacity-40"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <span className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-gray-100 transition disabled:opacity-40"
                            >
                                <ChevronRight size={18} />
                            </button>

                        </div>
                    )}
                </>
            )}

            {/* Delete Modal */}
            {deleteId && (
                <DeleteTaskModal
                    taskTitle={taskToDelete?.title}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                    loading={deleteLoading}
                />
            )}

        </div>
    );

}