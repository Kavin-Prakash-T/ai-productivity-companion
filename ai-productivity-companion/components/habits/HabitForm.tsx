"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
    Flame,
    Repeat,
} from "lucide-react";

import Button from "../common/Button";
import { createHabit } from "@/services/habitService";

export default function HabitForm() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        frequency: "Daily",
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit() {

        if (!form.title) {
            return toast.error("Enter habit title");
        }

        try {

            setLoading(true);

            const { data } = await createHabit(form);

            toast.success(data.message);

            router.push("/habits");

        } catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                "Unable to create habit"
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="max-w-3xl mx-auto">

            <h1 className="mb-8 text-3xl font-bold">
                Create Habit
            </h1>

            <div className="rounded-2xl border bg-white p-8 space-y-6">

                <div>

                    <label className="mb-2 flex items-center gap-2">

                        <Flame size={18} />

                        Habit Name

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

                        <Repeat size={18} />

                        Frequency

                    </label>

                    <select
                        name="frequency"
                        value={form.frequency}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4"
                    >
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>

                </div>

                <Button
                    title={
                        loading
                            ? "Creating..."
                            : "Create Habit"
                    }
                    onClick={handleSubmit}
                />

            </div>

        </div>

    );

}