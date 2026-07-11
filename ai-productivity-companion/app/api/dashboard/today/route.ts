import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import Habit from "@/models/Habit";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

function getDateKey(date: Date): string {
    return date.toISOString().split("T")[0];
}

export async function GET(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const userId = authUser.userId;

        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        const todayDateKey = getDateKey(now);
        const todayDay = now.getDay();

        const tasks = await Task.find({
            user: userId,
            dueDate: {
                $gte: startOfToday,
                $lte: endOfToday,
            },
            status: {
                $nin: ["completed", "cancelled"],
            },
        }).sort({
            priorityScore: -1,
            priority: -1,
            dueDate: 1,
        });

        const habits = await Habit.find({
            user: userId,
            isActive: true,
            $or: [
                {
                    frequency: "daily",
                },
                {
                    frequency: "weekly",
                    targetDays: todayDay,
                },
            ],
        }).sort({
            createdAt: 1,
        });

        const todayHabits = habits.map((habit) => {
            const completedToday =
                habit.completionLogs.some(
                    (log) => log.date === todayDateKey
                );

            return {
                id: habit._id,
                title: habit.title,
                category: habit.category,
                reminderTime: habit.reminderTime,
                currentStreak: habit.currentStreak,
                completedToday,
            };
        });

        const totalEstimatedMinutes = tasks.reduce(
            (total, task) =>
                total + (task.estimatedMinutes || 0),
            0
        );

        return successResponse(
            "Today's dashboard fetched successfully",
            {
                date: todayDateKey,
                tasks,
                habits: todayHabits,

                summary: {
                    totalTasks: tasks.length,
                    totalHabits: todayHabits.length,
                    completedHabits: todayHabits.filter(
                        (habit) => habit.completedToday
                    ).length,
                    estimatedWorkMinutes:
                        totalEstimatedMinutes,
                },
            }
        );
    } catch (error) {
        console.error("Today's dashboard error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}