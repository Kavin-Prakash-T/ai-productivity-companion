"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
    Type,
    FileText,
    Calendar,
    Flag,
    FolderOpen,
    Clock,
    Sparkles,
} from "lucide-react";

import Button from "../common/Button";
import { createTask } from "@/services/taskService";

export default function TaskForm() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        title: "",
        description: "",
        priority: "MEDIUM",
        category: "",
        dueDate: "",
        estimatedTime: ""

    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    }

    async function handleSubmit() {

        if (
            !formData.title ||
            !formData.description ||
            !formData.category ||
            !formData.dueDate
        ) {

            return toast.error("Fill all required fields");

        }

        try {

            setLoading(true);

            const { data } = await createTask(formData);

            toast.success(data.message);

            router.push("/tasks");

        }
        catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                "Unable to create task"
            );

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <div className="max-w-4xl mx-auto">

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Create Task
                </h1>

                <p className="text-gray-500 mt-2">
                    Add a new task to your productivity system.
                </p>

            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm">

                <div className="grid gap-6">

                    <div>

                        <label className="mb-2 flex items-center gap-2 font-medium">

                            <Type size={18} />

                            Title

                        </label>

                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl border px-4"
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
                            className="w-full rounded-xl border p-4"
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
                                className="w-full h-12 rounded-xl border px-4"
                            >

                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>

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
                                className="w-full h-12 rounded-xl border px-4"
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
                                className="w-full h-12 rounded-xl border px-4"
                            />

                        </div>

                        <div>

                            <label className="mb-2 flex items-center gap-2 font-medium">

                                <Clock size={18} />

                                Estimated Time

                            </label>

                            <input
                                name="estimatedTime"
                                value={formData.estimatedTime}
                                onChange={handleChange}
                                placeholder="2 Hours"
                                className="w-full h-12 rounded-xl border px-4"
                            />

                        </div>

                    </div>

                    <div className="rounded-xl border p-6 bg-gray-50">

                        <div className="flex items-center gap-2 mb-3">

                            <Sparkles size={20} />

                            <h2 className="font-semibold">
                                AI Suggestion
                            </h2>

                        </div>

                        <p className="text-sm text-gray-500">

                            Click Generate after saving the task to let AI
                            create subtasks, estimate completion time and
                            recommend the best execution plan.

                        </p>

                    </div>

                    <div className="flex justify-end">

                        <div className="w-48">

                            <Button
                                title={
                                    loading
                                        ? "Creating..."
                                        : "Create Task"
                                }
                                onClick={handleSubmit}
                                disabled={loading}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}