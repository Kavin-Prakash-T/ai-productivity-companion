"use client";

import type { CalendarEvent } from "@/types";
import EventCard from "./EventCard";

interface Props {
    events: CalendarEvent[];
    currentDate: Date;
    selectedDay: number | null;
    onSelectDay: (day: number | null) => void;
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCalendarDays(year: number, month: number): (number | null)[] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        days.push(d);
    }

    return days;
}

function toDateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarGrid({ events, currentDate, selectedDay, onSelectDay }: Props) {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const days = getCalendarDays(year, month);

    // Map date-key → events
    const eventMap: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
        const key = new Date(ev.startTime).toISOString().split("T")[0];
        if (!eventMap[key]) eventMap[key] = [];
        eventMap[key].push(ev);
    });

    // Selected day events
    const selectedKey = selectedDay
        ? toDateKey(year, month, selectedDay)
        : null;
    const selectedEvents = selectedKey ? (eventMap[selectedKey] ?? []) : [];

    return (
        <div className="space-y-4">

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                {WEEK_DAYS.map((d) => (
                    <div key={d} className="py-1">{d}</div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">

                {days.map((day, index) => {

                    if (day === null) {
                        return <div key={`empty-${index}`} className="h-16 sm:h-24 rounded-xl" />;
                    }

                    const key = toDateKey(year, month, day);
                    const dayEvents = eventMap[key] ?? [];
                    const isToday =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();
                    const isSelected = day === selectedDay;

                    return (
                        <button
                            key={day}
                            onClick={() => onSelectDay(isSelected ? null : day)}
                            className={`h-16 sm:h-24 rounded-xl border p-1.5 text-left transition group ${isSelected ? "border-[#0A0A0A] bg-gray-50 shadow-sm" : "border-[#E5E7EB] bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                                }`}
                        >

                            <span
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${isToday
                                    ? "bg-[#0A0A0A] text-white shadow-sm"
                                    : "text-[#0A0A0A] group-hover:text-black"
                                    }`}
                            >
                                {day}
                            </span>

                            {/* Event dots */}
                            <div className="mt-1 space-y-0.5">
                                {dayEvents.slice(0, 2).map((ev) => (
                                    <div
                                        key={ev._id}
                                        className="truncate rounded text-[10px] font-semibold leading-tight bg-gray-100 text-[#0A0A0A] border border-gray-200 px-1.5 py-0.5 hidden sm:block"
                                    >
                                        {ev.title}
                                    </div>
                                ))}
                                {dayEvents.length > 0 && (
                                    <div className="sm:hidden flex gap-0.5">
                                        {dayEvents.slice(0, 3).map((_, i) => (
                                            <div key={i} className="h-1 w-1 rounded-full bg-[#0A0A0A]" />
                                        ))}
                                    </div>
                                )}
                                {dayEvents.length > 2 && (
                                    <p className="hidden sm:block text-[10px] font-bold text-[#6B7280] mt-0.5">+{dayEvents.length - 2} more</p>
                                )}
                            </div>

                        </button>
                    );

                })}

            </div>

            {/* Selected day events panel */}
            {selectedDay && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-md">

                    <h3 className="font-bold text-sm text-[#0A0A0A] mb-3.5">
                        Events on {WEEK_DAYS[new Date(year, month, selectedDay).getDay()]}, {selectedDay}
                    </h3>

                    {selectedEvents.length === 0 ? (
                        <p className="text-xs text-[#6B7280] font-medium">No events on this day.</p>
                    ) : (
                        <div className="space-y-3">
                            {selectedEvents.map((ev) => (
                                <EventCard key={ev._id} event={ev} />
                            ))}
                        </div>
                    )}

                </div>
            )}

        </div>
    );

}