import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Habit, { HabitFrequency } from "@/models/Habit";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

const validFrequencies: HabitFrequency[] = [
    "daily",
    "weekly",
];

export async function GET(
    request: Request,
    context: RouteContext
) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid habit ID", 400);
        }

        const habit = await Habit.findOne({
            _id: id,
            user: authUser.userId,
        });

        if (!habit) {
            return errorResponse("Habit not found", 404);
        }

        return successResponse(
            "Habit fetched successfully",
            { habit }
        );
    } catch (error) {
        console.error("Get habit error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}

export async function PUT(
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

        if (
            body.frequency &&
            !validFrequencies.includes(body.frequency)
        ) {
            return errorResponse(
                "Frequency must be daily or weekly",
                400
            );
        }

        if (
            body.targetDays &&
            (!Array.isArray(body.targetDays) ||
                body.targetDays.some(
                    (day: unknown) =>
                        typeof day !== "number" ||
                        day < 0 ||
                        day > 6
                ))
        ) {
            return errorResponse(
                "Target days must contain numbers from 0 to 6",
                400
            );
        }

        if (
            body.reminderTime &&
            !/^([01]\d|2[0-3]):([0-5]\d)$/.test(
                body.reminderTime
            )
        ) {
            return errorResponse(
                "Reminder time must use HH:mm format",
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

        if (body.title !== undefined) {
            if (!body.title.trim()) {
                return errorResponse(
                    "Habit title cannot be empty",
                    400
                );
            }

            habit.title = body.title.trim();
        }

        if (body.description !== undefined) {
            habit.description = body.description.trim();
        }

        if (body.category !== undefined) {
            habit.category =
                body.category.trim() || "Personal";
        }

        if (body.frequency !== undefined) {
            habit.frequency = body.frequency;

            if (body.frequency === "daily") {
                habit.targetDays = [];
            }
        }

        if (body.targetDays !== undefined) {
            habit.targetDays = body.targetDays;
        }

        if (body.reminderEnabled !== undefined) {
            habit.reminderEnabled = Boolean(
                body.reminderEnabled
            );

            if (!habit.reminderEnabled) {
                habit.reminderTime = undefined;
            }
        }

        if (body.reminderTime !== undefined) {
            habit.reminderTime = body.reminderTime;
        }

        if (body.isActive !== undefined) {
            habit.isActive = Boolean(body.isActive);
        }

        await habit.save();

        return successResponse(
            "Habit updated successfully",
            { habit }
        );
    } catch (error) {
        console.error("Update habit error:", error);

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid habit ID", 400);
        }

        const habit = await Habit.findOneAndDelete({
            _id: id,
            user: authUser.userId,
        });

        if (!habit) {
            return errorResponse("Habit not found", 404);
        }

        return successResponse(
            "Habit deleted successfully"
        );
    } catch (error) {
        console.error("Delete habit error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}