"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    Flame,
    Repeat,
    ArrowLeft,
    Loader2,
} from "lucide-react";

import Button from "../common/Button";
import { createHabit, getHabit, updateHabit } from "@/services/habitService";

interface Props {
    id?: string;
}

export default function HabitForm({ id }: Props) {

    const router = useRouter();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const [form, setForm] = useState({
        title: "",
        frequency: "daily",
        category: "Personal",
    });

    useEffect(() => {
        if (!id) return;

        async function fetchHabit() {
            try {
                const { data } = await getHabit(id!);
                const habit = data.data?.habit ?? data.habit;
                setForm({
                    title: habit.title || "",
                    frequency: habit.frequency || "daily",
                    category: habit.category || "Personal",
                });
            } catch {
                toast.error("Failed to load habit details");
            } finally {
                setFetching(false);
            }
        }

        fetchHabit();
    }, [id]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit() {

        if (!form.title.trim()) {
            return toast.error("Enter habit title");
        }

        try {
            setLoading(true);

            if (isEdit) {
                const { data } = await updateHabit(id!, form);
                toast.success(data.message || "Habit updated successfully");
                router.push(`/habits/${id}`);
            } else {
                const { data } = await createHabit(form);
                toast.success(data.message || "Habit created successfully");
                router.push("/habits");
            }
            router.refresh();

        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                `Unable to ${isEdit ? "update" : "create"} habit`
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
                    href={isEdit ? `/habits/${id}` : "/habits"}
                    className="rounded-xl border border-[#E5E7EB] bg-white p-2 text-[#6B7280] hover:bg-gray-50 hover:text-[#0A0A0A] transition-colors shadow-sm"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[#0A0A0A]">
                        {isEdit ? "Edit Habit" : "Create Habit"}
                    </h1>
                    <p className="text-[#6B7280] mt-1 text-sm font-medium">
                        {isEdit ? "Modify your habit configuration." : "Add a new habit to track your consistency."}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 space-y-6 shadow-sm">

                <div>
                    <label className="mb-2 flex items-center gap-2 font-semibold text-[#0A0A0A] text-sm">
                        <Flame size={18} className="text-[#6B7280]" />
                        Habit Name
                    </label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                        placeholder="e.g. Read for 30 minutes"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 font-semibold text-[#0A0A0A] text-sm">
                        <Repeat size={18} className="text-[#6B7280]" />
                        Frequency
                    </label>
                    <select
                        name="frequency"
                        value={form.frequency}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[#0A0A0A] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>

                <Button
                    title={loading ? "Saving..." : isEdit ? "Update Habit" : "Create Habit"}
                    onClick={handleSubmit}
                    disabled={loading}
                />

            </div>

        </div>
    );

}