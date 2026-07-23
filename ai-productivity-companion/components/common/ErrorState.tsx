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
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-20 px-6 text-center">

            <div className="rounded-2xl bg-red-50 p-5">
                <AlertCircle size={40} className="text-red-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
                Failed to Load
            </h2>

            <p className="mt-2 text-gray-500 max-w-sm">
                {message}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-6 h-11 rounded-xl bg-black px-6 text-sm font-medium text-white hover:bg-neutral-800 transition"
                >
                    Try Again
                </button>
            )}

        </div>
    );
}
