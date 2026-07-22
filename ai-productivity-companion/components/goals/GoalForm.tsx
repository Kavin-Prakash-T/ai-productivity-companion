"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
    Target,
    Calendar,
    FileText,
} from "lucide-react";

import Button from "../common/Button";
import { createGoal } from "@/services/goalService";

export default function GoalForm() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        targetDate: "",
    });

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit() {

        if (
            !form.title ||
            !form.description ||
            !form.targetDate
        ) {
            return toast.error(
                "Fill all fields"
            );
        }

        try {

            setLoading(true);

            const { data } =
                await createGoal(form);

            toast.success(data.message);

            router.push("/goals");

        } catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                "Unable to create goal"
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="max-w-3xl mx-auto">

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Create Goal
                </h1>

            </div>

            <div className="rounded-2xl border bg-white p-8 space-y-6">

                <div>

                    <label className="mb-2 flex items-center gap-2">

                        <Target size={18} />

                        Goal Title

                    </label>

                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4"
                    />

                </div>

                <div>

                    <label className="mb-2 flex items-center gap-2">

                        <FileText size={18} />

                        Description

                    </label>

                    <textarea
                        rows={5}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-4"
                    />

                </div>

                <div>

                    <label className="mb-2 flex items-center gap-2">

                        <Calendar size={18} />

                        Target Date

                    </label>

                    <input
                        type="date"
                        name="targetDate"
                        value={form.targetDate}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4"
                    />

                </div>

                <Button
                    title={
                        loading
                            ? "Creating..."
                            : "Create Goal"
                    }
                    onClick={handleSubmit}
                />

            </div>

        </div>
    );
}