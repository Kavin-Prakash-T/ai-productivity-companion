import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task, { TaskStatus } from "@/models/Task";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext
) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { id } = await context.params;
        const { status } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid task ID", 400);
        }

        const validStatuses: TaskStatus[] = [
            "pending",
            "in-progress",
            "completed",
            "missed",
            "cancelled",
        ];

        if (!validStatuses.includes(status)) {
            return errorResponse("Invalid task status", 400);
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: authUser.userId,
            },
            {
                status,
                completedAt:
                    status === "completed" ? new Date() : undefined,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        return successResponse(
            "Task status updated successfully",
            { task }
        );
    } catch (error) {
        console.error("Update task status error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}