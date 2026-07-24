"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white py-20 px-6 text-center shadow-sm">

            <div className="rounded-2xl bg-zinc-50 p-5 border border-zinc-200 shadow-sm">
                <Icon size={40} className="text-zinc-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-zinc-950">
                {title}
            </h2>

            <p className="mt-2 text-zinc-500 max-w-sm">
                {description}
            </p>

            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-6 h-11 rounded-xl bg-zinc-950 px-6 text-sm font-medium text-white hover:bg-zinc-900 transition active:scale-[0.98] shadow-sm"
                >
                    {action.label}
                </button>
            )}

        </div>
    );
}
