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
                <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div className="flex items-center gap-3">
                <Link
                    href={isEdit ? `/habits/${id}` : "/habits"}
                    className="rounded-xl border p-2 hover:bg-gray-100 transition"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isEdit ? "Edit Habit" : "Create Habit"}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEdit ? "Modify your habit configuration." : "Add a new habit to track your consistency."}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-8 space-y-6">

                <div>
                    <label className="mb-2 flex items-center gap-2 font-medium">
                        <Flame size={18} />
                        Habit Name
                    </label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        placeholder="e.g. Read for 30 minutes"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 font-medium">
                        <Repeat size={18} />
                        Frequency
                    </label>
                    <select
                        name="frequency"
                        value={form.frequency}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
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