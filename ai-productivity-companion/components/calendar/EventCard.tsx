import Link from "next/link";
import type { CalendarEvent } from "@/types";

interface Props {
    event: CalendarEvent;
}

const typeColors: Record<string, string> = {
    meeting: "bg-blue-100 text-blue-700",
    interview: "bg-purple-100 text-purple-700",
    class: "bg-green-100 text-green-700",
    appointment: "bg-yellow-100 text-yellow-700",
    personal: "bg-gray-100 text-gray-700",
    other: "bg-gray-100 text-gray-600",
};

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export default function EventCard({ event }: Props) {

    const color = typeColors[event.type] ?? "bg-gray-100 text-gray-600";

    return (
        <Link
            href={`/calendar/${event._id}`}
            className="block rounded-xl border bg-white p-3 hover:shadow-md transition text-sm"
        >

            <div className="flex items-start justify-between gap-2">

                <p className="font-medium line-clamp-1 flex-1">{event.title}</p>

                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${color}`}>
                    {event.type}
                </span>

            </div>

            {!event.allDay && (
                <p className="mt-1 text-xs text-gray-400">
                    {formatTime(event.startTime)} – {formatTime(event.endTime)}
                </p>
            )}

            {event.location && (
                <p className="mt-0.5 text-xs text-gray-400 truncate">📍 {event.location}</p>
            )}

        </Link>
    );

}
