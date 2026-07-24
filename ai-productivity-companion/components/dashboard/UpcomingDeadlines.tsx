"use client";

import Link from "next/link";
import { Calendar, Target, AlertCircle } from "lucide-react";
import type { Task, Goal } from "@/types";
import { SkeletonListItem } from "@/components/common/Skeleton";

interface Props {
    tasks: Task[];
    goals: Goal[];
    loading?: boolean;
}

function formatDate(dateStr?: string) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    return `${diff}d left`;
}

export default function UpcomingDeadlines({ tasks, goals, loading }: Props) {

    const all = [
        ...tasks.map((t) => ({
            id: t._id,
            href: `/tasks/${t._id}`,
            title: t.title,
            date: t.dueDate,
            type: "task" as const,
            priority: t.priority,
        })),
        ...goals.map((g) => ({
            id: g._id,
            href: `/goals/${g._id}`,
            title: g.title,
            date: g.targetDate,
            type: "goal" as const,
            priority: null,
        })),
    ].sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#0A0A0A]">Upcoming Deadlines</h2>
                <span className="text-xs text-[#9CA3AF] font-medium">Next 7 days</span>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => <SkeletonListItem key={i} />)}
                </div>
            ) : all.length === 0 ? (
                <div className="py-10 text-center text-[#9CA3AF]">
                    <Calendar size={32} className="mx-auto mb-2 text-[#D1D5DB]" />
                    <p className="text-sm">No upcoming deadlines</p>
                </div>
            ) : (
                <div className="space-y-2.5">

                    {all.slice(0, 5).map((item) => (

                        <Link
                            key={`${item.type}-${item.id}`}
                            href={item.href}
                            className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-gray-50 p-3 hover:bg-white hover:shadow-sm hover:border-gray-300 transition-all duration-200"
                        >

                            <div className="flex items-center gap-3 min-w-0">

                                <div className="shrink-0 rounded-lg bg-white border border-[#E5E7EB] shadow-sm p-2 text-[#6B7280]">
                                    {item.type === "task" ? (
                                        <AlertCircle size={15} />
                                    ) : (
                                        <Target size={15} />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#0A0A0A] truncate">{item.title}</p>
                                    <p className="text-xs text-[#9CA3AF] font-medium capitalize mt-0.5">{item.type}</p>
                                </div>

                            </div>

                            <span className="ml-3 shrink-0 text-xs font-bold text-[#6B7280] bg-white border border-[#E5E7EB] shadow-sm px-2.5 py-1 rounded-lg">
                                {formatDate(item.date)}
                            </span>

                        </Link>

                    ))}

                </div>
            )}

        </div>
    );

}