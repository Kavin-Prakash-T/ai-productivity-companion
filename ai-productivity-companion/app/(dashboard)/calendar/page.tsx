"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, CalendarDays } from "lucide-react";

import { getEvents, deleteEvent } from "@/services/calendarService";
import type { CalendarEvent } from "@/types";

import CalendarGrid from "@/components/calendar/CalendarGrid";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import ErrorState from "@/components/common/ErrorState";

export default function CalendarPage() {

    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getEvents();
            setEvents(data.data?.events ?? []);
        } catch {
            setError("Failed to load events.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function goToPrev() {
        setCurrentDate((d) => {
            const n = new Date(d);
            n.setMonth(n.getMonth() - 1);
            return n;
        });
        setSelectedDay(null);
    }

    function goToNext() {
        setCurrentDate((d) => {
            const n = new Date(d);
            n.setMonth(n.getMonth() + 1);
            return n;
        });
        setSelectedDay(null);
    }

    function goToToday() {
        setCurrentDate(new Date());
        setSelectedDay(new Date().getDate());
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A]">Calendar</h1>
                    <p className="mt-1 text-sm font-medium text-[#6B7280]">
                        {loading ? "Loading..." : `${events.length} event${events.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                <Link
                    href="/calendar/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0A0A0A] px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90 transition shadow-sm"
                >
                    <Plus size={18} />
                    New Event
                </Link>

            </div>

            {/* Error */}
            {error && <ErrorState message={error} onRetry={load} />}

            {/* Calendar */}
            {!error && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 space-y-5 shadow-sm">

                    <CalendarHeader
                        currentDate={currentDate}
                        onPrev={goToPrev}
                        onNext={goToNext}
                        onToday={goToToday}
                    />

                    {loading ? (
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 sm:h-24 animate-pulse rounded-xl bg-gray-100"
                                />
                            ))}
                        </div>
                    ) : (
                        <CalendarGrid
                            events={events}
                            currentDate={currentDate}
                            selectedDay={selectedDay}
                            onSelectDay={setSelectedDay}
                        />
                    )}

                </div>
            )}

        </div>
    );

}