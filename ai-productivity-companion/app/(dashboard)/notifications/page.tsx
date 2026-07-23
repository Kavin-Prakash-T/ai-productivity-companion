"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bell } from "lucide-react";

import {
    getNotifications,
    markAsRead,
    markAllRead,
    deleteNotification,
} from "@/services/notificationService";
import type { Notification } from "@/types";

import NotificationCard from "@/components/notifications/NotificationCard";
import NotificationHeader from "@/components/notifications/NotificationHeader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonNotificationCard } from "@/components/common/Skeleton";

export default function NotificationsPage() {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getNotifications();
            setNotifications(data.data?.notifications ?? []);
        } catch {
            setError("Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleMarkRead(id: string) {
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch {
            toast.error("Failed to mark as read");
        }
    }

    async function handleMarkAllRead() {
        try {
            await markAllRead();
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );
            toast.success("All notifications marked as read");
        } catch {
            toast.error("Failed to mark all as read");
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        } catch {
            toast.error("Failed to delete notification");
        }
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="space-y-6">

            <NotificationHeader
                unreadCount={unreadCount}
                onMarkAllRead={handleMarkAllRead}
                loading={loading}
            />

            {error && <ErrorState message={error} onRetry={load} />}

            {!error && (
                loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <SkeletonNotificationCard key={i} />
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="All Clear"
                        description="You have no notifications right now. We'll let you know when something important happens."
                    />
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <NotificationCard
                                key={notification._id}
                                notification={notification}
                                onMarkRead={handleMarkRead}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )
            )}

        </div>
    );

}