import Link from "next/link";
import { Flame, Repeat } from "lucide-react";

export default function HabitCard({
    habit,
}: {
    habit: any;
}) {
    return (
        <Link
            href={`/habits/${habit._id}`}
            className="block rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition"
        >

            <div className="flex items-center justify-between">

                <h2 className="text-xl font-semibold">
                    {habit.title}
                </h2>

                <Flame size={24} />
            </div>

            <div className="mt-6 flex items-center gap-2">

                <Repeat size={18} />

                {habit.frequency}

            </div>

            <div className="mt-5">

                <span className="text-4xl font-bold">
                    {habit.streak}
                </span>

                <span className="ml-2 text-gray-500">
                    Day Streak
                </span>

            </div>

        </Link>
    );
}