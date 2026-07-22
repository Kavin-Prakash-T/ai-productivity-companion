import { CircleCheckBig } from "lucide-react";

const tasks = [
    "Finish Resume",
    "Complete AI Module",
    "Prepare Interview",
    "Read System Design",
];

export default function RecentTasks() {
    return (
        <div className="rounded-2xl border bg-white p-6">

            <h2 className="mb-5 text-xl font-semibold">
                Recent Tasks
            </h2>

            <div className="space-y-4">

                {tasks.map((task) => (

                    <div
                        key={task}
                        className="flex items-center gap-3"
                    >
                        <CircleCheckBig size={18} />

                        <span>{task}</span>

                    </div>

                ))}

            </div>

        </div>
    );
}