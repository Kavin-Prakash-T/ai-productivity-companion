"use client";

import { Search } from "lucide-react";

interface Props {
    search: string;
    priority: string;
    status: string;
    onSearch: (v: string) => void;
    onPriority: (v: string) => void;
    onStatus: (v: string) => void;
}

export default function TaskFilter({
    search,
    priority,
    status,
    onSearch,
    onPriority,
    onStatus,
}: Props) {
    return (
        <div className="flex flex-wrap gap-3">

            <div className="relative">

                <Search
                    size={15}
                    className="absolute left-3.5 top-3.5 text-[#9CA3AF]"
                />

                <input
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search tasks..."
                    className="h-11 w-64 rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#0A0A0A] placeholder-[#9CA3AF] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
                />

            </div>

            <select
                value={priority}
                onChange={(e) => onPriority(e.target.value)}
                className="h-11 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0A0A0A] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
            >
                <option value="">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>

            <select
                value={status}
                onChange={(e) => onStatus(e.target.value)}
                className="h-11 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0A0A0A] focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/10 transition-all duration-200 shadow-sm"
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
            </select>

        </div>
    );

}