import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Task from "@/models/Task";
import CalendarEvent from "@/models/CalendarEvent";
import Goal from "@/models/Goal";
import Notification from "@/models/Notification";
import { sendEmail } from "@/utils/sendEmail";
import { getAuthUser } from "@/lib/getAuthUser";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

function isAuthorized(request: Request): boolean {
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    const cronSecret =
        request.headers.get("x-cron-secret") || bearerToken;

    if (process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET) {
        return true;
    }

    try {
        const user = getAuthUser(request);
        if (user && user.userId) {
            return true;
        }
    } catch {

    }

    if (!process.env.CRON_SECRET) {
        return true;
    }

    return false;
}

async function process24HourReminders() {
    await connectDB();

    const now = new Date();
    const twentyFourHoursFromNow = new Date(
        now.getTime() + 24 * 60 * 60 * 1000
    );

    // 1. Process Tasks due in <= 24 hours
    const tasks = await Task.find({
        status: { $nin: ["completed", "cancelled"] },
        dueDate: {
            $ne: null,
            $exists: true,
            $lte: twentyFourHoursFromNow,
        },
        reminderSent: { $ne: true },
    });

    let taskRemindersSent = 0;

    for (const task of tasks) {
        const user = await User.findById(task.user).select("email name");
        if (!task.dueDate) continue;

        const diffMs = task.dueDate.getTime() - now.getTime();
        const remainingHours = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));

        const message =
            remainingHours <= 1
                ? `"${task.title}" is due in less than 1 hour (${task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}). Please complete it soon!`
                : `"${task.title}" is due in approximately ${remainingHours} hours (${task.dueDate.toLocaleDateString()}). Please make progress now.`;

        // Create In-App Notification in Notifications tab
        await Notification.create({
            user: task.user,
            type: "task-reminder",
            title: `Deadline Warning: ${task.title}`,
            message,
            relatedTask: task._id,
            actionUrl: `/tasks`,
        });

        // Send Email Alert
        if (user && user.email) {
            try {
                await sendEmail({
                    to: user.email,
                    subject: `⏰ Task Deadline Warning (24h): ${task.title}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 24px; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
                            <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 12px;">Task Deadline Reminder</h2>
                            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                Hello ${user.name || "there"},<br/>
                                This is a reminder that your task is due within <strong>24 hours</strong>.
                            </p>
                            <div style="background-color: #f9fafb; border-left: 4px solid #000000; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                                <p style="font-size: 16px; font-weight: 600; margin: 0 0 6px 0; color: #111827;">${task.title}</p>
                                <p style="font-size: 14px; color: #6b7280; margin: 0;">Priority: <strong style="text-transform: capitalize; color: #111827;">${task.priority}</strong> | Remaining: <strong>${remainingHours <= 1 ? "Less than 1 hour" : remainingHours + " hours"}</strong></p>
                            </div>
                            <a href="/tasks" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">View Tasks</a>
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

    // 2. Process Calendar Events starting in <= 24 hours
    const calendarEvents = await CalendarEvent.find({
        startTime: {
            $ne: null,
            $exists: true,
            $lte: twentyFourHoursFromNow,
            $gte: now,
        },
        reminderSent: { $ne: true },
    });

    let calendarRemindersSent = 0;

    for (const event of calendarEvents) {
        const user = await User.findById(event.user).select("email name");
        const diffMs = event.startTime.getTime() - now.getTime();
        const remainingHours = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));

        const message = `Upcoming event "${event.title}" starts in ${remainingHours <= 1 ? "less than 1 hour" : remainingHours + " hours"}.`;

        // Create In-App Notification
        await Notification.create({
            user: event.user,
            type: "calendar-reminder",
            title: `Upcoming Event (24h): ${event.title}`,
            message,
            relatedCalendarEvent: event._id,
            actionUrl: "/calendar",
        });

        // Send Email Alert
        if (user && user.email) {
            try {
                await sendEmail({
                    to: user.email,
                    subject: `📅 Event Alert (24h): ${event.title}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 24px; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
                            <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 12px;">Upcoming Event Alert</h2>
                            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                Hello ${user.name || "there"},<br/>
                                You have an event scheduled within the next 24 hours.
                            </p>
                            <div style="background-color: #f9fafb; border-left: 4px solid #000000; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                                <p style="font-size: 16px; font-weight: 600; margin: 0 0 6px 0; color: #111827;">${event.title}</p>
                                <p style="font-size: 14px; color: #6b7280; margin: 0;">Starts: <strong>${event.startTime.toLocaleString()}</strong></p>
                            </div>
                            <a href="/calendar" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">Open Calendar</a>
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

    // 3. Process Goals with targetDate in <= 24 hours
    const goals = await Goal.find({
        status: { $nin: ["completed", "cancelled"] },
        targetDate: {
            $ne: null,
            $exists: true,
            $lte: twentyFourHoursFromNow,
        },
        reminderSent: { $ne: true },
    });

    let goalRemindersSent = 0;

    for (const goal of goals) {
        const user = await User.findById(goal.user).select("email name");
        if (!goal.targetDate) continue;

        const message = `Goal "${goal.title}" has a target date approaching within 24 hours. Current progress: ${goal.progress}%.`;

        await Notification.create({
            user: goal.user,
            type: "goal-update",
            title: `Goal Target Warning (24h): ${goal.title}`,
            message,
            relatedGoal: goal._id,
            actionUrl: "/goals",
        });

        if (user && user.email) {
            try {
                await sendEmail({
                    to: user.email,
                    subject: `🎯 Goal Target Date Warning (24h): ${goal.title}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 24px; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
                            <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 12px;">Goal Target Date Reminder</h2>
                            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                Hello ${user.name || "there"},<br/>
                                Your goal target deadline is in less than 24 hours.
                            </p>
                            <div style="background-color: #f9fafb; border-left: 4px solid #000000; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                                <p style="font-size: 16px; font-weight: 600; margin: 0 0 6px 0; color: #111827;">${goal.title}</p>
                                <p style="font-size: 14px; color: #6b7280; margin: 0;">Progress: <strong>${goal.progress}%</strong></p>
                            </div>
                            <a href="/goals" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">View Goals</a>
                        </div>
                    `,
                });
            } catch (emailError) {
                console.error(`Failed to send email to ${user.email}:`, emailError);
            }
        }

        goal.reminderSent = true;
        await goal.save();
        goalRemindersSent++;
    }

    return {
        taskRemindersSent,
        calendarRemindersSent,
        goalRemindersSent,
        totalSent: taskRemindersSent + calendarRemindersSent + goalRemindersSent,
        checkedAt: now,
    };
}

export async function GET(request: Request) {
    try {
        if (!isAuthorized(request)) {
            return errorResponse("Unauthorized", 401);
        }

        const result = await process24HourReminders();

        return successResponse("Reminder check completed", result);
    } catch (error) {
        console.error("Reminder processing error:", error);
        return errorResponse("Unable to process reminders", 500);
    }
}

export async function POST(request: Request) {
    try {
        if (!isAuthorized(request)) {
            return errorResponse("Unauthorized", 401);
        }

        const result = await process24HourReminders();

        return successResponse("Reminder check triggered successfully", result);
    } catch (error) {
        console.error("Reminder processing error:", error);
        return errorResponse("Unable to process reminders", 500);
    }
}
