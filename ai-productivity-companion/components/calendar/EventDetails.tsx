"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Bell,
    Trash2,
    Loader2,
} from "lucide-react";

import { getEvent, deleteEvent } from "@/services/calendarService";
import type { CalendarEvent } from "@/types";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonText } from "@/components/common/Skeleton";

const typeColors: Record<string, string> = {
    meeting: "bg-blue-100 text-blue-700",
    interview: "bg-purple-100 text-purple-700",
    class: "bg-green-100 text-green-700",
    appointment: "bg-yellow-100 text-yellow-700",
    personal: "bg-gray-100 text-gray-700",
    other: "bg-gray-100 text-gray-600",
};

function formatFullDate(dateStr?: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(dateStr?: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export default function EventDetails({ id }: { id: string }) {

    const router = useRouter();

    const [event, setEvent] = useState<CalendarEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        loadEvent();
    }, [id]);

    async function loadEvent() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getEvent(id);
            setEvent(data.data?.event ?? data.event);
        } catch {
            setError("Failed to load event details");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteEvent(id);
            toast.success("Event deleted successfully");
            router.push("/calendar");
        } catch {
            toast.error("Failed to delete event");
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                <div className="rounded-2xl border bg-white p-8">
                    <SkeletonText lines={4} />
                </div>
            </div>
        );
    }

    if (error || !event) {
        return <ErrorState message={error ?? "Event not found."} onRetry={loadEvent} />;
    }

    const typeColor = typeColors[event.type] ?? "bg-gray-100 text-gray-600";

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-3">
                    <Link
                        href="/calendar"
                        className="mt-1 rounded-xl border p-2 hover:bg-gray-100 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">{event.title}</h1>
                        <p className="text-gray-500 mt-1 text-sm">Calendar Event Details</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowDelete(true)}
                    className="flex items-center gap-2 rounded-xl border border-red-300 px-5 py-3 text-red-600 hover:bg-red-50 transition sm:self-start"
                >
                    <Trash2 size={18} />
                    Delete Event
                </button>

            </div>

            {/* Details card */}
            <div className="rounded-2xl border bg-white p-6 sm:p-8 space-y-6">

                <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${typeColor}`}>
                        {event.type}
                    </span>
                </div>

                {event.description && (
                    <div>
                        <h2 className="font-semibold text-gray-800 text-lg mb-2">Description</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                    </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6 border-t py-6">

                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={18} className="text-gray-400 shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs text-gray-400">Date</span>
                            <span className="font-medium text-black">{formatFullDate(event.startTime)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <Clock size={18} className="text-gray-400 shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs text-gray-400">Time</span>
                            <span className="font-medium text-black">
                                {event.allDay ? "All Day Event" : `${formatTime(event.startTime)} – ${formatTime(event.endTime)}`}
                            </span>
                        </div>
                    </div>

                    {event.location && (
                        <div className="flex items-center gap-3 text-gray-600">
                            <MapPin size={18} className="text-gray-400 shrink-0" />
                            <div className="text-sm">
                                <span className="block text-xs text-gray-400">Location</span>
                                <span className="font-medium text-black truncate max-w-xs block">{event.location}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-gray-600">
                        <Bell size={18} className="text-gray-400 shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs text-gray-400">Reminder</span>
                            <span className="font-medium text-black">
                                {event.reminderEnabled
                                    ? `Set for ${event.reminderMinutesBefore || 30} minutes before`
                                    : "No reminders set"}
                            </span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Delete confirm dialog */}
            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowDelete(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
                        <h2 className="text-center text-xl font-bold">Delete Event?</h2>
                        <p className="mt-3 text-center text-sm text-gray-500">This action cannot be undone.</p>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setShowDelete(false)} className="flex-1 h-11 rounded-xl border hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 h-11 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50">
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}
