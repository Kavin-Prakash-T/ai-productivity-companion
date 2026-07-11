import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/getAuthUser";
import CalendarEvent from "@/models/CalendarEvent";
import ScheduleBlock from "@/models/ScheduleBlock";
import { calculateFreeSlots } from "@/utils/timeSlots";
import {
    errorResponse,
    successResponse,
} from "@/utils/apiResponse";

function isValidTime(value: string): boolean {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export async function GET(request: Request) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);
        const url = new URL(request.url);

        const date =
            url.searchParams.get("date") ||
            new Date().toISOString().split("T")[0];

        const workStart =
            url.searchParams.get("workStart") || "09:00";

        const workEnd =
            url.searchParams.get("workEnd") || "18:00";

        const minimumMinutes = Number(
            url.searchParams.get("minimumMinutes") || 30
        );

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return errorResponse(
                "Date must use YYYY-MM-DD format",
                400
            );
        }

        if (
            !isValidTime(workStart) ||
            !isValidTime(workEnd)
        ) {
            return errorResponse(
                "Working hours must use HH:mm format",
                400
            );
        }

        if (
            Number.isNaN(minimumMinutes) ||
            minimumMinutes < 5
        ) {
            return errorResponse(
                "Minimum slot duration must be at least 5 minutes",
                400
            );
        }

        const dayStart = new Date(`${date}T00:00:00`);
        const dayEnd = new Date(`${date}T23:59:59.999`);

        const [events, scheduleBlocks] = await Promise.all([
            CalendarEvent.find({
                user: authUser.userId,
                startTime: { $lte: dayEnd },
                endTime: { $gte: dayStart },
            }).select("startTime endTime"),

            ScheduleBlock.find({
                user: authUser.userId,
                status: {
                    $nin: ["cancelled", "completed"],
                },
                startTime: { $lte: dayEnd },
                endTime: { $gte: dayStart },
            }).select("startTime endTime"),
        ]);

        const busySlots = [
            ...events.map((event) => ({
                startTime: event.startTime,
                endTime: event.endTime,
            })),
            ...scheduleBlocks.map((block) => ({
                startTime: block.startTime,
                endTime: block.endTime,
            })),
        ];

        const freeSlots = calculateFreeSlots(
            date,
            workStart,
            workEnd,
            busySlots,
            minimumMinutes
        );

        return successResponse(
            "Free slots fetched successfully",
            {
                date,
                workStart,
                workEnd,
                freeSlots,
            }
        );
    } catch (error) {
        console.error("Free slots error:", error);

        if (
            error instanceof Error &&
            error.message === "Unauthorized"
        ) {
            return errorResponse("Unauthorized", 401);
        }

        return errorResponse("Internal server error", 500);
    }
}