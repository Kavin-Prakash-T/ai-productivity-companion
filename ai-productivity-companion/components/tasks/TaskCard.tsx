import {
    Calendar,
    Flag,
    SquareCheckBig,
} from "lucide-react";

import PriorityBadge from "./PriorityBadge";

interface Props {
    task: any;
}

export default function TaskCard({
    task,
}: Props) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <div className="flex justify-between">

                <h2 className="text-lg font-semibold">
                    {task.title}
                </h2>

                <PriorityBadge
                    priority={task.priority}
                />

            </div>

            <p className="mt-3 text-sm text-gray-500">

                {task.description}

            </p>

            <div className="mt-5 flex flex-wrap gap-5 text-sm">

                <div className="flex items-center gap-2">

                    <Calendar size={16} />

                    {task.dueDate}

                </div>

                <div className="flex items-center gap-2">

                    <Flag size={16} />

                    {task.category}

                </div>

                <div className="flex items-center gap-2">

                    <SquareCheckBig size={16} />

                    {task.status}

                </div>

            </div>

        </div>
    );
}