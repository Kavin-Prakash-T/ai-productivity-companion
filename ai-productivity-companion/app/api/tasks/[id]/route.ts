import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task, {
    TaskPriority,
    TaskStatus,
} from "@/models/Task";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    request: Request,
    context: RouteContext
) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid task ID", 400);
        }

        const task = await Task.findOne({
            _id: id,
            user: authUser.userId,
        });

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        return successResponse("Task fetched successfully", {
            task,
        });
    } catch (error) {
        console.error("Get task error:", error);

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
            return errorResponse("Invalid task ID", 400);
        }

        const validPriorities: TaskPriority[] = [
            "low",
            "medium",
            "high",
            "urgent",
        ];

        const validStatuses: TaskStatus[] = [
            "pending",
            "in-progress",
            "completed",
            "missed",
            "cancelled",
        ];

        if (
            body.priority &&
            !validPriorities.includes(body.priority)
        ) {
            return errorResponse("Invalid priority", 400);
        }

        if (
            body.status &&
            !validStatuses.includes(body.status)
        ) {
            return errorResponse("Invalid status", 400);
        }

        if (
            body.estimatedMinutes !== undefined &&
            Number(body.estimatedMinutes) < 1
        ) {
            return errorResponse(
                "Estimated time must be at least 1 minute",
                400
            );
        }

        const updateData: Record<string, unknown> = {};

        // Title: validate and trim
        if (body.title !== undefined) {
            if (!body.title?.trim()) {
                return errorResponse("Task title cannot be empty", 400);
            }
            updateData.title = body.title.trim();
        }

        // Other string fields
        if (body.description !== undefined) {
            updateData.description = body.description?.trim();
        }
        if (body.category !== undefined) {
            updateData.category = body.category?.trim() || "General";
        }

        // Enum fields (already validated above)
        if (body.priority !== undefined) {
            updateData.priority = body.priority;
        }
        if (body.status !== undefined) {
            updateData.status = body.status;
        }

        // Numeric field
        if (body.estimatedMinutes !== undefined) {
            updateData.estimatedMinutes = Number(body.estimatedMinutes);
        }

        // Boolean field
        if (body.reminderEnabled !== undefined) {
            updateData.reminderEnabled = Boolean(body.reminderEnabled);
        }

        // Date fields
        if (body.dueDate) {
            updateData.dueDate = new Date(body.dueDate);
        }

        if (body.reminderTime) {
            updateData.reminderTime = new Date(body.reminderTime);
            updateData.reminderSent = false;
        }

        // completedAt lifecycle
        if (body.status === "completed") {
            updateData.completedAt = new Date();
        } else if (body.status) {
            updateData.completedAt = undefined;
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: authUser.userId,
            },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        return successResponse("Task updated successfully", {
            task,
        });
    } catch (error) {
        console.error("Update task error:", error);

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
            return errorResponse("Invalid task ID", 400);
        }

        const task = await Task.findOneAndDelete({
            _id: id,
            user: authUser.userId,
        });

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        return successResponse("Task deleted successfully");
    } catch (error) {
        console.error("Delete task error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}