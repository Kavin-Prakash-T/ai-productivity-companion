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
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm"
                    aria-label="Previous month"
                >
                    <ChevronLeft size={18} />
                </button>

                <h2 className="text-lg font-bold min-w-[180px] text-center text-[#0A0A0A]">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <button
                    onClick={onNext}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm"
                    aria-label="Next month"
                >
                    <ChevronRight size={18} />
                </button>

            </div>

            <button
                onClick={onToday}
                className="h-9 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#0A0A0A] hover:bg-gray-50 transition shadow-sm"
            >
                Today
            </button>

        </div>
    );

}
