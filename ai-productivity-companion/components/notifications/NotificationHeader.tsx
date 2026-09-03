"use client";

import { CheckCheck, RefreshCw } from "lucide-react";

interface Props {
    unreadCount: number;
    onMarkAllRead: () => void;
    onCheckReminders?: () => void;
    checkingReminders?: boolean;
    loading?: boolean;
}

export default function NotificationHeader({
    unreadCount,
    onMarkAllRead,
    onCheckReminders,
    checkingReminders,
    loading
}: Props) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
                <p className="mt-1 text-sm text-gray-500">
                    {loading ? "Loading..." : `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
                </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {onCheckReminders && (
                    <button
                        onClick={onCheckReminders}
                        disabled={checkingReminders}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                        title="Check for 24h deadline reminders immediately"
                    >
                        <RefreshCw size={16} className={checkingReminders ? "animate-spin text-black" : "text-gray-600"} />
                        {checkingReminders ? "Checking..." : "Check Reminders Now"}
                    </button>
                )}

                {unreadCount > 0 && (
                    <button
                        onClick={onMarkAllRead}
                        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
                    >
                        <CheckCheck size={16} />
                        Mark All Read
                    </button>
                )}
            </div>

        </div>
    );

}
