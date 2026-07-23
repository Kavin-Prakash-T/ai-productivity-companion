"use client";

import { Search } from "lucide-react";

interface Props {
    search: string;
    status: string;
    onSearch: (v: string) => void;
    onStatus: (v: string) => void;
}

export default function GoalFilter({ search, status, onSearch, onStatus }: Props) {
    return (
        <div className="flex flex-wrap gap-3">

            <div className="relative">

                <Search
                    size={16}
                    className="absolute left-3.5 top-3.5 text-gray-400"
                />

                <input
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search goals..."
                    className="h-11 w-64 rounded-xl border pl-10 pr-4 text-sm focus:border-black focus:ring-1 focus:ring-black transition"
                />

            </div>

            <select
                value={status}
                onChange={(e) => onStatus(e.target.value)}
                className="h-11 rounded-xl border px-4 text-sm focus:border-black focus:ring-1 focus:ring-black transition"
            >
                <option value="">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>

        </div>
    );

}
