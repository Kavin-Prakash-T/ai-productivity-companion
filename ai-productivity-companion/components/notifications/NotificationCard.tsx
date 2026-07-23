"use client";

import { Bell, CheckCircle2, Trash2, Flame, Calendar, Bot, Target, Info } from "lucide-react";
import type { Notification } from "@/types";

interface Props {
    notification: Notification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const typeIcons: Record<string, React.ElementType> = {
    "task-reminder": Bell,
    "calendar-reminder": Calendar,
    "habit-reminder": Flame,
    "goal-update": Target,
    "ai-recommendation": Bot,
    "system": Info,
};

function formatRelativeTime(dateStr?: string) {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
}

export default function NotificationCard({ notification, onMarkRead, onDelete }: Props) {

    const Icon = typeIcons[notification.type] ?? Bell;

    return (
        <div
            className={`flex items-start justify-between gap-4 rounded-2xl border p-5 transition ${!notification.isRead ? "bg-gray-50 border-gray-300" : "bg-white"
                }`}
        >

            <div className="flex items-start gap-4">

                {/* Icon */}
                <div
                    className={`shrink-0 rounded-xl p-3 ${!notification.isRead ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                        }`}
                >
                    <Icon size={18} />
                </div>

                {/* Content */}
                <div className="min-w-0">

                    <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-semibold ${!notification.isRead ? "text-black" : "text-gray-700"}`}>
                            {notification.title}
                        </h3>
                        {!notification.isRead && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-black" />
                        )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                        {formatRelativeTime(notification.createdAt)}
                    </p>

                </div>

            </div>

            {/* Actions */}
            <div className="flex shrink-0 gap-1">

                {!notification.isRead && (
                    <button
                        onClick={() => onMarkRead(notification._id)}
                        title="Mark as read"
                        className="rounded-lg p-2 hover:bg-gray-200 transition"
                    >
                        <CheckCircle2 size={16} className="text-gray-500" />
                    </button>
                )}

                <button
                    onClick={() => onDelete(notification._id)}
                    title="Delete"
                    className="rounded-lg p-2 hover:bg-red-50 transition"
                >
                    <Trash2 size={16} className="text-red-400" />
                </button>

            </div>

        </div>
    );

}