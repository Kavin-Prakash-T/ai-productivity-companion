"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    Target,
    Calendar,
    FileText,
    ArrowLeft,
    Loader2,
} from "lucide-react";

import Button from "../common/Button";
import { createGoal, getGoal, updateGoal } from "@/services/goalService";

interface Props {
    id?: string;
}

export default function GoalForm({ id }: Props) {

    const router = useRouter();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "Personal",
        targetDate: "",
    });

    useEffect(() => {
        if (!id) return;

        async function fetchGoal() {
            try {
                const { data } = await getGoal(id!);
                const goal = data.data?.goal ?? data.goal;

                let formattedDate = "";
                if (goal.targetDate) {
                    formattedDate = new Date(goal.targetDate).toISOString().split("T")[0];
                }

                setForm({
                    title: goal.title || "",
                    description: goal.description || "",
                    category: goal.category || "Personal",
                    targetDate: formattedDate,
                });
            } catch {
                toast.error("Failed to load goal details");
            } finally {
                setFetching(false);
            }
        }

        fetchGoal();
    }, [id]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit() {

        if (!form.title.trim() || !form.targetDate) {
            return toast.error("Title and target date are required");
        }

        try {
            setLoading(true);

            if (isEdit) {
                const { data } = await updateGoal(id!, form);
                toast.success(data.message || "Goal updated successfully");
                router.push(`/goals/${id}`);
            } else {
                const { data } = await createGoal(form);
                toast.success(data.message || "Goal created successfully");
                router.push("/goals");
            }
            router.refresh();

        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                `Unable to ${isEdit ? "update" : "create"} goal`
            );
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div className="flex items-center gap-3">
                <Link
                    href={isEdit ? `/goals/${id}` : "/goals"}
                    className="rounded-xl border p-2 hover:bg-gray-100 transition"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isEdit ? "Edit Goal" : "Create Goal"}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEdit ? "Modify your goal details." : "Add a new goal to track your milestone progress."}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-8 space-y-6">

                <div>
                    <label className="mb-2 flex items-center gap-2 font-medium">
                        <Target size={18} />
                        Goal Title
                    </label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        placeholder="e.g. Run a Marathon"
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
                        value={form.description}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        placeholder="Details about this goal"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 font-medium">
                        <Calendar size={18} />
                        Target Date
                    </label>
                    <input
                        type="date"
                        name="targetDate"
                        value={form.targetDate}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                    />
                </div>

                <Button
                    title={loading ? "Saving..." : isEdit ? "Update Goal" : "Create Goal"}
                    onClick={handleSubmit}
                    disabled={loading}
                />

            </div>

        </div>
    );

}