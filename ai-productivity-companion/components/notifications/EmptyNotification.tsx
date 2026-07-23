import { BellOff } from "lucide-react";

export default function EmptyNotification() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-20">

            <BellOff size={60} />

            <h2 className="mt-5 text-2xl font-bold">
                No Notifications
            </h2>

            <p className="mt-2 text-gray-500">
                You're all caught up.
            </p>

        </div>
    );
}