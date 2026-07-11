import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Goal from "@/models/Goal";
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
        const { progress } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse("Invalid goal ID", 400);
        }

        if (progress === undefined) {
            return errorResponse("Progress is required", 400);
        }

        const progressValue = Number(progress);

        if (
            Number.isNaN(progressValue) ||
            progressValue < 0 ||
            progressValue > 100
        ) {
            return errorResponse(
                "Progress must be between 0 and 100",
                400
            );
        }

        let status:
            | "not-started"
            | "in-progress"
            | "completed";

        if (progressValue === 0) {
            status = "not-started";
        } else if (progressValue === 100) {
            status = "completed";
        } else {
            status = "in-progress";
        }

        const goal = await Goal.findOneAndUpdate(
            {
                _id: id,
                user: authUser.userId,
            },
            {
                progress: progressValue,
                status,
                completedAt:
                    progressValue === 100
                        ? new Date()
                        : undefined,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!goal) {
            return errorResponse("Goal not found", 404);
        }

        return successResponse(
            "Goal progress updated successfully",
            { goal }
        );
    } catch (error) {
        console.error("Update goal progress error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}