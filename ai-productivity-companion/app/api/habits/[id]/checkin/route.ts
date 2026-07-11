import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Habit from "@/models/Habit";
import { calculateHabitStreak } from "@/utils/habitStreak";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function isValidDateKey(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function getTodayDateKey(): string {
    return new Date().toISOString().split("T")[0];
}

export async function POST(
    request: Request,
    context: RouteContext
) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { id } = await context.params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid habit ID", 400);
        }

        const date = body.date || getTodayDateKey();

        if (!isValidDateKey(date)) {
            return errorResponse(
                "Date must use YYYY-MM-DD format",
                400
            );
        }

        const habit = await Habit.findOne({
            _id: id,
            user: authUser.userId,
        });

        if (!habit) {
            return errorResponse("Habit not found", 404);
        }

        if (!habit.isActive) {
            return errorResponse(
                "Cannot check in an inactive habit",
                400
            );
        }

        const alreadyCompleted =
            habit.completionLogs.some(
                (log) => log.date === date
            );

        if (alreadyCompleted) {
            return errorResponse(
                "Habit already completed for this date",
                409
            );
        }

        habit.completionLogs.push({
            date,
            completedAt: new Date(),
        });

        habit.totalCompletions =
            habit.completionLogs.length;

        habit.currentStreak = calculateHabitStreak(
            habit.completionLogs
        );

        habit.longestStreak = Math.max(
            habit.longestStreak,
            habit.currentStreak
        );

        await habit.save();

        return successResponse(
            "Habit checked in successfully",
            { habit }
        );
    } catch (error) {
        console.error("Habit check-in error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}

export async function DELETE(
    request: Request,
    context: RouteContext
) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { id } = await context.params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid habit ID", 400);
        }

        const date = body.date || getTodayDateKey();

        if (!isValidDateKey(date)) {
            return errorResponse(
                "Date must use YYYY-MM-DD format",
                400
            );
        }

        const habit = await Habit.findOne({
            _id: id,
            user: authUser.userId,
        });

        if (!habit) {
            return errorResponse("Habit not found", 404);
        }

        const logExists = habit.completionLogs.some(
            (log) => log.date === date
        );

        if (!logExists) {
            return errorResponse(
                "No check-in found for this date",
                404
            );
        }

        habit.completionLogs =
            habit.completionLogs.filter(
                (log) => log.date !== date
            );

        habit.totalCompletions =
            habit.completionLogs.length;

        habit.currentStreak = calculateHabitStreak(
            habit.completionLogs
        );

        await habit.save();

        return successResponse(
            "Habit check-in removed successfully",
            { habit }
        );
    } catch (error) {
        console.error("Remove check-in error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}