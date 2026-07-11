import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import Habit, { HabitFrequency } from "@/models/Habit";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

const validFrequencies: HabitFrequency[] = [
    "daily",
    "weekly",
];

export async function POST(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        const {
            title,
            description,
            category,
            frequency,
            targetDays,
            reminderEnabled,
            reminderTime,
        } = await request.json();

        if (!title?.trim()) {
            return errorResponse("Habit title is required", 400);
        }

        if (
            frequency &&
            !validFrequencies.includes(frequency)
        ) {
            return errorResponse(
                "Frequency must be daily or weekly",
                400
            );
        }

        if (
            targetDays &&
            (!Array.isArray(targetDays) ||
                targetDays.some(
                    (day: unknown) =>
                        typeof day !== "number" ||
                        day < 0 ||
                        day > 6
                ))
        ) {
            return errorResponse(
                "Target days must contain numbers from 0 to 6",
                400
            );
        }

        if (
            reminderTime &&
            !/^([01]\d|2[0-3]):([0-5]\d)$/.test(
                reminderTime
            )
        ) {
            return errorResponse(
                "Reminder time must use HH:mm format",
                400
            );
        }

        const habit = await Habit.create({
            user: authUser.userId,
            title: title.trim(),
            description: description?.trim(),
            category: category?.trim() || "Personal",
            frequency: frequency || "daily",
            targetDays:
                frequency === "weekly" ? targetDays || [] : [],
            reminderEnabled: Boolean(reminderEnabled),
            reminderTime:
                reminderEnabled && reminderTime
                    ? reminderTime
                    : undefined,
        });

        return successResponse(
            "Habit created successfully",
            { habit },
            201
        );
    } catch (error) {
        console.error("Create habit error:", error);

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

        const category = url.searchParams.get("category");
        const frequency = url.searchParams.get(
            "frequency"
        ) as HabitFrequency | null;
        const isActive = url.searchParams.get("isActive");
        const search = url.searchParams.get("search");

        const query: Record<string, unknown> = {
            user: authUser.userId,
        };

        if (frequency) {
            if (!validFrequencies.includes(frequency)) {
                return errorResponse(
                    "Invalid habit frequency",
                    400
                );
            }

            query.frequency = frequency;
        }

        if (category) {
            query.category = category;
        }

        if (isActive === "true") {
            query.isActive = true;
        }

        if (isActive === "false") {
            query.isActive = false;
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

        const habits = await Habit.find(query).sort({
            isActive: -1,
            createdAt: -1,
        });

        return successResponse(
            "Habits fetched successfully",
            {
                habits,
                count: habits.length,
            }
        );
    } catch (error) {
        console.error("Get habits error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}