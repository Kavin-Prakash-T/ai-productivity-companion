"use client";

import { Bell, Trash2, Check } from "lucide-react";

export default function NotificationCard({
    notification,
}: {
    notification: any;
}) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

                <div className="flex gap-4">

                    <div className="rounded-xl bg-black p-3 text-white">

                        <Bell size={20} />

                    </div>

                    <div>

                        <h2 className="font-semibold">

                            {notification.title}

                        </h2>

                        <p className="mt-2 text-gray-500">

                            {notification.message}

                        </p>

                        <p className="mt-3 text-xs text-gray-400">

                            {notification.createdAt}

                        </p>

                    </div>

                </div>

                <div className="flex gap-2">

                    <button className="rounded-lg border p-2 hover:bg-gray-100">

                        <Check size={18} />

                    </button>

                    <button className="rounded-lg border p-2 hover:bg-red-50">

                        <Trash2 size={18} />

                    </button>

                </div>

            </div>

        </div>
    );
}