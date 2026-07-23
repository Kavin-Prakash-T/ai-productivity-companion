"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: Props) {

    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">

            <div className="rounded-2xl bg-red-50 p-5">
                <AlertCircle size={48} className="text-red-500" />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                Something went wrong!
            </h1>

            <p className="mt-2 text-sm text-gray-500 max-w-sm">
                An unexpected error occurred. Please try resetting the app state or refreshing the page.
            </p>

            <div className="mt-8 flex gap-4">

                <button
                    onClick={reset}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 text-sm font-medium text-white hover:bg-neutral-800 transition"
                >
                    Try Again
                </button>

                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex h-11 items-center justify-center rounded-xl border px-6 text-sm font-medium hover:bg-gray-100 transition"
                >
                    Reload Page
                </button>

            </div>

        </div>
    );

}
