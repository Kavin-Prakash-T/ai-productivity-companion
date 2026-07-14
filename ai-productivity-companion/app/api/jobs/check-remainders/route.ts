import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Task from "@/models/Task";
import CalendarEvent from "@/models/CalendarEvent";
import Notification from "@/models/Notification";
import { sendPushNotification } from "@/utils/sendPushNotification";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

function createTaskReminderMessage(
    title: string,
    priority: string,
    dueDate: Date
): string {
    const remainingMinutes = Math.max(
        0,
        Math.round(
            (dueDate.getTime() - Date.now()) / 60000
        )
    );

    if (remainingMinutes <= 60) {
        return `"${title}" is due in less than one hour. Start or finish it now.`;
    }

    if (priority === "urgent") {
        return `"${title}" is urgent and due soon. Prioritize it before lower-impact work.`;
    }

    const remainingHours = Math.ceil(
        remainingMinutes / 60
    );

    return `"${title}" is due in approximately ${remainingHours} hours. This is a good time to make progress.`;
}

async function removeInvalidTokens(
    userId: string,
    invalidTokens: string[]
) {
    if (invalidTokens.length === 0) {
        return;
    }

    await User.findByIdAndUpdate(userId, {
        $pull: {
            fcmTokens: {
                $in: invalidTokens,
            },
        },
    });
}

export async function GET(request: Request) {
    try {
        const cronSecret =
            request.headers.get("x-cron-secret");

        if (
            !process.env.CRON_SECRET ||
            cronSecret !== process.env.CRON_SECRET
        ) {
            return errorResponse("Unauthorized", 401);
        }

        await connectDB();

        const now = new Date();

        const reminderWindowEnd = new Date(
            now.getTime() + 5 * 60 * 1000
        );

        const tasks = await Task.find({
            reminderEnabled: true,
            reminderSent: false,
            reminderTime: {
                $gte: now,
                $lte: reminderWindowEnd,
            },
            status: {
                $nin: ["completed", "cancelled"],
            },
        });

        let taskRemindersSent = 0;

        for (const task of tasks) {
            const user = await User.findById(
                task.user
            ).select("fcmTokens");

            const dueDate =
                task.dueDate || task.reminderTime || now;

            const message =
                createTaskReminderMessage(
                    task.title,
                    task.priority,
                    dueDate
                );

            const notification =
                await Notification.create({
                    user: task.user,
                    type: "task-reminder",
                    title: "Task Reminder",
                    message,
                    relatedTask: task._id,
                    actionUrl: `/tasks/${task._id}`,
                });

            if (
                user &&
                user.fcmTokens.length > 0
            ) {
                const delivery =
                    await sendPushNotification({
                        tokens: user.fcmTokens,
                        title: "Task Reminder",
                        body: message,
                        actionUrl: `/tasks/${task._id}`,
                    });

                await removeInvalidTokens(
                    user._id.toString(),
                    delivery.invalidTokens
                );

                if (delivery.successCount > 0) {
                    notification.pushSent = true;
                    notification.pushSentAt =
                        new Date();

                    await notification.save();
                }
            }

            task.reminderSent = true;
            await task.save();

            taskRemindersSent++;
        }

        const calendarEvents =
            await CalendarEvent.find({
                reminderEnabled: true,
                reminderSent: false,
                startTime: {
                    $gt: now,
                },
            });

        let calendarRemindersSent = 0;

        for (const event of calendarEvents) {
            const reminderTime = new Date(
                event.startTime.getTime() -
                (event.reminderMinutesBefore || 15) *
                60 *
                1000
            );

            if (
                reminderTime < now ||
                reminderTime > reminderWindowEnd
            ) {
                continue;
            }

            const user = await User.findById(
                event.user
            ).select("fcmTokens");

            const message = `${event.title} starts in ${event.reminderMinutesBefore || 15
                } minutes.`;

            const notification =
                await Notification.create({
                    user: event.user,
                    type: "calendar-reminder",
                    title: "Upcoming Event",
                    message,
                    relatedCalendarEvent: event._id,
                    actionUrl: "/calendar",
                });

            if (
                user &&
                user.fcmTokens.length > 0
            ) {
                const delivery =
                    await sendPushNotification({
                        tokens: user.fcmTokens,
                        title: "Upcoming Event",
                        body: message,
                        actionUrl: "/calendar",
                    });

                await removeInvalidTokens(
                    user._id.toString(),
                    delivery.invalidTokens
                );

                if (delivery.successCount > 0) {
                    notification.pushSent = true;
                    notification.pushSentAt =
                        new Date();

                    await notification.save();
                }
            }

            event.reminderSent = true;
            await event.save();

            calendarRemindersSent++;
        }

        return successResponse(
            "Reminder check completed",
            {
                taskRemindersSent,
                calendarRemindersSent,
                checkedAt: now,
            }
        );
    } catch (error) {
        console.error(
            "Reminder processing error:",
            error
        );

        return errorResponse(
            "Unable to process reminders",
            500
        );
    }
}