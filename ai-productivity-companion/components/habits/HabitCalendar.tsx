"use client";

import type { HabitLog } from "@/types";

interface Props {
    logs: HabitLog[];
}

function getLast30Days(): string[] {
    const days: string[] = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split("T")[0]);
    }
    return days;
}

export default function HabitCalendar({ logs }: Props) {

    const days = getLast30Days();
    const completedDates = new Set(logs.map((l) => l.date));

    return (
        <div className="rounded-2xl border bg-white p-6">

            <h3 className="font-semibold mb-4">Last 30 Days</h3>

            <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-15">

                {days.map((day) => {

                    const done = completedDates.has(day);
                    const dayNum = new Date(day).getDate();

                    return (
                        <div
                            key={day}
                            title={`${day} — ${done ? "Completed" : "Missed"}`}
                            className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium transition ${done
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-400"
                                }`}
                        >
                            {dayNum}
                        </div>
                    );

                })}

            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm bg-black" />
                    Completed
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm bg-gray-100 border" />
                    Missed
                </div>
            </div>

        </div>
    );

}
