import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import { errorResponse, successResponse } from "@/utils/apiResponse";

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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid task ID", 400);
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: authUser.userId,
            },
            {
                status: "completed",
                completedAt: new Date(),
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        return successResponse(
            "Task marked as completed successfully",
            { task }
        );
    } catch (error) {
        console.error("Complete task error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}
