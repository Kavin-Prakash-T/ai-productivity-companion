import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Task from "@/models/Task";
import CalendarEvent from "@/models/CalendarEvent";
import Notification from "@/models/Notification";
import { sendEmail } from "@/utils/sendEmail";
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

    if (remainingMinutes <= 5) {
        return `"${title}" is due in 5 minutes. Start or finish it now.`;
    }

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



export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
        const bearerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.substring(7)
            : null;

        const cronSecret =
            request.headers.get("x-cron-secret") || bearerToken;

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
            dueDate: {
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
            ).select("email");

            const dueDate = task.dueDate || now;

            const message =
                createTaskReminderMessage(
                    task.title,
                    task.priority,
                    dueDate
                );

            await Notification.create({
                user: task.user,
                type: "task-reminder",
                title: "Task Reminder",
                message,
                relatedTask: task._id,
                actionUrl: `/tasks/${task._id}`,
            });

            if (user && user.email) {
                try {
                    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
                    await sendEmail({
                        to: user.email,
                        subject: `Task Reminder: ${task.title}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                                <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 16px;">Task Reminder</h2>
                                <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 24px;">${message}</p>
                                <a href="${appUrl}/tasks/${task._id}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">View Task</a>
                            </div>
                        `,
                    });
                } catch (emailError) {
                    console.error(`Failed to send email to ${user.email}:`, emailError);
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
                    $lte: reminderWindowEnd,
                },
            });

        let calendarRemindersSent = 0;

        for (const event of calendarEvents) {
            const user = await User.findById(
                event.user
            ).select("email");

            const message = `${event.title} starts in 5 minutes.`;

            await Notification.create({
                user: event.user,
                type: "calendar-reminder",
                title: "Upcoming Event",
                message,
                relatedCalendarEvent: event._id,
                actionUrl: "/calendar",
            });

            if (user && user.email) {
                try {
                    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
                    await sendEmail({
                        to: user.email,
                        subject: `Upcoming Event: ${event.title}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                                <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 16px;">Upcoming Event Reminder</h2>
                                <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 24px;">${message}</p>
                                <a href="${appUrl}/calendar" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">View Calendar</a>
                            </div>
                        `,
                    });
                } catch (emailError) {
                    console.error(`Failed to send email to ${user.email}:`, emailError);
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