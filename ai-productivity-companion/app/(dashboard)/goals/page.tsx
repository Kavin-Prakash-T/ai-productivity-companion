import Link from "next/link";
import { Plus } from "lucide-react";

import GoalCard from "@/components/goals/GoalCard";

const goals = [
    {
        _id: "1",
        title: "Complete AI Productivity Companion",
        progress: 70,
        targetDate: "30 Jul 2026",
    },
    {
        _id: "2",
        title: "Get Software Job",
        progress: 40,
        targetDate: "15 Aug 2026",
    },
];

export default function GoalsPage() {
    return (
        <div className="space-y-8">

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">
                        Goals
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Track your long-term goals.
                    </p>

                </div>

                <Link
                    href="/goals/create"
                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white"
                >
                    <Plus size={18} />
                    New Goal
                </Link>

            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                {goals.map((goal) => (
                    <GoalCard
                        key={goal._id}
                        goal={goal}
                    />
                ))}

            </div>

        </div>
    );
}