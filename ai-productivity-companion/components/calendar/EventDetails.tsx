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
    meeting: "bg-blue-50 text-blue-700 border border-blue-200",
    interview: "bg-purple-50 text-purple-700 border border-purple-200",
    class: "bg-green-50 text-green-700 border border-green-200",
    appointment: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    personal: "bg-gray-50 text-[#6B7280] border border-[#E5E7EB]",
    other: "bg-gray-50 text-[#6B7280] border border-[#E5E7EB]",
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
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
                    <SkeletonText lines={4} />
                </div>
            </div>
        );
    }

    if (error || !event) {
        return <ErrorState message={error ?? "Event not found."} onRetry={loadEvent} />;
    }

    const typeColor = typeColors[event.type] ?? "bg-gray-50 text-[#6B7280] border border-[#E5E7EB]";

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-3">
                    <Link
                        href="/calendar"
                        className="mt-1 rounded-xl border border-[#E5E7EB] bg-white p-2 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">{event.title}</h1>
                        <p className="mt-1 text-sm font-medium text-[#6B7280]">Calendar Event Details</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowDelete(true)}
                    className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition shadow-sm sm:self-start"
                >
                    <Trash2 size={18} />
                    Delete Event
                </button>

            </div>

            {/* Details card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 space-y-6 shadow-sm">

                <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${typeColor}`}>
                        {event.type}
                    </span>
                </div>

                {event.description && (
                    <div>
                        <h2 className="font-bold text-[#0A0A0A] text-lg mb-2">Description</h2>
                        <p className="text-[#6B7280] leading-relaxed whitespace-pre-wrap">{event.description}</p>
                    </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6 border-t border-[#E5E7EB] py-6">

                    <div className="flex items-center gap-3 text-[#6B7280]">
                        <Calendar size={18} className="text-[#9CA3AF] shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs font-medium text-[#9CA3AF]">Date</span>
                            <span className="font-medium text-[#0A0A0A]">{formatFullDate(event.startTime)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[#6B7280]">
                        <Clock size={18} className="text-[#9CA3AF] shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs font-medium text-[#9CA3AF]">Time</span>
                            <span className="font-medium text-[#0A0A0A]">
                                {event.allDay ? "All Day Event" : `${formatTime(event.startTime)} – ${formatTime(event.endTime)}`}
                            </span>
                        </div>
                    </div>

                    {event.location && (
                        <div className="flex items-center gap-3 text-[#6B7280]">
                            <MapPin size={18} className="text-[#9CA3AF] shrink-0" />
                            <div className="text-sm">
                                <span className="block text-xs font-medium text-[#9CA3AF]">Location</span>
                                <span className="font-medium text-[#0A0A0A] truncate max-w-xs block">{event.location}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-[#6B7280]">
                        <Bell size={18} className="text-[#9CA3AF] shrink-0" />
                        <div className="text-sm">
                            <span className="block text-xs font-medium text-[#9CA3AF]">Reminder</span>
                            <span className="font-medium text-[#0A0A0A]">
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
                    <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={() => setShowDelete(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white border border-[#E5E7EB] p-8 shadow-2xl">
                        <h2 className="text-center text-xl font-bold text-[#0A0A0A]">Delete Event?</h2>
                        <p className="mt-3 text-center text-sm font-medium text-[#6B7280]">This action cannot be undone.</p>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setShowDelete(false)} className="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-white font-medium text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="flex-1 h-11 rounded-xl bg-red-600 font-medium text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50">
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}
