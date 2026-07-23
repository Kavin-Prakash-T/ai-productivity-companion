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
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-20 px-6 text-center">

            <div className="rounded-2xl bg-gray-100 p-5">
                <Icon size={40} className="text-gray-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
                {title}
            </h2>

            <p className="mt-2 text-gray-500 max-w-sm">
                {description}
            </p>

            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-6 h-11 rounded-xl bg-black px-6 text-sm font-medium text-white hover:bg-neutral-800 transition"
                >
                    {action.label}
                </button>
            )}

        </div>
    );
}
