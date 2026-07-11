import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type RouteContext = {
    params: Promise<{
        id: string;
        subtaskId: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext
) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { id, subtaskId } = await context.params;
        const { title, completed } = await request.json();

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(subtaskId)
        ) {
            return errorResponse("Invalid ID", 400);
        }

        const task = await Task.findOne({
            _id: id,
            user: authUser.userId,
        });

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        const subtask = task.subtasks.find(
            (item) => item._id?.toString() === subtaskId
        );

        if (!subtask) {
            return errorResponse("Subtask not found", 404);
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return errorResponse(
                    "Subtask title cannot be empty",
                    400
                );
            }

            subtask.title = title.trim();
        }

        if (completed !== undefined) {
            subtask.completed = Boolean(completed);
        }

        await task.save();

        return successResponse(
            "Subtask updated successfully",
            { task }
        );
    } catch (error) {
        console.error("Update subtask error:", error);

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
        const { id, subtaskId } = await context.params;

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(subtaskId)
        ) {
            return errorResponse("Invalid ID", 400);
        }

        const task = await Task.findOne({
            _id: id,
            user: authUser.userId,
        });

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        const subtaskExists = task.subtasks.some(
            (item) => item._id?.toString() === subtaskId
        );

        if (!subtaskExists) {
            return errorResponse("Subtask not found", 404);
        }

        task.subtasks = task.subtasks.filter(
            (item) => item._id?.toString() !== subtaskId
        );

        await task.save();

        return successResponse(
            "Subtask deleted successfully",
            { task }
        );
    } catch (error) {
        console.error("Delete subtask error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}