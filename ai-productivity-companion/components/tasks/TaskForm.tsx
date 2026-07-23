"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    Type,
    FileText,
    Calendar,
    Flag,
    FolderOpen,
    Clock,
    Sparkles,
    ArrowLeft,
    Loader2,
} from "lucide-react";

import Button from "../common/Button";
import { createTask, getTask, updateTask } from "@/services/taskService";

interface Props {
    id?: string;
}

export default function TaskForm({ id }: Props) {

    const router = useRouter();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        category: "General",
        dueDate: "",
        estimatedMinutes: "",
    });

    useEffect(() => {
        if (!id) return;

        async function fetchTask() {
            try {
                const { data } = await getTask(id!);
                const task = data.data?.task ?? data.task;

                // Format dueDate to match datetime-local input format (YYYY-MM-DDTHH:MM)
                let formattedDate = "";
                if (task.dueDate) {
                    const date = new Date(task.dueDate);
                    formattedDate = date.toISOString().slice(0, 16);
                }

                setFormData({
                    title: task.title || "",
                    description: task.description || "",
                    priority: task.priority || "medium",
                    category: task.category || "General",
                    dueDate: formattedDate,
                    estimatedMinutes: task.estimatedMinutes?.toString() || "",
                });
            } catch {
                toast.error("Failed to load task details");
            } finally {
                setFetching(false);
            }
        }

        fetchTask();
    }, [id]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit() {

        if (!formData.title.trim()) {
            return toast.error("Task title is required");
        }

        const minutesVal = formData.estimatedMinutes.trim();
        if (minutesVal && (Number.isNaN(Number(minutesVal)) || Number(minutesVal) < 1)) {
            return toast.error("Estimated minutes must be at least 1");
        }

        const payload = {
            ...formData,
            estimatedMinutes: minutesVal ? Number(minutesVal) : undefined,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        };

        try {
            setLoading(true);

            if (isEdit) {
                const { data } = await updateTask(id!, payload);
                toast.success(data.message || "Task updated successfully");
                router.push(`/tasks/${id}`);
            } else {
                const { data } = await createTask(payload);
                toast.success(data.message || "Task created successfully");
                router.push("/tasks");
            }
            router.refresh();
        }
        catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                `Unable to ${isEdit ? "update" : "create"} task`
            );
        }
        finally {
            setLoading(false);
        }

    }

    if (fetching) {
        return (
            <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            <div className="flex items-center gap-3">
                <Link
                    href={isEdit ? `/tasks/${id}` : "/tasks"}
                    className="rounded-xl border p-2 hover:bg-gray-100 transition"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isEdit ? "Edit Task" : "Create Task"}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEdit ? "Modify your task configuration." : "Add a new task to your productivity system."}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-6">

                <div>
                    <label className="mb-2 flex items-center gap-2 font-medium">
                        <Type size={18} />
                        Title
                    </label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        placeholder="Task title"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 font-medium">
                        <FileText size={18} />
                        Description
                    </label>
                    <textarea
                        rows={5}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        placeholder="Task description"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <Flag size={18} />
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <FolderOpen size={18} />
                            Category
                        </label>
                        <input
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                            placeholder="Work / Study / Personal"
                        />
                    </div>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <Calendar size={18} />
                            Due Date
                        </label>
                        <input
                            type="datetime-local"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        />
                    </div>

                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <Clock size={18} />
                            Estimated Time (Minutes)
                        </label>
                        <input
                            type="number"
                            name="estimatedMinutes"
                            value={formData.estimatedMinutes}
                            onChange={handleChange}
                            placeholder="120"
                            className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        />
                    </div>

                </div>

                {!isEdit && (
                    <div className="rounded-xl border p-6 bg-gray-50">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={20} />
                            <h2 className="font-semibold">AI Suggestion</h2>
                        </div>
                        <p className="text-sm text-gray-500">
                            Click Generate after saving the task to let AI
                            create subtasks, estimate completion time and
                            recommend the best execution plan.
                        </p>
                    </div>
                )}

                <div className="flex justify-end">
                    <div className="w-48">
                        <Button
                            title={loading ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
                            onClick={handleSubmit}
                            disabled={loading}
                        />
                    </div>
                </div>

            </div>

        </div>
    );

}