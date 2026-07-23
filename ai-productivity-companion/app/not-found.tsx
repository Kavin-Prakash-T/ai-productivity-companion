"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">

            <div className="rounded-2xl bg-gray-100 p-5">
                <AlertTriangle size={48} className="text-black" />
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
                Page Not Found
            </h1>

            <p className="mt-3 text-base text-gray-500 max-w-sm">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
            </p>

            <div className="mt-8 flex items-center gap-4">

                <Link
                    href="/dashboard"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 text-sm font-medium text-white hover:bg-neutral-800 transition shadow-sm"
                >
                    Back to Dashboard
                </Link>

            </div>

        </div>
    );
}
