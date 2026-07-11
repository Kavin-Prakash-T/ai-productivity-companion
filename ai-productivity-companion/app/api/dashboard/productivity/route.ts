import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import Goal from "@/models/Goal";
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

        const url = new URL(request.url);
        const days = Number(
            url.searchParams.get("days") || 7
        );

        if (
            Number.isNaN(days) ||
            days < 1 ||
            days > 90
        ) {
            return errorResponse(
                "Days must be between 1 and 90",
                400
            );
        }

        const now = new Date();

        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - (days - 1));
        startDate.setHours(0, 0, 0, 0);

        const [completedTasks, missedTasks, goals, habits] =
            await Promise.all([
                Task.find({
                    user: userId,
                    status: "completed",
                    completedAt: {
                        $gte: startDate,
                        $lte: now,
                    },
                }).select("completedAt estimatedMinutes"),

                Task.find({
                    user: userId,
                    status: "missed",
                    updatedAt: {
                        $gte: startDate,
                        $lte: now,
                    },
                }).select("_id"),

                Goal.find({
                    user: userId,
                }).select("progress status"),

                Habit.find({
                    user: userId,
                    isActive: true,
                }).select(
                    "completionLogs currentStreak longestStreak"
                ),
            ]);

        const dailyStats = [];

        for (let index = 0; index < days; index++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);

            const dateKey = getDateKey(date);

            const completedTaskCount =
                completedTasks.filter((task) => {
                    if (!task.completedAt) {
                        return false;
                    }

                    return (
                        getDateKey(task.completedAt) === dateKey
                    );
                }).length;

            const habitCompletionCount = habits.reduce(
                (total, habit) => {
                    const completed = habit.completionLogs.some(
                        (log) => log.date === dateKey
                    );

                    return total + (completed ? 1 : 0);
                },
                0
            );

            dailyStats.push({
                date: dateKey,
                completedTasks: completedTaskCount,
                completedHabits: habitCompletionCount,
            });
        }

        const totalCompletedMinutes =
            completedTasks.reduce(
                (total, task) =>
                    total + (task.estimatedMinutes || 0),
                0
            );

        const averageGoalProgress =
            goals.length === 0
                ? 0
                : Math.round(
                    goals.reduce(
                        (total, goal) =>
                            total + goal.progress,
                        0
                    ) / goals.length
                );

        const totalHabitCompletions = habits.reduce(
            (total, habit) => {
                return (
                    total +
                    habit.completionLogs.filter(
                        (log) =>
                            new Date(
                                `${log.date}T00:00:00.000Z`
                            ) >= startDate
                    ).length
                );
            },
            0
        );

        const maximumPossibleHabitCompletions =
            habits.length * days;

        const habitCompletionRate =
            maximumPossibleHabitCompletions === 0
                ? 0
                : Math.round(
                    (totalHabitCompletions /
                        maximumPossibleHabitCompletions) *
                    100
                );

        const taskScore = Math.min(
            completedTasks.length * 5,
            40
        );

        const habitScore = Math.round(
            habitCompletionRate * 0.3
        );

        const goalScore = Math.round(
            averageGoalProgress * 0.3
        );

        const missedPenalty = Math.min(
            missedTasks.length * 5,
            20
        );

        const productivityScore = Math.max(
            0,
            Math.min(
                100,
                taskScore +
                habitScore +
                goalScore -
                missedPenalty
            )
        );

        return successResponse(
            "Productivity statistics fetched successfully",
            {
                period: {
                    days,
                    startDate,
                    endDate: now,
                },

                statistics: {
                    completedTasks: completedTasks.length,
                    missedTasks: missedTasks.length,
                    completedWorkMinutes:
                        totalCompletedMinutes,
                    averageGoalProgress,
                    habitCompletionRate,
                    productivityScore,
                },

                dailyStats,
            }
        );
    } catch (error) {
        console.error("Productivity error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}