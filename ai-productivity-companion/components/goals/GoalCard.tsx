import Link from "next/link";
import { Target, Calendar } from "lucide-react";

export default function GoalCard({
    goal,
}: {
    goal: any;
}) {
    return (
        <Link
            href={`/goals/${goal._id}`}
            className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition block"
        >
            <div className="flex justify-between items-center">

                <h2 className="text-xl font-semibold">
                    {goal.title}
                </h2>

                <Target size={24} />

            </div>

            <div className="mt-6">

                <div className="flex justify-between text-sm mb-2">

                    <span>Progress</span>

                    <span>{goal.progress}%</span>

                </div>

                <div className="h-3 rounded-full bg-gray-200">

                    <div
                        className="h-3 rounded-full bg-black"
                        style={{
                            width: `${goal.progress}%`,
                        }}
                    />

                </div>

            </div>

            <div className="mt-6 flex items-center gap-2 text-gray-500">

                <Calendar size={18} />

                {goal.targetDate}

            </div>

        </Link>
    );
}