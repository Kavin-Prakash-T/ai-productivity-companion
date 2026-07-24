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
                <Loader2 size={32} className="animate-spin text-[#0A0A0A]" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div className="flex items-center gap-3">
                <Link
                    href={isEdit ? `/goals/${id}` : "/goals"}
                    className="rounded-xl border border-[#E5E7EB] bg-white p-2 text-[#6B7280] hover:bg-gray-50 hover:text-[#0A0A0A] transition-colors shadow-sm"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A]">
                        {isEdit ? "Edit Goal" : "Create Goal"}
                    </h1>
                    <p className="text-[#6B7280] mt-1 text-sm font-medium">
                        {isEdit ? "Modify your goal details." : "Add a new goal to track your milestone progress."}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 space-y-6 shadow-sm">

                <div>
                    <label className="mb-2 flex items-center gap-2 font-semibold text-[#0A0A0A] text-sm">
                        <Target size={18} className="text-[#6B7280]" />
                        Goal Title
                    </label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        placeholder="e.g. Run a Marathon"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 font-semibold text-[#0A0A0A] text-sm">
                        <FileText size={18} className="text-[#6B7280]" />
                        Description
                    </label>
                    <textarea
                        rows={5}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white p-4 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        placeholder="Details about this goal"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 font-semibold text-[#0A0A0A] text-sm">
                        <Calendar size={18} className="text-[#6B7280]" />
                        Target Date
                    </label>
                    <input
                        type="date"
                        name="targetDate"
                        value={form.targetDate}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[#0A0A0A] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
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