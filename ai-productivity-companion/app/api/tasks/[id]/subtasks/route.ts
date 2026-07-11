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
    }>;
};

export async function POST(
    request: Request,
    context: RouteContext
) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const { id } = await context.params;
        const { title } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid task ID", 400);
        }

        if (!title?.trim()) {
            return errorResponse(
                "Subtask title is required",
                400
            );
        }

        const task = await Task.findOne({
            _id: id,
            user: authUser.userId,
        });

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        task.subtasks.push({
            title: title.trim(),
            completed: false,
        });

        await task.save();

        return successResponse(
            "Subtask created successfully",
            { task },
            201
        );
    } catch (error) {
        console.error("Create subtask error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}

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
        }).select("subtasks");

        if (!task) {
            return errorResponse("Task not found", 404);
        }

        return successResponse(
            "Subtasks fetched successfully",
            {
                subtasks: task.subtasks,
            }
        );
    } catch (error) {
        console.error("Get subtasks error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}