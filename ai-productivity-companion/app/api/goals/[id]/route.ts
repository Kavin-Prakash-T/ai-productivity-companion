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

        const allowedFields = [
            "title",
            "description",
            "category",
            "targetDate",
            "progress",
            "status",
        ];

        const updateData: Record<string, unknown> = {};

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

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

        if (body.progress !== undefined) {
            updateData.progress = Number(body.progress);

            if (Number(body.progress) === 100) {
                updateData.status = "completed";
                updateData.completedAt = new Date();
            } else if (
                Number(body.progress) > 0 &&
                body.status !== "cancelled"
            ) {
                updateData.status = "in-progress";
                updateData.completedAt = undefined;
            }
        }

        if (body.status === "completed") {
            updateData.progress = 100;
            updateData.completedAt = new Date();
        } else if (body.status) {
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