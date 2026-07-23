"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    currentDate: Date;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export default function CalendarHeader({ currentDate, onPrev, onNext, onToday }: Props) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

                <button
                    onClick={onPrev}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-gray-100 transition"
                    aria-label="Previous month"
                >
                    <ChevronLeft size={18} />
                </button>

                <h2 className="text-lg font-semibold min-w-[180px] text-center">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <button
                    onClick={onNext}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-gray-100 transition"
                    aria-label="Next month"
                >
                    <ChevronRight size={18} />
                </button>

            </div>

            <button
                onClick={onToday}
                className="h-9 rounded-xl border px-4 text-sm font-medium hover:bg-gray-100 transition"
            >
                Today
            </button>

        </div>
    );

}
