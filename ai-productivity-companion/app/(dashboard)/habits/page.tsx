import Link from "next/link";
import { Plus } from "lucide-react";

import HabitCard from "@/components/habits/HabitCard";

const habits = [
    {
        _id: "1",
        title: "Morning Exercise",
        streak: 18,
        frequency: "Daily",
    },
    {
        _id: "2",
        title: "Read Books",
        streak: 7,
        frequency: "Daily",
    },
];

export default function HabitsPage() {
    return (
        <div className="space-y-8">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Habits
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Build positive daily habits.
                    </p>

                </div>

                <Link
                    href="/habits/create"
                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white"
                >
                    <Plus size={18} />
                    New Habit
                </Link>

            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                {habits.map((habit) => (
                    <HabitCard
                        key={habit._id}
                        habit={habit}
                    />
                ))}

            </div>

        </div>
    );
}