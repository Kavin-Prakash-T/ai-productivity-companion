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

export async function POST(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        const {
            title,
            description,
            category,
            priority,
            dueDate,
            estimatedMinutes,
            reminderEnabled,
            reminderTime,
        } = await request.json();

        if (!title?.trim()) {
            return errorResponse("Task title is required", 400);
        }

        if (
            estimatedMinutes !== undefined &&
            Number(estimatedMinutes) < 1
        ) {
            return errorResponse(
                "Estimated time must be at least 1 minute",
                400
            );
        }

        if (dueDate && Number.isNaN(new Date(dueDate).getTime())) {
            return errorResponse("Invalid due date", 400);
        }

        if (
            reminderTime &&
            Number.isNaN(new Date(reminderTime).getTime())
        ) {
            return errorResponse("Invalid reminder time", 400);
        }

        const validPriorities: TaskPriority[] = [
            "low",
            "medium",
            "high",
            "urgent",
        ];

        if (priority && !validPriorities.includes(priority)) {
            return errorResponse("Invalid task priority", 400);
        }

        const task = await Task.create({
            user: authUser.userId,
            title: title.trim(),
            description: description?.trim(),
            category: category?.trim() || "General",
            priority: priority || "medium",
            dueDate: dueDate ? new Date(dueDate) : undefined,
            estimatedMinutes: estimatedMinutes
                ? Number(estimatedMinutes)
                : undefined,
            reminderEnabled: Boolean(reminderEnabled),
            reminderTime: reminderTime
                ? new Date(reminderTime)
                : undefined,
        });

        return successResponse(
            "Task created successfully",
            { task },
            201
        );
    } catch (error) {
        console.error("Create task error:", error);

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
        ) as TaskStatus | null;

        const priority = url.searchParams.get(
            "priority"
        ) as TaskPriority | null;

        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");

        const query: Record<string, unknown> = {
            user: authUser.userId,
        };

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
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

        const tasks = await Task.find(query).sort({
            dueDate: 1,
            createdAt: -1,
        });

        return successResponse("Tasks fetched successfully", {
            tasks,
            count: tasks.length,
        });
    } catch (error) {
        console.error("Get tasks error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}