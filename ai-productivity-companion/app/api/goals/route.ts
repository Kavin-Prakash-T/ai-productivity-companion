import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Goal, { GoalStatus } from "@/models/Goal";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

export async function POST(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        const {
            title,
            description,
            category,
            targetDate,
        } = await request.json();

        if (!title?.trim()) {
            return errorResponse("Goal title is required", 400);
        }

        if (
            targetDate &&
            Number.isNaN(new Date(targetDate).getTime())
        ) {
            return errorResponse("Invalid target date", 400);
        }

        const goal = await Goal.create({
            user: authUser.userId,
            title: title.trim(),
            description: description?.trim(),
            category: category?.trim() || "Personal",
            targetDate: targetDate
                ? new Date(targetDate)
                : undefined,
        });

        return successResponse(
            "Goal created successfully",
            { goal },
            201
        );
    } catch (error) {
        console.error("Create goal error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const url = new URL(request.url);

        const status = url.searchParams.get(
            "status"
        ) as GoalStatus | null;

        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");

        const query: Record<string, unknown> = {
            user: authUser.userId,
        };

        const validStatuses: GoalStatus[] = [
            "not-started",
            "in-progress",
            "completed",
            "cancelled",
        ];

        if (status) {
            if (!validStatuses.includes(status)) {
                return errorResponse("Invalid goal status", 400);
            }

            query.status = status;
        }

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const goals = await Goal.find(query).sort({
            targetDate: 1,
            createdAt: -1,
        });

        return successResponse("Goals fetched successfully", {
            goals,
            count: goals.length,
        });
    } catch (error) {
        console.error("Get goals error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}