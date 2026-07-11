import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Task from "@/models/Task";
import Goal from "@/models/Goal";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

export async function GET(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const userId = authUser.userId;

        const url = new URL(request.url);
        const daysParam = Number(
            url.searchParams.get("days") || 7
        );

        if (
            Number.isNaN(daysParam) ||
            daysParam < 1 ||
            daysParam > 90
        ) {
            return errorResponse(
                "Days must be between 1 and 90",
                400
            );
        }

        const now = new Date();

        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + daysParam);
        endDate.setHours(23, 59, 59, 999);

        const [tasks, goals] = await Promise.all([
            Task.find({
                user: userId,
                dueDate: {
                    $gte: now,
                    $lte: endDate,
                },
                status: {
                    $nin: ["completed", "cancelled"],
                },
            })
                .select(
                    "title description priority status dueDate estimatedMinutes category"
                )
                .sort({ dueDate: 1 }),

            Goal.find({
                user: userId,
                targetDate: {
                    $gte: now,
                    $lte: endDate,
                },
                status: {
                    $nin: ["completed", "cancelled"],
                },
            })
                .select(
                    "title description status targetDate progress category"
                )
                .sort({ targetDate: 1 }),
        ]);

        return successResponse(
            "Upcoming deadlines fetched successfully",
            {
                rangeInDays: daysParam,
                tasks,
                goals,
            }
        );
    } catch (error) {
        console.error("Upcoming deadlines error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}