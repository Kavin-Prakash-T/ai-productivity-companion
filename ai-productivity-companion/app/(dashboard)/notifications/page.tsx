import NotificationCard from "@/components/notifications/NotificationCard";

const notifications = [
    {
        _id: "1",
        title: "Task Reminder",
        message: "Complete your React project before 6 PM.",
        createdAt: "5 mins ago",
        read: false,
    },
    {
        _id: "2",
        title: "Goal Completed",
        message: "Congratulations! You completed your goal.",
        createdAt: "Yesterday",
        read: true,
    },
];

export default function NotificationPage() {
    return (
        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">
                    Notifications
                </h1>

                <p className="mt-2 text-gray-500">
                    Stay updated with reminders and alerts.
                </p>

            </div>

            <div className="space-y-4">

                {notifications.map((notification) => (

                    <NotificationCard
                        key={notification._id}
                        notification={notification}
                    />

                ))}

            </div>

        </div>
    );
}