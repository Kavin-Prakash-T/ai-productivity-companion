import Link from "next/link";
import { Plus } from "lucide-react";

import TaskCard from "@/components/tasks/TaskCard";
import TaskFilter from "@/components/tasks/TaskFilter";

const tasks = [
    {
        _id: "1",
        title: "Finish Resume",
        description: "Complete resume project.",
        dueDate: "25 Jul 2026",
        priority: "High",
        category: "Career",
        status: "Pending",
    },
    {
        _id: "2",
        title: "Build Dashboard",
        description: "Finish frontend dashboard.",
        dueDate: "26 Jul 2026",
        priority: "Medium",
        category: "Project",
        status: "Pending",
    },
];

export default function TasksPage() {
    return (
        <div className="space-y-8">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Tasks
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage all your tasks.
                    </p>

                </div>

                <Link
                    href="/tasks/create"
                    className="flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-white"
                >
                    <Plus size={18} />

                    New Task
                </Link>

            </div>

            <TaskFilter />

            <div className="grid gap-6 lg:grid-cols-2">

                {tasks.map((task) => (
                    <TaskCard
                        key={task._id}
                        task={task}
                    />
                ))}

            </div>

        </div>
    );
}