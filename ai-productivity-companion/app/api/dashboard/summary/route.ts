import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import Goal from "@/models/Goal";
import Habit from "@/models/Habit";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

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

        const [
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            overdueTasks,
            todayTasks,
            totalGoals,
            completedGoals,
            activeGoals,
            totalHabits,
            activeHabits,
        ] = await Promise.all([
            Task.countDocuments({ user: userId }),

            Task.countDocuments({
                user: userId,
                status: "completed",
            }),

            Task.countDocuments({
                user: userId,
                status: "pending",
            }),

            Task.countDocuments({
                user: userId,
                status: "in-progress",
            }),

            Task.countDocuments({
                user: userId,
                dueDate: { $lt: now },
                status: {
                    $nin: ["completed", "cancelled"],
                },
            }),

            Task.countDocuments({
                user: userId,
                dueDate: {
                    $gte: startOfToday,
                    $lte: endOfToday,
                },
                status: {
                    $nin: ["completed", "cancelled"],
                },
            }),

            Goal.countDocuments({ user: userId }),

            Goal.countDocuments({
                user: userId,
                status: "completed",
            }),

            Goal.countDocuments({
                user: userId,
                status: {
                    $in: ["not-started", "in-progress"],
                },
            }),

            Habit.countDocuments({ user: userId }),

            Habit.countDocuments({
                user: userId,
                isActive: true,
            }),
        ]);

        const taskCompletionRate =
            totalTasks === 0
                ? 0
                : Math.round((completedTasks / totalTasks) * 100);

        const goalCompletionRate =
            totalGoals === 0
                ? 0
                : Math.round((completedGoals / totalGoals) * 100);

        return successResponse(
            "Dashboard summary fetched successfully",
            {
                tasks: {
                    total: totalTasks,
                    completed: completedTasks,
                    pending: pendingTasks,
                    inProgress: inProgressTasks,
                    overdue: overdueTasks,
                    dueToday: todayTasks,
                    completionRate: taskCompletionRate,
                },

                goals: {
                    total: totalGoals,
                    completed: completedGoals,
                    active: activeGoals,
                    completionRate: goalCompletionRate,
                },

                habits: {
                    total: totalHabits,
                    active: activeHabits,
                },
            }
        );
    } catch (error) {
        console.error("Dashboard summary error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}