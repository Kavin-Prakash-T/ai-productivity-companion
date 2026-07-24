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
                    className="absolute left-3.5 top-3.5 text-[#9CA3AF]"
                />

                <input
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search goals..."
                    className="h-11 w-64 rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                />

            </div>

            <select
                value={status}
                onChange={(e) => onStatus(e.target.value)}
                className="h-11 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0A0A0A] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
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
