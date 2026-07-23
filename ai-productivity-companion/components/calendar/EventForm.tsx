"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    Calendar,
    Clock,
    FileText,
    ArrowLeft,
    Loader2,
} from "lucide-react";

import Button from "../common/Button";
import { createEvent, getEvent, updateEvent } from "@/services/calendarService";

interface Props {
    id?: string;
}

export default function EventForm({ id }: Props) {

    const router = useRouter();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        time: ""
    });

    useEffect(() => {
        if (!id) return;

        async function fetchEvent() {
            try {
                const { data } = await getEvent(id!);
                const ev = data.data?.event ?? data.event;

                let formattedDate = "";
                let formattedTime = "";

                if (ev.startTime) {
                    const start = new Date(ev.startTime);
                    formattedDate = start.toISOString().split("T")[0];
                    formattedTime = start.toTimeString().split(" ")[0].slice(0, 5);
                }

                setForm({
                    title: ev.title || "",
                    description: ev.description || "",
                    date: formattedDate,
                    time: formattedTime,
                });
            } catch {
                toast.error("Failed to load event details");
            } finally {
                setFetching(false);
            }
        }

        fetchEvent();
    }, [id]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

            if (isEdit) {
                const { data } = await updateEvent(id!, form);
                toast.success(data.message || "Event updated successfully");
                router.push(`/calendar/${id}`);
            } else {
                const { data } = await createEvent(form);
                toast.success(data.message || "Event created successfully");
                router.push("/calendar");
            }
            router.refresh();

        }
        catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                `Unable to ${isEdit ? "update" : "create"} event`
            );
        }
        finally {
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
                    href={isEdit ? `/calendar/${id}` : "/calendar"}
                    className="rounded-xl border p-2 hover:bg-gray-100 transition"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isEdit ? "Edit Event" : "Create Event"}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEdit ? "Modify event configuration details." : "Add a new event to your scheduling calendar."}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-8 space-y-6 shadow-sm">

                <div>
                    <label className="mb-2 flex items-center gap-2 font-medium">
                        <FileText size={18} />
                        Title
                    </label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        placeholder="Event title"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 font-medium">
                        <FileText size={18} />
                        Description
                    </label>
                    <textarea
                        rows={4}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        placeholder="Details about this event"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <Calendar size={18} />
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        />
                    </div>

                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <Clock size={18} />
                            Time
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                            className="w-full h-12 rounded-xl border px-4 focus:border-black focus:ring-1 focus:ring-black transition"
                        />
                    </div>

                </div>

                <Button
                    title={loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
                    onClick={handleSubmit}
                    disabled={loading}
                />

            </div>

        </div>
    );

}