import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Goal, { GoalStatus } from "@/models/Goal";
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
            return errorResponse("Invalid goal ID", 400);
        }

        const goal = await Goal.findOne({
            _id: id,
            user: authUser.userId,
        });

        if (!goal) {
            return errorResponse("Goal not found", 404);
        }

        return successResponse("Goal fetched successfully", {
            goal,
        });
    } catch (error) {
        console.error("Get goal error:", error);

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
            return errorResponse("Invalid goal ID", 400);
        }

        const validStatuses: GoalStatus[] = [
            "not-started",
            "in-progress",
            "completed",
            "cancelled",
        ];

        if (
            body.status &&
            !validStatuses.includes(body.status)
        ) {
            return errorResponse("Invalid goal status", 400);
        }

        if (
            body.progress !== undefined &&
            (Number(body.progress) < 0 ||
                Number(body.progress) > 100)
        ) {
            return errorResponse(
                "Progress must be between 0 and 100",
                400
            );
        }

        if (
            body.targetDate &&
            Number.isNaN(new Date(body.targetDate).getTime())
        ) {
            return errorResponse("Invalid target date", 400);
        }

        const updateData: Record<string, unknown> = {};

        // --- Scalar field updates ---
        if (body.title !== undefined) {
            if (!body.title.trim()) {
                return errorResponse(
                    "Goal title cannot be empty",
                    400
                );
            }
            updateData.title = body.title.trim();
        }

        if (body.description !== undefined) {
            updateData.description = body.description.trim();
        }

        if (body.category !== undefined) {
            updateData.category =
                body.category.trim() || "Personal";
        }

        if (body.targetDate) {
            updateData.targetDate = new Date(body.targetDate);
        }

        // --- Progress + Status resolution (single pass, no double-write) ---
        // Determine the final progress value (prefer explicit status=completed over a partial progress value)
        let resolvedProgress =
            body.progress !== undefined ? Number(body.progress) : undefined;
        let resolvedStatus: string | undefined = body.status;

        // If the caller explicitly says status=completed, force progress to 100
        if (body.status === "completed") {
            resolvedProgress = 100;
        }

        // If progress reaches 100, status must be completed (only if caller didn't request cancelled)
        if (resolvedProgress === 100 && resolvedStatus !== "cancelled") {
            resolvedStatus = "completed";
        } else if (
            resolvedProgress !== undefined &&
            resolvedProgress > 0 &&
            resolvedProgress < 100 &&
            resolvedStatus !== "cancelled"
        ) {
            // Any progress between 1-99 moves goal to in-progress unless explicitly set otherwise
            if (!resolvedStatus) {
                resolvedStatus = "in-progress";
            }
        } else if (resolvedProgress === 0 && !resolvedStatus) {
            resolvedStatus = "not-started";
        }

        if (resolvedProgress !== undefined) {
            updateData.progress = resolvedProgress;
        }

        if (resolvedStatus) {
            updateData.status = resolvedStatus;
        }

        // Set/clear completedAt based on resolved status
        if (resolvedStatus === "completed") {
            updateData.completedAt = new Date();
        } else if (resolvedStatus && resolvedStatus !== "completed") {
            updateData.completedAt = undefined;
        }

        const goal = await Goal.findOneAndUpdate(
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

        if (!goal) {
            return errorResponse("Goal not found", 404);
        }

        return successResponse("Goal updated successfully", {
            goal,
        });
    } catch (error) {
        console.error("Update goal error:", error);

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
            return errorResponse("Invalid goal ID", 400);
        }

        const goal = await Goal.findOneAndDelete({
            _id: id,
            user: authUser.userId,
        });

        if (!goal) {
            return errorResponse("Goal not found", 404);
        }

        return successResponse("Goal deleted successfully");
    } catch (error) {
        console.error("Delete goal error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}