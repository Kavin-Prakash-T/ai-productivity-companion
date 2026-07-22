import Link from "next/link";
import { Plus } from "lucide-react";
import CalendarGrid from "@/components/calendar/CalendarGrid";

export default function CalendarPage() {
    return (
        <div className="space-y-8">

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">
                        Calendar
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your schedule and events.
                    </p>

                </div>

                <Link
                    href="/calendar/create"
                    className="flex items-center gap-2 rounded-xl bg-black text-white px-5 py-3"
                >
                    <Plus size={18} />
                    New Event
                </Link>

            </div>

            <CalendarGrid />

        </div>
    );
}