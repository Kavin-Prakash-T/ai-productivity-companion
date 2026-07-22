"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
    Calendar,
    Clock,
    FileText,
} from "lucide-react";

import Button from "../common/Button";
import { createEvent } from "@/services/calendarService";

export default function EventForm() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({

        title: "",
        description: "",
        date: "",
        time: ""

    });

    function handleChange(
        e: any
    ) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    }

    async function handleSubmit() {

        if (
            !form.title ||
            !form.date ||
            !form.time
        ) {
            return toast.error("Fill all fields");
        }

        try {

            setLoading(true);

            const { data } = await createEvent(form);

            toast.success(data.message);

            router.push("/calendar");

        }
        catch (error: any) {

            toast.error(
                error.response?.data?.message ||
                "Unable to create event"
            );

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <div className="max-w-3xl mx-auto">

            <h1 className="mb-8 text-3xl font-bold">
                Create Event
            </h1>

            <div className="rounded-2xl border bg-white p-8 space-y-6">

                <div>

                    <label className="mb-2 flex items-center gap-2">

                        <FileText size={18} />

                        Title

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
                        rows={4}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-4"
                    />

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>

                        <label className="mb-2 flex items-center gap-2">

                            <Calendar size={18} />

                            Date

                        </label>

                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl border px-4"
                        />

                    </div>

                    <div>

                        <label className="mb-2 flex items-center gap-2">

                            <Clock size={18} />

                            Time

                        </label>

                        <input
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl border px-4"
                        />

                    </div>

                </div>

                <Button
                    title={
                        loading
                            ? "Creating..."
                            : "Create Event"
                    }
                    onClick={handleSubmit}
                />

            </div>

        </div>

    );

}