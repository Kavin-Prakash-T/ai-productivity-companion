"use client";

import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({
    message = "Something went wrong. Please try again.",
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white py-20 px-6 text-center shadow-sm">

            <div className="rounded-2xl bg-red-50 p-5">
                <AlertCircle size={40} className="text-red-500" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-zinc-950">
                Failed to Load
            </h2>

            <p className="mt-2 text-zinc-500 max-w-sm">
                {message}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-6 h-11 rounded-xl bg-zinc-950 px-6 text-sm font-medium text-white hover:bg-zinc-900 transition active:scale-[0.98] shadow-sm"
                >
                    Try Again
                </button>
            )}

        </div>
    );
}
