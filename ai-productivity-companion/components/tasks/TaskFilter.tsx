"use client";

export default function TaskFilter() {
    return (
        <div className="flex flex-wrap gap-4">

            <input
                placeholder="Search task..."
                className="h-11 w-72 rounded-xl border px-4"
            />

            <select className="h-11 rounded-xl border px-4">
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
            </select>

            <select className="h-11 rounded-xl border px-4">
                <option>All Status</option>
                <option>Pending</option>
                <option>Completed</option>
            </select>

        </div>
    );
}