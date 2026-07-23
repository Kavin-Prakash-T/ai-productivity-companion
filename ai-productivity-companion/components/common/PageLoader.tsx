"use client";

export default function PageLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">

            <div className="flex flex-col items-center gap-4">

                <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />

                <p className="text-sm text-gray-500">
                    Loading...
                </p>

            </div>

        </div>
    );
}
