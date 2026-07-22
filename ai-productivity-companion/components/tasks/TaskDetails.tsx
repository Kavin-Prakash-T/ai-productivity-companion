"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
    Calendar,
    Clock,
    Flag,
    FolderOpen,
    Pencil,
    Trash2,
    CheckCircle2,
} from "lucide-react";

import {
    getTask,
    completeTask,
    deleteTask,
} from "@/services/taskService";

import { useRouter } from "next/navigation";

export default function TaskDetails({
    id,
}: {
    id: string;
}) {
    const router = useRouter();

    const [task, setTask] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTask();
    }, []);

    async function loadTask() {
        try {
            const { data } = await getTask(id);

            setTask(data.task);
        } catch {
            toast.error("Unable to load task");
        } finally {
            setLoading(false);
        }
    }

    async function handleComplete() {
        try {
            const { data } = await completeTask(id);

            toast.success(data.message);

            loadTask();
        } catch {
            toast.error("Unable to update");
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this task?")) return;

        try {
            const { data } = await deleteTask(id);

            toast.success(data.message);

            router.push("/tasks");
        } catch {
            toast.error("Delete failed");
        }
    }

    if (loading)
        return <p>Loading...</p>;

    if (!task)
        return <p>Task not found.</p>;

    return (
        <div className="mx-auto max-w-5xl space-y-8">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        {task.title}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Task Details
                    </p>

                </div>

                <div className="flex gap-3">

                    <Link
                        href={`/tasks/${id}/edit`}
                        className="flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-gray-100"
                    >
                        <Pencil size={18} />
                        Edit
                    </Link>

                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 rounded-xl border border-red-300 px-5 py-3 text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>

                </div>

            </div>

            <div className="rounded-2xl border bg-white p-8 space-y-6">

                <div>

                    <h2 className="font-semibold mb-2">
                        Description
                    </h2>

                    <p className="text-gray-600">
                        {task.description}
                    </p>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    <div className="flex items-center gap-3">
                        <Flag size={18} />
                        <span>{task.priority}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <FolderOpen size={18} />
                        <span>{task.category}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar size={18} />
                        <span>{task.dueDate}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Clock size={18} />
                        <span>{task.estimatedTime}</span>
                    </div>

                </div>

                <button
                    onClick={handleComplete}
                    className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-white"
                >
                    <CheckCircle2 size={20} />
                    Mark Completed
                </button>

            </div>

        </div>
    );
}