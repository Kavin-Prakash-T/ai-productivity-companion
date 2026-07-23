"use client";

// Reusable skeleton loading components

interface SkeletonProps {
    className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
        </div>
    );
}

export function SkeletonListItem() {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-white p-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
        </div>
    );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
                />
            ))}
        </div>
    );
}

export function SkeletonTaskCard() {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex justify-between">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-3/4" />
            <div className="mt-5 flex gap-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    );
}

export function SkeletonNotificationCard() {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export default Skeleton;
