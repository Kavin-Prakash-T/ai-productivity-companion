import Link from "next/link";
import type { CalendarEvent } from "@/types";

interface Props {
    event: CalendarEvent;
}

const typeColors: Record<string, string> = {
    meeting: "bg-blue-50 text-blue-700 border border-blue-200",
    interview: "bg-purple-50 text-purple-700 border border-purple-200",
    class: "bg-green-50 text-green-700 border border-green-200",
    appointment: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    personal: "bg-gray-50 text-[#6B7280] border border-[#E5E7EB]",
    other: "bg-gray-50 text-[#6B7280] border border-[#E5E7EB]",
};

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export default function EventCard({ event }: Props) {

    const color = typeColors[event.type] ?? "bg-gray-50 text-[#6B7280] border border-[#E5E7EB]";

    return (
        <Link
            href={`/calendar/${event._id}`}
            className="block rounded-xl border border-[#E5E7EB] bg-white p-3 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm transition text-sm shadow-sm"
        >

            <div className="flex items-start justify-between gap-2">

                <p className="font-bold text-[#0A0A0A] line-clamp-1 flex-1">{event.title}</p>

                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${color}`}>
                    {event.type}
                </span>

            </div>

            {!event.allDay && (
                <p className="mt-1 text-xs font-medium text-[#6B7280]">
                    {formatTime(event.startTime)} – {formatTime(event.endTime)}
                </p>
            )}

            {event.location && (
                <p className="mt-0.5 text-xs font-medium text-[#6B7280] truncate">📍 {event.location}</p>
            )}

        </Link>
    );

}
